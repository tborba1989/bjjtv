from app import db
from app.models.models import Competicao
from datetime import datetime

def criar_competicoes_simuladas():
    competicoes = [
        Competicao(
            nome="Campeonato RN de Jiu-Jitsu",
            data=datetime(2025, 11, 11),
            mes="Nov",
            local="Natal/RN",
            horario="09:00 - 18:00",
            imagem_url="https://exemplo.com/imagens/campeonato_rn.jpg",
            status="active"
        ),
        Competicao(
            nome="Copa Potiguar de Jiu-Jitsu",
            data=datetime(2025, 11, 18),
            mes="Nov",
            local="Mossoró/RN",
            horario="10:00 - 17:00",
            imagem_url="https://exemplo.com/imagens/copa_potiguar.jpg",
            status="active"
        ),
        Competicao(
            nome="Grand Slam BJJ",
            data=datetime(2025, 11, 25),
            mes="Nov",
            local="Pipa/RN",
            horario="08:00 - 20:00",
            imagem_url="https://exemplo.com/imagens/grand_slam.jpg",
            status="active"
        )
    ]

    for competicao in competicoes:
        db.session.add(competicao)
    db.session.commit()

    print("Três competições simuladas foram criadas com sucesso!")

# Execute a função no shell
if __name__ == "__main__":
    from app import create_app

    app = create_app()
    with app.app_context():
        criar_competicoes_simuladas()
