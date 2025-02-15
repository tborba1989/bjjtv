// src/components/inscricao/InscricaoForm.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { XCircle } from 'lucide-react';
import axios from 'axios';

// Importação dos componentes
import { ChecagemCPF } from './ChecagemCPF';
import { DadosAtleta } from './DadosAtleta';
import { Categorias } from './Categorias';
import { Resumo } from './Resumo';
import { Pagamento } from './Pagamento';

export const InscricaoForm = ({ isOpen, onClose, competicaoId, competicaoTitle }) => {
  // Estados
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCadastroForm, setShowCadastroForm] = useState(false);
  const [showCategoriasForm, setShowCategoriasForm] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriasEscolhidas, setCategoriasEscolhidas] = useState(new Set());
  const [inscricaoConfirmada, setInscricaoConfirmada] = useState(false);
  const [resumoInscricao, setResumoInscricao] = useState(null);

  const [atletaData, setAtletaData] = useState({
    nome_competidor: '',
    cpf: '',
    apelido: '',
    faixa: '',
    peso: '',
    celular: '',
    equipe: '',
    professor: '',
    sexo: '',
    data_nascimento: ''
  });

  const faixas = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];

  useEffect(() => {
    // Pré-carregar título da competição se disponível
    if (competicaoId && competicaoTitle) {
      document.title = `Inscrição - ${competicaoTitle}`;
    }
  }, [competicaoId, competicaoTitle]);

  // Funções auxiliares
  const formatCPF = (cpf) => cpf.replace(/\D/g, '');
  const validarCPF = (cpf) => formatCPF(cpf).length === 11;

  // Reset do formulário
  const handleClose = (e) => {
    e?.stopPropagation();
    setCpf('');
    setError(null);
    setShowCadastroForm(false);
    setShowCategoriasForm(false);
    setInscricaoConfirmada(false);
    setAtletaData({
      nome_competidor: '',
      cpf: '',
      apelido: '',
      faixa: '',
      peso: '',
      celular: '',
      equipe: '',
      professor: '',
      sexo: '',
      data_nascimento: ''
    });
    onClose();
  };

  // Busca de categorias disponíveis
  const buscarCategorias = async (atletaData) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/categorias/disponiveis/${atletaData.cpf}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      const categoriasOrganizadas = {
        recomendada: response.data.recomendada || [],
        absoluto: response.data.absoluto || [],
        peso_acima: response.data.peso_acima || [],
        peso_abaixo: response.data.peso_abaixo || []
      };

      const temCategorias = Object.values(categoriasOrganizadas)
        .some(arr => arr.length > 0);

      if (temCategorias) {
        setCategorias(categoriasOrganizadas);
        setShowCategoriasForm(true);
        setShowCadastroForm(false);
      } else {
        setError('Nenhuma categoria disponível para suas características.');
      }
    } catch (error) {
      setError('Erro ao buscar categorias disponíveis.');
    }
  };

  // Handler para verificação inicial do CPF
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validarCPF(cpf)) {
      setError('CPF inválido. Digite um CPF válido.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/atletas/buscar/${formatCPF(cpf)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setAtletaData({
          nome_competidor: response.data.data.nome || '',
          cpf: response.data.data.cpf || '',
          apelido: response.data.data.apelido || '',
          faixa: response.data.data.faixa || '',
          peso: response.data.data.peso || '',
          celular: response.data.data.celular || '',
          equipe: response.data.data.equipe || '',
          professor: response.data.data.professor || '',
          sexo: response.data.data.sexo || '',
          data_nascimento: response.data.data.data_nascimento || ''
        });
        setShowCadastroForm(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setAtletaData({ ...atletaData, cpf: formatCPF(cpf) });
          setShowCadastroForm(true);
        } else {
          setError(err.response?.data?.message || 'Erro ao verificar CPF.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Handler para cadastro/atualização do atleta
  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dadosFormatados = {
        ...atletaData,
        peso: atletaData.peso ? parseFloat(atletaData.peso) : null,
        data_nascimento: atletaData.data_nascimento
          ? new Date(atletaData.data_nascimento).toLocaleDateString('pt-BR')
          : null
      };

      try {
        await axios.put(
          `http://localhost:5000/api/atletas/${atletaData.cpf}`,
          dadosFormatados,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
      } catch (putError) {
        if (putError.response?.status === 404) {
          await axios.post(
            'http://localhost:5000/api/atletas',
            dadosFormatados,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              withCredentials: true
            }
          );
        } else {
          throw putError;
        }
      }

      await buscarCategorias(dadosFormatados);
    } catch (error) {
      setError('Erro ao processar dados do atleta');
    } finally {
      setLoading(false);
    }
  };

// No InscricaoForm.jsx, ajuste o handleSelecionarCategoria para:

const handleSelecionarCategoria = async (categoriaIds) => {
  setLoading(true);
  setError(null);

  try {
    const ids = Array.isArray(categoriaIds) ? categoriaIds : [categoriaIds];
    const inscricoesPromises = ids.map(categoriaId => {
      const inscricaoData = {
        atleta_cpf: atletaData.cpf,
        categoria_id: categoriaId,
        competicao_id: Number(competicaoId)
      };

      return axios.post(
        'http://localhost:5000/api/inscricoes',
        inscricaoData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
    });

    const results = await Promise.all(inscricoesPromises);

    // Primeiro ID de categoria selecionada
    const primeiraCategoria = Array.from(categoriasEscolhidas)[0];

    const resumo = {
      numeroInscricao: results[0].data.numero_inscricao,
      atleta: atletaData.nome_competidor,
      cpf: atletaData.cpf,
      categorias: Array.from(categoriasEscolhidas).map(id => {
        const categoria = Object.values(categorias)
          .flat()
          .find(cat => cat.id === id);
        return categoria ? categoria.categoria : '';
      }),
      competicaoId: Number(competicaoId),
      categoriaId: primeiraCategoria,
      nomeCompeticao: competicaoTitle,
      valorTotal: categoriasEscolhidas.size * 100,
      dataInscricao: new Date().toLocaleDateString()
    };

    setResumoInscricao(resumo);
    setInscricaoConfirmada(true);

  } catch (error) {
    console.error('Erro ao realizar inscrição:', error);
    setError('Erro ao realizar inscrição.');
  } finally {
    setLoading(false);
  }
};

  // Handler para impressão do resumo
  const handleImprimirResumo = () => {
    const conteudo = document.getElementById('resumo-inscricao').innerHTML;
    const janelaImpressao = window.open('', '', 'height=600,width=800');
    janelaImpressao.document.write('<html><head><title>Resumo da Inscrição</title>');
    janelaImpressao.document.write('</head><body>');
    janelaImpressao.document.write(conteudo);
    janelaImpressao.document.write('</body></html>');
    janelaImpressao.document.close();
    janelaImpressao.print();
  };

  // Controle de exibição do modal
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-xl">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {showCategoriasForm
                ? 'Selecione sua Categoria'
                : showCadastroForm
                  ? 'Cadastro de Atleta'
                  : `Inscrição - ${competicaoTitle}`}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Conteúdo Principal */}
          <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {inscricaoConfirmada ? (
              <>
                <Resumo
                  resumo={resumoInscricao}
                  onImprimir={handleImprimirResumo}
                />
                <Pagamento
                  resumo={resumoInscricao}
                  onError={setError}
                />
              </>
            ) : showCategoriasForm ? (
            <Categorias
              categorias={categorias}
              categoriasEscolhidas={categoriasEscolhidas}
              handleToggleCategoria={(id) => {
                setCategoriasEscolhidas(prev => {
                  const novasEscolhas = new Set(prev);
                  if (novasEscolhas.has(id)) {
                    novasEscolhas.delete(id);
                  } else {
                    novasEscolhas.add(id);
                  }
                  return novasEscolhas;
                });
              }}
              loading={loading}
              // Adicionar estas props que faltavam
              onContinuar={() => handleSelecionarCategoria(Array.from(categoriasEscolhidas))}
              competicaoId={Number(competicaoId)}
              atletaCpf={atletaData.cpf}
            />
            ) : showCadastroForm ? (
              <DadosAtleta
                atletaData={atletaData}
                setAtletaData={setAtletaData}
                error={error}
                faixas={faixas}
                onSubmit={handleCadastroSubmit}
                loading={loading}
              />
            ) : (
              <ChecagemCPF
                cpf={cpf}
                setCpf={setCpf}
                error={error}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            )}
          </div>

          {/* Rodapé com Botões */}

            <div className="border-t p-4 bg-gray-50 rounded-b-lg">
              <div className="flex justify-end gap-3">
                {!inscricaoConfirmada ? (
                  <button
                    type="button"
                    onClick={showCategoriasForm ? () => {
                      setShowCategoriasForm(false);
                      setShowCadastroForm(true);
                    } : showCadastroForm ? () => setShowCadastroForm(false) : handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    {showCategoriasForm ? 'Voltar para Cadastro' : showCadastroForm ? 'Voltar' : 'Cancelar'}
                  </button>
                ) : (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Concluir
                  </button>
                )}

                {!inscricaoConfirmada && (
                  <button
                    onClick={showCategoriasForm ?
                      () => handleSelecionarCategoria(Array.from(categoriasEscolhidas)) :
                      undefined}
                    form={showCadastroForm ? "cadastroForm" : "cpfForm"}
                    type={showCategoriasForm ? "button" : "submit"}
                    disabled={loading || (showCategoriasForm && categoriasEscolhidas.size === 0)}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading ?
                      (showCategoriasForm ? 'Inscrevendo...' :
                       showCadastroForm ? 'Cadastrando...' :
                       'Verificando...') :
                      (showCategoriasForm ? 'Confirmar Inscrições' :
                       showCadastroForm ? 'Cadastrar e Continuar' :
                       'Continuar')}
                  </button>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

InscricaoForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  competicaoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  competicaoTitle: PropTypes.string.isRequired
};

export default InscricaoForm;
