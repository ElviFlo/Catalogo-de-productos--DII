import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicamentoDto } from '../dto/createMedicamento';
import { UpdateMedicamentoDto } from '../dto/updateMedicamento';
import { SearchMedicamentoDto } from '../dto/searchMedicamento';

@Injectable()
export class MedicamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicamentoDto: CreateMedicamentoDto) {
    return this.prisma.medicamento.create({
      data: createMedicamentoDto,
    });
  }

  async findAll() {
    return this.prisma.medicamento.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.medicamento.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateMedicamentoDto: UpdateMedicamentoDto) {
    return this.prisma.medicamento.update({
      where: { id },
      data: updateMedicamentoDto,
    });
  }

  async remove(id: string) {
    return this.prisma.medicamento.delete({
      where: { id },
    });
  }

  async search(searchDto: SearchMedicamentoDto) {
    const { nombre, tipo, subcategoria, farmaceutica } = searchDto;
    
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
}
