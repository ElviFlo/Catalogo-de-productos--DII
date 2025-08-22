import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicamentoDto } from '../dto/createMedicamento';
import { UpdateMedicamentoDto } from '../dto/updateMedicamento';
import { SearchMedicamentoDto } from '../dto/searchMedicamento';
import { Medicamento, Prisma } from '@prisma/client';

export interface IMedicamentoRepository {
  create(data: CreateMedicamentoDto): Promise<Medicamento>;
  findAll(): Promise<Medicamento[]>;
  findById(id: string): Promise<Medicamento | null>;
  update(id: string, data: UpdateMedicamentoDto): Promise<Medicamento>;
  delete(id: string): Promise<Medicamento>;
  search(criteria: SearchMedicamentoDto): Promise<Medicamento[]>;
  findByType(tipo: string): Promise<Medicamento[]>;
  count(): Promise<number>;
  getStats(): Promise<{ total: number; byType: Array<{ tipo: string; count: number }> }>;
}

@Injectable()
export class MedicamentoRepository implements IMedicamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMedicamentoDto): Promise<Medicamento> {
    const payload: Prisma.MedicamentoCreateInput = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      farmaceutica: data.farmaceutica,
      concentracion: data.concentracion ?? undefined,
      fechaCaducidad: new Date(data.fechaCaducidad),
      tipo: data.tipo as any,
      volumen: data.volumen ?? undefined,
      cantidad: data.cantidad ?? undefined,
      subcategoria: (data.subcategoria as any) ?? undefined,
      // precio tiene default en el esquema
    };

    return this.prisma.medicamento.create({ data: payload });
  }

  async findAll(): Promise<Medicamento[]> {
    return this.prisma.medicamento.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Medicamento | null> {
    return this.prisma.medicamento.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateMedicamentoDto): Promise<Medicamento> {
    return this.prisma.medicamento.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Medicamento> {
    return this.prisma.medicamento.delete({ where: { id } });
  }

  async search(criteria: SearchMedicamentoDto): Promise<Medicamento[]> {
    const { nombre, tipo, subcategoria, farmaceutica } = criteria;

    const where: Prisma.MedicamentoWhereInput = {};

    if (nombre) {
      where.nombre = { contains: nombre } as any;
    }
    if (tipo) {
      where.tipo = tipo as any; // si tienes un enum TS puedes mapearlo aquí
    }
    if (subcategoria) {
      // ajusta si tu esquema tiene otro campo para subcategoría
      (where as any).subcategoria = subcategoria as any;
    }
    if (farmaceutica) {
      where.farmaceutica = { contains: farmaceutica } as any;
    }

    return this.prisma.medicamento.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(tipo: string): Promise<Medicamento[]> {
    return this.prisma.medicamento.findMany({
      where: { tipo: tipo as any },
      orderBy: { nombre: 'asc' },
    });
  }

  async count(): Promise<number> {
    return this.prisma.medicamento.count();
  }

  /**
   * 👉 Arreglado: no pasamos tipos a groupBy; usamos _count._all
   * y luego mapeamos al formato esperado.
   */
  async getStats(): Promise<{ total: number; byType: Array<{ tipo: string; count: number }> }> {
    const total = await this.prisma.medicamento.count();

    const grouped = await this.prisma.medicamento.groupBy({
      by: ['tipo'],
      _count: { _all: true },
    });

    const byType = grouped.map(g => ({
      tipo: g.tipo,
      count: g._count._all,
    }));

    return { total, byType };
  }

  // ---------- Extras opcionales del repo ----------

  async findExpiringSoon(days: number = 30): Promise<Medicamento[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + days);

    return this.prisma.medicamento.findMany({
      where: {
        fechaCaducidad: { lte: fechaLimite },
      },
      orderBy: { fechaCaducidad: 'asc' },
    });
  }

  async findByFarmaceutica(farmaceutica: string): Promise<Medicamento[]> {
    return this.prisma.medicamento.findMany({
      where: {
        farmaceutica: { contains: farmaceutica } as any,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findLowStock(threshold: number = 10): Promise<Medicamento[]> {
    // Ajusta estas condiciones según tus campos reales de stock
    return this.prisma.medicamento.findMany({
      where: {
        OR: [
          { cantidad: { lte: threshold } as any },
          { volumen: { lte: threshold } as any },
        ],
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
