# Catálogo de Productos — DII
README del proyecto + Documentación de Patrones (módulo `catalogo`)  

---

## Resumen del módulo 
El módulo implementa un Catálogo de Productos para un e‑commerce farmacéutico con categorías como cremas, pastillas y geles, con el fin de demostrar la aplicación práctica de patrones de diseño en organización, gestión y visualización de productos.

---

##  Patrones de Diseño (contexto general)
Los patrones de diseño son soluciones recurrentes a problemas habituales de diseño de software. Se agrupan en tres familias:
- # Creacionales:
      Cómo crear objetos flexible y reutilizablemente.
- # Estructurales: 
      Cómo componer objetos y clases en estructuras mayores sin perder flexibilidad.
- # De comportamiento: 
      Cómo interactúan los objetos y se reparten responsabilidades.

> En este módulo nos enfocamos en: Factory Method (creacional), Composite (estructural) e Iterator (comportamiento).

---

## 🔹 Instalación del Backend (NestJS)

1) Instalar CLI de NestJS (global):
```bash
npm i -g @nestjs/cli
```

- Dependencias principales de NestJS:
```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs
```
- Dependencias de desarrollo:
```bash
npm install -D @nestjs/cli @nestjs/schematics @nestjs/testing typescript ts-node ts-loader
```
- Validacion de datos en NestJS:
```bash
npm install class-validator class-transformer
```
- Manejo de variables de entorno:
```bash
npm install @nestjs/config
```
---

## 🔹 Instalación del Frontend (Vite + React)
```bash
cd frontend

npm install react react-dom typescript tailwindcss @headlessui/react lucide-react

npm install -D vite postcss autoprefixer eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier

```
---


##  Arquitectura del módulo
- Capas: Controller (HTTP) → Service (negocio) → Repository (persistencia) → Dominio (entidades).
- DTOs con `class-validator` para validar entrada/salida.
- Factory para crear entidades concretas desde DTO con reglas por tipo.
- Opcionales: Composite (categorías/hojas), Iterator (recorridos), preparados en esqueleto.

Estructura relevante del backend (rutas reales del repo):
```
backend/src/catalogo/
  app/                       # servicios (esqueleto)
  domain/                    # entidades y patrones de dominio
    crema.ts                 # clase concreta
    gel.ts                   # clase concreta
    pastilla.ts              # clase concreta
    medicamento.ts           # base abstracta
    enums/subpastilla.ts     # enum tipado
    factory/medicamento.factory.ts
    composite/               # (esqueleto)
    iterator/                # (esqueleto)
  dto/createMedicamento.ts   # DTO
  infraestructure/           # controller/repository (esqueleto)
```

###  Factory Method — MedicamentoFactory (creacional) 
¿Qué es? Proporciona una interfaz de creación que permite a las subclases decidir qué objetos concretos instanciar, evitando acoplar al cliente con clases concretas.  
# Aplicabilidad (este módulo):
- Cuando no conocemos a priori qué tipo de medicamento crear a partir de la entrada.
- Para extender con nuevos tipos sin tocar el código cliente.
- Para centralizar validaciones de negocio de creación.
Pros/Contras breves:
-  Menor acoplamiento, SRP (creación en un único lugar), OCP (agregar tipos sin romper clientes).
-  Puede aumentar la cantidad de clases/métodos de creación si hay muchos tipos.
Dónde se encuentra: `backend/src/catalogo/domain/factory/medicamento.factory.ts`  
Cómo lo usamos (snippet real):
```ts
import {{ Medicamento }} from "../medicamento";
import {{ CreateMedicamentoDto }} from "../../dto/createMedicamento";
import {{ Crema }} from "../crema";
import {{ Gel }} from "../gel";
import {{ Pastilla }} from "../pastilla";

// Importa la excepción específica de NestJS para un manejo de errores más limpio.
import {{ BadRequestException }} from "@nestjs/common";

// La fábrica actúa como un 'traductor' y 'validador' de lógica de negocio.
export class MedicamentoFactory {{
  static create(dto: CreateMedicamentoDto, id: string): Medicamento {{
    const baseData = {{
      id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      farmaceutica: dto.farmaceutica,
      concentracion: dto.concentracion,
      fechaCaducidad: new Date(dto.fechaCaducidad),
    }};
    switch (dto.tipo) {{
      
...
```

Flujo:* `Request → DTO validado → MedicamentoFactory.create(dto, id) → (Crema|Gel|Pastilla)`

---

### DTO — CreateMedicamentoDto (contrato/validación) 
¿Qué es? Objeto de transferencia que valida y modela la entrada.  
¿Por que?: separamos transporte de dominio y validamos campos comunes y específicos de cada tipo.  
se encuentra en: `backend/src/catalogo/dto/createMedicamento.ts`  
Snippet real:
```ts
import {{ IsString, IsNotEmpty, IsDateString, IsEnum, IsNumber, IsOptional, IsPositive}} from 'class-validator';
import {{ SubcategoriaPastilla }} from '../domain/enums/subpastilla';

// Este archivo ahora se convierte en el ÚNICO 'formulario de entrada' para crear cualquier medicamento.
// Usamos propiedades opcionales (?) para manejar los diferentes tipos.
export class CreateMedicamentoDto {{
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  farmaceutica!: string;

  @IsString()
  @IsNotEmpty()
  concentracion!: string;

  @IsDateString()
  fechaCaducidad!: string;

  @IsEnum(['CREMA', 'GEL', 'PASTILLA'])
 
...
```

---

###  Herencia y Polimorfismo — Dominio
¿Qué es? Jerarquía con una base abstracta y clases concretas que especializan comportamiento.  
Dónde se encuentra: 
- `backend/src/catalogo/domain/medicamento.ts` (abstracta)  
- `backend/src/catalogo/domain/crema.ts`, `gel.ts`, `pastilla.ts` (concretas)  
Snippet real (base):
```ts
// Clase 'abstracta': sirve como base para otras clases.
export abstract class Medicamento {{
  // El constructor define las propiedades comunes a todos los medicamentos.
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public farmaceutica: string,
    public concentracion: string,
    public fechaCaducidad: Date,
    public tipo: string,
  ) {{}}

  // Método 'abstracto': obliga a las clases hijas
...
```

---

###  Enum — SubcategoriaPastilla
¿Qué es? Tipado fuerte de subcategorías consumido por DTO/Factory para validar y evitar literales mágicos.  
Dónde se encuentra: `backend/src/catalogo/domain/enums/subpastilla.ts`

---


###  Composite (estructural) 
¿Qué es? Permite componer objetos en árboles y tratarlos de forma uniforme (hojas y compuestos).  
Aplicabilidad (módulo): categorías ↔ productos; navegar jerarquías de catálogo.  
Dónde se encuentra:  
- `backend/src/catalogo/domain/composite/CategoriaComponent.ts` (interfaz)
- `backend/src/catalogo/domain/composite/Categoria.ts` (compuesto)
- `backend/src/catalogo/domain/composite/ProductoLeaf.ts` (hoja)
- `backend/src/catalogo/domain/composite/subcategoria.ts` (subnivel)
Plan mínimo:
```ts
export interface CategoriaComponent { nombre: string; getPrecioTotal(): number; }
export class Categoria implements CategoriaComponent { /* children: CategoriaComponent[] */ }
export class ProductoLeaf implements CategoriaComponent { /* ... */ }
```

###  Iterator (comportamiento) 
¿Qué es? Recorre elementos de una colección sin exponer su representación interna.  
Aplicabilidad (módulo): recorrer listas/árboles de productos en diferentes órdenes (inicio/mitad/final).  
Se encuentran en:  
- `backend/src/catalogo/domain/iterator/MedicamentoIterator.ts`
- `backend/src/catalogo/domain/iterator/IteradorInicio.ts`
- `backend/src/catalogo/domain/iterator/IteradorFinal.ts`
Plan mínimo:
```ts
export interface Iterator<T> { hasNext(): boolean; next(): T; }
export class IteradorInicio<T> implements Iterator<T> { /* ... */ }
export class IteradorMitad<T> implements Iterator<T> { /* ... */ }
export class IteradorFinal<T> implements Iterator<T> { /* ... */ }
```

###  Repository / Controller / Service (infraestructura) 
Intención: orquestar `DTO → Factory → Repository` desde endpoints HTTP.  
Dónde se encuentra:  
- `backend/src/catalogo/infraestructure/medicamento.repository.ts`
- `backend/src/catalogo/infraestructure/catalogo.controller.ts`
- `backend/src/catalogo/app/*.service.ts`
Guía mínima:
```ts
// Controller
@Post('medicamentos')
create(@Body() dto: CreateMedicamentoDto) {
  return this.medicamentoService.create(dto);
}

// Service
create(dto: CreateMedicamentoDto) {
  const id = cryptoRandomId();
  const entity = MedicamentoFactory.create(dto, id);
  return this.repo.create(entity);
}
```


---

##  Cómo correr el proyecto
Frontend (Vite):
```bash
cd frontend
npm install
npm run dev
```
Abre la URL que muestra Vite (p. ej. `http://localhost:5173`).

---


##  Guía rápida de comandos
Instalaciones de dependencias
```bash
npm install
```

Scripts del proyecto
```bash
npm run build           # Compilar TypeScript
npm run start           # Ejecutar en producción
npm run dev             # Ejecutar en modo desarrollo

npm run prisma:generate # Generar cliente Prisma
npm run prisma:push     # Sincronizar esquema con BD
npm run prisma:studio   # Abrir Prisma Studio
npm run seed            # Ejecutar script de seed
```

Comandos Prisma (usando npx)
```bash
npx prisma generate     # Generar cliente Prisma
npx prisma db push      # Sincronizar esquema con BD
npx prisma studio       # Abrir interfaz visual
npx prisma db seed      # Ejecutar seed
```

## Orden de comandos npm 
- Primero en el backend (desde la carpeta backend/):
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```
- Luego en el frontend (desde la carpeta frontend/):
```bash
cd frontend
npm install
npm run dev
```
