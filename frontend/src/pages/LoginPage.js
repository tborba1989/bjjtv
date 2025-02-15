// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../config/env';
import '../styles/LoginPage.css';
import Footer from '../components/Footer';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario: username,  // Alterado de email para usuario
          senha: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.usuario)); // Adicionado para guardar dados do usuário
        alert('Login realizado com sucesso!');
        navigate('/admin');
      } else {
        // More specific error handling
        alert(data.error || 'Erro de autenticação');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-wrapper">
          <img src={getImageUrl('logo/logo.png')} alt="RN BJJ TV" className="login-logo" />
        </div>
        <h2>Área Administrativa</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <button className="link-button" onClick={() => alert('Função em desenvolvimento')}>
          Esqueci minha senha
        </button>
        <button className="link-button" onClick={() => navigate('/')}>
          Voltar para Home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;