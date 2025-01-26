import bcrypt

def verify_password(stored_hash, provided_password):
    """
    Verifica se a senha fornecida corresponde ao hash armazenado.

    :param stored_hash: Hash da senha armazenado no banco de dados.
    :param provided_password: Senha fornecida pelo usuário.
    :return: True se a senha corresponder, False caso contrário.
    """
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_hash.encode('utf-8'))

# Exemplo de uso
if __name__ == "__main__":
    # Hash armazenado (de exemplo)
    stored_hash = "$2b$12$mV4YN6ZYW8lw6T.Wd7F1ROvfclSh7Ha5bx1MhVhvqmcUokQH5/nl."  # Hash para "admin"

    # Senha fornecida pelo usuário
    provided_password = "admin"

    if verify_password(stored_hash, provided_password):
        print("Senha correta!")
    else:
        print("Senha incorreta.")
