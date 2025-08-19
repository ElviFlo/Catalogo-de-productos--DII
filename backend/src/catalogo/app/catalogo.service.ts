import { Injectable } from '@nestjs/common';
import { MedicamentoService } from './medicamento.service';
import { CreateMedicamentoDto } from '../dto/createMedicamento';
import { UpdateMedicamentoDto } from '../dto/updateMedicamento';
import { SearchMedicamentoDto } from '../dto/searchMedicamento';

@Injectable()
export class CatalogoService {
  constructor(private readonly medicamentoService: MedicamentoService) {}

  /**
   * Obtiene el catálogo completo de medicamentos
   */
  async getCatalogo() {
    return this.medicamentoService.findAll();
  }

  /**
   * Obtiene estadísticas del catálogo
   */
  async getEstadisticas() {
    return this.medicamentoService.getStats();
  }

  /**
   * Busca medicamentos en el catálogo
   */
  async buscarMedicamentos(searchDto: SearchMedicamentoDto) {
    return this.medicamentoService.search(searchDto);
  }

  /**
   * Obtiene medicamentos por tipo
   */
  async getMedicamentosPorTipo(tipo: string) {
    return this.medicamentoService.findByType(tipo);
  }

  /**
   * Obtiene un medicamento específico del catálogo
   */
  async getMedicamento(id: string) {
    return this.medicamentoService.findOne(id);
  }

  /**
   * Agrega un nuevo medicamento al catálogo
   */
  async agregarMedicamento(createDto: CreateMedicamentoDto) {
    return this.medicamentoService.create(createDto);
  }

  /**
   * Actualiza un medicamento del catálogo
   */
  async actualizarMedicamento(id: string, updateDto: UpdateMedicamentoDto) {
    return this.medicamentoService.update(id, updateDto);
  }

  /**
   * Elimina un medicamento del catálogo
   */
  async eliminarMedicamento(id: string) {
    return this.medicamentoService.remove(id);
  }

  /**
   * Obtiene medicamentos que caducan pronto
   */
  async getMedicamentosCaducando(dias: number = 30) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);

    return this.medicamentoService.search({
      fechaCaducidad: fechaLimite.toISOString(),
    } as any);
  }

  /**
   * Obtiene medicamentos por farmacéutica
   */
  async getMedicamentosPorFarmaceutica(farmaceutica: string) {
    return this.medicamentoService.search({
      farmaceutica,
    });
  }
}

