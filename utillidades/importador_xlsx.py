import pandas as pd
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
import os
from tkinter import Tk, filedialog, simpledialog, messagebox

def detectar_tipo_sqlalchemy(tipo_pandas):
    """Mapeia os tipos do pandas para tipos do SQLAlchemy."""
    if pd.api.types.is_integer_dtype(tipo_pandas):
        return 'Integer'
    elif pd.api.types.is_float_dtype(tipo_pandas):
        return 'Float'
    elif pd.api.types.is_bool_dtype(tipo_pandas):
        return 'Boolean'
    elif pd.api.types.is_datetime64_any_dtype(tipo_pandas):
        return 'DateTime'
    else:
        return 'String'

def gerar_modelo_sqlalchemy(nome_modelo, df):
    """Gera a classe do modelo SQLAlchemy com base no DataFrame."""
    modelo = f"from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime\n"
    modelo += f"from app import db\n\n\n"
    modelo += f"class {nome_modelo}(db.Model):\n"
    modelo += f"    __tablename__ = '{nome_modelo.lower()}'\n\n"
    modelo += f"    id = Column(Integer, primary_key=True, autoincrement=True)\n"

    for coluna in df.columns:
        tipo_sqlalchemy = detectar_tipo_sqlalchemy(df[coluna])
        modelo += f"    {coluna.lower()} = Column({tipo_sqlalchemy})\n"

    return modelo

def importar_e_gerar_modelo(caminho_arquivo, nome_modelo="TabelaGenerica"):
    """Importa dados de um Excel e gera o modelo SQLAlchemy."""
    try:
        df = pd.read_excel(caminho_arquivo)
        print(f"✅ Arquivo {caminho_arquivo} carregado com sucesso!")

        modelo_sqlalchemy = gerar_modelo_sqlalchemy(nome_modelo, df)

        with open("models.py", "w", encoding="utf-8") as file:
            file.write(modelo_sqlalchemy)

        print(f"📄 Modelo {nome_modelo} gerado com sucesso no arquivo 'models.py'!")
        messagebox.showinfo("Sucesso", f"Modelo {nome_modelo} gerado com sucesso!")

    except Exception as e:
        print(f"❌ Erro ao importar o arquivo: {e}")
        messagebox.showerror("Erro", f"Erro ao importar o arquivo: {e}")

def selecionar_arquivo():
    """Abre a janela para selecionar o arquivo Excel."""
    root = Tk()
    root.withdraw()  # Oculta a janela principal

    # Selecionar o arquivo .xlsx
    caminho_arquivo = filedialog.askopenfilename(
        title="Selecione o arquivo Excel",
        filetypes=[("Arquivos Excel", "*.xlsx *.xls")]
    )

    if not caminho_arquivo:
        print("❌ Nenhum arquivo selecionado.")
        return

    # Solicitar o nome da classe do modelo
    nome_modelo = simpledialog.askstring("Nome do Modelo", "Digite o nome do modelo SQLAlchemy:")

    if not nome_modelo:
        print("❌ Nome do modelo não informado.")
        return

    importar_e_gerar_modelo(caminho_arquivo, nome_modelo)

if __name__ == "__main__":
    selecionar_arquivo()
