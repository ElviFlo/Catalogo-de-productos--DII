import { Medicamento } from '../medicamento';
import { MedicamentoIterator } from './MedicamentoIterator';

// Su estrategia es recorrer la colección de principio a fin (hacia adelante).
export class AlphabeticalForwardIterator implements MedicamentoIterator {
  // 'private position' es como el "dedo" que apunta al elemento actual en la lista.
  private position: number = 0;
  private sorted: Medicamento[];

  // El constructor recibe la colección de medicamentos que va a recorrer.
  constructor(private collection: Medicamento[]) {
    // Ordenamos los medicamentos por nombre ascendente (A → Z)
    this.sorted = [...collection].sort((a, b) =>
      a.nombre.localeCompare(b.nombre),
    );
  }

  /**
   * Devuelve el elemento en la posición actual.
   * Lanza un error si intentas acceder a un elemento que no existe (si ya terminaste de recorrer).
   */
  public current(): Medicamento {
    if (!this.hasNext()) {
      throw new Error("No hay un elemento actual en la colección.");
    }
    return this.sorted[this.position];
  }
  
  /**
   * Comprueba si todavía hay elementos por delante en la colección.
   * Devuelve 'true' mientras el "dedo" (position) no se haya salido del final de la lista.
   */
  public hasNext(): boolean {
    return this.position < this.sorted.length;
  }
  
  /**
   * Este es el método principal de avance.
   * 1. Primero, comprueba si hay un siguiente elemento.
   * 2. Si lo hay, guarda el elemento actual.
   * 3. Mueve el "dedo" (position) un lugar hacia adelante.
   * 4. Devuelve el elemento que guardó.
   * 5. Si no hay más elementos, simplemente devuelve null.
   */
  public next(): Medicamento | null {
    if (this.hasNext()) {
      const item = this.sorted[this.position];
      this.position++;
      return item;
    }
    return null;
  }

  /**
   * Reinicia el iterador.
   * Simplemente vuelve a poner el "dedo" (position) en el inicio de la lista (posición 0).
   */
  public reset(): void {
    this.position = 0;
  }
}