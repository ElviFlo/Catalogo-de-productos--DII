// Servicio de API para conectar directamente con Neon
const API_BASE_URL = 'https://ep-restless-night-ac56rgq8-pooler.sa-east-1.aws.neon.tech';

export const medicamentoAPI = {
  // Obtener todos los medicamentos
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/medicamentos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('neondb_owner:npg_LIogBi74axnk')
        }
      });
      return response.json();
    } catch (error) {
      console.error('Error conectando con Neon:', error);
      throw error;
    }
  },

  // Crear medicamento
  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('neondb_owner:npg_LIogBi74axnk')
        },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error creando medicamento:', error);
      throw error;
    }
  },

  // Buscar medicamentos
  async search(criteria) {
    try {
      const params = new URLSearchParams(criteria);
      const response = await fetch(`${API_BASE_URL}/medicamentos/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('neondb_owner:npg_LIogBi74axnk')
        }
      });
      return response.json();
    } catch (error) {
      console.error('Error buscando medicamentos:', error);
      throw error;
    }
  }
};
