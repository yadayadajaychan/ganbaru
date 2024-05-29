from flask import Flask, jsonify, request, abort, make_response
import Database

app = Flask(__name__)
db = Database.db()
db.init()

@app.route("/user/create", methods=["POST"])
def create_user():
    global db;

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["username"]
    except:
        return jsonify({"error": "missing username"}), 400

    try:
        data["password"]
    except:
        return jsonify({"error": "missing password"}), 400

    try:
        db.create_user(data["username"], data["password"])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return "", 200

@app.route("/user/delete", methods=["POST"])
def delete_user():
    global db;

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["username"]
    except:
        return jsonify({"error": "missing username"}), 400

    try:
        data["password"]
    except:
        return jsonify({"error": "missing password"}), 400

    try:
        db.delete_user(data["username"], data["password"])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return "", 200

@app.route("/user/login", methods=["POST"])
def login():
    global db

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["username"]
    except:
        return jsonify({"error": "missing username"}), 400

    try:
        data["password"]
    except:
        return jsonify({"error": "missing password"}), 400

    try:
        timeout = data["timeout"]
        cookie_timeout = timeout
    except:
        # defaults to 1 day
        timeout = 86400
        cookie_timeout = None

    try:
        session_id = db.login(data["username"], data["password"], timeout)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    resp = make_response()
    resp.set_cookie("session_id",
                    value=session_id,
                    max_age=cookie_timeout,
                    #domain=".nijika.org",
                    secure=True)
    return resp, 200

@app.route("/user/check_session", methods=["GET"])
def check_session():
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        db.check_session(session_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return "", 200

@app.route("/forums/create", methods=["POST"])
def create_forum():
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    name = data.get("name")
    if name is None:
        return jsonify({"error": "name is required to create forum"}), 400

    description = data.get("description")

    try:
        db.create_forum(session_id, name, description)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return "", 200

@app.route("/forums", methods=["GET"])
def get_forums():
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        forums = db.get_forums(session_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(forums), 200

if __name__ == "__main__":
    app.run(debug=True)
