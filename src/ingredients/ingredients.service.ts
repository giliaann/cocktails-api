import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { GetIngredientsFilterDto } from './dto/get-ingredients.dto';
import { Composition } from 'src/cocktails/entities/composition.entity';

@Injectable()
export class IngredientsService {

  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Composition)
    private readonly compositionRepository: Repository<Composition>
  ) {}

  async create(createIngredientDto: CreateIngredientDto): Promise <Ingredient> {
    const ingredient = this.ingredientRepository.create(createIngredientDto);
    return await this.ingredientRepository.save(ingredient);
  }

  async findAll(filterDto: GetIngredientsFilterDto){

    const {search, category, alcoholic, sortBy, sortOrder, page, limit} = filterDto;

    const query = this.ingredientRepository.createQueryBuilder('ingredient');

    if(search){
      query.andWhere('ingredient.name ILIKE :search', {search: `%${search}%`});
    }

    if(category){
      query.andWhere('ingredient.category = :category', {category});
    }

    if (alcoholic!==undefined){
      query.andWhere('ingredient.alcoholic = :alcoholic', {alcoholic});
    }

    if(sortBy){
      query.orderBy(`ingredient.${sortBy}`, sortOrder);
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      data: items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total/limit),
        currentPage: page,
      }
    }
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

    if(!ingredient){
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    const compositions = await this.compositionRepository.find({where: {ingredient_id: id}})

    if(compositions.length != 0){
      throw new BadRequestException(`Cannot remove element, ingredient is used in ${compositions.length} compositions`)
    }

  await this.ingredientRepository.remove(ingredient)
    
  }
}
