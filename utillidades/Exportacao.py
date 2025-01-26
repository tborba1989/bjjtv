from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import io
from datetime import datetime

app = Flask(__name__)

# 🔧 Configuração do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://mdb_ur8h_user:pNHZGAjzcADnsd32vRlg69XmE0VwURqX@dpg-cttfnj8gph6c738ioqg0-a.oregon-postgres.render.com/mdb_ur8h"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 👤 Modelo de Usuário
class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def to_dict(self):
        return {
            'ID': self.id,
            'Usuário': self.username,
            'Email': self.email
        }

# 📤 Rota de Exportação de Usuários
@app.route('/test_export', methods=['GET'])
def test_export():
    try:
        # 🔎 Filtra os IDs recebidos (se existirem)
        selected_ids = request.args.get('ids')
        if selected_ids:
            id_list = [int(id) for id in selected_ids.split(',')]
            usuarios = Users.query.filter(Users.id.in_(id_list)).all()
        else:
            usuarios = Users.query.all()

        if not usuarios:
            return jsonify({"success": False, "message": "Nenhum usuário encontrado."}), 404

        # 📄 Cria o DataFrame com os dados
        df = pd.DataFrame([u.to_dict() for u in usuarios])

        # 📥 Gera o arquivo Excel em memória
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Usuários')
        output.seek(0)

        # 📄 Nome do arquivo
        filename = f'usuarios_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'

        # 📥 Envia o arquivo para download
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )

    except Exception as e:
        print(f"❌ Erro no processo de exportação: {str(e)}")
        return jsonify({"success": False, "message": f"Erro ao exportar: {str(e)}"}), 500

# 🚀 Inicializa o servidor
if __name__ == '__main__':
    app.run(debug=True, port=5000)
