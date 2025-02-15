# routes/patrocinadores.py
from flask import Blueprint, jsonify
from backend.app.models.models import Patrocinador

patrocinadores = Blueprint('patrocinadores', __name__)


@patrocinadores.route('/api/patrocinadores', methods=['GET'])
def listar_patrocinadores():
    try:
        # Busca apenas patrocinadores ativos
        patrocinadores = Patrocinador.query.filter_by(ativo=True).all()

        return jsonify({
            'success': True,
            'data': [p.to_dict() for p in patrocinadores]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar patrocinadores: {str(e)}'
        }), 500