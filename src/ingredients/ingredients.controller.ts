import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto, createIngredientSchema } from './dto/create-ingredient.dto';
import { UpdateIngredientDto, updateIngredientSchema } from './dto/update-ingredient.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createIngredientSchema)) createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body(new ZodValidationPipe(updateIngredientSchema)) updateIngredientDto: UpdateIngredientDto
  ) {
    return this.ingredientsService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(+id);
  }
}
