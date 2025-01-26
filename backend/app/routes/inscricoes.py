from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from app import db
from app.models.models import Atleta, Competicao, Inscricao, Categoria
from app.services.services import get_categorias_disponiveis
from PIL import Image
from werkzeug.utils import secure_filename
import io
import random
import os

# Criar Blueprint para as rotas
competicoes = Blueprint('competicoes', __name__)
inscricoes = Blueprint('inscricoes', __name__)
categorias = Blueprint('categorias', __name__)

# Configurações para o upload de imagens
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                            'frontend', 'public', 'images', 'events')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_competition_image(competition_id, image_file):
    """
    Salva a imagem da competição no formato webp
    """
    try:
        # Cria o diretório se não existir
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        # Abre e converte a imagem para webp
        img = Image.open(image_file)

        # Define o caminho do arquivo
        filename = f"{competition_id}.webp"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Salva a imagem como webp
        img.save(filepath, 'WEBP', quality=85, optimize=True)

        return True
    except Exception as e:
        current_app.logger.error(f"Erro ao salvar imagem: {str(e)}")
        return False

# Rotas para Competições
@competicoes.route('/api/competicoes', methods=['GET'])
def listar_competicoes():
    try:
        # Buscar apenas competições ativas e futuras
        competicoes = Competicao.query.filter(
            Competicao.status == 'Ativa',
            Competicao.data >= datetime.now().date()
        ).order_by(Competicao.data).all()

        return jsonify([c.to_dict() for c in competicoes])
    except Exception as e:
        current_app.logger.error(f"Erro ao listar competições: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Rotas para Competições
@competicoes.route('/api/competicoes/inativas', methods=['GET'])
def listar_in_competicoes():
    try:
        # Buscar apenas competições inativas
        competicoes = Competicao.query.filter(
            Competicao.status == 'Inativa'  # Usando booleano False
        ).order_by(Competicao.data).all()

        return jsonify([c.to_dict() for c in competicoes])
    except Exception as e:
        current_app.logger.error(f"Erro ao listar competições: {str(e)}")
        return jsonify({'error': str(e)}), 500


@competicoes.route('/api/competicoes/<int:id>', methods=['GET'])
def obter_competicao(id):
    try:
        competicao = Competicao.query.get_or_404(id)
        return jsonify(competicao.to_dict())
    except Exception as e:
        current_app.logger.error(f"Erro ao obter competição {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@competicoes.route('/api/competicoes', methods=['POST'])
def criar_competicao():
    try:
        # Verifica se há arquivo de imagem no request
        if 'imagem' not in request.files:
            return jsonify({'error': 'Nenhuma imagem enviada'}), 400

        imagem = request.files['imagem']
        if imagem.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400

        if not allowed_file(imagem.filename):
            return jsonify({'error': 'Tipo de arquivo não permitido'}), 400

        # Dados da competição devem vir como form-data
        data = request.form

        # Validar dados obrigatórios
        required_fields = ['nome', 'data', 'local']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400

        # Converter data string para objeto date
        try:
            date = datetime.strptime(data['data'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400

        # Criar nova competição
        nova_competicao = Competicao(
            nome=data['nome'],
            data=date,
            mes=date.strftime('%b'),  # Abreviação do mês
            local=data['local'],
            horario=data.get('horario'),
            status='Ativa'
        )

        # Salva primeiro para obter o ID
        db.session.add(nova_competicao)
        db.session.commit()

        # Salva a imagem usando o ID da competição
        if save_competition_image(nova_competicao.id, imagem):
            # Atualiza o caminho da imagem no banco
            nova_competicao.imagem_url = f"/images/events/{nova_competicao.id}.webp"
            db.session.commit()
        else:
            # Se falhar o upload da imagem, ainda mantém a competição, mas sem imagem
            current_app.logger.warning(f"Falha ao salvar imagem da competição {nova_competicao.id}")

        return jsonify({
            'message': 'Competição criada com sucesso',
            'id': nova_competicao.id
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Erro ao criar competição: {str(e)}")
        return jsonify({'error': str(e)}), 500


@inscricoes.route('/api/inscricoes/numero', methods=['GET'])
def get_inscricoes():
    try:
        atleta_cpf = request.args.get('atleta_cpf')
        competicao_id = request.args.get('competicao_id')
        categoria_id = request.args.get('categoria_id')

        # Log para debug
        print("\nBuscando inscrição:")
        print(f"CPF: {atleta_cpf}")
        print(f"Competição: {competicao_id}")
        print(f"Categoria: {categoria_id}")

        if not all([atleta_cpf, competicao_id, categoria_id]):
            return jsonify({
                'error': 'Parâmetros obrigatórios ausentes'
            }), 400

        # Busca a inscrição
        inscricoes = db.session.query(Inscricao).filter_by(
            atleta_cpf=atleta_cpf,
            competicao_id=competicao_id,
            categoria_id=categoria_id
        ).all()

        # Prepara a resposta
        response = []
        for inscricao in inscricoes:
            response.append({
                'id': inscricao.id,
                'numero_inscricao': inscricao.numero_inscricao,
                'status_pagamento': inscricao.status_pagamento,
                'data_inscricao': inscricao.data_inscricao.strftime('%Y-%m-%d') if inscricao.data_inscricao else None
            })

        return jsonify({
            'inscricoes': response
        }), 200

    except Exception as e:
        print(f"Erro: {str(e)}")
        return jsonify({
            'error': 'Erro ao buscar inscrição'
        }), 500

@inscricoes.route('/api/inscricoes', methods=['POST'])
def criar_inscricao():
    try:
        data = request.json

        # Verificar se os campos obrigatórios existem
        if not data.get('atleta_cpf') or not data.get('competicao_id') or not data.get('categoria_id'):
            return jsonify({'error': 'Campos obrigatórios faltando'}), 400

        # Verificar se a inscrição já existe
        inscricao_existente = Inscricao.query.filter_by(
            atleta_cpf=data['atleta_cpf'],
            competicao_id=data['competicao_id'],
            categoria_id=data['categoria_id']
        ).first()
        if inscricao_existente:
            return jsonify({'error': 'Atleta já inscrito nesta competição e categoria'}), 400

        # Criar nova inscrição
        nova_inscricao = Inscricao(
            atleta_cpf=data['atleta_cpf'],
            competicao_id=data['competicao_id'],
            categoria_id=data['categoria_id'],
            numero_inscricao=data.get('numero_inscricao', random.randint(10000, 99999)),  # Gera número de inscrição único
            status_pagamento=data.get('status_pagamento', 'PENDENTE'),
            data_inscricao=datetime.utcnow(),
            data_pagamento=None
        )

        db.session.add(nova_inscricao)
        db.session.commit()

        return jsonify({
            'message': 'Inscrição criada com sucesso',
            'inscricao': nova_inscricao.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Erro ao criar inscrição: {str(e)}")
        return jsonify({'error': str(e)}), 500


@inscricoes.route('/api/inscricoes/verificar', methods=['POST'])
def verificar_inscricao():
    try:
        data = request.json

        # Verifica se os campos obrigatórios existem
        if not data.get('atleta_cpf') or not data.get('competicao_id') or not data.get('categoria_id'):
            return jsonify({'error': 'Campos obrigatórios faltando'}), 400

        # Busca a inscrição
        inscricao = Inscricao.query.filter_by(
            atleta_cpf=data['atleta_cpf'],
            competicao_id=data['competicao_id'],
            categoria_id=data['categoria_id']
        ).first()

        # Se encontrar a inscrição, retorna os dados dela
        if inscricao:
            categoria = Categoria.query.get(inscricao.categoria_id)
            return jsonify({
                'error': 'Atleta já inscrito nesta categoria',
                'inscricao': {
                    'id': inscricao.id,
                    'numero_inscricao': inscricao.numero_inscricao,
                    'categoria_id': categoria.id if categoria else 'Categoria não encontrada',
                    'status': inscricao.status_pagamento
                }
            }), 400

        # Se não encontrar, retorna sucesso
        return jsonify({'exists': False}), 200

    except Exception as e:
        current_app.logger.error(f"Erro ao verificar inscrição: {str(e)}")
        return jsonify({'error': str(e)}), 500


@categorias.route('/api/categorias/disponiveis/<cpf>', methods=['GET'])
def obter_categorias_disponiveis(cpf):
    atleta = Atleta.query.filter_by(cpf=cpf).first_or_404()
    categorias = get_categorias_disponiveis(atleta)
    return jsonify(categorias)