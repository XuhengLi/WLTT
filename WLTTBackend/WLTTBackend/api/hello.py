
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

@WLTTBackend.app.route('/api/getnote/all/', methods=["GET"])
def get_notes():
    context = {}
    connection = WLTTBackend.model.get_db()
    cur = connection.execute('''SELECT * FROM NOTES N;''')
    notes = cur.fetchall()
    context["notes"] = notes
    return flask.jsonify(**context)

@WLTTBackend.app.route('/api/savenote/', methods=["POST"])
def save_notes():
    connection = WLTTBackend.model.get_db()
    input_data = flask.request.form
    database.execute('''INSERT INTO NOTES(notename, content) VALUES ("{}", "{}");'''.format(input_data['note_name'], input_data['note_content']))

    context = {}
    return flask.jsonify(context)