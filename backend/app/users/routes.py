from app.users import blp
from flask.views import MethodView
from flask_smorest import abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from app.db import db
from app.db.models import UserModel
from app.schemas import (
    UserSchema,
    UserResponseSchema,
    SingleUserResponseSchema,
    UserUpdateSchema,
)


@blp.route("/users")
class UsersList(MethodView):
    @blp.response(
        200,
        description="Get all users.",
        schema=UserResponseSchema,
    )
    def get(self):
        all_users = UserModel.query.all()
        return UserResponseSchema().dump({"data": all_users})

    @blp.arguments(UserSchema)
    @blp.response(
        201,
        description="Create new user.",
        schema=SingleUserResponseSchema,
    )
    def post(self, user_data):
        user = UserModel(**user_data)

        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            abort(400, message="A user with that username already exists.")
        except SQLAlchemyError:
            abort(500, message="An error occurred while inserting the user.")

        return SingleUserResponseSchema().dump({"data": user})


@blp.route("/users/<string:user_id>")
class UsersId(MethodView):
    @blp.response(
        200,
        description="Get user by id.",
        schema=SingleUserResponseSchema,
    )
    def get(self, user_id):
        user = UserModel.query.get_or_404(user_id)
        return SingleUserResponseSchema().dump({"data": user})

    @blp.response(204, description="Delete user by id.")
    def delete(self, user_id):
        user = UserModel.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"status": "success", "message": "User deleted."}

    @blp.arguments(UserUpdateSchema)
    @blp.response(
        200,
        description="Update user by id.",
        schema=SingleUserResponseSchema,
    )
    def put(self, user_data, user_id):
        user = UserModel.query.get(user_id)

        if not user:
            return abort(
                400,
                message="User not found.",
            )

        user.username = user_data["username"]

        db.session.add(user)
        db.session.commit()
        return SingleUserResponseSchema().dump({"data": user})


@blp.route("/users/username/<string:username>")
class UsersName(MethodView):
    @blp.response(
        200,
        description="Get user by username.",
        schema=SingleUserResponseSchema,
    )
    def get(self, username):
        user = UserModel.query.filter_by(username=username).first_or_404()
        return SingleUserResponseSchema().dump({"data": user})
