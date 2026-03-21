import * as z from 'zod'
import { CocktailCategory } from '../entities/cocktail.entity'
import { Composition } from '../entities/composition.entity'
import { createCompositionSchema } from './create-composition.dto'
import { createZodDto } from 'nestjs-zod';


export const createCocktailSchema = z.object({
    name: z.string()
    .min(1, {message: 'Cocktail name is obligatory'})
    .max(255, {message: 'Cocktail name max lenght it 255'}),

    category: z.enum(CocktailCategory)
    .optional()
    .default(CocktailCategory.OTHER),

    description: z.string()
    .max(25000, {message: 'Cocktail description max length is 25000'})
    .nullable()
    .optional(),

    instruction: z.string()
    .max(50000, {message: 'Cocktail instruction max length is 50000'})
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

    image_url: z.url({message: 'Invalid Url'})
    .max(500)
    .nullable()
    .optional(),
    
    compositions: z.array(createCompositionSchema)
    .optional()
});

export class CreateCocktailDto extends createZodDto(createCocktailSchema){};


