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
                host     = "localhost",
                database = "ganbaru",
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

    def close(self):
        self.cur.close()
        self.conn.close()

    def __create_auth_table(self):
        try:
            # passwords are salted and hashed using argon2id
            self.cur.execute('CREATE TABLE IF NOT EXISTS auth ('
                                        'uid        integer NOT NULL UNIQUE,'
                                        'username   text    NOT NULL UNIQUE,'
                                        'hash       text    NOT NULL,'
                                        'session_id text,'
                                        'session_expiration timestamp (0) with time zone);')
        finally:
            self.conn.commit()

    def __create_admin(self, username, password):
        self.cur.execute('SELECT uid FROM auth WHERE uid=0')
        if self.cur.fetchone() is None:
            self.create_user(username, password)

    def __create_users_table(self):
        try:
            self.cur.execute('CREATE TABLE IF NOT EXISTS users ('
                             'uid        integer NOT NULL UNIQUE,'
                             'forums     integer[],'
                             'first_name text,'
                             'last_name  text,'
                             'alias      text);')
        finally:
            self.conn.commit()

    def __create_forums_table(self):
        try:
            self.cur.execute('CREATE TABLE IF NOT EXISTS forums ('
                             'fid         integer NOT NULL UNIQUE,'
                             'owner       integer NOT NULL,'
                             'name        text NOT NULL,'
                             'description text);')
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
                             'student_aids integer[]);')
        finally:
            self.conn.commit()

    def create_user(self, username, password):
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
                             '(uid, username, hash) '
                             'VALUES (%s, %s, %s)',
                             (uid, username, hash))
            self.cur.execute('INSERT INTO users (uid) VALUES (%s)', (uid,))
        except psycopg2.errors.UniqueViolation:
            raise Exception("username taken")
        finally:
            self.conn.commit()

        return

    # returns True if password correct
    # raises exception if incorrect
    def check_password(self, username, password):
        self.cur.execute('SELECT hash FROM auth WHERE username=%s', (username,))
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

    def delete_user(self, username, password):
        username = username.lower()

        self.cur.execute('SELECT uid FROM auth WHERE username=%s', (username,))
        record = self.cur.fetchone()
        if not record:
            raise Exception("user doesn't exist")

        uid = record[0]
        if uid == 0:
            raise Exception("can't delete admin")

        self.check_password(username, password)

        #change owner of forums to admin
        self.cur.execute('SELECT fid '
                         'FROM forums '
                         'WHERE owner = %s', (uid,))
        for record in self.cur.fetchall():
            fid = record[0]
            try:
                self.cur.execute('UPDATE forums '
                                 'SET owner = 0 '
                                 'WHERE fid = %s', (fid,))
                self.__add_to_forum(0, fid)
            finally:
                self.conn.commit()

        try:
            self.cur.execute('DELETE FROM auth WHERE uid=%s', (uid,))
            self.cur.execute('DELETE FROM users WHERE uid=%s', (uid,))
        finally:
            self.conn.commit()

    def login(self, username, password, timeout):
        username = username.lower()

        self.check_password(username, password)

        session_id = base64.b64encode(os.urandom(36)).decode()
        exp_date = datetime.utcfromtimestamp(time.time() + timeout).isoformat()
        try:
            # TODO support multiple sessions
            self.cur.execute('UPDATE auth SET session_id = %s, '
                             'session_expiration = %s '
                             'WHERE username = %s',
                             (session_id, exp_date, username))
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
    def add_to_forum(self, session_id, uids, fid):
        uid = self.check_session(session_id)

        self.check_forum(fid)
        # TODO check if authorized to add users to the forum

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
            self.cur.execute('SELECT * '
                             'FROM forums '
                             'WHERE fid = %s', (fid,))
            record = self.cur.fetchone()

            forum = dict()
            forum['forum_id']    = record[0]
            forum['owner']       = record[1]
            forum['name']        = record[2]
            forum['description'] = record[3]

            output.append(forum)

        return {"forums": output}

    def create_post(self, session_id, forum_id, title, full_text, tags):
        uid = self.check_session(session_id)
        self.check_forum(forum_id)
        # TODO check if part of forum

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

        try:
            self.cur.execute('INSERT INTO posts '
                             '(fid, pid, uid, title, date, last_activity, views, answers, '
                             'instructor_answered, tags, full_text) '
                             'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);',
                             (forum_id, pid, uid, title, date, last_activity, views, answers,
                              instructor_answered, tags, full_text))
        finally:
            self.conn.commit()

    def get_posts(self, session_id, forum_id, query):
        uid = self.check_session(session_id)
        self.check_forum(forum_id)
        # TODO check if part of forum

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

        #TODO search and tags
        search = query.get("search", '.*')

        query = sql.SQL('SELECT pid, uid, title, date, last_activity, '
                        'views, answers, instructor_answered, tags '
                         'FROM posts '
                         'WHERE fid = %s AND (title ~ %s OR full_text ~ %s) '
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
            post = {"post_id"       : record[0],
                    "user_id"       : record[1],
                    "title"         : record[2],
                    "date"          : record[3],
                    "last_activity" : record[4],
                    "views"         : record[5],
                    "answers"       : record[6],
                    "instructor_answered": record[7],
                    "tags"          : record[8],
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
