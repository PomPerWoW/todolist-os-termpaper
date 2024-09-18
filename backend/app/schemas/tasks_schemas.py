from marshmallow import Schema, fields
from app.schemas.plain_schemas import PlainTaskSchema, PlainUserSchema


class TaskSchema(PlainTaskSchema):
    user_id = fields.Int(required=True, load_only=True)
    user = fields.Nested(PlainUserSchema(), dump_only=True)


class TaskResponseSchema(Schema):
    status = fields.Str(default="success")
    data = fields.Nested(PlainTaskSchema(many=True), dump_only=True)


class SingleTaskResponseSchema(Schema):
    status = fields.Str(default="success")
    data = fields.Nested(TaskSchema(), dump_only=True)


class TaskUpdateSchema(Schema):
    task_title = fields.Str()
    completed = fields.Boolean(load_default=False)
