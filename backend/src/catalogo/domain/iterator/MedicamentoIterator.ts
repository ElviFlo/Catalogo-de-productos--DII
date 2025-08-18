import { Medicamento } from '../medicamento';

// La interfaz Iterator declara las operaciones para recorrer una colección.
export interface MedicamentoIterator {
  // Devuelve true si quedan elementos por iterar
  hasNext(): boolean;
  
  // Devuelve el elemento actual de la colección.
  current(): Medicamento;

  // Devuelve el siguiente Medicamento o null si no hay más
  next(): Medicamento | null;

  // Opcional: volver al estado inicial del iterador
  reset(): void;
}
