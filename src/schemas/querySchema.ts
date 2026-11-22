import { z } from 'zod';

export const querySchema = z.object({
  searchTerm: z
    .string()
    .trim()
    .refine((val) => val.length === 0 || val.length >= 2, {
      message: 'Ingresá al menos 2 caracteres para buscar.'
    }),
  selectedCurrency: z.enum(['usd', 'eur', 'ars'], {
    message: 'Seleccioná una moneda válida (USD, EUR o ARS).'
  })
});

export type QueryFormData = z.infer<typeof querySchema>;
