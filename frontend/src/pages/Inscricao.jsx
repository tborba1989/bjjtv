import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import axios from 'axios';

export const InscricaoForm = ({ isOpen, onClose, competicaoId, competicaoTitle }) => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCadastroForm, setShowCadastroForm] = useState(false);
  const [showCategoriasForm, setShowCategoriasForm] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriasEscolhidas, setCategoriasEscolhidas] = useState(new Set());
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
  const [inscricoesConcluidas, setInscricoesConcluidas] = useState([]);
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const faixas = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];

  const formatCPF = (cpf) => {
    return cpf.replace(/\D/g, '');
  };

  const validarCPF = (cpf) => {
    const cpfLimpo = formatCPF(cpf);
    return cpfLimpo.length === 11;
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    setCpf('');
    setError(null);
    setShowCadastroForm(false);
    setShowCategoriasForm(false);
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

const buscarCategorias = async (atletaData) => {
  console.log('Iniciando busca de categorias com dados:', atletaData);
  try {
    const response = await axios.get(`http://localhost:5000/api/categorias/disponiveis/${atletaData.cpf}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    console.log('Resposta da busca de categorias:', response.data);

    // Reorganizar as categorias com base na resposta
    const categoriasOrganizadas = {
      recomendada: response.data.recomendada || [],
      absoluto: response.data.absoluto || [],
      peso_acima: response.data.peso_acima || [],
      peso_abaixo: response.data.peso_abaixo || []
    };

    // Verificar se há categorias
    const temCategorias = Object.values(categoriasOrganizadas).some(arr => arr.length > 0);

    if (temCategorias) {
      setCategorias(categoriasOrganizadas);
      setShowCategoriasForm(true);
      setShowCadastroForm(false);
      console.log('Categorias definidas e formulário atualizado:', categoriasOrganizadas);
    } else {
      setError('Nenhuma categoria disponível para suas características.');
    }

  } catch (error) {
    console.error('Erro detalhado ao buscar categorias:', error);
    setError('Erro ao buscar categorias disponíveis. Por favor, tente novamente.');
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validarCPF(cpf)) {
      setError('CPF inválido. Digite um CPF válido.');
      setLoading(false);
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');

    try {
      const { data } = await axios.get(`http://localhost:5000/api/atletas/buscar/${cpfLimpo}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (data.success) {
        console.log('Atleta encontrado:', data.data);
        setAtletaData({
          nome_competidor: data.data.nome || '',
          cpf: data.data.cpf || '',
          apelido: data.data.apelido || '',
          faixa: data.data.faixa || '',
          peso: data.data.peso || '',
          celular: data.data.celular || '',
          equipe: data.data.equipe || '',
          professor: data.data.professor || '',
          sexo: data.data.sexo || '',
          data_nascimento: data.data.data_nascimento || ''
        });
        setShowCadastroForm(true);
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setAtletaData({ ...atletaData, cpf: cpfLimpo });
          setShowCadastroForm(true);
        } else if (!err.response) {
          setError('Erro de conexão com o servidor. Verifique se o servidor está rodando.');
        } else {
          setError(err.response.data?.message || 'Erro ao verificar CPF. Tente novamente.');
        }
      } else {
        setError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

const handleCadastroSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  console.log('Iniciando cadastro do atleta');

  try {
    // Formatando a data para dd/mm/yyyy
    const formatarData = (data) => {
      if (!data) return null;
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR'); // Isso retorna dd/mm/yyyy
    };

    const dadosFormatados = {
      nome_competidor: atletaData.nome_competidor,
      cpf: atletaData.cpf,
      apelido: atletaData.apelido,
      faixa: atletaData.faixa,
      peso: atletaData.peso ? parseFloat(atletaData.peso) : null,
      celular: atletaData.celular,
      equipe: atletaData.equipe,
      professor: atletaData.professor,
      sexo: atletaData.sexo,
      data_nascimento: formatarData(atletaData.data_nascimento)
    };

    console.log('Dados formatados para envio:', dadosFormatados);

    try {
      const response = await axios.put(`http://localhost:5000/api/atletas/${atletaData.cpf}`, dadosFormatados, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Resposta do servidor (PUT):', response.data);

      if (response.data.message === 'Atleta atualizado com sucesso!') {
        console.log('Atualização bem sucedida, buscando categorias...');
        await buscarCategorias(dadosFormatados);
      }

    } catch (putError) {
      console.error('Erro no PUT:', putError.response?.data);
      if (putError.response?.status === 404) {
        const response = await axios.post('http://localhost:5000/api/atletas', dadosFormatados, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        if (response.data.message === 'Atleta cadastrado com sucesso!') {
          console.log('Cadastro bem sucedido, buscando categorias...');
          await buscarCategorias(dadosFormatados);
        }
      } else {
        throw putError;
      }
    }

  } catch (error) {
    console.error('Erro completo:', error.response?.data || error);
    setError(error.response?.data?.message || 'Erro ao processar dados do atleta');
  } finally {
    setLoading(false);
  }
};

const handleSelecionarCategoria = async (categoriaIds) => {
  setLoading(true);
  setError(null);

  try {
    const ids = Array.isArray(categoriaIds) ? categoriaIds : [categoriaIds];

    // Para debug
    console.log('Iniciando inscrições para as categorias:', ids);

    const inscricoesPromises = ids.map(categoriaId => {
      const inscricaoData = {
        atleta_cpf: atletaData.cpf,         // Alterado para atleta_cpf
        categoria_id: categoriaId,
        competicao_id: Number(competicaoId)  // Garantindo que seja número
      };

      console.log('Dados da inscrição:', inscricaoData);

      return axios.post('http://localhost:5000/api/inscricoes', inscricaoData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
    });

    // Executar todas as inscrições em paralelo
    const results = await Promise.all(inscricoesPromises);

    console.log('Resultados das inscrições:', results);

    // Se chegou aqui, todas as inscrições foram bem-sucedidas
    handleClose();

  } catch (error) {
    console.error('Erro ao realizar inscrições:', error.response?.data || error);
    setError(
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Erro ao realizar inscrição. Por favor, tente novamente.'
    );
  } finally {
    setLoading(false);
  }
};

const handleToggleCategoria = (categoriaId) => {
  setCategoriasEscolhidas(prev => {
    const novasEscolhas = new Set(prev);
    if (novasEscolhas.has(categoriaId)) {
      novasEscolhas.delete(categoriaId);
    } else {
      novasEscolhas.add(categoriaId);
    }
    return novasEscolhas;
  });
};

const handleInscricaoSubmit = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await axios.post('http://localhost:5000/api/inscricoes', {
      atleta_cpf: atletaData.cpf,
      competicao_id: competicaoId,
      categorias: selectedCategorias
    });

    if (response.status === 201) {
      // Atualiza estado com as inscrições realizadas
      setInscricoesConcluidas(response.data.inscricao);
      alert(`Inscrição realizada com sucesso! Número: ${response.data.inscricao.numero_inscricao}`);
      setMostrarResumo(true);
    }
  } catch (err) {
    setError('Erro ao registrar inscrição.');
  } finally {
    setLoading(false);
  }
};

// Resumo para impressão
const handleImprimirResumo = () => {
  window.print();
};

// Redirecionar para pagamentos
const handlePagamento = () => {
  // Implementar lógica para iniciar o pagamento
  alert('Integração com pagamentos iniciada!');
};

if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-xl">
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

          <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {!showCadastroForm && !showCategoriasForm ? (
              <form id="cpfForm" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                    CPF do Atleta
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="Digite seu CPF"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
                  </div>
                )}
              </form>
            ) : showCadastroForm ? (
              <form id="cadastroForm" onSubmit={handleCadastroSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={atletaData.nome_competidor}
                      onChange={(e) => setAtletaData({...atletaData, nome_competidor: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apelido *
                    </label>
                    <input
                      type="text"
                      value={atletaData.apelido}
                      onChange={(e) => setAtletaData({...atletaData, apelido: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      value={atletaData.cpf}
                      onChange={(e) => setAtletaData({ ...atletaData, cpf: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Faixa *
                    </label>
                    <select
                      value={atletaData.faixa}
                      onChange={(e) => setAtletaData({ ...atletaData, faixa: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecione a faixa</option>
                      {faixas.map((faixa) => (
                        <option key={faixa} value={faixa}>
                          {faixa}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={atletaData.peso}
                      onChange={(e) => setAtletaData({ ...atletaData, peso: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={atletaData.data_nascimento}
                      onChange={(e) => setAtletaData({...atletaData, data_nascimento: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sexo *
                    </label>
                    <select
                      value={atletaData.sexo}
                      onChange={(e) => setAtletaData({...atletaData, sexo: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecione o sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Celular
                    </label>
                    <input
                      type="tel"
                      value={atletaData.celular}
                      onChange={(e) => setAtletaData({...atletaData, celular: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equipe
                    </label>
                    <input
                      type="text"
                      value={atletaData.equipe}
                      onChange={(e) => setAtletaData({...atletaData, equipe: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professor
                    </label>
                    <input
                      type="text"
                      value={atletaData.professor}
                      onChange={(e) => setAtletaData({...atletaData, professor: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                    {error}
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-6">
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">
                    Você pode selecionar múltiplas categorias clicando nas opções desejadas.
                  </p>
                </div>

                {Object.entries(categorias).map(([tipo, lista]) => {
                  if (!lista || lista.length === 0) return null;

                  return (
                    <div key={tipo} className="space-y-4">
                      <h3 className="text-lg font-semibold capitalize">
                        {tipo === 'peso_abaixo' ? 'Categoria Peso Abaixo' :
                         tipo === 'peso_acima' ? 'Categoria Peso Acima' :
                         tipo === 'recomendada' ? 'Categoria Recomendada' :
                         'Categoria Absoluto'}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {lista.map((categoria) => {
                          const isSelected = categoriasEscolhidas.has(categoria.id);

                          return (
                            <div
                              key={categoria.id}
                              onClick={() => handleToggleCategoria(categoria.id)}
                              className={`
                                border rounded-lg p-4 cursor-pointer transition-all duration-200
                                ${tipo === 'recomendada' ? 'border-green-500' : 'border-gray-200'}
                                ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
                                ${tipo === 'recomendada' && !isSelected ? 'bg-green-50' : ''}
                              `}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 pt-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleCategoria(categoria.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium flex items-center">
                                    {categoria.categoria}
                                    {tipo === 'recomendada' && (
                                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Recomendada
                                      </span>
                                    )}
                                  </h4>
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
                })}

                {Object.values(categorias).every(lista => !lista || lista.length === 0) && (
                  <p className="text-gray-500">Nenhuma categoria disponível para suas características.</p>
                )}
              </div>
            )}
          </div>

          <div className="border-t p-4 bg-gray-50 rounded-b-lg">
            <div className="flex justify-end gap-3">
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

              {showCategoriasForm ? (
<button
  type="button"
  onClick={() => {
    // Passar o array de IDs das categorias selecionadas
    handleSelecionarCategoria(Array.from(categoriasEscolhidas));
  }}
  disabled={loading || categoriasEscolhidas.size === 0}
  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
>
  {loading ? (
    <>
      <span className="animate-spin">⭮</span>
      Inscrevendo...
    </>
  ) : (
    <>
      Confirmar Inscrições
      {categoriasEscolhidas.size > 0 && (
        <span className="bg-blue-500 px-2 py-0.5 rounded-full text-sm">
          {categoriasEscolhidas.size}
        </span>
      )}
    </>
  )}
</button>
              ) : !showCategoriasForm && (
                <button
                  form={showCadastroForm ? "cadastroForm" : "cpfForm"}
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? (showCadastroForm ? 'Cadastrando...' : 'Verificando...') : (showCadastroForm ? 'Cadastrar e Continuar' : 'Continuar')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscricaoForm;
