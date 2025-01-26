// src/api.js
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
    throw error;
  }
};
