import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArbolCatalogoService } from '../app/arbol-catalogo.service';
import { MedicamentoService } from '../app/medicamento.service';
import { CreateMedicamentoDto } from '../dto/createMedicamento';
import { UpdateMedicamentoDto } from '../dto/updateMedicamento';
import { SearchMedicamentoDto } from '../dto/searchMedicamento';

// /catalogo/arbol (árbol Composite)
@Controller('catalogo')
export class CatalogoController {
  constructor(private readonly arbolSvc: ArbolCatalogoService) {}

  @Get('arbol')
  getArbol() {
    return this.arbolSvc.arbolPorTipo();
  }
}

// /medicamentos (CRUD + búsqueda)
@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly medicamentoService: MedicamentoService) {}

  @Post()
  create(@Body() dto: CreateMedicamentoDto) {
    return this.medicamentoService.create(dto);
  }

  @Get()
  findAll(@Query() searchDto: SearchMedicamentoDto) {
    if (Object.keys(searchDto).length > 0) {
      return this.medicamentoService.search(searchDto);
    }
    return this.medicamentoService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.medicamentoService.getStats();
  }

  @Get('tipo/:tipo')
  findByType(@Param('tipo') tipo: string) {
    return this.medicamentoService.findByType(tipo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMedicamentoDto) {
    return this.medicamentoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicamentoService.remove(id);
  }
}
