from app import db, create_app  # Certifique-se de que `create_app` está no caminho correto
from app.models.models import Competicao  # Ajuste o caminho para o modelo
from datetime import datetime

# Criar 6 eventos inativos (status=False)
def criar_eventos_inativos():
    eventos_inativos = [
        Competicao(
            nome="Copa Brasil de Jiu-Jitsu",
            data=datetime(2024, 5, 10, 9, 0),
            local="São Paulo/SP",
            horario="09:00 - 18:00",
            status=False,
            imagem_url="/images/events/copa_brasil.webp"
        ),
        Competicao(
            nome="Open RJ de Jiu-Jitsu",
            data=datetime(2024, 6, 15, 10, 0),
            local="Rio de Janeiro/RJ",
            horario="10:00 - 17:00",
            status=False,
            imagem_url="/images/events/open_rj.webp"
        ),
        Competicao(
            nome="Campeonato Nacional de Jiu-Jitsu",
            data=datetime(2024, 7, 20, 8, 0),
            local="Belo Horizonte/MG",
            horario="08:00 - 16:00",
            status=False,
            imagem_url="/images/events/campeonato_nacional.webp"
        ),
        Competicao(
            nome="Taça Nordeste de Jiu-Jitsu",
            data=datetime(2024, 8, 5, 9, 30),
            local="Recife/PE",
            horario="09:30 - 17:30",
            status=False,
            imagem_url="/images/events/taca_nordeste.webp"
        ),
        Competicao(
            nome="Desafio Sul de Jiu-Jitsu",
            data=datetime(2024, 9, 12, 10, 0),
            local="Porto Alegre/RS",
            horario="10:00 - 18:00",
            status=False,
            imagem_url="/images/events/desafio_sul.webp"
        ),
        Competicao(
            nome="Festival Jiu-Jitsu Brasil",
            data=datetime(2024, 10, 18, 9, 0),
            local="Curitiba/PR",
            horario="09:00 - 17:00",
            status=False,
            imagem_url="/images/events/festival_brasil.webp"
        ),
    ]

    db.session.bulk_save_objects(eventos_inativos)
    db.session.commit()
    print("Eventos inativos criados com sucesso!")

# Executar o script dentro do contexto da aplicação Flask
if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        criar_eventos_inativos()
