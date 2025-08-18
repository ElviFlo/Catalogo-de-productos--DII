import { Medicamento } from './medicamento';

// 'Gel' extiende (hereda) de 'Medicamento', por lo que tiene todas sus propiedades.
export class Gel extends Medicamento {
  // Declaramos la nueva propiedad específica del Gel.  
  public volumen: number; // en ml

  // Llama al constructor del padre ('Medicamento') con sus datos y un tipo fijo 'GEL'.
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
      'GEL'
    );
    // Asignamos el valor de la nueva propiedad desde el objeto 'data' recibido.
    this.volumen = data.volumen;
  }

  getDetalles(): string {
    return `${this.nombre} (${this.concentracion}) es un gel de ${this.volumen}ml.`;
  }
}