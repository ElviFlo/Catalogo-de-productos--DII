import { Injectable } from '@nestjs/common';
import { MedicamentoRepository } from '../infraestructure/medicamento.repository';
import { CreateMedicamentoDto } from '../dto/createMedicamento';
import { UpdateMedicamentoDto } from '../dto/updateMedicamento';
import { SearchMedicamentoDto } from '../dto/searchMedicamento';

@Injectable()
export class MedicamentoService {
  constructor(private readonly medicamentoRepository: MedicamentoRepository) {}

  async create(createMedicamentoDto: CreateMedicamentoDto) {
    return this.medicamentoRepository.create(createMedicamentoDto);
  }

  async findAll() {
    return this.medicamentoRepository.findAll();
  }

  async findOne(id: string) {
    return this.medicamentoRepository.findById(id);
  }

  async update(id: string, updateMedicamentoDto: UpdateMedicamentoDto) {
    return this.medicamentoRepository.update(id, updateMedicamentoDto);
  }

  async remove(id: string) {
    return this.medicamentoRepository.delete(id);
  }

  async search(searchDto: SearchMedicamentoDto) {
    return this.medicamentoRepository.search(searchDto);
  }

  async findByType(tipo: string) {
    return this.medicamentoRepository.findByType(tipo);
  }

  async getStats() {
    return this.medicamentoRepository.getStats();
  }

  // Métodos adicionales usando el repositorio
  async findExpiringSoon(days: number = 30) {
    return this.medicamentoRepository.findExpiringSoon(days);
  }

  async findByFarmaceutica(farmaceutica: string) {
    return this.medicamentoRepository.findByFarmaceutica(farmaceutica);
  }

  async findLowStock(threshold: number = 10) {
    return this.medicamentoRepository.findLowStock(threshold);
  }

  async count() {
    return this.medicamentoRepository.count();
  }
}
