from app.main import blp
from flask.views import MethodView


@blp.route("/")
class Main(MethodView):
    @blp.response(
        200,
        description="APIs test.",
    )
    def get(self):
        return {"status": "success", "message": "This is The Main Blueprint."}
