
import flask
import WLTTBackend


@WLTTBackend.app.route('/api/hello', methods=["GET"])
def hello_world_func():
    dict = {
        "text": "hello world",
        "id": 1
    }
    print("entered hello\n")
    return flask.jsonify(dict), 206

@WLTTBackend.app.route('/api/hello', methods=["GET"])
def hello_world_func():
    dict = {
        "text": "hello world",
        "id": 1
    }
    print("entered hello\n")
    return flask.jsonify(dict), 206