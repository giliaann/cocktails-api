import * as z from 'zod'
import { createCompositionSchema } from './create-composition.dto'
import { createZodDto } from 'nestjs-zod';


export const updateCompositionSchema = createCompositionSchema
.omit({ingredient_id: true})
.partial();

export class UpdateCompositionDto extends createZodDto(updateCompositionSchema){};

