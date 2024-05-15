from flask import Flask, jsonify, request, abort
import Database

app = Flask(__name__)
db = Database.db()
db.init()

@app.route("/user/create", methods=["POST"])
def create_user():
    global db;

    try:
        data = request.get_json()
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
        data = request.get_json()
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
        data = request.get_json()
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
    except:
        # 30 days default
        timeout = 2592000

    try:
        session_id = db.login(data["username"], data["password"], timeout)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"session_id": session_id}), 200

@app.route("/user/check_session", methods=["POST"])
def check_session():
    try:
        data = request.get_json()
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["session_id"]
    except:
        return jsonify({"error": "missing session_id"}), 400

    try:
        db.check_session(data["session_id"])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return "", 200

if __name__ == "__main__":
    app.run(debug=True)
