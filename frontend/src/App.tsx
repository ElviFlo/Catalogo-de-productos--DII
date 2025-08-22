import { useState } from "react";
import CatalogoGrid from "./components/CatalogoGrid";
import ArbolCatalogo from "./components/ArbolCatalogo";

export default function App() {
  const [tab, setTab] = useState<"catalogo"|"arbol">("catalogo");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar estilo tienda */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-xl">
            <span className="inline-block w-8 h-8 rounded-lg bg-emerald-600 text-white grid place-items-center">E</span>
            Elite Store
          </div>
          <nav className="hidden md:flex items-center gap-6 text-slate-600">
            <a className="hover:text-slate-900" href="#">Home</a>
            <a className="hover:text-slate-900" href="#">Categorías</a>
            <button onClick={()=>setTab("catalogo")} className={"hover:text-slate-900 " + (tab==="catalogo"?"text-slate-900 font-semibold":"")}>Catálogo</button>
          </nav>

          {/* Tabs a la derecha */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={()=>setTab("catalogo")}
              className={`px-3 py-1.5 rounded-lg border ${tab==="catalogo" ? "bg-slate-900 text-white border-slate-900" : ""}`}
            >
              Catálogo
            </button>
            <button
              onClick={()=>setTab("arbol")}
              className={`px-3 py-1.5 rounded-lg border ${tab==="arbol" ? "bg-slate-900 text-white border-slate-900" : ""}`}
            >
              Árbol (Composite)
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Catálogo de Productos — DII</h1>
        {tab === "catalogo" ? <CatalogoGrid /> : <ArbolCatalogo />}
      </main>

      {/* Footer minimal */}
      <footer className="mt-10 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-600 text-sm">
          <div>
            <div className="font-semibold mb-2">Home</div>
            <ul className="space-y-1"><li>Booking</li><li>Facilities</li><li>Location</li><li>Contact</li></ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Help</div>
            <ul className="space-y-1"><li>About Us</li><li>Help center</li><li>Privacy policy</li><li>FAQs</li></ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Get the app</div>
            <ul className="space-y-1"><li>iOS app</li><li>Android app</li></ul>
          </div>
        </div>
      </footer>
    </div>
  );
}