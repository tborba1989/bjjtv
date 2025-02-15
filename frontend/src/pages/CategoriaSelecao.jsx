import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoriaSelecao = ({ isOpen, onClose, atletaData, competicaoId }) => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategorias = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/inscricoes/categorias/${competicaoId}/${atletaData.id}`);
      setCategorias(data);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    }
  };

  const handleCategoriaSelect = (id) => {
    setSelectedCategorias((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/inscricoes', {
        atleta_id: atletaData.id,
        competicao_id: competicaoId,
        categorias: selectedCategorias
      });
      alert('Inscrição realizada com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro ao registrar inscrição:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCategorias();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">Selecione as Categorias</h3>
      <div className="grid grid-cols-2 gap-4">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            onClick={() => handleCategoriaSelect(categoria.id)}
            className={`p-4 border ${selectedCategorias.includes(categoria.id) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            {categoria.nome}
          </div>
        ))}
      </div>
      <button onClick={handleConfirm} disabled={loading} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">
        {loading ? 'Salvando...' : 'Confirmar Inscrição'}
      </button>
    </div>
  );
};

export default CategoriaSelecao;
