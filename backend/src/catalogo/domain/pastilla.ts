import { Medicamento } from './medicamento';
import { SubcategoriaPastilla } from '@prisma/client';

// 'Pastilla' extiende (hereda) de 'Medicamento', por lo que tiene todas sus propiedades.
export class Pastilla extends Medicamento {
 // Declaramos las nuevas propiedades específica de Pastilla.  
  public cantidad: number;
  public subcategoria: SubcategoriaPastilla;

  // Llama al constructor del padre ('Medicamento') con sus datos y un tipo fijo 'PASTILLA'.
  constructor(data: {
    id: string;
    nombre: string;
    descripcion: string;
    farmaceutica: string;
    concentracion: string;
    fechaCaducidad: Date;
    cantidad: number;
    subcategoria: SubcategoriaPastilla;
  }) {
    super(
      data.id,
      data.nombre,
      data.descripcion,
      data.farmaceutica,
      data.concentracion,
      data.fechaCaducidad,
      'PASTILLA'
    );

    // Asignamos el valor de las nuevas propiedades desde el objeto 'data' recibido.
    this.cantidad = data.cantidad;
    this.subcategoria = data.subcategoria;
  }

  getDetalles(): string {
    return `${this.nombre} es un (${this.subcategoria}) - Cantidad: ${this.cantidad} pastillas.`;
  }
}