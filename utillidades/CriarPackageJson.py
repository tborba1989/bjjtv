# Script para criar apenas o package.json no frontend
import os
import json

def criar_package_json():
    os.makedirs('../frontend/frontend', exist_ok=True)
    package_json_conteudo = {
        "name": "frontend",
        "version": "1.0.0",
        "private": True,
        "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.3.0"
        },
        "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject"
        }
    }

    with open('../frontend/package.json', 'w', encoding='utf-8') as arquivo:
        json.dump(package_json_conteudo, arquivo, indent=2)
        print('Arquivo frontend/package.json criado com sucesso.')

if __name__ == '__main__':
    criar_package_json()
