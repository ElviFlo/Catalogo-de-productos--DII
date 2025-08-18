import React, { useMemo, useState } from "react";
import {
  Heart,
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

// Types
export type ProductType = "Cremas" | "Geles" | "Pastillas";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number; // COP
  type: ProductType;
  image: string;
}

const CURRENCY = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

// Mock data
const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Acetaminofén",
    brand: "MK",
    price: 4000,
    type: "Pastillas",
    image: "../../assets/products/acetaminofen.png",
  },
  {
    id: "2",
    name: "Loratadina",
    brand: "AG",
    price: 5000,
    type: "Pastillas",
    image: "../../assets/products/loratadina",
  },
  {
    id: "3",
    name: "Diclofenaco",
    brand: "Genfar",
    price: 10000,
    type: "Pastillas",
    image: "../../assets/products/diclofenaco.png",
  },
  {
    id: "4",
    name: "Lavirk",
    brand: "Genfar",
    price: 8000,
    type: "Geles",
    image: "../../assets/products/lavirk.png",
  },
  {
    id: "5",
    name: "Alka-Seltzer",
    brand: "Bayer",
    price: 8000,
    type: "Pastillas",
    image: "../../assets/products/alka-seltzer.png",
  },
  {
    id: "6",
    name: "Buscapina Fem",
    brand: "Sanofi",
    price: 11000,
    type: "Pastillas",
    image: "../../assets/products/buscapina.png",
  },
  {
    id: "7",
    name: "Terbix",
    brand: "Genfar",
    price: 4000,
    type: "Cremas",
    image: "../../assets/products/terbix.png",
  },
  {
    id: "8",
    name: "Clotrimazol",
    brand: "AG",
    price: 6000,
    type: "Cremas",
    image: "../../assets/products/clotrimazol.png",
  },
  {
    id: "9",
    name: "Advil Max",
    brand: "Pfizer",
    price: 4000,
    type: "Pastillas",
    image: "../../assets/products/advil-max.png",
  },
  {
    id: "10",
    name: "Naproxeno",
    brand: "AG",
    price: 10000,
    type: "Pastillas",
    image: "../../assets/products/naproxeno.png",
  },
  {
    id: "11",
    name: "Aciclovir",
    brand: "Genfar",
    price: 12000,
    type: "Cremas",
    image: "../../assets/products/aciclovir.png",
  },
  {
    id: "12",
    name: "Ibupol",
    brand: "AG",
    price: 10000,
    type: "Geles",
    image: "../../assets/products/ibupol.png",
  },
];

// Helpers
const unique = (arr: string[]) => Array.from(new Set(arr));
const MAX_PRICE = Math.max(...PRODUCTS.map((p) => p.price));

export default function Catalog() {
  // UI State
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"Todos" | ProductType>("Todos");
  const [brand, setBrand] = useState<string>("Todas");
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE); // inicia en el máximo
  const [sortBy, setSortBy] = useState<
    "relevance" | "priceAsc" | "priceDesc" | "name"
  >("relevance");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const brands = useMemo(() => unique(PRODUCTS.map((p) => p.brand)), []);

  // Reset
  const resetFilters = () => {
    setQuery("");
    setType("Todos");
    setBrand("Todas");
    setMaxPrice(MAX_PRICE);
    setSortBy("relevance");
    setPage(1);
  };

  // Filtro + orden
  const filtered = useMemo(() => {
    let data = PRODUCTS.filter((p) => {
      const q = query.toLowerCase();
      const matchesQuery = q
        ? p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
        : true;
      const matchesType = type === "Todos" ? true : p.type === type;
      const matchesBrand = brand === "Todas" ? true : p.brand === brand;
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesType && matchesBrand && matchesPrice;
    });

    switch (sortBy) {
      case "priceAsc":
        data = [...data].sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        data = [...data].sort((a, b) => b.price - a.price);
        break;
      case "name":
        data = [...data].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break; // relevance = orden original
    }
    return data;
  }, [brand, maxPrice, query, sortBy, type]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      {/* Filtros + búsqueda (único buscador) */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            placeholder="Buscar productos..."
            className="h-10 w-72 rounded-full border px-4 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {/* icono de buscar dentro del input */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <select
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value as any);
          }}
          className="h-10 rounded-full border bg-white px-3 text-sm"
        >
          <option value="Todos">Tipo</option>
          <option value="Cremas">Cremas</option>
          <option value="Geles">Geles</option>
          <option value="Pastillas">Pastillas</option>
        </select>

        <select
          value={brand}
          onChange={(e) => {
            setPage(1);
            setBrand(e.target.value);
          }}
          className="h-10 rounded-full border bg-white px-3 text-sm"
        >
          <option value="Todas">Farmacéutica</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="h-10 rounded-full border bg-white px-3 text-sm"
        >
          <option value="relevance">Ordenar por</option>
          <option value="priceAsc">Precio: menor a mayor</option>
          <option value="priceDesc">Precio: mayor a menor</option>
          <option value="name">Nombre</option>
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Precio máx.</label>
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={1000}
            value={maxPrice}
            onChange={(e) => {
              setPage(1);
              setMaxPrice(parseInt(e.target.value, 10));
            }}
          />
          <span className="w-24 text-sm">{CURRENCY.format(maxPrice)}</span>
        </div>

        {/* Reset */}
        <button
          onClick={resetFilters}
          className="ml-auto inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm hover:bg-gray-50"
          aria-label="Reiniciar filtros"
        >
          <RotateCcw size={16} /> Reiniciar filtros
        </button>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((p) => (
          <article
            key={p.id}
            className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="absolute right-3 top-3 flex gap-1 opacity-80">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            </div>

            <div className="px-4 pt-6">
              <img
                src={p.image}
                alt={p.name}
                className="mx-auto h-28 w-full max-w-[260px] object-contain"
                loading="lazy"
              />
            </div>

            <div className="px-4 pb-4 pt-3">
              <h3 className="line-clamp-1 text-sm font-medium text-gray-800">
                {p.name}
              </h3>
              <div className="mt-1 text-xs text-gray-500">{p.brand}</div>

              <div className="mt-3 flex items-center justify-between">
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline"
                >
                  <Info size={14} /> Leer más
                </a>
                <button
                  aria-label="Guardar"
                  className="rounded-full p-1.5 hover:bg-gray-100"
                >
                  <Heart
                    size={16}
                    className="text-gray-500 group-hover:text-emerald-600"
                  />
                </button>
              </div>

              <div className="mt-2 text-right font-semibold text-gray-800">
                {CURRENCY.format(p.price)}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Paginación */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-50 disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const n = i + 1;
          const active = n === currentPage;
          return (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-8 w-8 rounded border text-sm ${
                active
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "hover:bg-gray-50"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {n}
            </button>
          );
        })}

        <button
          className="flex h-8 w-8 items-center justify-center rounded border hover:bg-gray-50 disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
