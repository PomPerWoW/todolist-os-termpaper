from ntpath import join
import os

from flask import Flask
from flask_smorest import Api
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

from app.main import blp as MainBlueprint
from app.users import blp as UsersBlueprint


load_dotenv()

app = Flask(__name__)

app.config["PROPAGATE_EXCEPTIONS"] = True
app.config["API_TITLE"] = "Todolist REST API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.3"
app.config["OPENAPI_URL_PREFIX"] = "/"
app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

db = SQLAlchemy(app)
api = Api(app)

api.register_blueprint(MainBlueprint)
api.register_blueprint(UsersBlueprint)
