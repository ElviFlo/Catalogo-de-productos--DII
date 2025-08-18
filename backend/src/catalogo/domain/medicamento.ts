// Clase 'abstracta': sirve como base para otras clases.
export abstract class Medicamento {
  // El constructor define las propiedades comunes a todos los medicamentos.
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public farmaceutica: string,
    public concentracion: string,
    public fechaCaducidad: Date,
    public tipo: string,
  ) {}

  // Método 'abstracto': obliga a las clases hijas (Crema, Gel, etc.) a implementar su propia versión.
  abstract getDetalles(): string;
}
