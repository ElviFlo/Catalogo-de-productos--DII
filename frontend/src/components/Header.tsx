import React, { useState } from "react";
import { ShoppingCart, User, Heart, Menu } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded bg-emerald-500 font-semibold text-white">
            E
          </div>
          <span className="text-2xl font-semibold text-gray-800">
            Elite Store
          </span>
        </div>

        {/* Right: Burger + Nav + Icons (sin buscador) */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Burger para mobile */}
          <button
            aria-label="Abrir menú"
            className="rounded p-2 hover:bg-gray-50 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu size={22} />
          </button>

          {/* Nav en desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            <a className="text-gray-700 hover:text-emerald-600" href="#">
              Home
            </a>
            <a className="text-gray-700 hover:text-emerald-600" href="#">
              Categorías
            </a>
            <a className="font-medium text-emerald-700" href="#">
              Catálogo
            </a>
          </nav>

          <button aria-label="Favoritos" className="p-2 hover:text-emerald-600">
            <Heart size={20} />
          </button>
          <button aria-label="Carrito" className="p-2 hover:text-emerald-600">
            <ShoppingCart size={20} />
          </button>
          <button aria-label="Cuenta" className="p-2 hover:text-emerald-600">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Nav desplegable en mobile */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3">
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a
                  className="block rounded px-2 py-2 hover:bg-gray-50"
                  href="#"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="block rounded px-2 py-2 hover:bg-gray-50"
                  href="#"
                >
                  Categorías
                </a>
              </li>
              <li>
                <a
                  className="block rounded px-2 py-2 font-medium text-emerald-700 hover:bg-gray-50"
                  href="#"
                >
                  Catálogo
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
