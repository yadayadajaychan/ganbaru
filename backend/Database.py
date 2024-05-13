import os
from dotenv import load_dotenv
import psycopg2
import re

class db:
    def __init__(self):
        load_dotenv()
        self.conn = psycopg2.connect(
                host     = "localhost",
                database = "ganbaru",
                user     = os.getenv('DB_USERNAME'),
                password = os.getenv('DB_PASSWORD'))

        self.cur = self.conn.cursor();

    def init(self):
        self.__create_auth()
        try:
            self.__insert_auth(0, "admin")
        except psycopg2.errors.UniqueViolation:
            None # admin already exists

    def close(self):
        self.cur.close()
        self.conn.close()

    def __create_auth(self):
        try:
            self.cur.execute('CREATE TABLE IF NOT EXISTS auth ('
                                        'uid        integer NOT NULL UNIQUE,'
                                        'username   text    NOT NULL UNIQUE,'
                                        #'salt       text    NOT NULL,'
                                        #'bcrypt     text    NOT NULL,'
                                        'session_id text,'
                                        'session_expiration timestamp (0) with time zone);')
        finally:
            self.conn.commit()

    def __insert_auth(self, uid, username):
        try:
            self.cur.execute('INSERT INTO auth VALUES (%s, %s)', (uid, username))
        finally:
            self.conn.commit()

    def __delete_auth(self, uid):
        try:
            self.cur.execute('DELETE FROM auth WHERE uid=%s', (uid,))
        finally:
            self.conn.commit()

    def create_user(self, username, password):
        if not username.isascii():
            raise Exception("non-ascii username not allowed")

        if len(username) < 1:
            raise Exception("empty username")

        r = re.compile('[^A-Za-z0-9_]')
        if r.search(username):
            raise Exception("only alphanumeric characters and underscore allowed")

        username = username.lower()

        #TODO generate random salt & hash passwords

        self.cur.execute('SELECT MAX(uid) FROM auth')
        uid = self.cur.fetchone()[0] + 1

        try:
            self.__insert_auth(uid, username)
        except psycopg2.errors.UniqueViolation:
            raise Exception("username taken")

        return

    def delete_user(self, username, password):
        self.cur.execute('SELECT uid FROM auth WHERE username=%s', (username,))
        record = self.cur.fetchone()
        if not record:
            raise Exception("user doesn't exist")

        uid = record[0]
        if uid == 0:
            raise Exception("can't delete admin")

        #TODO check password

        self.__delete_auth(uid)

    def login(self, username, password):
        pass
        #TODO check password
