import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicamentoDto } from '../dto/createMedicamento';
import { UpdateMedicamentoDto } from '../dto/updateMedicamento';
import { SearchMedicamentoDto } from '../dto/searchMedicamento';

export interface IMedicamentoRepository {
  create(data: CreateMedicamentoDto): Promise<any>;
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  update(id: string, data: UpdateMedicamentoDto): Promise<any>;
  delete(id: string): Promise<any>;
  search(criteria: SearchMedicamentoDto): Promise<any[]>;
  findByType(tipo: string): Promise<any[]>;
  count(): Promise<number>;
  getStats(): Promise<any>;
}

@Injectable()
export class MedicamentoRepository implements IMedicamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMedicamentoDto) {
    return this.prisma.medicamento.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.medicamento.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.medicamento.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateMedicamentoDto) {
    return this.prisma.medicamento.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.medicamento.delete({
      where: { id },
    });
  }

  async search(criteria: SearchMedicamentoDto) {
    const { nombre, tipo, subcategoria, farmaceutica } = criteria;
    
    const where: any = {};
    
    if (nombre) {
      where.nombre = { contains: nombre, mode: 'insensitive' };
    }
    
    if (tipo) {
      where.tipo = tipo;
    }
    
    if (subcategoria) {
      where.subcategoria = subcategoria;
    }
    
    if (farmaceutica) {
      where.farmaceutica = { contains: farmaceutica, mode: 'insensitive' };
    }

    return this.prisma.medicamento.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(tipo: string) {
    return this.prisma.medicamento.findMany({
      where: { tipo: tipo as any },
      orderBy: { nombre: 'asc' },
    });
  }

  async count() {
    return this.prisma.medicamento.count();
  }

  async getStats() {
    const total = await this.prisma.medicamento.count();
    const byType = await this.prisma.medicamento.groupBy({
      by: ['tipo'],
      _count: { tipo: true },
    });
    
    return {
      total,
      byType: byType.map(item => ({
        tipo: item.tipo,
        count: item._count.tipo,
      })),
    };
  }

  /**
   * Métodos adicionales específicos del repositorio
   */
  async findExpiringSoon(days: number = 30) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + days);

    return this.prisma.medicamento.findMany({
      where: {
        fechaCaducidad: {
          lte: fechaLimite,
        },
      },
      orderBy: { fechaCaducidad: 'asc' },
    });
  }

  async findByFarmaceutica(farmaceutica: string) {
    return this.prisma.medicamento.findMany({
      where: {
        farmaceutica: {
          contains: farmaceutica,
          mode: 'insensitive',
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findLowStock(threshold: number = 10) {
    return this.prisma.medicamento.findMany({
      where: {
        OR: [
          { cantidad: { lte: threshold } },
          { volumen: { lte: threshold } },
        ],
      },
      orderBy: { nombre: 'asc' },
    });
  }
}

