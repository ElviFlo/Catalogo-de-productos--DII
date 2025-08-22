export interface CategoriaComponent {
  id: string;
  nombre: string;
  isLeaf(): boolean;
  getCount(): number; 
  toPlain(): any;         
}