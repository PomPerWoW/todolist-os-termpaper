from app.users import blp
from flask.views import MethodView
from flask_smorest import abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from app.db.models import UserModel
from app.schemas import PlainUserSchema


@blp.route("/users")
class Users(MethodView):
    @blp.response(200, PlainUserSchema(many=True))
    def get(self):
        return UserModel.query.all()
