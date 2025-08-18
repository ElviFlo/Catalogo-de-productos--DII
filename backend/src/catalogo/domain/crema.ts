import { Medicamento } from './medicamento';

// 'Crema' extiende (hereda) de 'Medicamento', por lo que tiene todas sus propiedades.
export class Crema extends Medicamento {
  // Declaramos la nueva propiedad específica de la Crema.  
  public volumen: number; // en ml

  // Llama al constructor del padre ('Medicamento') con sus datos y un tipo fijo 'CREMA'.
  constructor(data: {
    id: string;
    nombre: string;
    descripcion: string;
    farmaceutica: string;
    concentracion: string;
    fechaCaducidad: Date;
    volumen: number;
  }) {
    super(
      data.id,
      data.nombre,
      data.descripcion,
      data.farmaceutica,
      data.concentracion,
      data.fechaCaducidad,
      'CREMA'
    );
    // Asignamos el valor de la nueva propiedad desde el objeto 'data' recibido.
    this.volumen = data.volumen;
  }

  getDetalles(): string {
    return `${this.nombre} (${this.concentracion}) es una crema de ${this.volumen}ml.`;
  }
}