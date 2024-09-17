from flask_smorest import Blueprint

blp = Blueprint(
    "users", __name__, url_prefix="/api/v1", description="Operation on users"
)

from app.users import routes
