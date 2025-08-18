import { Medicamento } from "../medicamento";
import { CreateMedicamentoDto } from "../../dto/createMedicamento";
import { Crema } from "../crema";
import { Gel } from "../gel";
import { Pastilla } from "../pastilla";

// Importa la excepción específica de NestJS para un manejo de errores más limpio.
import { BadRequestException } from "@nestjs/common";

// La fábrica actúa como un 'traductor' y 'validador' de lógica de negocio.
export class MedicamentoFactory {
  static create(dto: CreateMedicamentoDto, id: string): Medicamento {
    const baseData = {
      id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      farmaceutica: dto.farmaceutica,
      concentracion: dto.concentracion,
      fechaCaducidad: new Date(dto.fechaCaducidad),
    };

    switch (dto.tipo) {
      case "CREMA":
        if (dto.volumen === undefined) {
          // Lanza una excepción que NestJS convertirá en un error HTTP 400.
          throw new BadRequestException(
            'Para el tipo CREMA, la propiedad "volumen" es obligatoria.'
          );
        }
        // Construye y devuelve la instancia de Crema.
        return new Crema({ ...baseData, volumen: dto.volumen });

      case "GEL":
        if (dto.volumen === undefined) {
          // Lanza una excepción que NestJS convertirá en una respuesta HTTP 400.
          throw new BadRequestException(
            'Para el tipo GEL, la propiedad "volumen" es obligatoria.'
          );
        }
        // Construye y devuelve la instancia de Gel.
        return new Gel({ ...baseData, volumen: dto.volumen });

      case "PASTILLA":
        if (dto.cantidad === undefined || dto.subcategoria === undefined) {
          throw new BadRequestException(
            'Para el tipo PASTILLA, las propiedades "cantidad" y "subcategoria" son obligatorias.'
          );
        }

        // Construye y devuelve la instancia de Pastilla
        return new Pastilla({
          ...baseData,
          cantidad: dto.cantidad,
          subcategoria: dto.subcategoria,
        });

      default:
        // Si el `tipo` no es uno de los esperados, lanza un error claro.
        throw new BadRequestException(
          `El tipo de medicamento "${dto.tipo}" no es válido. Los tipos válidos son: CREMA, GEL, PASTILLA.`
        );
    }
  }
}
