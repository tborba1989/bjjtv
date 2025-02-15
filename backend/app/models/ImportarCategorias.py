# app/models/ImportarCategorias.py

import pandas as pd
import os
from backend.app import create_app
from backend.app import db
from backend.app.models.models import Categoria
from datetime import datetime


def importar_categorias(file_path=None):
    """
    Importa categorias do arquivo Excel usando a configuração existente do Flask
    """
    app = create_app()

    try:
        with app.app_context():
            if not file_path:
                raise ValueError("Nenhum arquivo selecionado")

            print(f"Lendo arquivo: {file_path}")

            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Arquivo não encontrado em: {file_path}")

            # Lê a planilha
            df = pd.read_excel(file_path, sheet_name='1')
            total_registros = len(df)
            print(f"Lendo {total_registros} categorias do arquivo Excel...")

            # Limpa tabela existente
            print("Limpando tabela existente...")
            Categoria.query.delete()
            db.session.commit()

            # Contador para feedback
            categorias_criadas = 0

            # Itera sobre as linhas e cria as categorias
            for _, row in df.iterrows():

                categoria = Categoria(
                    categoria=row['categoria'],
                    faixa=row['faixa'],
                    sexo=row['sexo'],
                    divisao=row['divisao'].upper(),
                    divisao_en=row['divisao_en'].upper(),
                    kimono=row['kimono'],
                    peso_min=row['peso_min'] if pd.notna(row['peso_min']) else None,
                    peso_max=row['peso_max'] if pd.notna(row['peso_max']) else None,
                    classif=row['classificacao'],
                    classif2=row['classificacao#'],
                    idade_min=int(row['idade_min']),
                    idade_max=int(row['idade_max']),
                )

                db.session.add(categoria)
                categorias_criadas += 1

                # Commit a cada 100 registros
                if categorias_criadas % 100 == 0:
                    db.session.commit()
                    print(f"Importadas {categorias_criadas} categorias...")

            # Commit final
            db.session.commit()
            return True, f"Importação concluída! {categorias_criadas} categorias importadas com sucesso."

    except Exception as e:
        error_msg = f"Erro durante a importação: {str(e)}"
        print(error_msg)
        with app.app_context():
            db.session.rollback()
        return False, error_msg


if __name__ == "__main__":
    print("=== Importador de Categorias ===")
    print("\nDigite o caminho completo do arquivo Excel ou arraste o arquivo para esta janela:")
    file_path = input().strip('"')  # Remove aspas se o usuário arrastar o arquivo

    if file_path:
        success, message = importar_categorias(file_path)
        print("\n" + message)
        input("\nPressione Enter para sair...")
    else:
        print("Nenhum arquivo selecionado.")
        input("\nPressione Enter para sair...")