import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicamentoDto } from './createMedicamento';

export class UpdateMedicamentoDto extends PartialType(CreateMedicamentoDto) {}
