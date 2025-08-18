import { Medicamento } from '../medicamento';
import { MedicamentoIterator } from './MedicamentoIterator';

// Su estrategia es recorrer la colección de fin a principio (hacia atrás).
export class AlphabeticalBackwardIterator implements MedicamentoIterator {
  // 'private position' sigue siendo el "dedo" que apunta al elemento actual.
  private position: number;
  private sorted: Medicamento[];

  // El constructor recibe la colección y, a diferencia del iterador hacia adelante,
  // coloca el "dedo" (position) en el último elemento de la lista desde el principio.
  constructor(private collection: Medicamento[]) {
    // Ordenamos los medicamentos por nombre ascendente (A → Z)
    this.sorted = [...collection].sort((a, b) =>
      a.nombre.localeCompare(b.nombre),
    );
    this.position = this.collection.length - 1;
  }

  /**
   * Devuelve el elemento en la posición actual.
   * Lanza un error si el iterador ya terminó su recorrido.
   */
  public current(): Medicamento {
    if (!this.hasNext()) {
      throw new Error("No hay un elemento actual en la colección.");
    }
    return this.sorted[this.position];
  }
  
  /**
   * Comprueba si todavía quedan elementos por recorrer hacia atrás.
   * Devuelve 'true' mientras el "dedo" (position) no se haya pasado del inicio de la lista (posición 0).
   */
  public hasNext(): boolean {
    return this.position >= 0;
  }
  
  /**
   * El método principal de avance (en este caso, retroceso).
   * 1. Primero, comprueba si hay un siguiente elemento (en reversa).
   * 2. Si lo hay, guarda el elemento actual.
   * 3. Mueve el "dedo" (position) un lugar hacia atrás.
   * 4. Devuelve el elemento que guardó.
   * 5. Si no hay más elementos, devuelve null.
   */
  public next(): Medicamento | null {
    if (this.hasNext()) {
      const item = this.sorted[this.position];
      this.position--;
      return item;
    }
    return null;
  }

  /**
   * Vuelve a poner el "dedo" (position) en el punto de partida de este iterador, que es el final de la lista.
   */
  public reset(): void {
    this.position = this.sorted.length - 1;
  }
}