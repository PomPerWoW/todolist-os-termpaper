from app.main import blp
from flask.views import MethodView


@blp.route("/")
class Main(MethodView):
    def get(self):
        return "This is The Main Blueprint"
