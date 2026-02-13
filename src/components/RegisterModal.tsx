import { useForm } from "react-hook-form";
import { registerSchema } from "../validations/register";
import { registerUser, clearError } from "../feature/authSlice";
import { useAuth } from "../store/hooks";
import { useAppDispatch } from "../store/hooks";
import { useEffect } from "react";

interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();
  const registerForm = useForm<RegisterFormData>();

  useEffect(() => {
    if (error) {
      registerForm.setError("root", {
        type: "manual",
        message: error,
      });
    }
  }, [error]);

  const onRegister = async (data: RegisterFormData) => {
    console.log("📝 Datos del formulario:", data); // DEBUG
    
    // Validar con Joi
    const { error: joiError } = registerSchema.validate(data, { abortEarly: false });
    
    if (joiError) {
      console.log("❌ Errores de validación:", joiError.details); // DEBUG
      joiError.details.forEach((detail) => {
        registerForm.setError(detail.path[0] as keyof RegisterFormData, {
          type: "manual",
          message: detail.message,
        });
      });
      return;
    }

    const payload = {
      name: data.nombre,
      lastName: data.apellido,
      email: data.email,
      password: data.password,
    };
    
    console.log("🚀 Payload a enviar:", payload); // DEBUG
    console.log("🔑 Password existe?", data.password !== undefined); // DEBUG

    // Registrar usuario
    const result = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(result)) {
      onClose();
      registerForm.reset();
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    registerForm.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-(--gray-900)">Crear cuenta</h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-(--gray-100) rounded-lg transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5 text-(--gray-500)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error general */}
        {registerForm.formState.errors.root && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{registerForm.formState.errors.root.message}</p>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="register-nombre" className="block text-sm font-medium text-(--gray-700) mb-1">
                Nombre
              </label>
              <input
                id="register-nombre"
                type="text"
                {...registerForm.register("nombre")}
                className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Juan"
                disabled={loading}
              />
              {registerForm.formState.errors.nombre && (
                <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.nombre.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="register-apellido" className="block text-sm font-medium text-(--gray-700) mb-1">
                Apellido
              </label>
              <input
                id="register-apellido"
                type="text"
                {...registerForm.register("apellido")}
                className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Pérez"
                disabled={loading}
              />
              {registerForm.formState.errors.apellido && (
                <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.apellido.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-(--gray-700) mb-1">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              {...registerForm.register("email")}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu@email.com"
              disabled={loading}
            />
            {registerForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-(--gray-700) mb-1">
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              {...registerForm.register("password")}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="********"
              disabled={loading}
            />
            {registerForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="register-confirm" className="block text-sm font-medium text-(--gray-700) mb-1">
              Confirmar contraseña
            </label>
            <input
              id="register-confirm"
              type="password"
              {...registerForm.register("confirmPassword")}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="********"
              disabled={loading}
            />
            {registerForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-(--green-600) text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="text-center text-sm text-(--gray-600)">
            ¿Ya tenés cuenta?{" "}
            <button
              type="button"
              onClick={() => {
                registerForm.reset();
                dispatch(clearError());
                onSwitchToLogin();
              }}
              className="text-primary hover:underline font-medium"
              disabled={loading}
            >
              Iniciá sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;