import * as z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createCompositionSchema = z.object({
    ingredient_id: z.number()
    .int()
    .positive({message: "Ingredient ID must be a positive integer"}),

    measure: z.string()
    .min(1, {message: "Measure is obligatory"})
    .max(255),
});

export class CreateCompostionDto extends createZodDto(createCompositionSchema){};
