import os, time
from datetime import datetime
from dotenv import load_dotenv
import psycopg2
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
                             'fid        integer NOT NULL UNIQUE,'
                             'owner      integer NOT NULL,'
                             'name       text NOT NULL,'
                             'description text);')
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
            self.cur.execute('INSERT INTO auth VALUES (%s, %s, %s)', (uid, username, hash))
            self.cur.execute('INSERT INTO users VALUES (%s)', (uid,))
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
        self.cur.execute('SELECT MAX(fid) FROM forums')
        max_fid = self.cur.fetchone()[0]
        if max_fid is None:
            fid = 0
        else:
            fid = max_fid + 1

        uid = self.check_session(session_id)

        try:
            self.cur.execute('INSERT INTO forums VALUES '
                             '(%s, %s, %s, %s);',
                             (fid, uid, name, description))
            self.cur.execute('UPDATE users '
                             'SET forums = forums || %s '
                             'WHERE uid = %s', (fid, uid))
        finally:
            self.conn.commit()

        return
