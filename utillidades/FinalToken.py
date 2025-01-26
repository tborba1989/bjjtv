import requests
import json

# Função para ler o AccessToken
def read_access_token(file_path='AccessToken.txt'):
    try:
        with open(file_path, 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        print("Arquivo AccessToken.txt não encontrado.")
        return None


# Função para gerar o token do Power BI
def generate_powerbi_token(access_token):
    url = "https://api.powerbi.com/v1.0/myorg/groups/16ae19ef-533d-4271-abcd-78da707ad5d7/reports/ab874a51-c101-4a2b-9f25-e0ef0b4e44fc/GenerateToken"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    body = {
        "accessLevel": "View"
    }
    response = requests.post(url, headers=headers, data=json.dumps(body))

    if response.status_code == 200:
        token = response.json().get("token")
        return token
    else:
        print("Erro ao gerar o token:", response.status_code, response.text)
        return None


# Função para salvar o token em um arquivo
def save_token(token, file_path='token.txt'):
    try:
        with open(file_path, 'w') as file:
            file.write(token)
        print(f"Token salvo em {file_path}")
    except Exception as e:
        print("Erro ao salvar o token:", e)


# Fluxo principal de execução
access_token = read_access_token()
if access_token:
    token = generate_powerbi_token(access_token)
    if token:
        save_token(token)
    else:
        print("Falha ao gerar o token do Power BI.")
else:
    print("Falha ao ler o AccessToken.")
