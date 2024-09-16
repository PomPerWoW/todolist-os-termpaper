from marshmallow import Schema, fields, validate
from app.schemas.plain_schemas import PlainUserSchema, PlainTaskSchema


class UserSchema(PlainUserSchema):
    tasks = fields.List(fields.Nested(PlainTaskSchema()), dump_only=True)


class UserResponseSchema(Schema):
    status = fields.Str(default="success")
    data = fields.Nested(PlainUserSchema(many=True), dump_only=True)


class SingleUserResponseSchema(Schema):
    status = fields.Str(default="success")
    data = fields.Nested(UserSchema(), dump_only=True)


class UserUpdateSchema(Schema):
    username = fields.Str(validate=validate.Length(min=4))
