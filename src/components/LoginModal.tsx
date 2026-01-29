import { useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const loginForm = useForm<LoginFormData>();

  const onLogin = (data: LoginFormData) => {
    console.log("Login:", data);
    alert(`Iniciando sesión con: ${data.email}`);
    onClose();
    loginForm.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-(--gray-900)">Iniciar sesión</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-(--gray-100) rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-(--gray-500)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-(--gray-700) mb-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              {...loginForm.register("email", { required: "El email es requerido" })}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu@email.com"
            />
            {loginForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-(--gray-700) mb-1">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              {...loginForm.register("password", { required: "La contraseña es requerida" })}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="********"
            />
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-(--green-600) text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>

          <p className="text-center text-sm text-(--gray-600)">
            ¿No tenés cuenta?{" "}
            <button
              type="button"
              onClick={() => {
                loginForm.reset();
                onSwitchToRegister();
              }}
              className="text-primary hover:underline font-medium"
            >
              Registrate
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;