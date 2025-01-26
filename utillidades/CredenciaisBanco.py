from run import app
from app.models.models import Users

with app.app_context():
    users = Users.query.all()
    for user in users:
        print(user.username, user.password)
