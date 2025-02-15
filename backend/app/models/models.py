# app/models/models.py
from datetime import datetime
from backend.app import db

class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    usuario = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Usuario {self.usuario}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'usuario': self.usuario,
            'email': self.email,
            'data_criacao': self.data_criacao.isoformat()
        }

class Competicao(db.Model):
    __tablename__ = 'competicoes'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    data = db.Column(db.Date, nullable=False)
    mes = db.Column(db.String(3))  # Abreviação do mês
    local = db.Column(db.String(200))
    horario = db.Column(db.String(50))
    imagem_url = db.Column(db.String(200))
    status = db.Column(db.String(20), default='active')  # active, completed, cancelled
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

    inscricoes = db.relationship('Inscricao', backref='competicao', lazy=True)
    lutas = db.relationship('Lutas', backref='competicao', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'data': self.data.strftime('%Y-%m-%d'),
            'mes': self.mes,
            'local': self.local,
            'horario': self.horario,
            'imagem_url': self.imagem_url,
            'status': self.status
        }

class Atleta(db.Model):
    __tablename__ = 'atletas'

    id = db.Column(db.Integer, primary_key=True)
    nome_competidor = db.Column(db.String(255), nullable=False)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    apelido = db.Column(db.String(255), unique=True, nullable=False)
    faixa = db.Column(db.String(50), nullable=False)
    peso = db.Column(db.Numeric(5, 2))
    celular = db.Column(db.String(20))
    equipe = db.Column(db.String(255))
    professor = db.Column(db.String(255))
    sexo = db.Column(db.String(20))
    data_nascimento = db.Column(db.Date)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    inscricoes = db.relationship('Inscricao', backref='atleta', lazy=True)
    lutas_atleta1 = db.relationship('Lutas', backref='atleta1', foreign_keys='Lutas.atleta1_id', lazy=True)
    lutas_atleta2 = db.relationship('Lutas', backref='atleta2', foreign_keys='Lutas.atleta2_id', lazy=True)
    lutas_vencedor = db.relationship('Lutas', backref='vencedor_luta', foreign_keys='Lutas.vencedor', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'nome_competidor': self.nome_competidor,
            'cpf': self.cpf,
            'apelido': self.apelido,
            'faixa': self.faixa,
            'peso': float(self.peso) if self.peso else None,
            'celular': self.celular,
            'equipe': self.equipe,
            'professor': self.professor,
            'sexo': self.sexo,
            'data_nascimento': self.data_nascimento.strftime('%d/%m/%Y') if self.data_nascimento else None,
            'criado_em': self.criado_em.strftime('%d/%m/%Y %H:%M'),
            'atualizado_em': self.atualizado_em.strftime('%d/%m/%Y %H:%M')
        }

class Lutas(db.Model):
    __tablename__ = 'lutas'

    id = db.Column(db.Integer, primary_key=True)
    competicao_id = db.Column(db.Integer, db.ForeignKey('competicoes.id'), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    atleta1_id = db.Column(db.Integer, db.ForeignKey('atletas.id'), nullable=False)
    nome_competidor1 = db.Column(db.String(255), nullable=False)
    atleta2_id = db.Column(db.Integer, db.ForeignKey('atletas.id'), nullable=False)
    nome_competidor2 = db.Column(db.String(255), nullable=False)
    vencedor = db.Column(db.Integer, db.ForeignKey('atletas.id'))
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'competicao_id': self.competicao_id,
            'categoria_id': self.categoria_id,
            'atleta1_id': self.atleta1_id,
            'nome_competidor1': self.nome_competidor1,
            'atleta2_id': self.atleta2_id,
            'nome_competidor2': self.nome_competidor2,
            'vencedor': self.vencedor,
            'criado_em': self.criado_em.strftime('%d/%m/%Y %H:%M'),
            'atualizado_em': self.atualizado_em.strftime('%d/%m/%Y %H:%M')
        }

class Patrocinador(db.Model):
    __tablename__ = 'patrocinadores'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    url_logo = db.Column(db.String(255))
    url_site = db.Column(db.String(255))
    descricao = db.Column(db.Text)
    tipo_anuncio = db.Column(db.String(100), nullable=False)  # Ex.: "Banner", "Vídeo", "Pop-up"
    valor_anuncio = db.Column(db.Float, nullable=False)  # Valor do anúncio em R$
    contato_comercial = db.Column(db.String(255), nullable=True)  # Contato do responsável
    telefone = db.Column(db.String(20), nullable=True)  # Telefone do responsável
    email = db.Column(db.String(255), nullable=True)  # Email do responsável
    ativo = db.Column(db.Boolean, default=True)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

    # Redes sociais
    facebook = db.Column(db.String(255), nullable=True)
    instagram = db.Column(db.String(255), nullable=True)
    twitter = db.Column(db.String(255), nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    youtube = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        """Converte o modelo em um dicionário."""
        return {
            "id": self.id,
            "nome": self.nome,
            "url_logo": self.url_logo,
            "url_site": self.url_site,
            "descricao": self.descricao,
            "tipo_anuncio": self.tipo_anuncio,
            "valor_anuncio": self.valor_anuncio,
            "contato_comercial": self.contato_comercial,
            "telefone": self.telefone,
            "email": self.email,
            "ativo": self.ativo,
            "criado_em": self.criado_em.strftime('%Y-%m-%d %H:%M:%S'),
            "facebook": self.facebook,
            "instagram": self.instagram,
            "twitter": self.twitter,
            "linkedin": self.linkedin,
            "youtube": self.youtube
        }

    def __repr__(self):
        return f"<Patrocinador {self.nome}>"

class Categoria(db.Model):
    __tablename__ = 'categorias'

    id = db.Column(db.Integer, primary_key=True)
    categoria = db.Column(db.String(256), nullable=False)
    faixa = db.Column(db.String(50))
    sexo = db.Column(db.String(20))
    divisao = db.Column(db.String(50), nullable=False)
    divisao_en = db.Column(db.String(50), nullable=False)
    kimono = db.Column(db.String(20), nullable=False)
    peso_min = db.Column(db.Float, nullable=True)
    peso_max = db.Column(db.Float, nullable=True)
    classif = db.Column(db.String(50), nullable=False)
    classif2 = db.Column(db.String(50), nullable=False)
    idade_min = db.Column(db.Integer, nullable=False)
    idade_max = db.Column(db.Integer, nullable=False)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamento com Inscricao
    inscricoes = db.relationship('Inscricao', backref='categoria')

    def to_dict(self):
        return {
            'id': self.id,
            'categoria': self.categoria,
            'faixa': self.faixa,
            'sexo': self.sexo,
            'divisao': self.divisao,
            'divisao_en': self.divisao_en,
            'kimono': self.kimono,
            'peso_min': float(self.peso_min) if self.peso_min else None,
            'peso_max': float(self.peso_max) if self.peso_max else None,
            'classificacao': self.classif,
            'idade_min': self.idade_min,
            'idade_max': self.idade_max
        }

class Inscricao(db.Model):
    __tablename__ = 'inscricoes'

    id = db.Column(db.Integer, primary_key=True)
    atleta_cpf = db.Column(db.String(11), db.ForeignKey('atletas.cpf'), nullable=False)
    competicao_id = db.Column(db.Integer, db.ForeignKey('competicoes.id'), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
    numero_inscricao = db.Column(db.Integer, nullable=False)
    status_pagamento = db.Column(db.String(20), default='PENDENTE')
    data_inscricao = db.Column(db.DateTime, default=datetime.utcnow)
    data_pagamento = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Inscricao {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'atleta_cpf': self.atleta_cpf,
            'competicao_id': self.competicao_id,
            'categoria_id': self.categoria_id,
            'numero_inscricao': self.numero_inscricao,
            'status_pagamento': self.status_pagamento,
            'data_inscricao': self.data_inscricao.isoformat() if self.data_inscricao else None,
            'data_pagamento': self.data_pagamento.isoformat() if self.data_pagamento else None
        }
