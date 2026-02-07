import Joi from 'joi';

export const bookingValidationSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder los 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras',
      'any.required': 'El nombre es requerido',
    }),

  apellido: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder los 50 caracteres',
      'string.pattern.base': 'El apellido solo puede contener letras',
      'any.required': 'El apellido es requerido',
    }),

  tel: Joi.string()
    .pattern(/^[0-9]{8,15}$/)
    .required()
    .messages({
      'string.empty': 'El teléfono es requerido',
      'string.pattern.base': 'Ingresa un número de teléfono válido (8-15 dígitos)',
      'any.required': 'El teléfono es requerido',
    }),
});

export type BookingFormData = {
  nombre: string;
  apellido: string;
  tel: string;
};