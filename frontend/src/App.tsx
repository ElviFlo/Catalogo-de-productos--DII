import React from "react";
import Header from "./components/Header";
import Catalog from "./components/Catalog";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Catalog />
      </main>
      <Footer />
    </div>
  );
}
