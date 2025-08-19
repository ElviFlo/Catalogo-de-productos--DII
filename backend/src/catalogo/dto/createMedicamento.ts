import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDateString, Min } from 'class-validator';
import { TipoMedicamento, SubcategoriaPastilla } from '@prisma/client';

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

  @IsEnum(TipoMedicamento)
  tipo!: TipoMedicamento;

  @IsInt()
  @IsOptional()
  @Min(1)
  volumen?: number; // solo para Crema/Gel

  @IsInt()
  @IsOptional()
  @Min(1)
  cantidad?: number; // solo para Pastilla

  @IsEnum(SubcategoriaPastilla)
  @IsOptional()
  subcategoria?: SubcategoriaPastilla; // solo para Pastilla
}