import * as z from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CocktailCategory } from '../entities/cocktail.entity';
import { SortOrder } from 'src/common/enums/sort-order.enum';

export const getCocktailsFilterSchema = z.object({
    //filters
    search: z
        .string()
        .optional(),

    category: z
        .enum(CocktailCategory)
        .optional(),
    
    alcoholic: z.coerce
        .boolean()
        .optional(),
    
    ingredientName: z
        .string()
        .optional(),

    //sort
    sortBy: z.enum(['name', 'percentage', 'created_at'])
        .optional()
        .default('name'),

    sortOrder: z.enum(SortOrder)
        .optional()
        .default(SortOrder.ASC),

    //pagination
    page: z.coerce
        .number()
        .min(1)
        .optional()
        .default(1),

    limit: z.coerce
        .number()
        .min(1)
        .max(100)
        .optional()
        .default(10)
});

export class GetCocktailsFilterDto extends createZodDto(getCocktailsFilterSchema) {}