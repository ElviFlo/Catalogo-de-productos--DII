import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { CatalogoController } from './infraestructure/catalogo.controller';
import { MedicamentosController } from './infraestructure/medicamentos.controller';

import { ArbolCatalogoService } from './app/arbol-catalogo.service';
import { MedicamentoService } from './app/medicamento.service';
import { MedicamentoRepository } from './infraestructure/medicamento.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogoController, MedicamentosController],
  providers: [ArbolCatalogoService, MedicamentoService, MedicamentoRepository],
  exports: [ArbolCatalogoService, MedicamentoService, MedicamentoRepository],
})
export class CatalogoModule {}
