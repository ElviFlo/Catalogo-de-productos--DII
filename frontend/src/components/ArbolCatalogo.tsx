import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Nodo =
  | { type: "categoria"; id: string; nombre: string; count: number; children: Nodo[] }
  | { type: "producto"; id: string; nombre: string; tipo: string; [k: string]: any };

function NodoView({ nodo }: { nodo: Nodo }) {
  const [open, setOpen] = useState(false);
  if (nodo.type === "producto") {
    return (
      <div style={{ paddingLeft: 20 }}>
        <strong>{nodo.nombre}</strong> <small>({(nodo as any).tipo})</small>
      </div>
    );
  }
  return (
    <div style={{ paddingLeft: 8 }}>
      <button onClick={() => setOpen(!open)}>
        {open ? "▾" : "▸"} <b>{nodo.nombre}</b> <small>[{nodo.count}]</small>
      </button>
      {open && (
        <div style={{ borderLeft: "1px solid #ccc", marginLeft: 6, paddingLeft: 10 }}>
          {nodo.children.map((h) => <NodoView key={h.id} nodo={h} />)}
        </div>
      )}
    </div>
  );
}

export default function ArbolCatalogo() {
  const [data, setData] = useState<Nodo | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Nodo>("/catalogo/arbol")
      .then(setData)
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando catálogo…</div>;
  if (err) return <div style={{ color: "red" }}>Error: {err}</div>;
  if (!data) return <div>Sin datos.</div>;

  return (
    <main style={{ maxWidth: 720, margin: "20px auto", padding: 16 }}>
      <h1>Catálogo de Productos — Composite</h1>
      <NodoView nodo={data} />
    </main>
  );
}