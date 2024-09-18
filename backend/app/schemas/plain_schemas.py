from marshmallow import Schema, fields, validate


class PlainUserSchema(Schema):
    id = fields.Str(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=4))


class PlainTaskSchema(Schema):
    id = fields.Str(dump_only=True)
    task_title = fields.Str(required=True)
    completed = fields.Boolean(dump_only=True)
