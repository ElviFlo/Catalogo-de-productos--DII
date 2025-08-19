import { Module } from '@nestjs/common';
import { CatalogoController } from './infraestructure/catalogo.controller';
import { MedicamentoService } from './app/medicamento.service';
import { CatalogoService } from './app/catalogo.service';
import { BusquedaService } from './app/busqueda.service';
import { MedicamentoRepository } from './infraestructure/medicamento.repository';

@Module({
  controllers: [CatalogoController],
  providers: [
    MedicamentoService,
    CatalogoService,
    BusquedaService,
    MedicamentoRepository,
  ],
  exports: [
    MedicamentoService,
    CatalogoService,
    BusquedaService,
    MedicamentoRepository,
  ],
})
export class CatalogoModule {}
