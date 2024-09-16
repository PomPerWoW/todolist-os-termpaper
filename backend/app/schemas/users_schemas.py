from marshmallow import Schema, fields


class PlainUserSchema(Schema):
    id = fields.Str(dump_only=True)
    username = fields.Str(required=True)
