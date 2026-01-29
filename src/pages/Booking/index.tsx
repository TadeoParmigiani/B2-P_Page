import { useState } from "react";
import { useForm } from "react-hook-form";
import Calendar from "../../components/Calendar";

interface ReservaFormData {
  nombre: string;
  apellido: string;
}

interface Cancha {
  id: number;
  name: string;
  type: string;
  description: string;
}

interface TimeSlot {
  hour: number;
  canchaId: number;
  status: "available" | "booked" | "user-booked";
  duration?: number;
}

const canchas: Cancha[] = [
  { id: 1, name: "Cancha 1 F11", type: "F11", description: "Césped sintético | Con iluminación" },
  { id: 2, name: "Cancha 3 F7", type: "F7", description: "Césped sintético | Con iluminación" },
  { id: 3, name: "Cancha 4 F7", type: "F7", description: "Césped sintético | Con iluminación" },
  { id: 4, name: "Cancha 6 *FUTSAL*", type: "FUTSAL", description: "Cemento | Con iluminación" },
  { id: 5, name: "Cancha 7 F5", type: "F5", description: "Césped sintético | Con iluminación" },
  { id: 6, name: "Cancha 8 F5", type: "F5", description: "Césped sintético | Con iluminación" },
  { id: 7, name: "Cancha 9 F5", type: "F5", description: "Césped sintético | Con iluminación" },
  { id: 8, name: "Cancha 10 F5", type: "F5", description: "Césped sintético | Con iluminación" },
  { id: 9, name: "Cancha 12 F5", type: "F5", description: "Césped sintético | Con iluminación" },
  { id: 10, name: "Cancha 13 F5", type: "F5", description: "Césped sintético | Con iluminación" },
];

const hours = Array.from({ length: 17 }, (_, i) => i + 8);

const initialBookedSlots: TimeSlot[] = [
  { hour: 9, canchaId: 1, status: "booked", duration: 2 },
  { hour: 8, canchaId: 2, status: "booked", duration: 1 },
  { hour: 8, canchaId: 3, status: "booked", duration: 1 },
  { hour: 17, canchaId: 2, status: "booked", duration: 2 },
  { hour: 19, canchaId: 1, status: "booked", duration: 5 },
  { hour: 19, canchaId: 2, status: "booked", duration: 4 },
  { hour: 20, canchaId: 3, status: "booked", duration: 3 },
  { hour: 19, canchaId: 4, status: "booked", duration: 3 },
  { hour: 19, canchaId: 5, status: "booked", duration: 2 },
  { hour: 19, canchaId: 6, status: "booked", duration: 2 },
  { hour: 19, canchaId: 7, status: "booked", duration: 2 },
  { hour: 19, canchaId: 8, status: "booked", duration: 3 },
  { hour: 19, canchaId: 9, status: "booked", duration: 4 },
  { hour: 19, canchaId: 10, status: "booked", duration: 4 },
  { hour: 24, canchaId: 1, status: "booked", duration: 1 },
  { hour: 24, canchaId: 2, status: "booked", duration: 1 },
  { hour: 24, canchaId: 3, status: "booked", duration: 1 },
];

function BookingSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedSlots] = useState<TimeSlot[]>(initialBookedSlots);
  const [selectedSlot, setSelectedSlot] = useState<{ hour: number; canchaId: number } | null>(null);
  const [sportFilter, setSportFilter] = useState<string>("Fútbol");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const reservaForm = useForm<ReservaFormData>();

  const onSubmitReserva = (data: ReservaFormData) => {
    if (!selectedSlot) return;
    const cancha = canchas.find((c) => c.id === selectedSlot.canchaId);
    alert(`Reserva confirmada!\n\nNombre: ${data.nombre} ${data.apellido}\nCancha: ${cancha?.name}\nFecha: ${selectedDate.toLocaleDateString("es-AR")}\nHora: ${selectedSlot.hour}:00 - ${selectedSlot.hour + 1}:00`);
    setSelectedSlot(null);
    reservaForm.reset();
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    reservaForm.reset();
  };

  const getSlotStatus = (hour: number, canchaId: number) => {
    const slot = bookedSlots.find(
      (s) => s.canchaId === canchaId && hour >= s.hour && hour < s.hour + (s.duration || 1)
    );
    return slot?.status || "available";
  };

  const getSlotDuration = (hour: number, canchaId: number) => {
    const slot = bookedSlots.find((s) => s.canchaId === canchaId && s.hour === hour);
    return slot?.duration || 0;
  };

  const isSlotStart = (hour: number, canchaId: number) => {
    return bookedSlots.some((s) => s.canchaId === canchaId && s.hour === hour);
  };

  const handleSlotClick = (hour: number, canchaId: number) => {
    const status = getSlotStatus(hour, canchaId);
    if (status === "available") {
      setSelectedSlot({ hour, canchaId });
    }
  };

  return (
    <section id="reservar" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--gray-900)] mb-8">
          Elige tu turno
        </h2>

        {/* Controls */}
        <div className="bg-white border border-[var(--gray-200)] rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Sport Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-[var(--gray-200)] rounded-lg hover:bg-[var(--gray-100)] transition-colors"
              >
                <svg className="w-5 h-5 text-[var(--primary)]" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2C12 2 12 6 8 8C4 10 2 12 2 12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 22C12 22 12 18 16 16C20 14 22 12 22 12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 12C6 12 8 8 8 8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="font-medium">{sportFilter}</span>
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[var(--gray-200)] rounded-lg shadow-lg z-10">
                  {["Fútbol", "Futsal", "Fútbol 5", "Fútbol 7", "Fútbol 11"].map((sport) => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => {
                        setSportFilter(sport);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-[var(--gray-100)] transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Calendar Component */}
            <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </div>
        </div>

        {/* Booking Grid */}
        <div className="bg-white border border-[var(--gray-200)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[var(--gray-200)]">
                  <th className="text-left p-4 w-48 bg-[var(--gray-50)]"></th>
                  {hours.map((hour) => (
                    <th key={hour} className="p-2 text-center text-sm font-medium text-[var(--gray-600)] bg-[var(--gray-50)] min-w-[50px]">
                      {hour === 24 ? "00" : hour.toString().padStart(2, "0")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {canchas.map((cancha) => (
                  <tr key={cancha.id} className="border-b border-[var(--gray-100)] last:border-b-0">
                    <td className="p-4">
                      <div className="font-semibold text-[var(--gray-900)]">{cancha.name}</div>
                      <div className="text-sm text-[var(--gray-500)]">{cancha.description}</div>
                    </td>
                    {hours.map((hour) => {
                      const status = getSlotStatus(hour, cancha.id);
                      const duration = getSlotDuration(hour, cancha.id);
                      const isStart = isSlotStart(hour, cancha.id);
                      const isSelected = selectedSlot?.hour === hour && selectedSlot?.canchaId === cancha.id;

                      if (status !== "available" && !isStart) {
                        return null;
                      }

                      return (
                        <td
                          key={hour}
                          colSpan={status !== "available" && isStart ? duration : 1}
                          className="p-1"
                        >
                          <button
                            type="button"
                            onClick={() => handleSlotClick(hour, cancha.id)}
                            disabled={status !== "available"}
                            className={`w-full h-8 rounded transition-all ${
                              status === "available"
                                ? isSelected
                                  ? "bg-[var(--primary)] ring-2 ring-[var(--primary)] ring-offset-2"
                                  : "hover:bg-[var(--gray-200)] cursor-pointer"
                                : status === "booked"
                                ? "bg-[var(--gray-400)] cursor-not-allowed"
                                : "bg-[var(--primary)] cursor-not-allowed"
                            }`}
                            aria-label={`${cancha.name} a las ${hour}:00 - ${status === "available" ? "Disponible" : "No disponible"}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-blue-800">
              Las reservas se pueden realizar hasta con <strong>seis días de antelación</strong>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-[var(--gray-400)] rounded"></div>
              <span className="text-sm text-[var(--gray-600)]">No disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-[var(--primary)] rounded"></div>
              <span className="text-sm text-[var(--gray-600)]">Tu reserva</span>
            </div>
          </div>
        </div>

        {/* Selected Slot Modal - Formulario de Reserva */}
        {selectedSlot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              {/* Header del modal */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--gray-900)]">Confirmar Reserva</h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Datos de la reserva (pre-seteados) */}
              <div className="bg-[var(--gray-100)] rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--gray-500)]">Cancha:</span>
                  <span className="font-medium text-[var(--gray-900)]">
                    {canchas.find((c) => c.id === selectedSlot.canchaId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--gray-500)]">Fecha:</span>
                  <span className="font-medium text-[var(--gray-900)]">
                    {selectedDate.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--gray-500)]">Hora:</span>
                  <span className="font-medium text-[var(--gray-900)]">
                    {selectedSlot.hour}:00 - {selectedSlot.hour + 1}:00
                  </span>
                </div>
              </div>

              {/* Formulario para nombre y apellido */}
              <form onSubmit={reservaForm.handleSubmit(onSubmitReserva)} className="space-y-4">
                <div>
                  <label htmlFor="reserva-nombre" className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                    Nombre
                  </label>
                  <input
                    id="reserva-nombre"
                    type="text"
                    {...reservaForm.register("nombre", { required: "El nombre es requerido" })}
                    className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                  {reservaForm.formState.errors.nombre && (
                    <p className="mt-1 text-sm text-red-500">{reservaForm.formState.errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="reserva-apellido" className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                    Apellido
                  </label>
                  <input
                    id="reserva-apellido"
                    type="text"
                    {...reservaForm.register("apellido", { required: "El apellido es requerido" })}
                    className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Tu apellido"
                  />
                  {reservaForm.formState.errors.apellido && (
                    <p className="mt-1 text-sm text-red-500">{reservaForm.formState.errors.apellido.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-[var(--gray-300)] rounded-lg hover:bg-[var(--gray-100)] transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--green-600)] transition-colors font-medium"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BookingSection;