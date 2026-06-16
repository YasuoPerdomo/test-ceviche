import React from "react";
import { Sede } from "../../types";
import { SEDES } from "../../data";

interface SedesSectionProps {
  selectedSede: Sede | null;
  onSelectSede: (sede: Sede) => void;
}

export default function SedesSection({ selectedSede, onSelectSede }: SedesSectionProps) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-12">
        <span className="text-xs text-[#2BB7CC] font-black uppercase tracking-widest">Encuéntranos</span>
        <h2 className="font-display text-3xl font-extrabold text-[#16448D] mt-1">Sedes Terminal Pesquero</h2>
        <p className="text-xs text-gray-400 mt-1">Haz clic en tu local favorito para empezar a ordenar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
        {SEDES.map(s => {
          const isActive = selectedSede?.id === s.id;
          return (
            <div
              key={s.id}
              onClick={() => onSelectSede(s)}
              className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                isActive
                  ? "border-[#2BB7CC] bg-[#B1E3EE]/10 shadow-md ring-2 ring-[#2BB7CC]/10"
                  : "border-gray-100 hover:border-[#B1E3EE] hover:bg-white bg-white hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl bg-gray-50 p-2.5 rounded-xl block">{s.emoji}</span>
                {isActive && (
                  <span className="bg-[#16448D] text-white text-[9px] uppercase font-bold py-1 px-2.5 rounded-full">
                    Sede Activa
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-[#16448D] uppercase tracking-tight">
                {s.suffix}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-normal font-medium">
                {s.address}
              </p>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-[#2BB7CC]">
                <span>Establecer como sede</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
