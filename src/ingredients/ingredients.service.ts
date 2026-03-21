import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IngredientsService {

  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>
  ) {}

  async create(createIngredientDto: CreateIngredientDto): Promise <Ingredient> {
    const ingredient = this.ingredientRepository.create(createIngredientDto);
    return await this.ingredientRepository.save(ingredient);
  }

  async findAll(): Promise <Ingredient[]> {
    return await this.ingredientRepository.find()
  }

  async findOne(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({where: {id}});

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return ingredient;
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.preload({
      id,
      ...updateIngredientDto
    })

    if(!ingredient){
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return await this.ingredientRepository.save(ingredient);
  }

  async remove(id: number): Promise <void> {
    
    const ingredient = await this.findOne(id);
    await this.ingredientRepository.remove(ingredient)
  }
}
