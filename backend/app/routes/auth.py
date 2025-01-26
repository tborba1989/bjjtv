from flask import Blueprint, request, jsonify, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from app.models.models import Usuario, db
from app.utils import gerar_token, verificar_token
from flask_cors import CORS

# Blueprint para autenticação
auth = Blueprint('auth', __name__)

# Inicializa o serializer para tokens de recuperação de senha
serializer = URLSafeTimedSerializer('chave_super_secreta_rnbjjtv')

# Decorador para verificar o token JWT
def token_obrigatorio(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'error': 'Token não fornecido'}), 401

        usuario_id = verificar_token(token)
        if not usuario_id:
            return jsonify({'error': 'Token inválido ou expirado'}), 401

        return f(usuario_id, *args, **kwargs)

    return decorated

# Rota de registro de usuário
@auth.route('/api/registrar', methods=['POST'])
def registrar():
    data = request.get_json()
    nome = data.get('nome')
    usuario = data.get('usuario')  # Novo campo usuário
    email = data.get('email')
    senha = data.get('senha')

    if not nome or not usuario or not email or not senha:  # Adicionado usuário na verificação
        return jsonify({'error': 'Todos os campos são obrigatórios'}), 400

    # Verifica se o nome de usuário já existe
    if Usuario.query.filter_by(usuario=usuario).first():
        return jsonify({'error': 'Nome de usuário já cadastrado'}), 409

    if Usuario.query.filter_by(email=email).first():
        return jsonify({'error': 'E-mail já cadastrado'}), 409

    senha_hash = generate_password_hash(senha)
    novo_usuario = Usuario(nome=nome, usuario=usuario, email=email, senha=senha_hash)  # Adicionado campo usuário

    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({'message': 'Usuário registrado com sucesso!'}), 201

# Rota de login de usuário
@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = data.get('usuario')  # Alterado de email para usuario
    senha = data.get('senha')

    usuario_encontrado = Usuario.query.filter_by(usuario=usuario).first()  # Busca por nome de usuário

    if usuario_encontrado and check_password_hash(usuario_encontrado.senha, senha):
        token = gerar_token(usuario_encontrado.id)
        return jsonify({
            'token': token,
            'usuario': {
                'id': usuario_encontrado.id,
                'nome': usuario_encontrado.nome,
                'usuario': usuario_encontrado.usuario,
                'email': usuario_encontrado.email
            }
        }), 200
    else:
        return jsonify({'error': 'Credenciais inválidas'}), 401

# Rota protegida de exemplo
@auth.route('/api/protegido', methods=['GET'])
@token_obrigatorio
def rota_protegida(usuario_id):
    return jsonify({'message': f'Acesso autorizado para o usuário {usuario_id}'}), 200

# Rota protegida para listar usuários
@auth.route('/api/usuarios', methods=['GET'])
@token_obrigatorio
def listar_usuarios(usuario_id):
    usuarios = Usuario.query.all()
    lista_usuarios = [
        {"id": usuario.id, "nome": usuario.nome, "usuario": usuario.usuario, "email": usuario.email}
        for usuario in usuarios
    ]
    return jsonify(lista_usuarios), 200

# Rota protegida para atualizar dados de um usuário
@auth.route('/api/usuarios/<int:id>', methods=['PUT'])
@token_obrigatorio
def atualizar_usuario(usuario_id, id):
    usuario = Usuario.query.get(id)

    if not usuario:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    data = request.get_json()
    nome = data.get('nome')
    novo_usuario = data.get('usuario')  # Novo campo usuário
    email = data.get('email')
    senha = data.get('senha')

    if nome:
        usuario.nome = nome
    if novo_usuario:
        if Usuario.query.filter_by(usuario=novo_usuario).first():
            return jsonify({'error': 'Nome de usuário já cadastrado'}), 409
        usuario.usuario = novo_usuario
    if email:
        if Usuario.query.filter_by(email=email).first():
            return jsonify({'error': 'E-mail já cadastrado'}), 409
        usuario.email = email
    if senha:
        usuario.senha = generate_password_hash(senha)

    db.session.commit()

    return jsonify({'message': 'Usuário atualizado com sucesso!'}), 200

# Rota protegida para deletar um usuário
@auth.route('/api/usuarios/<int:id>', methods=['DELETE'])
@token_obrigatorio
def deletar_usuario(usuario_id, id):
    usuario = Usuario.query.get(id)

    if not usuario:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    db.session.delete(usuario)
    db.session.commit()

    return jsonify({'message': 'Usuário deletado com sucesso!'}), 200

# Rota para solicitar recuperação de senha
@auth.route('/api/recuperar-senha', methods=['POST'])
def recuperar_senha():
    data = request.get_json()
    identificador = data.get('identificador')  # Pode ser email ou nome de usuário

    # Tenta encontrar o usuário por nome de usuário ou email
    usuario = Usuario.query.filter(
        (Usuario.usuario == identificador) | (Usuario.email == identificador)
    ).first()

    if not usuario:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    token = serializer.dumps(usuario.email, salt='recuperar-senha')
    link = url_for('auth.resetar_senha', token=token, _external=True)
    return jsonify({'message': 'Link de redefinição de senha', 'link': link}), 200

# Rota para redefinir senha
@auth.route('/api/resetar-senha/<token>', methods=['POST'])
def resetar_senha(token):
    try:
        email = serializer.loads(token, salt='recuperar-senha', max_age=3600)
    except (SignatureExpired, BadSignature):
        return jsonify({'error': 'Token inválido ou expirado'}), 400

    data = request.get_json()
    nova_senha = data.get('senha')

    usuario = Usuario.query.filter_by(email=email).first()
    usuario.senha = generate_password_hash(nova_senha)
    db.session.commit()

    return jsonify({'message': 'Senha redefinida com sucesso!'}), 200