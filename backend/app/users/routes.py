from app.users import blp
from flask.views import MethodView


@blp.route("/users")
class Users(MethodView):
    def get(self):
        return "This is The Users Blueprint"
