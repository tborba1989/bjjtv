from flask import Flask, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

# Inicializa o banco de dados e migração
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # Configuração do Flask apontando para o diretório 'out'
    app = Flask(__name__, static_folder="../frontend/out", static_url_path="/static")

    # Configuração CORS usando variáveis de ambiente
    CORS(app, resources={
        r"/*": {
            "origins": os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(','),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": "*",
            "expose_headers": "*",
            "supports_credentials": True,
            "max_age": 600
        }
    })

    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    # Configurações do banco de dados e chave secreta
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    # Inicializa o banco de dados e a migração
    db.init_app(app)
    migrate.init_app(app, db)

    # Registro de blueprints
    from app.routes.auth import auth
    from app.routes.atletas import atletas
    from app.routes.inscricoes import competicoes, inscricoes, categorias
    from app.routes.patrocinadores import patrocinadores

    app.register_blueprint(auth)
    app.register_blueprint(atletas)
    app.register_blueprint(competicoes)
    app.register_blueprint(inscricoes)
    app.register_blueprint(patrocinadores)

    # Rota para servir o frontend
    @app.route("/")
    @app.route("/<path:path>")
    def serve_frontend(path=""):
        # Diretório base do build estático
        static_dir = os.path.abspath("../frontend/out")

        # Caminho completo do arquivo solicitado
        full_path = os.path.join(static_dir, path)

        # Logs para depuração
        print(f"Requisição para: {path}")
        print(f"Diretório estático: {static_dir}")
        print(f"Caminho completo: {full_path}")

        # Se o arquivo solicitado existir, envie-o
        if path and os.path.exists(full_path):
            print(f"Arquivo encontrado: {full_path}")
            return send_from_directory(static_dir, path)

        # Fallback para index.html
        print("Servindo index.html como fallback")
        return send_from_directory(static_dir, "index.html")

    return app
