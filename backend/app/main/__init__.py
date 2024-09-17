from flask_smorest import Blueprint

blp = Blueprint("main", __name__, url_prefix="/api/v1", description="Operation on main")

from app.main import routes
