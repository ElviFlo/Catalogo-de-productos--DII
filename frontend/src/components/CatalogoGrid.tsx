import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Medicamento } from "../types";

/* Precio “falso” para mostrar en la UI (si tu BD no tiene precio).
   Genera un valor reproducible por producto. */
function priceOf(m: Medicamento) {
  const seed = Array.from((m.id ?? "") + (m.nombre ?? "")).reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = 4000 + (seed % 9000); // 4.000 – 13.999
  return Math.round(base / 100) * 100; // redondeado a centenas
}

const fmtCLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100">{children}</span>;
}

function Card({ m }: { m: Medicamento }) {
  const img = `../assets/products/${m.nombre}.png`;
  const precio = priceOf(m);
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-3 flex flex-col">
      <div className="relative">
        <img src={img} alt={m.nombre} className="rounded-xl w-full h-40 object-cover mb-3 border" />
        {/* corazoncito dummy */}
        <button className="absolute top-2 right-2 text-slate-700/70 hover:text-rose-500" title="Favorito">♥</button>
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex gap-2 items-center">
          <Badge>{m.tipo}</Badge>
          {m.concentracion ? <Badge>{m.concentracion}</Badge> : null}
        </div>
        <h3 className="font-semibold">{m.nombre}</h3>
        <p className="text-slate-500 text-sm line-clamp-2">{m.descripcion}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-semibold">{fmtCLP.format(precio)}</div>
        <span className="text-xs text-slate-500">Farmacéutica: <b>{m.farmaceutica}</b></span>
      </div>
    </div>
  );
}

type PriceBand = "all" | "lt5" | "btw5_10" | "gt10";
type OrderBy = "relevancia" | "precio_asc" | "precio_desc" | "nombre";

export default function CatalogoGrid() {
  const [data, setData] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filtros/orden/paginación
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("");
  const [farm, setFarm] = useState("");
  const [precio, setPrecio] = useState<PriceBand>("all");
  const [orderBy, setOrderBy] = useState<OrderBy>("relevancia");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const meds = await api.get<Medicamento[]>("/medicamentos");
        if (!cancel) setData(meds);
      } catch (e: any) {
        if (!cancel) setError(e?.message ?? "Error al cargar");
        console.error("GET /medicamentos falló:", e);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  // opciones de filtros
  const tipos = useMemo(() => Array.from(new Set(data.map(d => d.tipo))).sort(), [data]);
  const farms = useMemo(() => Array.from(new Set(data.map(d => d.farmaceutica))).sort(), [data]);

  // aplica filtros
  const filtered = data.filter(m => {
    const passTipo = tipo ? m.tipo === tipo : true;
    const passFarm = farm ? m.farmaceutica === farm : true;
    const txt = (m.nombre + " " + m.descripcion).toLowerCase();
    const passQ = q ? txt.includes(q.toLowerCase()) : true;

    const p = priceOf(m);
    const passPrecio =
      precio === "all" ? true :
      precio === "lt5" ? p < 5000 :
      precio === "btw5_10" ? p >= 5000 && p <= 10000 :
      p > 10000;

    return passTipo && passFarm && passQ && passPrecio;
  });

  // ordenamiento
  const ordered = useMemo(() => {
    const arr = [...filtered];
    const qLower = q.toLowerCase();
    switch (orderBy) {
      case "precio_asc":  arr.sort((a,b) => priceOf(a) - priceOf(b)); break;
      case "precio_desc": arr.sort((a,b) => priceOf(b) - priceOf(a)); break;
      case "nombre":      arr.sort((a,b) => a.nombre.localeCompare(b.nombre)); break;
      default:            /* relevancia */ break;
    }
    // Priorizar coincidencias que comienzan con el texto buscado
    if (qLower) {
      arr.sort((a, b) => {
        const aStarts = (a.nombre || "").toLowerCase().startsWith(qLower) ? 0 : 1;
        const bStarts = (b.nombre || "").toLowerCase().startsWith(qLower) ? 0 : 1;
        return aStarts - bStarts;
      });
    }
    return arr;
  }, [filtered, orderBy]);

  // paginación
  const totalPages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const pageClamped = Math.min(page, totalPages);
  const pageData = ordered.slice((pageClamped - 1) * pageSize, pageClamped * pageSize);

  // si cambian filtros/orden, vuelve a página 1
  useEffect(() => { setPage(1); }, [q, tipo, farm, precio, orderBy]);

  return (
    <div className="space-y-6">
      {/* barra de filtros como en la maqueta */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={precio} onChange={e=>setPrecio(e.target.value as PriceBand)} className="border rounded-lg px-3 py-2">
          <option value="all">Precio (todos)</option>
          <option value="lt5">Menos de $5.000</option>
          <option value="btw5_10">$5.000 – $10.000</option>
          <option value="gt10">Más de $10.000</option>
        </select>

        <select value={tipo} onChange={e=>setTipo(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">Tipo (todos)</option>
          {tipos.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={farm} onChange={e=>setFarm(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">Farmacéutica (todas)</option>
          {farms.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select value={orderBy} onChange={e=>setOrderBy(e.target.value as OrderBy)} className="border rounded-lg px-3 py-2">
          <option value="relevancia">Ordenar por…</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre (A–Z)</option>
        </select>

        <button className="border rounded-lg px-3 py-2 text-slate-600" title="Más filtros (demo)">
          Filtros
        </button>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar producto…"
          className="border rounded-lg px-3 py-2 w-72 ml-auto"
        />
      </div>

      {/* estado de carga / error */}
      {loading && <div className="text-slate-600">Cargando catálogo…</div>}
      {!loading && error && (
        <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
          Error cargando <b>/medicamentos</b>: {error}
        </div>
      )}

      {/* grid */}
      {!loading && !error && (
        <>
          <div className="text-slate-600 text-sm">{ordered.length} resultado(s)</div>
          {ordered.length === 0 ? (
            <div className="text-slate-600">No hay productos para los filtros aplicados.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pageData.map(m => <Card key={m.id} m={m} />)}
              </div>

              {/* paginación simple */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p-1))}
                  className="px-3 py-1 rounded-lg border disabled:opacity-50"
                  disabled={pageClamped === 1}
                >‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={"px-3 py-1 rounded-lg border " + (n === pageClamped ? "bg-slate-900 text-white border-slate-900" : "")}
                  >{n}</button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p+1))}
                  className="px-3 py-1 rounded-lg border disabled:opacity-50"
                  disabled={pageClamped === totalPages}
                >›</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}