from flask import Flask, jsonify, request, make_response, redirect
from flask_cors import CORS
import Database

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", headers='Content-Type', supports_credentials=True)

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
        data["email"]
    except:
        return jsonify({"error": "missing email"}), 400

    try:
        db.create_user(data["email"], data["password"], data["username"])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    timeout = int(data.get("timeout", 86400))

    try:
        session_id = db.login(data["email"], data["password"], timeout)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    resp = make_response(jsonify({}))
    resp.set_cookie("session_id",
                    value=session_id,
                    max_age=timeout,
                    #domain=".nijika.org",
                    samesite='None',
                    secure=True)
    return resp, 200

@app.route("/user/delete", methods=["POST"])
def delete_user():
    global db;

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["email"]
    except:
        return jsonify({"error": "missing email"}), 400

    try:
        data["password"]
    except:
        return jsonify({"error": "missing password"}), 400

    try:
        db.delete_user(data["email"], data["password"])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({}), 200

@app.route("/user/login", methods=["POST"])
def login():
    global db

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["email"]
    except:
        return jsonify({"error": "missing email"}), 400

    try:
        data["password"]
    except:
        return jsonify({"error": "missing password"}), 400

    timeout = int(data.get("timeout", 86400))

    try:
        session_id = db.login(data["email"], data["password"], timeout)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    resp = make_response(jsonify({}))
    resp.set_cookie("session_id",
                    value=session_id,
                    max_age=timeout,
                    #domain=".nijika.org",
                    samesite='None',
                    secure=True)
    return resp, 200

@app.route("/user/logout", methods=["POST"])
def logout():
    resp = make_response(jsonify({}))
    resp.set_cookie("session_id",
                    value='',
                    max_age=0,
                    samesite='None',
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

    return jsonify({}), 200

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
        fid = db.create_forum(session_id, name, description)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(fid), 200

@app.route("/forums/info/<forum_id>", methods=["GET"])
def get_forum_info(forum_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        forum = db.get_forum_info(session_id, forum_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(forum), 200

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

@app.route("/forums/<forum_id>/join_code", methods=["GET"])
def get_join_code(forum_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        join_code = db.get_join_code(session_id, forum_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"join_code": join_code}), 200

@app.route("/forums/<forum_id>/refresh_join_code", methods=["POST"])
def refresh_join_code(forum_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        db.refresh_join_code(session_id, forum_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({}), 200

@app.route("/forums/<forum_id>/mod_join_code", methods=["GET"])
def get_mod_join_code(forum_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        mod_join_code = db.get_mod_join_code(session_id, forum_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"mod_join_code": mod_join_code}), 200

@app.route("/forums/<forum_id>/refresh_mod_join_code", methods=["POST"])
def refresh_mod_join_code(forum_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        db.refresh_mod_join_code(session_id, forum_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({}), 200

@app.route("/forums/join/<join_code>", methods=["POST"])
def join_forum(join_code):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        fid = db.join_forum(session_id, join_code)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(fid), 200

@app.route("/forums/join/<join_code>", methods=["GET"])
def join_forum_and_redirect(join_code):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        fid = db.join_forum(session_id, join_code)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    fid = fid["forum_id"]

    return redirect(f"/forum/{fid}", code=302)

@app.route("/forums/<forum_id>/create", methods=["POST"])
def create_post(forum_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    title = data.get("title")
    if title is None:
        return jsonify({"error": "title is required to create post"}), 400

    full_text = data.get("full_text")
    if full_text is None:
        return jsonify({"error": "post body can't be empty"}), 400
    elif len(full_text) > 10000:
        return jsonify({"error": "post body is over the 10k character limit"}), 400

    tags = data.get("tags")

    anonymous = data.get("anonymous", False)
    alias = data.get("alias", False)

    try:
        pid = db.create_post(session_id, forum_id, title, full_text, tags, anonymous, alias)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(pid), 200

@app.route("/forums/<forum_id>", methods=["GET"])
def get_posts(forum_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    query = request.args

    try:
        posts = db.get_posts(session_id, forum_id, query)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(posts), 200

@app.route("/forums/<forum_id>/<post_id>", methods=["GET"])
def view_post(forum_id, post_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        post = db.view_post(session_id, forum_id, post_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(post), 200

@app.route("/forums/<forum_id>/<post_id>/create", methods=["POST"])
def create_answer(forum_id, post_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["answer"]
    except:
        return jsonify({"error": "missing answer field"}), 400

    if len(data["answer"]) > 10000:
        return jsonify({"error": "answer body is over the 10k character limit"}), 400

    anonymous = data.get("anonymous", False)
    alias = data.get("alias", False)

    try:
        db.create_answer(session_id, forum_id, post_id, data["answer"], anonymous, alias)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({}), 200

@app.route("/forums/<forum_id>/<post_id>/answers", methods=["GET"])
def get_answers(forum_id, post_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    query = request.args

    try:
        answers = db.get_answers(session_id, forum_id, post_id, query)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(answers), 200

@app.route("/forums/<forum_id>/<post_id>/get_vote", methods=["GET"])
def get_post_vote(forum_id, post_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        vote = db.get_post_vote(session_id, forum_id, post_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(vote), 200

@app.route("/forums/<forum_id>/<post_id>/vote", methods=["POST"])
def vote_on_post(forum_id, post_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["vote"]
    except:
        return jsonify({"error": "missing vote field"}), 400

    try:
        vote = db.vote_on_post(session_id, forum_id, post_id, data["vote"])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({}), 200

@app.route("/forums/<forum_id>/<post_id>/<answer_id>/get_vote", methods=["GET"])
def get_answer_vote(forum_id, post_id, answer_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        vote = db.get_answer_vote(session_id, forum_id, post_id, answer_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(vote), 200

@app.route("/forums/<forum_id>/<post_id>/<answer_id>/vote", methods=["POST"])
def vote_on_answer(forum_id, post_id, answer_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    try:
        data["vote"]
    except:
        return jsonify({"error": "missing vote field"}), 400

    try:
        vote = db.vote_on_answer(session_id, forum_id, post_id, answer_id, data["vote"])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({}), 200

@app.route("/forums/<forum_id>/is_mod", methods=["GET"])
def is_mod(forum_id):
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        db.is_mod(session_id, forum_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({}), 200

@app.route("/user/profile/set_info", methods=["POST"])
def set_info():
    try:
        session_id = request.cookies['session_id']
    except:
        return jsonify({"error": "missing session_id cookie"}), 400

    try:
        data = request.get_json(force=True)
    except:
        return jsonify({"error": "invalid json"}), 400

    full_name = data.get("full_name", None)
    username = data.get("username", None)

    resp = make_response(jsonify({}))
    try:
        if username is not None:
            token, timeout = db.set_username(session_id, username)
            resp.set_cookie("session_id",
                            value=token,
                            max_age=timeout,
                            #domain=".nijika.org",
                            samesite='None',
                            secure=True)
        if full_name is not None:
            db.set_full_name(session_id, full_name)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return resp, 200

if __name__ == "__main__":
    app.run(debug=True)
