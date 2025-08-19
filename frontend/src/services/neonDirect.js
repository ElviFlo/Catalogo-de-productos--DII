// Conexión directa a Neon desde el frontend
import { PrismaClient } from '@prisma/client';

// Configuración usando Neon Local Connect
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://neon:npg@localhost:5432/neondb"
    }
  }
});

export const neonDirectAPI = {
  // Obtener todos los medicamentos
  async getAll() {
    try {
      const medicamentos = await prisma.medicamento.findMany({
        orderBy: { nombre: 'asc' }
      });
      return medicamentos;
    } catch (error) {
      console.error('Error conectando directamente a Neon:', error);
      throw error;
    }
  },

  // Crear medicamento
  async create(data) {
    try {
      const medicamento = await prisma.medicamento.create({
        data: data
      });
      return medicamento;
    } catch (error) {
      console.error('Error creando medicamento:', error);
      throw error;
    }
  },

  // Buscar medicamentos por criterios
  async search(criteria) {
    try {
      const where = {};
      
      if (criteria.nombre) {
        where.nombre = { contains: criteria.nombre, mode: 'insensitive' };
      }
      
      if (criteria.tipo) {
        where.tipo = criteria.tipo;
      }
      
      if (criteria.subcategoria) {
        where.subcategoria = criteria.subcategoria;
      }
      
      if (criteria.farmaceutica) {
        where.farmaceutica = { contains: criteria.farmaceutica, mode: 'insensitive' };
      }

      const medicamentos = await prisma.medicamento.findMany({ where });
      return medicamentos;
    } catch (error) {
      console.error('Error buscando medicamentos:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  async getStats() {
    try {
      const total = await prisma.medicamento.count();
      
      const porTipo = await prisma.medicamento.groupBy({
        by: ['tipo'],
        _count: { tipo: true }
      });
      
      const porFarmaceutica = await prisma.medicamento.groupBy({
        by: ['farmaceutica'],
        _count: { farmaceutica: true }
      });

      return {
        total,
        porTipo,
        porFarmaceutica
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Obtener medicamentos que caducan pronto
  async getExpiringSoon(months = 6) {
    try {
      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() + months);
      
      const medicamentos = await prisma.medicamento.findMany({
        where: {
          fechaCaducidad: {
            lte: fechaLimite
          }
        },
        orderBy: { fechaCaducidad: 'asc' }
      });
      
      return medicamentos;
    } catch (error) {
      console.error('Error obteniendo medicamentos que caducan:', error);
      throw error;
    }
  },

  // Cerrar conexión
  async disconnect() {
    await prisma.$disconnect();
  }
};
