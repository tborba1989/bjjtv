import requests

url = "http://localhost:5000/api/users/new"

novo_usuario = {
    "username": "novo_usuario",
    "password": "senhaSegura123",
    "email": "novo_usuario@example.com",
    "role": "admin"
}

try:
    response = requests.post(url, json=novo_usuario)

    if response.status_code == 201:
        print("✅ Usuário criado com sucesso!")
        print(response.json())
    elif response.status_code == 409:
        print("⚠️ Usuário já existe.")
    else:
        print(f"❌ Erro ao criar usuário: {response.status_code}")
        print(response.text)
except requests.exceptions.RequestException as e:
    print("❌ Erro de conexão:", e)
