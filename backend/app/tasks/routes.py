from app.tasks import blp
from flask.views import MethodView
from flask_smorest import abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from app.db import db
from app.db.models import TaskModel
from app.schemas import (
    TaskSchema,
    TaskResponseSchema,
    SingleTaskResponseSchema,
    TaskUpdateSchema,
)


@blp.route("/tasks")
class TasksList(MethodView):
    @blp.response(
        200,
        description="Get all tasks.",
        schema=TaskResponseSchema,
    )
    def get(self):
        all_tasks = TaskModel.query.all()
        return TaskResponseSchema().dump({"data": all_tasks})

    @blp.arguments(TaskSchema)
    @blp.response(
        201,
        description="Create new task.",
        schema=SingleTaskResponseSchema,
    )
    def post(self, task_data):
        task = TaskModel(**task_data)

        try:
            db.session.add(task)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while inserting the task.")

        return SingleTaskResponseSchema().dump({"data": task})


@blp.route("/tasks/<string:task_id>")
class Tasks(MethodView):
    @blp.response(
        200,
        description="Get task by id.",
        schema=SingleTaskResponseSchema,
    )
    def get(self, task_id):
        task = TaskModel.query.get_or_404(task_id)
        return SingleTaskResponseSchema().dump({"data": task})

    @blp.response(204, description="Delete task by id.")
    def delete(self, task_id):
        task = TaskModel.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return {"status": "success", "message": "Task deleted."}

    @blp.arguments(TaskUpdateSchema)
    @blp.response(
        200,
        description="Update task by id.",
        schema=SingleTaskResponseSchema,
    )
    def put(self, task_data, task_id):
        task = TaskModel.query.get(task_id)

        if not task:
            return abort(
                400,
                message="Task not found.",
            )

        task.task_title = task_data["task_title"]
        task.task_description = task_data["task_description"]
        task.completed = task_data["completed"]

        db.session.add(task)
        db.session.commit()
        return SingleTaskResponseSchema().dump({"data": task})
