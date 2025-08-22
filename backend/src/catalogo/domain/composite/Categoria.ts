import { CategoriaComponent } from "./CategoriaComponent";

export class Categoria implements CategoriaComponent {
  public children: CategoriaComponent[] = [];
  constructor(public id: string, public nombre: string) {}

  add(child: CategoriaComponent) { this.children.push(child); }
  removeById(id: string) { this.children = this.children.filter(c => c.id !== id); }

  isLeaf() { return false; }
  getCount() { return this.children.reduce((acc, c) => acc + c.getCount(), 0); }

  toPlain() {
    return {
      type: "categoria",
      id: this.id,
      nombre: this.nombre,
      count: this.getCount(),
      children: this.children.map(c => c.toPlain())
    };
  }
}
