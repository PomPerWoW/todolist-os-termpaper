from flask_smorest import Blueprint

blp = Blueprint("tasks", __name__, description="Operation on tasks")

from app.tasks import routes
