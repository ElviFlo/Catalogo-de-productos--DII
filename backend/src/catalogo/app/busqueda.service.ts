import { Injectable } from '@nestjs/common';
import { MedicamentoRepository } from '../infraestructure/medicamento.repository';
import { SearchMedicamentoDto } from '../dto/searchMedicamento';

@Injectable()
export class BusquedaService {
  constructor(private readonly medicamentoRepository: MedicamentoRepository) {}

  /**
   * Búsqueda básica por texto en nombre y descripción
   */
  async buscarPorTexto(texto: string) {
    return this.medicamentoRepository.search({
      nombre: texto,
    });
  }

  /**
   * Búsqueda avanzada con múltiples criterios
   */
  async busquedaAvanzada(criterios: SearchMedicamentoDto) {
    return this.medicamentoRepository.search(criterios);
  }

  /**
   * Búsqueda por tipo de medicamento
   */
  async buscarPorTipo(tipo: string) {
    return this.medicamentoRepository.findByType(tipo);
  }

  /**
   * Búsqueda por farmacéutica
   */
  async buscarPorFarmaceutica(farmaceutica: string) {
    return this.medicamentoRepository.findByFarmaceutica(farmaceutica);
  }

  /**
   * Búsqueda de medicamentos que caducan pronto
   */
  async buscarCaducando(dias: number = 30) {
    return this.medicamentoRepository.findExpiringSoon(dias);
  }

  /**
   * Búsqueda de medicamentos con stock bajo
   */
  async buscarStockBajo(umbral: number = 10) {
    return this.medicamentoRepository.findLowStock(umbral);
  }

  /**
   * Búsqueda por rango de fechas de caducidad
   */
  async buscarPorRangoCaducidad(fechaInicio: Date, fechaFin: Date) {
    // Implementar búsqueda por rango de fechas
    const medicamentos = await this.medicamentoRepository.findAll();
    
    return medicamentos.filter(med => {
      const fechaCaducidad = new Date(med.fechaCaducidad);
      return fechaCaducidad >= fechaInicio && fechaCaducidad <= fechaFin;
    });
  }

  /**
   * Búsqueda por concentración
   */
  async buscarPorConcentracion(concentracion: string) {
    const medicamentos = await this.medicamentoRepository.findAll();
    
    return medicamentos.filter(med => 
      med.concentracion?.toLowerCase().includes(concentracion.toLowerCase())
    );
  }

  /**
   * Búsqueda de medicamentos genéricos
   */
  async buscarGenericos() {
    return this.medicamentoRepository.findByFarmaceutica('Genérico');
  }

  /**
   * Búsqueda de medicamentos de marca
   */
  async buscarDeMarca() {
    const medicamentos = await this.medicamentoRepository.findAll();
    
    return medicamentos.filter(med => 
      med.farmaceutica !== 'Genérico'
    );
  }

  /**
   * Búsqueda por subcategoría (solo para pastillas)
   */
  async buscarPorSubcategoria(subcategoria: string) {
    const medicamentos = await this.medicamentoRepository.findAll();
    
    return medicamentos.filter(med => 
      med.subcategoria === subcategoria
    );
  }

  /**
   * Búsqueda de medicamentos por precio (si se implementa en el futuro)
   */
  async buscarPorPrecio(precioMin: number, precioMax: number) {
    // Placeholder para futura implementación de precios
    console.log(`Búsqueda por precio: ${precioMin} - ${precioMax}`);
    return [];
  }
}

