from flask import Flask, jsonify, request, abort
import Database

app = Flask(__name__)

@app.route("/user/create", methods=["POST"])
def create_user():
    try:
        data = request.get_json()
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        db.create_user(data["username"], data["password"])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return "", 200


if __name__ == "__main__":
    global db
    db = Database.db()
    db.init()
    app.run(debug=True)
