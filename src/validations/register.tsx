import Joi from 'joi';

export const registerSchema = Joi.object({
  nombre: Joi.string()
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'any.required': 'El nombre es requerido'
    }),
  apellido: Joi.string()
    .required()
    .messages({
      'string.empty': 'El apellido es requerido',
      'any.required': 'El apellido es requerido'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'El email es requerido',
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener mínimo 6 caracteres',
      'any.required': 'La contraseña es requerida'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'string.empty': 'Confirmá tu contraseña',
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'Confirmá tu contraseña'
    })
});
