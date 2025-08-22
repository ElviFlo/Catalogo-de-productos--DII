import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TipoMedicamentoEnum, SubcategoriaPastillaEnum } from './createMedicamento';

export class SearchMedicamentoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEnum(TipoMedicamentoEnum)
  @IsOptional()
  tipo?: TipoMedicamentoEnum;

  @IsEnum(SubcategoriaPastillaEnum)
  @IsOptional()
  subcategoria?: SubcategoriaPastillaEnum;

  @IsString()
  @IsOptional()
  farmaceutica?: string;
}
