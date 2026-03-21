import * as z from 'zod';
import { createCocktailSchema } from './create-cocktail.dto';
import { createZodDto } from 'nestjs-zod';

export const updateCocktailSchema = createCocktailSchema.partial();

export class UpdateCocktailDto extends createZodDto(updateCocktailSchema){};

