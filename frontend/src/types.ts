export type Medicamento = {
  id: string;
  nombre: string;
  descripcion: string;
  farmaceutica: string;
  concentracion?: string | null;
  fechaCaducidad?: string | Date | null;
  tipo: "CREMA" | "GEL" | "PASTILLA" | string;
};