import os
from dotenv import load_dotenv
import psycopg2
import re
from argon2 import PasswordHasher

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
        self.__create_admin("admin", "12345678")

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
        except psycopg2.errors.UniqueViolation:
            raise Exception("username taken")
        finally:
            self.conn.commit()

        return

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
            return False

    def delete_user(self, username, password):
        self.cur.execute('SELECT uid FROM auth WHERE username=%s', (username,))
        record = self.cur.fetchone()
        if not record:
            raise Exception("user doesn't exist")

        uid = record[0]
        if uid == 0:
            raise Exception("can't delete admin")

        if self.check_password(username, password):
            try:
                self.cur.execute('DELETE FROM auth WHERE uid=%s', (uid,))
            finally:
                self.conn.commit()
        else:
            raise Exception("wrong password")

    def login(self, username, password):
        if self.check_password(username, password):
            pass
        else:
            raise Exception("wrong password")
