# Script Python para listar a estrutura de diretórios, ignorando pastas específicas
import os


def listar_diretorio(caminho):
    ignorar_pastas = {'venv', 'build', 'node_modules'}
    for raiz, dirs, arquivos in os.walk(caminho):
        # Remove pastas a serem ignoradas
        dirs[:] = [d for d in dirs if d not in ignorar_pastas]

        nivel = raiz.replace(caminho, '').count(os.sep)
        indentacao = ' ' * 4 * nivel
        print(f'{indentacao}{os.path.basename(raiz)}/')
        sub_indentacao = ' ' * 4 * (nivel + 1)
        for arquivo in arquivos:
            print(f'{sub_indentacao}{arquivo}')


if __name__ == "__main__":
    caminho_base = input("Digite o caminho do diretório: ")
    listar_diretorio(caminho_base)
