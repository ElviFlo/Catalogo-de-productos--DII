import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t bg-emerald-50/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:grid-cols-4">
        <div>
          <p className="text-sm text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
          <div className="mt-4 flex items-center gap-3 text-gray-500">
            <span>🌐</span><span>💬</span><span>📱</span>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-gray-800">Home</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-emerald-700">Booking</a></li>
            <li><a href="#" className="hover:text-emerald-700">Facilities</a></li>
            <li><a href="#" className="hover:text-emerald-700">Location</a></li>
            <li><a href="#" className="hover:text-emerald-700">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-gray-800">Help</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-emerald-700">About us</a></li>
            <li><a href="#" className="hover:text-emerald-700">Help center</a></li>
            <li><a href="#" className="hover:text-emerald-700">Privacy policy</a></li>
            <li><a href="#" className="hover:text-emerald-700">FAQs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-gray-800">Get the app</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-emerald-700">iOS app</a></li>
            <li><a href="#" className="hover:text-emerald-700">Android app</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Elite Store — Todos los derechos reservados.
      </div>
    </footer>
  );
}
