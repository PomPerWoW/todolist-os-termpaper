from flask_smorest import Blueprint

blp = Blueprint("main", __name__, description="Operation on main")

from app.main import routes
