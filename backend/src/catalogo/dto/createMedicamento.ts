import { IsString, IsNotEmpty, IsDateString, IsEnum, IsNumber, IsOptional, IsPositive} from 'class-validator';
import { SubcategoriaPastilla } from '../domain/enums/subpastilla';

// Este archivo ahora se convierte en el ÚNICO 'formulario de entrada' para crear cualquier medicamento.
// Usamos propiedades opcionales (?) para manejar los diferentes tipos.
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
  @IsNotEmpty()
  concentracion!: string;

  @IsDateString()
  fechaCaducidad!: string;

  @IsEnum(['CREMA', 'GEL', 'PASTILLA'])
  tipo!: 'CREMA' | 'GEL' | 'PASTILLA';
  
  // Propiedades opcionales específicas de cada tipo
  
  @IsOptional()
  @IsNumber()
  @IsPositive()
  volumen?: number; // Para Crema y Gel

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cantidad?: number; // Para Pastilla

  @IsOptional()
  @IsEnum(SubcategoriaPastilla)
  subcategoria?: SubcategoriaPastilla; // Para Pastilla
}