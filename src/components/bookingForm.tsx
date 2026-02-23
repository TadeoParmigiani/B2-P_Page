import { useForm } from "react-hook-form";
import { bookingValidationSchema, type BookingFormData } from "../validations/booking";
import type { Field } from "../feature/fieldSlice";

interface BookingModalProps {
  isOpen: boolean;
  selectedSlot: { hour: number; canchaId: string };
  selectedDate: Date;
  fields: Field[];
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
}

function BookingModal({ isOpen, selectedSlot, selectedDate, fields, onClose, onSubmit }: BookingModalProps) {
  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<BookingFormData>();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: BookingFormData) => {
    
    const { error } = bookingValidationSchema.validate(data, { abortEarly: false });

    if (error) {
    
      error.details.forEach((detail) => {
        const field = detail.path[0] as keyof BookingFormData;
        setError(field, {
          type: 'manual',
          message: detail.message,
        });
      });
      return;
    }

    onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        {/* Header del modal */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-(--gray-900)">Confirmar Reserva</h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-(--gray-100) rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-(--gray-500)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-(--gray-100) rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-(--gray-500)">Cancha:</span>
            <span className="font-medium text-(--gray-900)">
              {fields.find((c) => c._id === selectedSlot.canchaId)?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--gray-500)">Fecha:</span>
            <span className="font-medium text-(--gray-900)">
              {selectedDate.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--gray-500)">Hora:</span>
            <span className="font-medium text-(--gray-900)">
              {selectedSlot.hour}:00 - {selectedSlot.hour + 1}:00
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--gray-500)">Precio:</span>
            <span className="font-medium text-(--gray-900)">
              ${fields.find((c) => c._id === selectedSlot.canchaId)?.pricePerHour}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="reserva-nombre" className="block text-sm font-medium text-(--gray-700) mb-1">
              Nombre
            </label>
            <input
              id="reserva-nombre"
              type="text"
              {...register("nombre")}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tu nombre"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="reserva-apellido" className="block text-sm font-medium text-(--gray-700) mb-1">
              Apellido
            </label>
            <input
              id="reserva-apellido"
              type="text"
              {...register("apellido")}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tu apellido"
            />
            {errors.apellido && (
              <p className="mt-1 text-sm text-red-500">{errors.apellido.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="reserva-tel" className="block text-sm font-medium text-(--gray-700) mb-1">
              Teléfono
            </label>
            <input
              id="reserva-tel"
              type="tel"
              {...register("tel")}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: 1123456789"
            />
            {errors.tel && (
              <p className="mt-1 text-sm text-red-500">{errors.tel.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-(--gray-300) rounded-lg hover:bg-(--gray-100) transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-(--green-600) transition-colors font-medium cursor-pointer"
            >
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;