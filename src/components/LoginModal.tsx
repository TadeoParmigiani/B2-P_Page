import { useForm } from "react-hook-form";
import { loginSchema } from "../validations/login";
import { loginUser, clearError } from "../feature/authSlice";
import { useAuth } from "../store/hooks";
import { useAppDispatch } from "../store/hooks";
import { useEffect } from "react";

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
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();
  const loginForm = useForm<LoginFormData>();

  useEffect(() => {
    if (error) {
      loginForm.setError("root", {
        type: "manual",
        message: error,
      });
    }
  }, [error]);

  const onLogin = async (data: LoginFormData) => {
    const { error: joiError } = loginSchema.validate(data, { abortEarly: false });
    
    if (joiError) {
      joiError.details.forEach((detail) => {
        loginForm.setError(detail.path[0] as keyof LoginFormData, {
          type: "manual",
          message: detail.message,
        });
      });
      return;
    }

    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      onClose();
      loginForm.reset();
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    loginForm.reset();
    onClose();
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
        {loginForm.formState.errors.root && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{loginForm.formState.errors.root.message}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-(--gray-700) mb-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              {...loginForm.register("email")}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu@email.com"
              disabled={loading}
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
              {...loginForm.register("password")}
              className="w-full px-4 py-2 border border-(--gray-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="********"
              disabled={loading}
            />
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-(--green-600) text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <p className="text-center text-sm text-(--gray-600)">
            ¿No tenés cuenta?{" "}
            <button
              type="button"
              onClick={() => {
                loginForm.reset();
                dispatch(clearError());
                onSwitchToRegister();
              }}
              className="text-primary hover:underline font-medium"
              disabled={loading}
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