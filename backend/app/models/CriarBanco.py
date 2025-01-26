from app import create_app, db
from sqlalchemy import text


def sync_database():
    app = create_app()

    with app.app_context():
        # Primeiro, dropa a tabela existente
        with db.engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS usuarios CASCADE"))
            conn.commit()
            print("Tabela anterior removida com sucesso.")

        # Agora recria todas as tabelas do zero
        db.create_all()
        print("Banco de dados recriado com sucesso!")

        # Criar usuário admin inicial
        from app.models.models import Usuario
        from werkzeug.security import generate_password_hash

        # Verifica se já existe um admin
        admin = Usuario.query.filter_by(email='teste@rnbjjtv.com').first()

        if not admin:
            admin = Usuario(
                nome='Admin',
                usuario='admin',
                email='teste@rnbjjtv.com',
                senha=generate_password_hash('senha123')
            )

            db.session.add(admin)
            db.session.commit()
            print("Usuário admin criado com sucesso!")
        else:
            print("Usuário admin já existe!")


if __name__ == "__main__":
    sync_database()