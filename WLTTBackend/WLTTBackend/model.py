
"""model (database) API."""

import sqlite3
import flask
import WLTTBackend


def dict_factory(cursor, row):
   #Convert database row objects to a dictionary. 
   
    output = {}
    for idx, col in enumerate(cursor.description):
        output[col[0]] = row[idx]

    return output


def get_db():
    """Open a new database connection."""
    if not hasattr(flask.g, 'sqlite_db'):
        flask.g.sqlite_db = sqlite3.connect(
            WLTTBackend.app.config['DATABASE_FILENAME'])
        flask.g.sqlite_db.row_factory = dict_factory

       
        flask.g.sqlite_db.execute("PRAGMA foreign_keys = ON")

    return flask.g.sqlite_db


@WLTTBackend.app.teardown_appcontext
def close_db(error):
    # pylint: disable=unused-argument
    """Close the database at the end of a request."""
    if hasattr(flask.g, 'sqlite_db'):
        flask.g.sqlite_db.commit()
        flask.g.sqlite_db.close()
