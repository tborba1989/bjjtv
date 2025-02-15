# app/__init__.py
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Configuração CORS simplificada
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": "*",
            "expose_headers": "*",
            "supports_credentials": True,
            "max_age": 600
        }
    })

    # Headers padrão para todas as respostas
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    # Resto do seu código permanece igual
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://mdb_h36p_user:lMv3mbgwo4Obc8UkCevku7CJfLBRwihL@dpg-cu5etft6l47c73dmmlc0-a.oregon-postgres.render.com/mdb_h36p'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'chave_super_secreta_rnbjjtv'

    db.init_app(app)
    migrate.init_app(app, db)

    from backend.app.routes.auth import auth
    from backend.app.routes.atletas import atletas
    from backend.app.routes.inscricoes import competicoes
    from backend.app.routes.inscricoes import inscricoes
    from backend.app.routes.inscricoes import categorias
    from backend.app.routes.patrocinadores import patrocinadores

    app.register_blueprint(auth)
    app.register_blueprint(atletas)
    app.register_blueprint(competicoes)
    app.register_blueprint(inscricoes)
    app.register_blueprint(patrocinadores)


    return app