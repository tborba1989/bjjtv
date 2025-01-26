from app import create_app

app = create_app()
print(app.url_map)  # Isso vai mostrar todas as rotas registradas