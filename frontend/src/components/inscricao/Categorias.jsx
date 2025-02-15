// src/components/inscricao/Categorias.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';

export const Categorias = ({
  categorias,
  categoriasEscolhidas,
  handleToggleCategoria,
  loading,
  onContinuar,
  competicaoId,
  atletaCpf
}) => {
  const [inscricoesExistentes, setInscricoesExistentes] = useState(new Map());
  const [processandoCategoria, setProcessandoCategoria] = useState(null);
  const [erro, setErro] = useState(null);

const verificarEToggleCategoria = useCallback(async (categoriaId, categoriaAtual) => {
  setProcessandoCategoria(categoriaId);
  setErro(null);

  console.log('Verificando categoria:', {
    atletaCpf,
    competicaoId,
    categoriaId,
    categoriaAtual
  });

  try {
    const response = await fetch('http://localhost:5000/api/inscricoes/verificar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        atleta_cpf: atletaCpf,
        competicao_id: competicaoId,
        categoria_id: categoriaId
      })
    });

    console.log('Status da resposta:', response.status);
    const data = await response.json();
    console.log('Dados recebidos:', data);

    // Corrigido: lógica de inscrição existente
    if (response.status === 400) {
      setInscricoesExistentes((prev) =>
        new Map(prev.set(categoriaId, { ...data, categoria_nome: categoriaAtual.categoria }))
      );

      // Mostra mensagem informando que já existe inscrição
      setErro({
        tipo: 'info',
        mensagem: `Você já possui uma inscrição ativa nesta categoria: ${categoriaAtual.categoria}.
                  Número da inscrição: ${data.numero_inscricao || 'Não disponível'}`,
      });

      // **Não permite alternar a inscrição já existente**
      return;
    }

    // Corrigido: lógica para nova inscrição (não inscrito)
    if (response.status === 200) {
      // Remove do estado de inscrições existentes se necessário
      setInscricoesExistentes((prev) => {
        const novoEstado = new Map(prev);
        novoEstado.delete(categoriaId);
        return novoEstado;
      });

      // Alterna a seleção
      handleToggleCategoria(categoriaId);
    }
  } catch (error) {
    console.error('Erro ao verificar inscrição:', error);

    setErro({
      tipo: 'error',
      mensagem: 'Erro ao verificar inscrição. Por favor, tente novamente.',
    });
  } finally {
    setProcessandoCategoria(null);
  }
}, [atletaCpf, competicaoId, handleToggleCategoria]);


  const renderCategoriasGrupo = (tipo, lista) => {
    if (!lista || lista.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold capitalize">
          {tipo === 'peso_abaixo' ? 'Categoria Peso Abaixo' :
           tipo === 'peso_acima' ? 'Categoria Peso Acima' :
           tipo === 'recomendada' ? 'Categoria Recomendada' :
           'Categoria Absoluto'}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {lista.map((categoria) => {
            const isSelected = categoriasEscolhidas.has(categoria.id);
            const inscricaoExistente = inscricoesExistentes.get(categoria.id);
            const isProcessando = processandoCategoria === categoria.id;

            return (
              <div
                key={categoria.id}
                onClick={() => !isProcessando && !inscricaoExistente &&
                  verificarEToggleCategoria(categoria.id, categoria)}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${tipo === 'recomendada' ? 'border-green-500' : 'border-gray-200'}
                  ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                  ${inscricaoExistente ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                  ${tipo === 'recomendada' && !isSelected && !inscricaoExistente ? 'bg-green-50' : ''}
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    {isProcessando ? (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    ) : (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={inscricaoExistente !== undefined}
                        onChange={() => !inscricaoExistente &&
                          verificarEToggleCategoria(categoria.id, categoria)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center">
                        {categoria.categoria}
                        {tipo === 'recomendada' && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Recomendada
                          </span>
                        )}
                      </h4>
                      {inscricaoExistente && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Inscrito #{inscricaoExistente.numero_inscricao}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 space-y-1 mt-1">
                      <p>Faixa: {categoria.faixa} | Classificação: {categoria.classificacao}</p>
                      <p>
                        {categoria.divisao && `Divisão: ${categoria.divisao}`}
                        {categoria.peso_max && ` | Peso máx: ${categoria.peso_max}kg`}
                        {categoria.peso_min && ` | Peso mín: ${categoria.peso_min}kg`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Você pode selecionar múltiplas categorias clicando nas opções desejadas.
        </AlertDescription>
      </Alert>

      {erro && (
        <Alert variant={erro.tipo === 'info' ? 'default' : 'destructive'}>
          <AlertTitle>
            {erro.tipo === 'info' ? 'Informação' : 'Erro'}
          </AlertTitle>
          <AlertDescription>{erro.mensagem}</AlertDescription>
        </Alert>
      )}

      {inscricoesExistentes.size > 0 && (
        <Alert>
          <AlertTitle>Suas Inscrições Existentes</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              {Array.from(inscricoesExistentes.values()).map((inscricao) => (
                <div key={inscricao.id} className="text-sm">
                  • {inscricao.categoria_nome} - Número: {inscricao.numero_inscricao}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {Object.entries(categorias).map(([tipo, lista]) => renderCategoriasGrupo(tipo, lista))}

      {Object.values(categorias).every(lista => !lista || lista.length === 0) && (
        <Alert variant="destructive">
          <AlertDescription>
            Nenhuma categoria disponível para suas características.
          </AlertDescription>
        </Alert>
      )}

      {(categoriasEscolhidas.size > 0 || inscricoesExistentes.size > 0) && (
        <div className="sticky bottom-0 bg-white p-4 border-t shadow-lg">
          <button
            onClick={onContinuar}
            disabled={loading || categoriasEscolhidas.size === 0}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                     disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </span>
            ) : (
              `Continuar com ${categoriasEscolhidas.size} nova(s) categoria(s)`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

Categorias.propTypes = {
  categorias: PropTypes.shape({
    recomendada: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      categoria: PropTypes.string.isRequired,
      faixa: PropTypes.string.isRequired,
      classificacao: PropTypes.string.isRequired,
      divisao: PropTypes.string,
      peso_max: PropTypes.number,
      peso_min: PropTypes.number
    })),
    absoluto: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      categoria: PropTypes.string.isRequired,
      faixa: PropTypes.string.isRequired,
      classificacao: PropTypes.string.isRequired,
      divisao: PropTypes.string,
      peso_max: PropTypes.number,
      peso_min: PropTypes.number
    })),
    peso_acima: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      categoria: PropTypes.string.isRequired,
      faixa: PropTypes.string.isRequired,
      classificacao: PropTypes.string.isRequired,
      divisao: PropTypes.string,
      peso_max: PropTypes.number,
      peso_min: PropTypes.number
    })),
    peso_abaixo: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      categoria: PropTypes.string.isRequired,
      faixa: PropTypes.string.isRequired,
      classificacao: PropTypes.string.isRequired,
      divisao: PropTypes.string,
      peso_max: PropTypes.number,
      peso_min: PropTypes.number
    }))
  }).isRequired,
  categoriasEscolhidas: PropTypes.instanceOf(Set).isRequired,
  handleToggleCategoria: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onContinuar: PropTypes.func.isRequired,
  competicaoId: PropTypes.number.isRequired,
  atletaCpf: PropTypes.string.isRequired
};

export default Categorias;