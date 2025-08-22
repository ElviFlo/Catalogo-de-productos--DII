import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogoModule } from './catalogo/catalogo.module';

@Module({
  imports: [PrismaModule, CatalogoModule],
})
export class AppModule {}
