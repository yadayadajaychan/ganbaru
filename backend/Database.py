import os, time
from datetime import datetime
from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql
import re
from argon2 import PasswordHasher
import base64

class db:
    def __init__(self):
        load_dotenv()
        self.conn = psycopg2.connect(
                host     = os.getenv('DB_HOST'),
                port     = os.getenv('DB_PORT'),
                dbname   = os.getenv('DB_NAME'),
                user     = os.getenv('DB_USERNAME'),
                password = os.getenv('DB_PASSWORD'))
        self.cur = self.conn.cursor();

        self.ph = PasswordHasher()

    def init(self):
        self.__create_auth_table()
        self.__create_users_table()
        self.__create_admin("admin", "12345678")
        self.__create_forums_table()
        self.__create_posts_table()
        self.__create_answers_table()

    def close(self):
        self.cur.close()
        self.conn.close()

    def __create_auth_table(self):
        try:
            # passwords are salted and hashed using argon2id
            self.cur.execute('CREATE TABLE IF NOT EXISTS auth ('
                                        'uid        integer NOT NULL UNIQUE,'
                                        'email      text    NOT NULL UNIQUE,'
                                        'username   text    NOT NULL UNIQUE,'
                                        'hash       text    NOT NULL,'
                                        'session_id text,'
                                        'session_expiration timestamp (0) with time zone);')
        finally:
            self.conn.commit()

    def __create_admin(self, email, username, password):
        self.cur.execute('SELECT uid FROM auth WHERE uid=0')
        if self.cur.fetchone() is None:
            self.create_user(email, username, password)
            try:
                self.cur.execute("UPDATE users SET alias = 'admin' WHERE uid = 0")
            finally:
                self.conn.commit()

        self.cur.execute('SELECT uid FROM users WHERE uid=-1')
        if self.cur.fetchone() is None:
            try:
                self.cur.execute('INSERT INTO users (uid, full_name) '
                                 'VALUES (%s, %s)', (-1, "Deleted User"))
            finally:
                self.conn.commit()

    def __create_users_table(self):
        try:
            self.cur.execute('CREATE TABLE IF NOT EXISTS users ('
                             'uid        integer NOT NULL UNIQUE,'
                             'forums     integer[],'
                             'full_name  text,'
                             'alias      text);')
        finally:
            self.conn.commit()

    def __create_forums_table(self):
        try:
            self.cur.execute('CREATE TABLE IF NOT EXISTS forums ('
                             'fid         integer NOT NULL UNIQUE,'
                             'owner       integer NOT NULL,'
                             'name        text NOT NULL,'
                             'description text,'
                             'moderators  integer[],'
                             'join_code   text,'
                             'mod_join_code text);')
        finally:
            self.conn.commit()

    def __create_posts_table(self):
        try:
            self.cur.execute('CREATE TABLE IF NOT EXISTS posts ('
                             'fid     integer NOT NULL,'
                             'pid     integer NOT NULL,'
                             'uid     integer NOT NULL,'
                             'title   text NOT NULL,'
                             'date    timestamp (0) with time zone NOT NULL,'
                             'last_activity timestamp(0) with time zone NOT NULL,'
                             'views   integer NOT NULL,'
                             'answers integer NOT NULL,'
                             'instructor_answered boolean NOT NULL,'
                             'tags text[],'
                             'full_text text NOT NULL,'
                             'instructor_aid integer,'
                             'score     integer NOT NULL,'
                             'anonymous bool NOT NULL,'
                             'alias     bool NOT NULL,'
                             'upvoted integer[],'
                             'downvoted integer[]);')
        finally:
            self.conn.commit()

    def __create_answers_table(self):
        try:
            self.cur.execute('CREATE TABLE IF NOT EXISTS answers ('
                             'fid    integer NOT NULL,'
                             'pid    integer NOT NULL,'
                             'aid    integer NOT NULL,'
                             'uid    integer NOT NULL,'
                             'date   timestamp (0) with time zone NOT NULL,'
                             'answer text NOT NULL,'
                             'score  integer NOT NULL,'
                             'anonymous bool NOT NULL,'
                             'alias     bool NOT NULL);')
        finally:
            self.conn.commit()

    def create_user(self, email, username, password):
        if not email.isascii():
            raise Exception("non-ascii email not allowed")

        if len(email) < 1:
            raise Exception("empty email")

        email = email.lower()

        if "@" not in email
            raise Exception("invalid email")

        if not username.isascii():
            raise Exception("non-ascii username not allowed")

        if len(username) < 1:
            raise Exception("empty username")

        r = re.compile('[^A-Za-z0-9_]')
        if r.search(username):
            raise Exception("only alphanumeric characters and underscore allowed in username")

        username = username.lower()

        if len(password) < 8:
            raise Exception("password must be at least 8 characters")
        elif len(password) > 1024:
            raise Exception("password must be at most 1024 characters")

        hash = self.ph.hash(password)

        self.cur.execute('SELECT MAX(uid) FROM auth')
        max_uid = self.cur.fetchone()[0]
        if max_uid is None:
            uid = 0
        else:
            uid = max_uid + 1

        try:
            self.cur.execute('INSERT INTO auth '
                             '(uid, email, username, hash) '
                             'VALUES (%s, %s, %s, %s)',
                             (uid, email, username, hash))
            self.cur.execute('INSERT INTO users (uid) VALUES (%s)', (uid,))
        except psycopg2.errors.UniqueViolation:
            raise Exception("username taken or email already in use")
        finally:
            self.conn.commit()

        return

    # returns True if password correct
    # raises exception if incorrect
    def check_password(self, email, password):
        self.cur.execute('SELECT hash FROM auth WHERE email=%s', (email,))
        record = self.cur.fetchone()
        if not record:
            raise Exception("user doesn't exist")
        hash = record[0]

        try:
            self.ph.verify(hash, password)
            return True
        except:
            raise Exception("wrong password")

    # returns uid if session exists and is valid
    # raises exception if session not found or expired
    def check_session(self, session_id):
        self.cur.execute('SELECT uid, session_expiration '
                         'FROM auth WHERE session_id = %s', (session_id,))
        record = self.cur.fetchone()
        if not record:
            raise Exception("session does not exist")
        uid = record[0]
        exp_date = record[1]

        # check expiration
        exp = exp_date.timestamp()
        curr_time = time.time()
        if curr_time > exp:
            raise Exception("session expired")

        return uid

    # checks if uid exists
    # raises exception if not found
    def check_uid(self, uid):
        self.cur.execute('SELECT uid '
                         'FROM users '
                         'WHERE uid = %s', (uid,))
        if self.cur.fetchone() is None:
            raise Exception(f"uid {uid} does not exist")

        return

    # checks if forum exists
    # raises exception if not found
    def check_forum(self, forum_id):
        self.cur.execute('SELECT fid '
                         'FROM forums '
                         'WHERE fid = %s', (forum_id,))
        if self.cur.fetchone() is None:
            raise Exception(f"forum {forum_id} does not exist")

        return

    # checks if post exists
    # raises exception if not found
    def check_post(self, forum_id, post_id):
        self.cur.execute('SELECT pid '
                         'FROM posts '
                         'WHERE fid = %s AND pid = %s',
                         (forum_id, post_id))
        if self.cur.fetchone() is None:
            raise Exception(f"post {post_id} does not exist")

        return

    # check if user is in forum
    # raises exception if not
    def check_in_forum(self, uid, forum_id):
        if uid == 0:
            return

        self.cur.execute('SELECT forums '
                         'FROM users '
                         'WHERE uid = %s', (uid,))
        if int(forum_id) not in self.cur.fetchone()[0]:
            raise Exception(f"user is not in forum {forum_id}")

        return

    # check if user is owner or moderator of a forum
    # raises exception if no
    def check_mod_in_forum(self, uid, forum_id):
        if uid == 0:
            return

        # check if user is owner
        self.cur.execute('SELECT owner '
                         'FROM forums '
                         'WHERE fid = %s', (forum_id,))
        if int(uid) == self.cur.fetchone()[0]:
            return

        # check if user is a moderator
        self.cur.execute('SELECT moderators '
                         'FROM forums '
                         'WHERE fid = %s', (forum_id,))
        if int(uid) in self.cur.fetchone()[0]:
            return

        raise Exception(f"not an owner or moderator of forum {forum_id}")

    # return display name given a user id
    # full name > alias > 'Anonymous User'
    def get_display_name(self, uid):
        # try getting full name
        full_name = self.get_full_name(uid)
        if full_name is not None:
            return full_name

        # try getting alias
        alias = self.get_alias(uid)
        if alias is not None:
            return alias

        return 'Unknown User'

    # return full name given a user id
    # if not found, returns None
    def get_full_name(self, uid):
        self.cur.execute('SELECT full_name '
                         'FROM users '
                         'WHERE uid = %s', (uid,))
        return self.cur.fetchone()[0]

    def set_full_name_wrapper(session_id, full_name):
        set_full_name(self, session_id, full_name)

    def set_full_name(self, session_id, full_name):
        uid = self.check_session(session_id)

        if len(full_name) == 0:
            full_name = None

        try:
            self.cur.execute('UPDATE users '
                             'SET full_name = %s '
                             'WHERE uid = %s', (full_name, uid))
        finally:
            self.conn.commit()

        return

    def get_email_wrapper(uid):
        get_email(self, uid)

    def get_email(self, uid):
        try:
            self.cur.execute('SELECT email '
                             'FROM users '
                             'WHERE uid = %s', (uid))
        return self.cur.fetchone()[0]

    # returns None if not found
    def get_alias(self, uid):
        self.cur.execute('SELECT alias '
                         'FROM users '
                         'WHERE uid = %s', (uid,))
        return self.cur.fetchone()[0]

    def set_alias_wrapper(session_id, alias):
        set_alias(self, session_id, alias)

    def set_alias(self, session_id, alias):
        uid = self.check_session(session_id)

        if len(alias) == 0:
            alias = None

        try:
            self.cur.execute('UPDATE users '
                             'SET alias = %s '
                             'WHERE uid = %s', (alias, uid))
        finally:
            self.conn.commit()

        return

    def get_user_info(self, session_id):
        uid = self.cur.execute('SELECT uid FROM auth WHERE session_id=\'%s\'', (session_id))
        email = get_email(uid)
        fullname = get_full_name(uid)
        alias = get_alias(uid)
        return email, fullname, alias

    def get_user_obj(self, uid, mod, anonymous, alias):
            if mod:
                user_obj = {"uid": uid,
                            "name": self.get_display_name(uid)}
            elif anonymous:
                user_obj = {"uid": -2,
                            "name": 'Anonymous User'}
            elif alias:
                alias = self.get_alias(uid)
                if alias is None:
                    alias = 'Unknown User'
                user_obj = {"uid": -2,
                            "name": alias}
            else:
                user_obj = {"uid": uid,
                            "name": self.get_display_name(uid)}

            return user_obj

    def delete_user(self, email, password):
        email = email.lower()

        self.cur.execute('SELECT uid FROM auth WHERE email=%s', (email,))
        record = self.cur.fetchone()
        if not record:
            raise Exception("user doesn't exist")

        uid = record[0]
        if uid == 0:
            raise Exception("can't delete admin")

        self.check_password(email, password)

        # change owner of forums to 'Deleted User'
        try:
            self.cur.execute('UPDATE forums '
                             'SET owner = -1 '
                             'WHERE owner = %s', (uid,))
        finally:
            self.conn.commit()

        # change owner of posts to 'Deleted User'
        try:
            self.cur.execute('UPDATE posts '
                             'SET uid = -1 '
                             'WHERE uid = %s', (uid,))
        finally:
            self.conn.commit()

        # change owner of answers to 'Deleted User'
        try:
            self.cur.execute('UPDATE answers '
                             'SET uid = -1 '
                             'WHERE uid = %s', (uid,))
        finally:
            self.conn.commit()

        try:
            self.cur.execute('DELETE FROM auth WHERE uid=%s', (uid,))
            self.cur.execute('DELETE FROM users WHERE uid=%s', (uid,))
        finally:
            self.conn.commit()

    def login(self, email, password, timeout):
        email = email.lower()

        self.check_password(email, password)

        session_id = base64.b64encode(os.urandom(36)).decode()
        exp_date = datetime.utcfromtimestamp(time.time() + timeout).isoformat()
        try:
            # TODO support multiple sessions
            self.cur.execute('UPDATE auth SET session_id = %s, '
                             'session_expiration = %s '
                             'WHERE email = %s',
                             (session_id, exp_date, email))
        finally:
            self.conn.commit()

        return session_id

    def create_forum(self, session_id, name, description=None):
        uid = self.check_session(session_id)
        #TODO check if allowed to create forum

        if len(name) <= 0:
            raise Exception("empty forum name not allowed")

        self.cur.execute('SELECT MAX(fid) FROM forums')
        max_fid = self.cur.fetchone()[0]
        if max_fid is None:
            fid = 0
        else:
            fid = max_fid + 1

        try:
            self.cur.execute('INSERT INTO forums '
                             '(fid, owner, name, description)'
                             'VALUES (%s, %s, %s, %s);',
                             (fid, uid, name, description))
            self.cur.execute('UPDATE users '
                             'SET forums = forums || %s '
                             'WHERE uid = %s', (fid, uid))
        finally:
            self.conn.commit()

        return

    def __add_to_forum(self, uid, fid):
        forum_ids = self.__get_forums(uid)
        if fid not in forum_ids:
            try:
                self.cur.execute('UPDATE users '
                                 'SET forums = forums || %s '
                                 'WHERE uid = %s', (fid, uid))
            finally:
                self.conn.commit()

        return

    # add users to a forum
    def add_uids_to_forum(self, session_id, uids, fid):
        uid = self.check_session(session_id)

        self.check_forum(fid)
        self.check_mod_in_forum(uid, fid)

        for uid in uids:
            self.check_uid(uid)
            self.__add_to_forum(uid, fid)

        return

    def __get_forums(self, uid):
        self.cur.execute('SELECT forums '
                         'FROM users '
                         'WHERE uid = %s', (uid,))
        forum_ids = self.cur.fetchone()[0]
        if forum_ids is None:
            forum_ids = []

        return forum_ids

    def __get_forum_users(self, fid):
        self.cur.execute('SELECT uid '
                         'FROM users '
                         'WHERE %s = ANY (forums)', (fid,))
        output = list()
        for record in self.cur.fetchall():
            output.append(record[0])

        return output

    # check doc/backend-api.txt for output format
    def get_forums(self, session_id):
        uid = self.check_session(session_id)

        forum_ids = self.__get_forums(uid)

        output = list()
        for fid in forum_ids:
            # get forum info from db
            self.cur.execute('SELECT fid, owner, name, description '
                             'FROM forums '
                             'WHERE fid = %s', (fid,))
            record = self.cur.fetchone()

            forum = dict()
            forum['forum_id']    = record[0]
            forum['owner']       = {"uid": record[1],
                                    "name": self.get_display_name(record[1])}
            forum['name']        = record[2]
            forum['description'] = record[3]

            output.append(forum)

        return {"forums": output}

    def create_post(self, session_id, forum_id, title, full_text, tags, anonymous=False, alias=False):
        uid = self.check_session(session_id)
        self.check_in_forum(uid, forum_id)

        try:
            self.check_mod_in_forum(uid, forum_id)
            mod = True
        except:
            mod = False

        # moderators can't make anonymous posts
        if mod:
            anonymous = False
            alias = False

        if len(title) == 0:
            raise Exception("post can't have empty title")
        if len(full_text) == 0:
            raise Exception("post body can't be empty")
        if tags is None:
            tags = []
        

        self.cur.execute('SELECT MAX(pid) '
                         'FROM posts '
                         'WHERE fid = %s', (forum_id,))
        max_pid = self.cur.fetchone()[0]
        if max_pid is None:
            pid = 0
        else:
            pid = max_pid + 1

        date = datetime.utcfromtimestamp(time.time()).isoformat()
        last_activity = date

        views = 0
        answers = 0
        instructor_answered = False
        upvoted = []
        downvoted = []

        try:
            self.cur.execute('INSERT INTO posts '
                             '(fid, pid, uid, title, date, last_activity, views, answers, '
                             'instructor_answered, tags, full_text, score, anonymous, alias, '
                             'upvoted, downvoted) '
                             'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);',
                             (forum_id, pid, uid, title, date, last_activity, views, answers,
                              instructor_answered, tags, full_text, 0, anonymous, alias, upvoted, downvoted))
        finally:
            self.conn.commit()

    def get_posts(self, session_id, forum_id, query):
        uid = self.check_session(session_id)
        self.check_in_forum(uid, forum_id)

        try:
            self.check_mod_in_forum(uid, forum_id)
            mod = True
        except:
            mod = False

        count = int(query.get("count", 50))
        if count < 0:
            raise Exception("count can't be less than 0")

        page = int(query.get("page", 1))
        offset = (page - 1) * count
        if offset < 0:
            raise Exception("page can't be less than 0")

        ascending = query.get("ascending", 'false').lower()
        if ascending == 'true':
            ascending = 'ASC'
        elif ascending == 'false':
            ascending = 'DESC'
        else:
            raise Exception("'ascending' must be a boolean")

        sortby = query.get("sortby", 'post_date')
        if sortby == "post_date":
            sortby = 'date'
        elif sortby == "activity":
            sortby = 'last_activity'
        elif sortby == "votes":
            raise Exception("sorting by votes not implemented yet") #TODO
        else:
            raise Exception("invalid sortby, must be: post_date, activity, votes")

        #TODO filter by tags
        search = query.get("search", '.*')

        query = sql.SQL('SELECT pid, uid, title, date, last_activity, '
                        'views, answers, instructor_answered, tags, '
                        'anonymous, alias, upvoted, downvoted '
                         'FROM posts '
                         'WHERE fid = %s AND (title ~* %s OR full_text ~* %s) '
                         'ORDER BY {sortby} {asc} '
                         'LIMIT %s OFFSET %s').format(
                                 sortby=sql.SQL(sortby),
                                 asc=sql.SQL(ascending),
                                 )
        try:
            self.cur.execute(query, (forum_id, search, search, count, offset))
        finally:
            self.conn.commit()

        post_infos = list()
        records = self.cur.fetchall()
        for record in records:
            anonymous = record[9]
            alias = record[10]
            user_obj = self.get_user_obj(record[1], mod, anonymous, alias)
            if uid in record[11]:
                vote = 1
            elif uid in record[12]:
                vote = -1
            else:
                vote = 0

            post = {"post_id"       : record[0],
                    "user"          : user_obj,
                    "title"         : record[2],
                    "date"          : record[3],
                    "last_activity" : record[4],
                    "views"         : record[5],
                    "answers"       : record[6],
                    "instructor_answered": record[7],
                    "tags"          : record[8],
                    "vote"          : vote,
                    }
            post_infos.append(post)

        # check if this is the last page
        try:
            self.cur.execute(query, (forum_id, search, search, 1, offset+count))
        finally:
            self.conn.commit()
        records = self.cur.fetchall()
        if len(records) == 0:
            nextPage = None
        else:
            nextPage = page+1

        return {"post_infos": post_infos, "nextPage": nextPage}

    def view_post(self, session_id, forum_id, post_id):
        uid = self.check_session(session_id)
        self.check_in_forum(uid, forum_id)
        self.check_post(forum_id, post_id)

        try:
            self.check_mod_in_forum(uid, forum_id)
            mod = True
        except:
            mod = False

        self.cur.execute('SELECT uid, title, date, last_activity, views, '
                         'answers, instructor_answered, tags, full_text, '
                         'anonymous, alias, upvoted, downvoted '
                         'FROM posts '
                         'WHERE fid = %s AND pid = %s',
                         (forum_id, post_id))
        record = self.cur.fetchone()

        # increment number of views
        try:
            self.cur.execute('UPDATE posts '
                             'SET views = views + 1 '
                             'WHERE fid = %s AND pid = %s',
                             (forum_id, post_id))
        finally:
            self.conn.commit()

        anonymous = record[9]
        alias = record[10]
        user_obj = self.get_user_obj(record[0], mod, anonymous, alias)
        if uid in record[11]:
            vote = 1
        elif uid in record[12]:
            vote = -1
        else:
            vote = 0

        post = {"user"    : user_obj,
                "title"   : record[1],
                "date"    : record[2],
                "last_activity": record[3],
                "views"   : record[4],
                "answers" : record[5],
                "instructor_answered": record[6],
                "tags"    : record[7],
                "full_text": record[8],
                "vote": vote,
                }

        return post

    def create_answer(self, session_id, forum_id, post_id, answer, anonymous=False, alias=False):
        uid = self.check_session(session_id)
        self.check_in_forum(uid, forum_id)
        self.check_post(forum_id, post_id)

        if len(answer) == 0:
            raise Exception("answer can not be empty")

        date = datetime.utcfromtimestamp(time.time()).isoformat()

        self.cur.execute('SELECT MAX(aid) '
                         'FROM answers '
                         'WHERE fid = %s AND pid = %s',
                         (forum_id, post_id))
        max_aid = self.cur.fetchone()[0]
        if max_aid is None:
            aid = 0
        else:
            aid = max_aid + 1

        try:
            self.check_mod_in_forum(uid, forum_id)
            mod = True
        except:
            mod = False

        # moderators can't make anonymous answers
        if mod:
            anonymous = False
            alias = False

        try:
            self.cur.execute('INSERT INTO answers '
                             '(fid, pid, aid, uid, date, answer, score, anonymous, alias) '
                             'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
                             (forum_id, post_id, aid, uid, date, answer, 0, anonymous, alias))
            self.cur.execute('UPDATE posts '
                             'SET answers = answers + 1, last_activity = %s '
                             'WHERE fid = %s AND pid = %s',
                             (date, forum_id, post_id))
            if mod:
                self.cur.execute('UPDATE posts '
                                 'SET instructor_answered = true, instructor_aid = %s '
                                 'WHERE fid = %s AND pid = %s',
                                 (aid, forum_id, post_id))
        finally:
            self.conn.commit()

    def get_answers(self, session_id, forum_id, post_id, query):
        uid = self.check_session(session_id)
        self.check_in_forum(uid, forum_id)
        self.check_post(forum_id, post_id)

        try:
            self.check_mod_in_forum(uid, forum_id)
            mod = True
        except:
            mod = False

        count = int(query.get("count", 50))
        if count < 0:
            raise Exception("count can't be less than 0")

        page = int(query.get("page", 1))
        offset = (page - 1) * count
        if offset < 0:
            raise Exception("page can't be less than 0")

        ascending = query.get("ascending", 'false').lower()
        if ascending == 'true':
            ascending = 'ASC'
        elif ascending == 'false':
            ascending = 'DESC'
        else:
            raise Exception("'ascending' must be a boolean")
        
        search = query.get("search", '.*')

        query = sql.SQL('SELECT instructor_answered, instructor_aid '
                        'FROM posts '
                        'WHERE fid = %s AND pid = %s')
        try:
            self.cur.execute(query, (forum_id, post_id))
        finally:
            self.conn.commit()
        records = self.cur.fetchone()
        instructor_answered = records[0]
        instructor_aid = records[1]

        instructor_answer = None
        if instructor_answered:
            self.cur.execute('SELECT aid, uid, date, answer, score '
                             'FROM answers '
                             'WHERE fid = %s AND pid = %s AND aid = %s',
                             (forum_id, post_id, instructor_aid))
            record = self.cur.fetchone()
            instructor_answer = {"answer_id" : record[0],
                                 "user"      : {"uid" : record[1],
                                                "name": self.get_display_name(record[1])},
                                 "date"      : record[2],
                                 "answer"    : record[3],
                                 "score"     : record[4],
                                 }

        query = sql.SQL('SELECT aid, uid, date, answer, score, anonymous, alias '
                         'FROM answers '
                         'WHERE fid = %s AND pid = %s AND aid != %s AND answer ~* %s '
                         'ORDER BY score {asc} '
                         'LIMIT %s OFFSET %s').format(
                                 asc=sql.SQL(ascending),
                                 )
        try:
            self.cur.execute(query, (forum_id, post_id, instructor_aid, search, count, offset))
        finally:
            self.conn.commit()

        answer_infos = list()
        records = self.cur.fetchall()
        for record in records:
            anonymous = record[5]
            alias = record[6]
            user_obj = self.get_user_obj(record[1], mod, anonymous, alias)

            answer = {"answer_id"     : record[0],
                      "user"          : user_obj,
                      "date"          : record[2],
                      "answer"        : record[3],
                      "score"         : record[4],
                     }
            answer_infos.append(answer)

        # check if this is the last page
        try:
            self.cur.execute(query, (forum_id, post_id, instructor_aid, search, 1, offset+count))
        finally:
            self.conn.commit()
        records = self.cur.fetchall()
        if len(records) == 0:
            nextPage = None
        else:
            nextPage = page+1

        return {"instructor_answer": instructor_answer,
                "student_answers"  :
                    { "answers"    : answer_infos,
                      "nextPage"   : nextPage}
               }

    def __refresh_join_code(self, forum_id):
        while True:
            join_code = base64.b32encode(os.urandom(5)).decode()

            # check for collisions
            self.cur.execute('SELECT fid '
                             'FROM forums '
                             'WHERE join_code = %s', (join_code,))
            record = self.cur.fetchone()
            if record is None:
                break

        try:
            self.cur.execute('UPDATE forums '
                             'SET join_code = %s '
                             'WHERE fid = %s',
                             (join_code, forum_id))
        finally:
            self.conn.commit()

    def get_join_code(self, session_id, forum_id):
        uid = self.check_session(session_id)
        self.check_in_forum(uid, forum_id)

        while True:
            self.cur.execute('SELECT join_code '
                             'FROM forums '
                             'WHERE fid = %s', (forum_id,))
            join_code = self.cur.fetchone()[0]

            if join_code is not None:
                break

            self.__refresh_join_code(forum_id)

        return join_code

    def refresh_join_code(self, session_id, forum_id):
        uid = self.check_session(session_id)
        self.check_mod_in_forum(uid, forum_id)

        self.__refresh_join_code(forum_id)
        return

    def join_forum(self, session_id, join_code):
        uid = self.check_session(session_id)

        if join_code is None or len(join_code) == 0:
            raise Exception("join code can't be empty")

        self.cur.execute('SELECT fid '
                         'FROM forums '
                         'WHERE join_code = %s', (join_code,))
        fid = self.cur.fetchone()
        if fid is None:
            raise Exception("join code is not valid")

        self.__add_to_forum(uid, fid[0])
        return

    def vote_on_post(self, session_id, forum_id, post_id, vote):
        uid = self.check_session(session_id)
        self.check_in_forum(uid, forum_id)
        self.check_post(forum_id, post_id)
        
        self.cur.execute('SELECT score, upvoted, downvoted '
                         'FROM posts '
                         'WHERE fid = %s AND pid = %s '
                        )
        records = self.cur.fetchone()
        score = records[0]
        upvoted = records[1]
        downvoted = records[2]
        if vote == -1:
            if uid not in upvoted and uid not in downvoted:
                score -= 1
            elif uid in upvoted:
                score -= 2
                upvoted.remove(uid)
            downvoted.append(uid)
        elif vote == 0:
            if uid in upvoted:
                score -= 1
                upvoted.remove(uid)
            elif uid in downvoted:
                score += 1
                downvoted.remove(uid)
        elif vote == 1:
            if uid not in upvoted and uid not in downvoted:
                score += 1
            elif uid in downvoted:
                score += 2
                downvoted.remove(uid)
            upvoted.append(uid)
        else:
            raise Exception("vote must be -1, 0, or 1")
        try:
            self.cur.execute('UPDATE posts '
                                 'SET score = %s, upvoted = %s, downvoted = %s '
                                 'WHERE pid = %s', (score, upvoted, downvoted, post_id))
        finally:
            self.conn.commit()
