from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models.models import db, Atleta
from flask_cors import CORS, cross_origin

atletas = Blueprint('atletas', __name__)


def formatar_sexo(sexo):
    """Função auxiliar para formatar o sexo"""
    if sexo:
        sexo = sexo.strip().lower()
        if sexo in ['m', 'masculino']:
            return 'Masculino'
        elif sexo in ['f', 'feminino']:
            return 'Feminino'
    return None

@atletas.route('/api/atletas', methods=['POST'])
def criar_atleta():
    data = request.get_json()

    # Validação dos campos obrigatórios
    campos_obrigatorios = ['nome_competidor', 'cpf', 'peso', 'faixa', 'data_nascimento', 'sexo']  # Adicionei sexo como obrigatório
    for campo in campos_obrigatorios:
        if campo not in data or not data[campo]:
            return jsonify({'error': f'O campo {campo} é obrigatório'}), 400

    # Valida o formato do sexo
    sexo_formatado = formatar_sexo(data.get('sexo'))
    if not sexo_formatado:
        return jsonify({'error': 'Sexo deve ser Masculino ou Feminino'}), 400

    # Verifica se já existe atleta com o mesmo CPF
    if Atleta.query.filter_by(cpf=data['cpf']).first():
        return jsonify({'error': 'CPF já cadastrado'}), 409

    try:
        # Conversão da data de nascimento
        data_nascimento = None
        if 'data_nascimento' in data and data['data_nascimento']:
            data_nascimento = datetime.strptime(data['data_nascimento'], '%d/%m/%Y').date()

        # Conversão do peso
        peso = None
        if 'peso' in data and data['peso']:
            peso = float(data['peso'])

        novo_atleta = Atleta(
            nome_competidor=data['nome_competidor'],
            apelido=data['apelido'],
            cpf=data['cpf'],
            faixa=data['faixa'],
            peso=peso,
            celular=data.get('celular'),
            equipe=data.get('equipe'),
            professor=data.get('professor'),
            sexo=sexo_formatado,  # Usando o sexo formatado
            data_nascimento=data_nascimento
        )

        db.session.add(novo_atleta)
        db.session.commit()

        return jsonify({
            'message': 'Atleta cadastrado com sucesso!',
            'atleta': novo_atleta.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@atletas.route('/api/atletas/<string:cpf>', methods=['PUT'])
def atualizar_atleta(cpf):
    atleta = Atleta.query.filter_by(cpf=cpf).first_or_404()
    data = request.get_json()

    try:
        if 'nome_competidor' in data:
            atleta.nome_competidor = data['nome_competidor']
        if 'cpf' in data:
            # Verifica se o novo cpf já existe para outro atleta
            existente = Atleta.query.filter_by(cpf=data['cpf']).first()
            if existente and existente.cpf != cpf:
                return jsonify({'error': 'CPF já cadastrado'}), 409
            atleta.cpf = data['cpf']
        if 'apelido' in data:
            atleta.apelido = data['apelido']
        if 'faixa' in data:
            atleta.faixa = data['faixa']
        if 'peso' in data:
            atleta.peso = float(data['peso']) if data['peso'] else None
        if 'celular' in data:
            atleta.celular = data['celular']
        if 'equipe' in data:
            atleta.equipe = data['equipe']
        if 'professor' in data:
            atleta.professor = data['professor']
        if 'sexo' in data:
            sexo_formatado = formatar_sexo(data['sexo'])
            if not sexo_formatado:
                return jsonify({'error': 'Sexo deve ser Masculino ou Feminino'}), 400
            atleta.sexo = sexo_formatado
        if 'data_nascimento' in data and data['data_nascimento']:
            atleta.data_nascimento = datetime.strptime(data['data_nascimento'], '%d/%m/%Y').date()

        db.session.commit()
        return jsonify({
            'message': 'Atleta atualizado com sucesso!',
            'atleta': atleta.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@atletas.route('/api/atletas', methods=['GET'])
def listar_atletas():
    try:
        atletas = Atleta.query.all()
        return jsonify([atleta.to_dict() for atleta in atletas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@atletas.route('/api/atletas/<int:id>', methods=['GET'])
def obter_atleta(id):
    atleta = Atleta.query.get_or_404(id)
    return jsonify(atleta.to_dict()), 200


@atletas.route('/api/atletas/<int:id>', methods=['DELETE'])
def deletar_atleta(id):
    atleta = Atleta.query.get_or_404(id)

    try:
        db.session.delete(atleta)
        db.session.commit()
        return jsonify({'message': 'Atleta deletado com sucesso!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@atletas.route('/api/atletas/buscar', methods=['GET'])
def buscar_atletas():
    termo = request.args.get('termo', '')

    if not termo:
        return jsonify({'error': 'Termo de busca não fornecido'}), 400

    try:
        atletas = Atleta.query.filter(
            db.or_(
                Atleta.nome_competidor.ilike(f'%{termo}%'),
                Atleta.apelido.ilike(f'%{termo}%'),
                Atleta.equipe.ilike(f'%{termo}%')
            )
        ).all()

        return jsonify([atleta.to_dict() for atleta in atletas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@atletas.route('/api/atletas/buscar/<string:cpf>', methods=['GET', 'OPTIONS'])
def buscar_atleta_por_cpf(cpf):
    # Removendo o @cross_origin daqui pois já temos CORS global
    try:
        # Remove caracteres não numéricos do CPF
        cpf_limpo = ''.join(filter(str.isdigit, cpf))
        print(f"Buscando atleta com CPF: {cpf_limpo}")

        # Busca o atleta pelo CPF
        atleta = Atleta.query.filter_by(cpf=cpf_limpo).first()

        if not atleta:
            return jsonify({
                'success': False,
                'message': 'Atleta não encontrado'
            }), 404

        return jsonify({
            'success': True,
            'data': {
                'id': atleta.id,
                'nome': atleta.nome_competidor,
                'cpf': atleta.cpf,
                'apelido': atleta.apelido,
                'faixa': atleta.faixa,
                'peso': atleta.peso,
                'celular': atleta.celular,
                'equipe': atleta.equipe,
                'professor': atleta.professor,
                'sexo': atleta.sexo,
                'data_nascimento': atleta.data_nascimento.strftime('%Y-%m-%d') if atleta.data_nascimento else None
            }
        }), 200

    except Exception as e:
        print(f"Erro ao buscar atleta: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500