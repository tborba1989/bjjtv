from datetime import date
from app.models.models import Categoria, Atleta


def get_ordem_divisoes():
    """Retorna a ordem correta das divisões"""
    return [
        'GALO',
        'PLUMA',
        'PENA',
        'LEVE',
        'MÉDIO',
        'MEIO-PESADO',
        'PESADO',
        'SUPER PESADO',
        'PESADÍSSIMO',
        'ABSOLUTO'
    ]

def get_categorias_disponiveis(atleta):
    hoje = date.today()
    idade = hoje.year - atleta.data_nascimento.year

    print(f"\n=== DEBUG: Dados do Atleta ===")
    print(f"Nome: {atleta.nome_competidor}")
    print(f"Idade: {idade} anos")
    print(f"Peso: {atleta.peso} kg")
    print(f"Sexo: {atleta.sexo}")
    print(f"Faixa: {atleta.faixa}")

    # Determina a classificação baseada na idade
    if 16 <= idade <= 17:
        classificacao = 'Juvenil'
    elif 18 <= idade <= 29:
        classificacao = 'Adulto'
    else:
        classificacao = 'Masters'

    print(f"Classificação por idade: {classificacao}")

    # Lista base de categorias na ordem correta
    ordem_divisoes = get_ordem_divisoes()

    categorias = Categoria.query.filter_by(
        classif=classificacao,
        faixa=atleta.faixa,
        sexo=atleta.sexo
    ).all()

    categorias_disponiveis = {
        'recomendada': [],
        'peso_acima': [],
        'peso_abaixo': [],
        'divisao_acima': [],
        'absoluto': []
    }

    peso_atleta = float(atleta.peso)
    categoria_recomendada = None

    # Adiciona a categoria Absoluto
    for cat in categorias:
        if cat.divisao == 'ABSOLUTO':
            print(f"Adicionando categoria Absoluto: {cat.categoria}")
            categorias_disponiveis['absoluto'].append(cat)

    # Encontra a categoria recomendada e ajusta pesos
    for cat in categorias:
        if cat.divisao == 'ABSOLUTO':
            continue

        print(f"\nVerificando categoria: {cat.categoria}")
        print(f"Divisão: {cat.divisao}")
        print(f"Peso da categoria: {cat.peso_min} - {cat.peso_max}")
        print(f"Peso do atleta: {peso_atleta}")

        # Se não tem peso_max, é uma categoria sem limite superior
        if cat.peso_max is None:
            continue

        # Verifica se o peso do atleta está dentro do limite
        if peso_atleta <= float(cat.peso_max):
            if not categoria_recomendada:
                categoria_recomendada = cat
                categorias_disponiveis['recomendada'].append(cat)
                print(">>> CATEGORIA RECOMENDADA ENCONTRADA!")

                # Após encontrar a categoria recomendada, adiciona apenas a próxima categoria
                idx_atual = ordem_divisoes.index(cat.divisao)

                # Adiciona apenas a próxima categoria de peso acima
                if idx_atual + 1 < len(ordem_divisoes):
                    proxima_div = ordem_divisoes[idx_atual + 1]
                    cat_acima = next(
                        (c for c in categorias if c.divisao == proxima_div),
                        None
                    )
                    if cat_acima:
                        categorias_disponiveis['peso_acima'].append(cat_acima)
                        print(f">>> Categoria peso acima encontrada: {cat_acima.categoria}")

                # Adiciona categoria de peso abaixo
                if idx_atual > 0:
                    div_abaixo = ordem_divisoes[idx_atual - 1]
                    cat_abaixo = next(
                        (c for c in categorias if c.divisao == div_abaixo),
                        None
                    )
                    if cat_abaixo:
                        categorias_disponiveis['peso_abaixo'].append(cat_abaixo)
                        print(f">>> Categoria peso abaixo encontrada: {cat_abaixo.categoria}")

                break

    # Converte as categorias para dicionários antes de retornar
    categorias_dict = {
        'recomendada': [cat.to_dict() for cat in categorias_disponiveis['recomendada']],
        'peso_acima': [cat.to_dict() for cat in categorias_disponiveis['peso_acima']],
        'peso_abaixo': [cat.to_dict() for cat in categorias_disponiveis['peso_abaixo']],
        'divisao_acima': [cat.to_dict() for cat in categorias_disponiveis['divisao_acima']],
        'absoluto': [cat.to_dict() for cat in categorias_disponiveis['absoluto']]
    }

    return categorias_dict
