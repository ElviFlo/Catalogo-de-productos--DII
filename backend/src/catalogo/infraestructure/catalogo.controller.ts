import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MedicamentoService } from '../app/medicamento.service';
import { CreateMedicamentoDto } from '../dto/createMedicamento';
import { UpdateMedicamentoDto } from '../dto/updateMedicamento';
import { SearchMedicamentoDto } from '../dto/searchMedicamento';

@Controller('medicamentos')
export class CatalogoController {
  constructor(private readonly medicamentoService: MedicamentoService) {}

  @Post()
  create(@Body() createMedicamentoDto: CreateMedicamentoDto) {
    return this.medicamentoService.create(createMedicamentoDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchMedicamentoDto) {
    // Si hay parámetros de búsqueda, usar search, sino findAll
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
  update(
    @Param('id') id: string,
    @Body() updateMedicamentoDto: UpdateMedicamentoDto,
  ) {
    return this.medicamentoService.update(id, updateMedicamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicamentoService.remove(id);
  }
}
