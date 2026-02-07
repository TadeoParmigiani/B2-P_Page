import { useState, useEffect } from "react";
import Calendar from "../../components/Calendar";
import BookingModal from "../../components/bookingForm";
import type { BookingFormData } from "../../validations/booking";
import { useAuth, useBookings, useFields, useAppDispatch, useSchedules } from "../../store/hooks";
import { fetchBookings, createBooking } from "../../feature/bookingSlice";
import { fetchFields } from "../../feature/fieldSlice";
import { fetchSchedules } from "../../feature/schedulesSlices";
import LoginModal from "../../components/LoginModal";
import RegisterModal from "../../components/RegisterModal";

const hours = Array.from({ length: 16 }, (_, i) => i + 8);

// Mapeo de días de la semana en español
const DAYS_MAP: { [key: number]: string } = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado"
};

function BookingSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ hour: number; canchaId: string } | null>(null);
  const [sportFilter, setSportFilter] = useState<string>("Fútbol");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { fields, loading: fieldsLoading } = useFields();
  const { schedules, loading: schedulesLoading } = useSchedules();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFields());
    dispatch(fetchBookings());
    dispatch(fetchSchedules());
  }, [dispatch]);

  // Verifica el estado de disponibilidad de un slot
  const getSlotStatus = (hour: number, canchaId: string): "available" | "booked" => {
    const dayOfWeek = DAYS_MAP[selectedDate.getDay()];
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    
    // Buscar el schedule correspondiente filtrando por campo, día y hora
    const schedule = schedules.find(s => {
      const fieldId = typeof s.field === 'string' ? s.field : s.field._id;
      return fieldId === canchaId && 
             s.day === dayOfWeek && 
             s.time === timeStr;
    });
    
    // Si no existe schedule o no está disponible, marcar como no disponible
    if (!schedule || !schedule.available) {
      return "booked";
    }

    // Verificar si existe una reserva para este schedule
    const booking = bookings.find(b => {
      const scheduleId = typeof b.schedule === 'string' ? b.schedule : b.schedule._id;
      return scheduleId === schedule._id;
    });
    
    return booking ? "booked" : "available";
  };

  const onSubmitReserva = async (data: BookingFormData) => {
    if (!selectedSlot || !user) return;
    
    try {
      const dayOfWeek = DAYS_MAP[selectedDate.getDay()];
      const timeStr = `${selectedSlot.hour.toString().padStart(2, '0')}:00`;
      
      // Buscar el schedule que coincida con campo, día y hora seleccionados
      const schedule = schedules.find(s => {
        const fieldId = typeof s.field === 'string' ? s.field : s.field._id;
        return fieldId === selectedSlot.canchaId && 
               s.day === dayOfWeek && 
               s.time === timeStr;
      });

      if (!schedule) {
        alert('No se encontró un horario disponible para esta selección');
        return;
      }

      // Crear la reserva con el schedule._id (ObjectId de MongoDB)
      await dispatch(createBooking({
        field: selectedSlot.canchaId,
        schedule: schedule._id,
        playerName: `${data.nombre} ${data.apellido}`,
        tel: data.tel,
      })).unwrap();

      alert(`¡Reserva confirmada!\n\nNombre: ${data.nombre} ${data.apellido}\nFecha: ${selectedDate.toLocaleDateString("es-AR")}\nHora: ${selectedSlot.hour}:00`);
      
      setSelectedSlot(null);
      // Actualizar datos después de crear la reserva
      dispatch(fetchBookings());
      dispatch(fetchSchedules());
    } catch (error) {
      alert('Error al crear la reserva. Por favor intenta nuevamente.');
    }
  };

  const handleSlotClick = (hour: number, canchaId: string) => {
    const status = getSlotStatus(hour, canchaId);
    if (status === "available") {
      if (!user) {
        setShowAuthAlert(true);
        return;
      }
      setSelectedSlot({ hour, canchaId });
    }
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  if (fieldsLoading || bookingsLoading || schedulesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <section id="reservar" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-(--gray-900) mb-8">
          Elige tu turno
        </h2>

        {/* Controls */}
        <div className="bg-white border border-(--gray-200) rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Sport Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-(--gray-200) rounded-lg hover:bg-(--gray-100) transition-colors"
              >
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
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
                <div className="absolute top-full left-0 mt-1 bg-white border border-(--gray-200) rounded-lg shadow-lg z-10">
                  {["Fútbol"].map((sport) => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => {
                        setSportFilter(sport);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-(--gray-100) transition-colors first:rounded-t-lg last:rounded-b-lg"
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
        <div className="bg-white border border-(--gray-200) rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead>
                <tr className="border-b border-(--gray-200)">
                  <th className="text-left p-4 w-48 bg-(--gray-50)"></th>
                  {hours.map((hour) => (
                    <th key={hour} className="p-2 text-center text-sm font-medium text-(--gray-600) bg-(--gray-50) min-w-12.5">
                      {hour === 24 ? "00" : hour.toString().padStart(2, "0")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.filter(f => f.isActive).map((cancha) => (
                  <tr key={cancha._id} className="border-b border-(--gray-100) last:border-b-0">
                    <td className="p-4">
                      <div className="font-semibold text-(--gray-900)">{cancha.name}</div>
                       <div className="text-xs text-(--gray-600) font-medium mt-0.5">{cancha.type}</div>
                      <div className="text-sm text-(--gray-500)">{cancha.description}</div>
                    </td>
                    {hours.map((hour) => {
                      const status = getSlotStatus(hour, cancha._id);
                      const isSelected = selectedSlot?.hour === hour && selectedSlot?.canchaId === cancha._id;

                      return (
                        <td key={hour} className="p-1">
                          <button
                            type="button"
                            onClick={() => handleSlotClick(hour, cancha._id)}
                            disabled={status !== "available"}
                            className={`w-full h-8 rounded transition-all ${
                              status === "available"
                                ? isSelected
                                  ? "bg-primary ring-2 ring-primary ring-offset-2"
                                  : "hover:bg-(--gray-200) cursor-pointer"
                                : "bg-(--gray-400) cursor-not-allowed"
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
              <div className="w-6 h-4 bg-(--gray-400) rounded"></div>
              <span className="text-sm text-(--gray-600)">No disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-primary rounded"></div>
              <span className="text-sm text-(--gray-600)">Tu reserva</span>
            </div>
          </div>
        </div>

        {/* Auth Alert Modal */}
        {showAuthAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-(--gray-900) mb-2">
                  Inicia sesión para reservar
                </h3>
                <p className="text-(--gray-600) mb-6">
                  Necesitás tener una cuenta para poder realizar una reserva.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setShowAuthAlert(false)}
                    className="flex-1 px-4 py-2 border border-(--gray-300) rounded-lg hover:bg-(--gray-100) transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthAlert(false);
                      setShowLoginModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-(--green-600) transition-colors font-medium"
                  >
                    Iniciar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={handleSwitchToRegister}
        />

        {/* Register Modal */}
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />

        {/* Booking Modal */}
        {selectedSlot && user && (
          <BookingModal
            isOpen={!!selectedSlot}
            selectedSlot={selectedSlot}
            selectedDate={selectedDate}
            fields={fields}
            onClose={() => setSelectedSlot(null)}
            onSubmit={onSubmitReserva}
          />
        )}
      </div>
    </section>
  );
}

export default BookingSection;