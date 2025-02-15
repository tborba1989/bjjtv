import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const API_BASE = 'http://localhost:5000';

export const Resumo = ({ resumo, onImprimir }) => {
  const [numerosInscricao, setNumerosInscricao] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const buscarNumeroInscricao = async () => {
      if (!resumo?.cpf || !resumo?.competicaoId || !resumo?.categoriaId) {
        console.warn('Dados incompletos para buscar número de inscrição');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          atleta_cpf: resumo.cpf,
          competicao_id: resumo.competicaoId,
          categoria_id: resumo.categoriaId
        });

        const url = `${API_BASE}/api/inscricoes/numero?${params}`;
        console.log('URL da requisição:', url);

        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (e) {
          throw new Error('Resposta do servidor não é JSON válido');
        }

        if (data.inscricoes && data.inscricoes.length > 0) {
          setNumerosInscricao(prev => ({
            ...prev,
            [resumo.categoriaId]: data.inscricoes[0].numero_inscricao
          }));
        } else {
          setError('Nenhuma inscrição encontrada');
        }
      } catch (error) {
        console.error('Erro ao buscar número de inscrição:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    buscarNumeroInscricao();
  }, [resumo]);

  if (!resumo) return null;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800">Inscrição realizada com sucesso!</p>
        </div>
      )}

      <div id="resumo-inscricao" className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">Resumo da Inscrição</h3>
        {resumo.nomeCompeticao && (
          <h4 className="text-xl font-bold mb-4">{resumo.nomeCompeticao}</h4>
        )}

        <div className="space-y-2">
          <p><strong>Atleta:</strong> {resumo.atleta}</p>
          <p><strong>CPF:</strong> {resumo.cpf}</p>
          <div className="mt-4">
            <p className="font-semibold">Categorias:</p>
            <ul className="list-disc pl-5 mt-2">
              {resumo.categorias && resumo.categorias.map((categoria, idx) => (
                <li key={idx}>
                  {isLoading ? (
                    "Carregando número de inscrição..."
                  ) : (
                    `Número de Inscrição: ${numerosInscricao[resumo.categoriaId]} - ${categoria}`
                  )}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4">
            <strong>Valor Total:</strong> R$ {resumo.valorTotal?.toFixed(2)}
          </p>
          <p><strong>Data:</strong> {resumo.dataInscricao}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={onImprimir}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Imprimir Resumo
          </button>
        </div>
      </div>
    </div>
  );
};

Resumo.propTypes = {
  resumo: PropTypes.shape({
    atleta: PropTypes.string,
    cpf: PropTypes.string,
    categorias: PropTypes.arrayOf(PropTypes.string),
    categoriaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    competicaoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nomeCompeticao: PropTypes.string,
    valorTotal: PropTypes.number,
    dataInscricao: PropTypes.string
  }),
  onImprimir: PropTypes.func.isRequired
};

export default Resumo;