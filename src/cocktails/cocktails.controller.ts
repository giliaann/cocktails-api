import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto, createCocktailSchema } from './dto/create-cocktail.dto';
import { UpdateCocktailDto, updateCocktailSchema } from './dto/update-cocktail.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { GetCocktailsFilterDto, getCocktailsFilterSchema } from './dto/get-cocktails-filter.dto';

@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCocktailSchema)) createCocktailDto: CreateCocktailDto) {
    return this.cocktailsService.create(createCocktailDto);
  }

  @Get()
  findAll(@Query(new ZodValidationPipe(getCocktailsFilterSchema)) filterDto: GetCocktailsFilterDto) {
    return this.cocktailsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cocktailsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body(new ZodValidationPipe(updateCocktailSchema)) updateCocktailDto: UpdateCocktailDto
  ) {
    return this.cocktailsService.update(+id, updateCocktailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cocktailsService.remove(+id);
  }
}
