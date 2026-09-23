"""
FOR EDUCATIONAL USE ONLY — DO NOT DEPLOY PUBLICLY.
This Flask app contains DELIBERATE vulnerabilities for scanner testing.
"""
import os
import sqlite3
from flask import Flask, request, g

DB_PATH = os.path.join(os.path.dirname(__file__), "demo.db")

app = Flask(__name__)


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
    return g.db


@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def seed_db():
    if os.path.exists(DB_PATH):
        return
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)")
    c.execute("INSERT INTO users (username, password) VALUES ('admin', 'admin123')")
    c.execute("INSERT INTO users (username, password) VALUES ('alice', 'wonderland')")
    conn.commit()
    conn.close()


@app.route("/")
def home():
    return """
    <html><body>
      <h1>Vulnerable Demo App</h1>
      <ul>
        <li><a href="/search?q=hello">Search</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/admin">Admin</a></li>
      </ul>
    </body></html>
    """


@app.route("/search")
def search():
    q = request.args.get("q", "")
    # Intentionally reflects input unescaped (XSS demo)
    return f"""
    <html><body>
      <h1>Search results</h1>
      <p>You searched for: {q}</p>
      <form action="/search" method="get">
        <input type="text" name="q">
        <input type="submit" value="Search">
      </form>
    </body></html>
    """


@app.route("/login", methods=["GET", "POST"])
def login():
    msg = ""
    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")
        db = get_db()
        # Intentionally vulnerable to SQL injection (raw concatenation)
        query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
        try:
            c = db.cursor()
            c.execute(query)
            row = c.fetchone()
            msg = f"Welcome, {row[1]}!" if row else "Invalid credentials."
        except sqlite3.OperationalError as e:
            # Intentionally leak DB errors for scanner demo
            msg = f"Database error: {e}"
    return f"""
    <html><body>
      <h1>Login</h1>
      <p>{msg}</p>
      <form action="/login" method="post">
        <p>Username: <input type="text" name="username"></p>
        <p>Password: <input type="password" name="password"></p>
        <input type="submit" value="Login">
      </form>
    </body></html>
    """


@app.route("/admin")
def admin():
    return "<html><body><h1>Admin Panel</h1><p>Secret config here (fake).</p></body></html>"


if __name__ == "__main__":
    seed_db()
    # Intentionally missing security headers
    app.run(host="127.0.0.1", port=5001, debug=False)