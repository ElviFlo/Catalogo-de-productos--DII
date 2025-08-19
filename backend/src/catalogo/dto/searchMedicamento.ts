import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TipoMedicamento, SubcategoriaPastilla } from '@prisma/client';

export class SearchMedicamentoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEnum(TipoMedicamento)
  @IsOptional()
  tipo?: TipoMedicamento;

  @IsEnum(SubcategoriaPastilla)
  @IsOptional()
  subcategoria?: SubcategoriaPastilla;

  @IsString()
  @IsOptional()
  farmaceutica?: string;
}
