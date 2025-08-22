import { CategoriaComponent } from "./CategoriaComponent";

export class ProductoLeaf implements CategoriaComponent {
  constructor(
    public id: string,
    public nombre: string,
    public tipo: "CREMA" | "GEL" | "PASTILLA",
    public datos?: Record<string, unknown>
  ) {}

  isLeaf() { return true; }
  getCount() { return 1; }

  toPlain() {
    return { type: "producto", id: this.id, nombre: this.nombre, tipo: this.tipo, ...this.datos };
  }
}
