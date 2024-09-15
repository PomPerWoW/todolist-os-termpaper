from flask_smorest import Blueprint

blp = Blueprint("users", __name__, description="Operation on users")

from app.users import routes
