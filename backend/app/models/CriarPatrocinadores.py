from app import db
from app.models.models import Patrocinador
from datetime import datetime

# Função para adicionar patrocinadores fictícios
def adicionar_patrocinadores():
    patrocinadores_ficticios = [
        Patrocinador(
            nome="TechCorp",
            url_logo="https://example.com/logos/techcorp.png",
            url_site="https://techcorp.com",
            descricao="Empresa de tecnologia inovadora.",
            tipo_anuncio="Banner",
            valor_anuncio=5000.00,
            contato_comercial="João Silva",
            telefone="(11) 99999-1234",
            email="joao.silva@techcorp.com",
            facebook="https://facebook.com/techcorp",
            instagram="https://instagram.com/techcorp",
            twitter="https://twitter.com/techcorp",
            linkedin="https://linkedin.com/company/techcorp",
            youtube="https://youtube.com/techcorp"
        ),
        Patrocinador(
            nome="Fitness Pro",
            url_logo="https://example.com/logos/fitnesspro.png",
            url_site="https://fitnesspro.com",
            descricao="Academia e equipamentos fitness.",
            tipo_anuncio="Pop-up",
            valor_anuncio=3000.00,
            contato_comercial="Maria Oliveira",
            telefone="(21) 88888-5678",
            email="maria.oliveira@fitnesspro.com",
            facebook="https://facebook.com/fitnesspro",
            instagram="https://instagram.com/fitnesspro",
            twitter="https://twitter.com/fitnesspro",
            linkedin="https://linkedin.com/company/fitnesspro",
            youtube="https://youtube.com/fitnesspro"
        ),
        Patrocinador(
            nome="HealthLife",
            url_logo="https://example.com/logos/healthlife.png",
            url_site="https://healthlife.com",
            descricao="Planos de saúde para esportistas.",
            tipo_anuncio="Vídeo",
            valor_anuncio=7000.00,
            contato_comercial="Carlos Souza",
            telefone="(31) 77777-9012",
            email="carlos.souza@healthlife.com",
            facebook="https://facebook.com/healthlife",
            instagram="https://instagram.com/healthlife",
            twitter="https://twitter.com/healthlife",
            linkedin="https://linkedin.com/company/healthlife",
            youtube="https://youtube.com/healthlife"
        ),
        Patrocinador(
            nome="SuperFoods",
            url_logo="https://example.com/logos/superfoods.png",
            url_site="https://superfoods.com",
            descricao="Produtos naturais e suplementos.",
            tipo_anuncio="Banner",
            valor_anuncio=4000.00,
            contato_comercial="Ana Costa",
            telefone="(41) 66666-3456",
            email="ana.costa@superfoods.com",
            facebook="https://facebook.com/superfoods",
            instagram="https://instagram.com/superfoods",
            twitter="https://twitter.com/superfoods",
            linkedin="https://linkedin.com/company/superfoods",
            youtube="https://youtube.com/superfoods"
        ),
        Patrocinador(
            nome="SportsWear",
            url_logo="https://example.com/logos/sportswear.png",
            url_site="https://sportswear.com",
            descricao="Roupas e acessórios esportivos.",
            tipo_anuncio="Banner",
            valor_anuncio=6000.00,
            contato_comercial="Pedro Lima",
            telefone="(51) 55555-7890",
            email="pedro.lima@sportswear.com",
            facebook="https://facebook.com/sportswear",
            instagram="https://instagram.com/sportswear",
            twitter="https://twitter.com/sportswear",
            linkedin="https://linkedin.com/company/sportswear",
            youtube="https://youtube.com/sportswear"
        ),
    ]

    db.session.add_all(patrocinadores_ficticios)
    db.session.commit()
    print("Patrocinadores fictícios adicionados com sucesso!")

# Execute a função no shell
if __name__ == "__main__":
    from app import create_app

    app = create_app()
    with app.app_context():
        adicionar_patrocinadores()