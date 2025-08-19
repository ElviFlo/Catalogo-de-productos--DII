import { Module } from '@nestjs/common';
import { CatalogoController } from './infraestructure/catalogo.controller';
import { MedicamentoService } from './app/medicamento.service';

@Module({
  controllers: [CatalogoController],
  providers: [MedicamentoService],
  exports: [MedicamentoService],
})
export class CatalogoModule {}
