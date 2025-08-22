import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDateString, Min } from 'class-validator';

export enum TipoMedicamentoEnum {
  PASTILLA = 'PASTILLA',
  CREMA = 'CREMA',
  JARABE = 'JARABE',
}

export enum SubcategoriaPastillaEnum {
  GENERICA = 'GENERICA',
  MARCA = 'MARCA',
}

export class CreateMedicamentoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  farmaceutica!: string;

  @IsString()
  @IsOptional()
  concentracion?: string;

  @IsDateString()
  @IsNotEmpty()
  fechaCaducidad!: string;

  @IsEnum(TipoMedicamentoEnum)
  tipo!: TipoMedicamentoEnum;

  @IsInt()
  @IsOptional()
  @Min(1)
  volumen?: number; // solo para Crema/Gel

  @IsInt()
  @IsOptional()
  @Min(1)
  cantidad?: number; // solo para Pastilla

  @IsEnum(SubcategoriaPastillaEnum)
  @IsOptional()
  subcategoria?: SubcategoriaPastillaEnum; // solo para Pastilla
}
