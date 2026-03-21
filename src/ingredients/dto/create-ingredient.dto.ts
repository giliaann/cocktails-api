import * as z from 'zod'; 
import { IngredientCategory } from '../entities/ingredient.entity';
import { createZodDto } from 'nestjs-zod';

export const createIngredientSchema = z.object({
    name: z.string()
    .min(1, {message: 'Invalid ingredient name'})
    .max(255),

    category: z.enum(IngredientCategory)
    .optional()
    .default(IngredientCategory.OTHER),

    description: z.string()
    .max(25000)
    .nullable()
    .optional(),

    alcoholic: z.boolean()
    .nullable()
    .optional(),

    percentage: z.number()
    .int()
    .min(0)
    .max(100)
    .nullable()
    .optional(),

    image_url: z.url({message: "Invalid URL"})
    .nullable()
    .optional()
    
});

export class CreateIngredientDto extends createZodDto(createIngredientSchema){};
