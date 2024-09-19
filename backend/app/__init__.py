import os
import time

from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from sqlalchemy.exc import OperationalError

from app.db import db
from app.main import blp as MainBlueprint
from app.users import blp as UsersBlueprint
from app.tasks import blp as TasksBlueprint


def create_app():
    if os.getenv("FLASK_ENV") == "development":
        from dotenv import load_dotenv

        load_dotenv()

    app = Flask(__name__)
    cors = CORS()

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://frontend:8080",
                    "http://127.0.0.1:8080",
                    "http://127.0.0.1:5500",
                    "http://localhost:5500",
                    "http://localhost:8080" 
                ]
            }
        },
    )

    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "Todolist REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = (
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    max_retries = 10
    retry_count = 0

    while retry_count < max_retries:
        try:
            with app.app_context():
                db.create_all()
            print("Successfully connected to the database!")
            break
        except OperationalError as e:
            retry_count += 1
            print(
                f"Failed to connect to the database. Retrying ({retry_count}/{max_retries})..."
            )
            time.sleep(3)

    if retry_count == max_retries:
        print("Failed to connect to the database after maximum retries.")
        raise Exception("Could not connect to the database")

    api = Api(app)

    api.register_blueprint(MainBlueprint)
    api.register_blueprint(UsersBlueprint)
    api.register_blueprint(TasksBlueprint)

    return app
