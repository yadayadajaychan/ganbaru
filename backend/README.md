# Back-end Server

## Requirements
- PostgreSQL: [https://www.postgresql.org/](https://www.postgresql.org/)
- Python Libraries
    - psycopg2
    - dotenv
    - flask
    - flask-cors
    - argon2
    - jwt
    - cryptography
- Gunicorn: [https://gunicorn.org/](https://gunicorn.org/)

## Environment
Copy the file `example.env` to `.env` and modify the variables
to allow access to the postgres database.
The database shouldn't have any tables in it before running the back-end server.

A pair of RSA keys is also required for authentication using JWTs.
They can be generated using openssl:
```
$ openssl genrsa -out privkey.pem 2048
$ openssl rsa -in privkey.pem -pubout -out pubkey.pem
```

Don't forget to set the `PRIVKEY_FILE` and `PUBKEY_FILE` variables
in the `.env` file.

## Running
After ensuring you have the postgres database set up, all the environment
variables set, all the python libraries installed, and gunicorn installed, you
can run the server on localhost:5000 by running the command:
```
$ gunicorn -b 127.0.0.1:5000 app:app
```
