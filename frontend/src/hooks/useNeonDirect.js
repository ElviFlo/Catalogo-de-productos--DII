import { useState, useEffect } from 'react';
import { neonDirectAPI } from '../services/neonDirect';

export const useNeonDirect = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Cargar todos los medicamentos
  const loadMedicamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await neonDirectAPI.getAll();
      setMedicamentos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando medicamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear medicamento
  const createMedicamento = async (medicamentoData) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoMedicamento = await neonDirectAPI.create(medicamentoData);
      setMedicamentos(prev => [...prev, nuevoMedicamento]);
      return nuevoMedicamento;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar medicamentos
  const searchMedicamentos = async (criteria) => {
    setLoading(true);
    setError(null);
    try {
      const resultados = await neonDirectAPI.search(criteria);
      return resultados;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas
  const loadStats = async () => {
    try {
      const estadisticas = await neonDirectAPI.getStats();
      setStats(estadisticas);
      return estadisticas;
    } catch (err) {
      setError(err.message);
      console.error('Error cargando estadísticas:', err);
    }
  };

  // Obtener medicamentos que caducan pronto
  const getExpiringSoon = async (months = 6) => {
    try {
      const medicamentos = await neonDirectAPI.getExpiringSoon(months);
      return medicamentos;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadMedicamentos();
    loadStats();
  }, []);

  // Limpiar conexión al desmontar
  useEffect(() => {
    return () => {
      neonDirectAPI.disconnect();
    };
  }, []);

  return {
    medicamentos,
    loading,
    error,
    stats,
    loadMedicamentos,
    createMedicamento,
    searchMedicamentos,
    loadStats,
    getExpiringSoon
  };
};

