from app.db import db


class TaskModel(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(80), nullable=False)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False
    )
    user = db.relationship("UserModel", back_populates="tasks")
    completed = db.Column(db.Boolean, default=False, nullable=False)
