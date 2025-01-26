import msal

# Configurações de autenticação
authority_url = 'https://login.microsoftonline.com/4aff2c7c-a558-4d03-be1d-1d1ddc65ad19'
client_id = '116b79d0-faa0-4d6d-a9b9-88a7c1f34c82'
client_secret = 'aEb8Q~z142ZhT8LkBLyHclccKhdTAo5l41pdCawz'
scope = ['https://analysis.windows.net/powerbi/api/.default']


def renew_token():
    # Cria uma aplicação confidencial
    app = msal.ConfidentialClientApplication(client_id, authority=authority_url, client_credential=client_secret)

    # Tenta obter um novo token
    result = app.acquire_token_for_client(scopes=scope)

    if 'access_token' in result:
        print("Access Token renovado com sucesso!")
        return result['access_token']
    else:
        print('Erro ao renovar o token:', result.get("error"), result.get("error_description"))
        return None


def save_token_to_file(AccessToken):
    # Salva o token em um arquivo .txt
    with open("AccessToken.txt", "w") as file:
        file.write(AccessToken)
    print("Access Token salvo em AccessToken.txt")


# Chama a função para renovar o token
new_access_token = renew_token()

# Se o token foi renovado com sucesso, salva no arquivo
if new_access_token:
    save_token_to_file(new_access_token)