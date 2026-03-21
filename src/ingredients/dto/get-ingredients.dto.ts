import * as z from 'zod'
import { createZodDto } from 'nestjs-zod'
import { IngredientCategory } from '../entities/ingredient.entity'
import { SortOrder } from 'src/common/enums/sort-order.enum'

export const getIngredientsFilterSchema = z.object({
    //filters
    search: z
        .string()
        .optional(),
    
    category: z
        .enum(IngredientCategory)
        .optional(),
        
    alcoholic: z.coerce
        .boolean()
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

export class GetIngredientsFilterDto extends createZodDto(getIngredientsFilterSchema) {}