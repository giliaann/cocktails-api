import * as z from 'zod'
import { CreateIngredientDto, createIngredientSchema } from './create-ingredient.dto';
import { createZodDto } from 'nestjs-zod';


export const updateIngredientSchema = createIngredientSchema.partial();


export class UpdateIngredientDto extends createZodDto(updateIngredientSchema){};

