from flask_smorest import Blueprint

blp = Blueprint(
    "tasks", __name__, url_prefix="/api/v1", description="Operation on tasks"
)

from app.tasks import routes
