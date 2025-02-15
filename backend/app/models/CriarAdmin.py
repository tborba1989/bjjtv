import sys
import os

# Adiciona o diretório pai ao PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app, db
from backend.app.models.models import Usuario
from werkzeug.security import generate_password_hash

app = create_app()


def criar_admin():
    with app.app_context():
        try:
            # Verifica se o usuário admin já existe
            if not Usuario.query.filter_by(usuario='admin').first():
                # Cria o usuário admin
                admin = Usuario(
                    nome='Administrador',
                    usuario='admin',
                    email='admin@rnbjjtv.com',
                    senha=generate_password_hash('senha123')
                )

                # Adiciona e commita no banco de dados
                db.session.add(admin)
                db.session.commit()
                print("Usuário admin criado com sucesso!")
            else:
                print("Usuário admin já existe!")
        except Exception as e:
            print(f"Erro ao criar admin: {str(e)}")
            db.session.rollback()


if __name__ == '__main__':
    criar_admin()