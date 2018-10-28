"""
Top Wolverine initializer
"""
import flask
from werkzeug.wsgi import DispatcherMiddleware

# app is a single object used by all the code modules in this package
app = flask.Flask(__name__)  # pylint: disable=invalid-name

# Read settings from config module (insta485/config.py)
app.config.from_object('WLTTBackend.config')

# Overlay settings read from file specified by environment variable. This is
# useful for using different on development and production machines.
# Reference: http://flask.pocoo.org/docs/0.12/config/
app.config.from_envvar('WLTTBackend_SETTINGS', silent=True)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


# Define a basic app to combine with our app, so that we can isolate our app
# with prefix "/secretkey" when deploying among other student solutions
# on the server
# Disabling check since flask makes use of "env" parameter when deployed
# pylint: disable=unused-argument
def empty_app(env, resp):
    """Exist for the purpose of deploying to 485 class servers."""
    resp('200 OK', [('Content-Type', 'text/plain')])
    return [b"Enforcing Prefix"]


# As with "app", we disable this check because this variable represents
# the app itself, rather than an arbitrary constant
# pylint: disable=invalid-name
deployed_app = DispatcherMiddleware(empty_app, {"/08l55j4h": app})

# Tell our app about views and model.  This is dangerously close to a
# circular import, which is naughty, but Flask was designed that way.
# (Reference http://flask.pocoo.org/docs/0.12/patterns/packages/)  We're
# going to tell pylint and pycodestyle to ignore this coding style violation.
# import WLTTBackend.views  # noqa: E402  pylint: disable=wrong-import-position
import WLTTBackend.model  # noqa: E402  pylint: disable=wrong-import-position
import WLTTBackend.api