import { Injectable } from "@nestjs/common";
import { Categoria } from "../domain/composite/Categoria";
import { ProductoLeaf } from "../domain/composite/ProductoLeaf";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ArbolCatalogoService {
  constructor(private prisma: PrismaService) {}

  async arbolPorTipo() {
    const meds = await this.prisma.medicamento.findMany({
      select: { id: true, nombre: true, tipo: true, farmaceutica: true },
      orderBy: { nombre: "asc" },
    });

    const root = new Categoria("root", "Catálogo");
    const buckets = new Map<string, Categoria>();

    for (const m of meds) {
      if (!buckets.has(m.tipo)) {
        buckets.set(m.tipo, new Categoria(m.tipo, m.tipo));
        root.add(buckets.get(m.tipo)!);
      }
      buckets.get(m.tipo)!.add(
        new ProductoLeaf(m.id, m.nombre, m.tipo, { farmaceutica: m.farmaceutica })
      );
    }
    return root.toPlain();
  }
}