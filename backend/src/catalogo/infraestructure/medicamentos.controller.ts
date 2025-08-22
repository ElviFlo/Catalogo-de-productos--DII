import { Controller, Get, Query, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { MedicamentoService } from '../app/medicamento.service';
import { CreateMedicamentoDto } from '../dto/createMedicamento';
import { UpdateMedicamentoDto } from '../dto/updateMedicamento';

@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly meds: MedicamentoService) {}

  @Get()
  findAll(
    @Query('nombre') nombre?: string,
    @Query('tipo') tipo?: 'CREMA' | 'GEL' | 'PASTILLA',
    @Query('farmaceutica') farmaceutica?: string,
  ) {
    // Si hay filtros, buscar; si no, devolver todo
    if (nombre || tipo || farmaceutica) {
      return this.meds.search({ nombre, tipo, farmaceutica });
    }
    return this.meds.findAll();
  }

  @Get('tipo/:tipo')
  findByTipo(@Param('tipo') tipo: 'CREMA' | 'GEL' | 'PASTILLA') {
    return this.meds.findByType(tipo);
  }

  @Get('stats')
  getStats() {
    return this.meds.getStats();
  }

  @Post()
  create(@Body() dto: CreateMedicamentoDto) {
    return this.meds.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMedicamentoDto) {
    return this.meds.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meds.remove(id);
  }

  // Mantener esta ruta al final para no interferir con rutas específicas
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meds.findOne(id);
  }
}
