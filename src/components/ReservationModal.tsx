import React, { useState, useEffect } from "react";
import { Sede } from "../types";
import { SEDES } from "../data";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSede: Sede | null;
  onSelectSede: (sede: Sede) => void;
}

export default function ReservationModal({
  isOpen,
  onClose,
  selectedSede,
  onSelectSede,
}: ReservationModalProps) {
  const [name, setName] = useState(() => localStorage.getItem("tp_customer_name") || "");
  const [phone, setPhone] = useState("");
  const [diners, setDiners] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("1:00 PM");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Prefill name if updated in localStorage
      const savedName = localStorage.getItem("tp_customer_name");
      if (savedName) setName(savedName);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSede) {
      alert("Por favor, selecciona una sede para tu reserva 🐟");
      return;
    }

    if (!name.trim() || !phone.trim() || !date || !time) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    // Save name in localStorage for convenience
    localStorage.setItem("tp_customer_name", name.trim());

    // Format WhatsApp message
    let message = `*SOLICITUD DE RESERVA - TERMINAL PESQUERO* ⚓\n\n`;
    message += `👤 *Nombre:* ${name.trim()}\n`;
    message += `📞 *Teléfono:* ${phone.trim()}\n`;
    message += `🏬 *Sede:* ${selectedSede.name}\n`;
    message += `👥 *Comensales:* ${diners} personas\n`;
    message += `📅 *Fecha:* ${date}\n`;
    message += `⏰ *Hora:* ${time}\n`;
    if (notes.trim()) {
      message += `📝 *Notas/Alergias:* ${notes.trim()}\n`;
    }
    message += `------------------------------------------\n`;
    message += `¡Hola! Me gustaría confirmar la disponibilidad de esta mesa en salón. ¡Muchas gracias! 🌊`;

    const encodedText = encodeURIComponent(message);
    const targetUrl = `https://api.whatsapp.com/send?phone=${selectedSede.phone}&text=${encodedText}`;
    window.open(targetUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-t-8 border-[#16448D] relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#16448D] to-[#0b2752] text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[26px]">restaurant_menu</span>
            <div className="text-left">
              <h2 className="font-display font-black text-xl tracking-tight">Reservar Mesa</h2>
              <p className="text-[10px] text-[#B1E3EE] uppercase font-bold tracking-wider">
                Ven a disfrutar en nuestros salones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 rounded-full hover:bg-white/10 text-white hover:text-[#EFA351] font-bold transition-all flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleConfirm} className="p-6 overflow-y-auto space-y-4 text-left font-sans">
          
          {/* Branch Picker */}
          <div>
            <label className="block text-[11px] font-bold text-[#16448D] uppercase tracking-widest mb-1.5">
              Sede de la Reserva:
            </label>
            {selectedSede ? (
              <div className="flex items-center justify-between bg-sky-50 border border-sky-100 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedSede.emoji}</span>
                  <div>
                    <span className="block font-bold text-sm text-[#16448D]">
                      {selectedSede.suffix.toUpperCase()}
                    </span>
                    <span className="block text-[11px] text-gray-500">
                      {selectedSede.address}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Temporarily open sedes list by letting parent handle it
                    alert("Por favor, selecciona otra sede en el selector principal del banner superior de la web.");
                  }}
                  className="text-xs font-bold text-[#2BB7CC] underline"
                >
                  Ver Sedes
                </button>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center justify-between">
                <span>No has seleccionado ninguna sede activa.</span>
                <select
                  onChange={(e) => {
                    const found = SEDES.find(s => s.id === e.target.value);
                    if (found) onSelectSede(found);
                  }}
                  className="bg-white border border-rose-200 text-rose-900 text-xs rounded-lg p-1"
                  required
                >
                  <option value="">Seleccionar Sede...</option>
                  {SEDES.map(s => (
                    <option key={s.id} value={s.id}>{s.suffix}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold text-[#16448D] uppercase tracking-widest mb-1.5">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2BB7CC] font-semibold"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold text-[#16448D] uppercase tracking-widest mb-1.5">
                Celular de Contacto *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 987654321"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2BB7CC] font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Diners */}
            <div>
              <label className="block text-[11px] font-bold text-[#16448D] uppercase tracking-widest mb-1.5">
                N° Personas *
              </label>
              <select
                value={diners}
                onChange={(e) => setDiners(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2BB7CC] font-semibold cursor-pointer"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-[#16448D] uppercase tracking-widest mb-1.5">
                Fecha *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2BB7CC] font-semibold cursor-pointer"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time Slots */}
            <div>
              <label className="block text-[11px] font-bold text-[#16448D] uppercase tracking-widest mb-1.5">
                Hora de Reserva *
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2BB7CC] font-semibold cursor-pointer"
                required
              >
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="1:00 PM">01:00 PM</option>
                <option value="1:30 PM">01:30 PM</option>
                <option value="2:00 PM">02:00 PM</option>
                <option value="2:30 PM">02:30 PM</option>
                <option value="3:00 PM">03:00 PM</option>
                <option value="3:30 PM">03:30 PM</option>
                <option value="4:00 PM">04:00 PM</option>
                <option value="4:30 PM">04:30 PM</option>
              </select>
            </div>
            
            {/* Info note about hours */}
            <div className="flex items-center">
              <p className="text-[10px] text-gray-400 leading-normal italic mt-4">
                * Las reservas se programan en nuestro horario de atención: de 12:00 PM a 4:30 PM.
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-[#16448D] uppercase tracking-widest mb-1.5">
              Notas especiales / Alergias:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Una persona con alergia a los crustáceos, o requerimos una silla de bebé."
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2BB7CC] font-semibold min-h-[60px]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#16448D] hover:bg-[#0b2752] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-base">chat</span>
            Enviar Solicitud de Reserva por WhatsApp
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 py-3 px-6 text-center border-t border-gray-100 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          * La reserva se completará cuando confirmes el envío del chat a la sede
        </div>
      </div>
    </div>
  );
}
