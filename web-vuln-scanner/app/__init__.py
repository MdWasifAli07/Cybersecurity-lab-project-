from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory


def create_app():
    frontend_dist = Path(__file__).resolve().parents[2] / "web vuln frontend" / "dist"
    app = Flask(__name__, static_folder=str(frontend_dist), static_url_path="")
    app.config["SECRET_KEY"] = "dev-key-change-me"

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin", "")
        if origin in {"http://localhost:5173", "http://127.0.0.1:5173"}:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Headers"] = "Content-Type"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        return response

    from app.routes import bp
    app.register_blueprint(bp)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        requested = frontend_dist / path
        if path and requested.is_file():
            return send_from_directory(frontend_dist, path)
        index_file = frontend_dist / "index.html"
        if index_file.is_file():
            return send_from_directory(frontend_dist, "index.html")
        return jsonify({
            "error": "React build not found",
            "message": "Run `npm run build` in the web vuln frontend directory.",
        }), 503

    return app