import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { Composition } from './entities/composition.entity';
import { Repository } from 'typeorm';
import { GetCocktailsFilterDto } from './dto/get-cocktails-filter.dto';

@Injectable()
export class CocktailsService {

  constructor(
    @InjectRepository(Cocktail)
    private readonly cocktailRepository: Repository<Cocktail>,

    @InjectRepository(Composition)
    private readonly compositionRepository: Repository<Composition>,

  ) {}


  async create(createCocktailDto: CreateCocktailDto): Promise<Cocktail> {
    
    const { compositions, ...cocktailData} = createCocktailDto

    const cocktail = this.cocktailRepository.create(cocktailData)

    if (compositions && compositions.length > 0) {
      cocktail.compositions = compositions.map((comp) => this.compositionRepository.create(comp));
    }

    return await this.cocktailRepository.save(cocktail);

  }

  async findAll(filterDto: GetCocktailsFilterDto) {
    const {search, category, alcoholic, ingredientName, sortBy, sortOrder, page, limit} = filterDto;

    const query = this.cocktailRepository.createQueryBuilder('cocktail')
      .leftJoinAndSelect('cocktail.compositions', 'composition')
      .leftJoinAndSelect('composition.ingredient', 'ingredient');

    if (search){
      query.andWhere('cocktail.name ILIKE :search', { search: `%${search}%`});
    }

    if (category){
      query.andWhere('cocktail.category = :category', {category})
    }

    if (alcoholic !== undefined){
      query.andWhere('cocktail.alcoholic = :alcoholic', {alcoholic})
    }

    if(ingredientName) {
      query.andWhere((qb) => {
        const subQuery = qb.subQuery()
          .select('c.id')
          .from('cocktails', 'c')
          .innerJoin('compositions', 'comp', 'comp.cocktail_id = c.id')
          .innerJoin('ingredients', 'ing', 'comp.ingredient_id = ing.id')
          .where('ing.name ILIKE :ingredientName')
          .getQuery()

       return `cocktail.id IN ${subQuery}`;
      }).setParameter('ingredientName', `%${ingredientName}%`);
    }

    if(sortBy){
      query.orderBy(`cocktail.${sortBy}`, sortOrder);
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
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }
    }
  }

  async findOne(id: number): Promise<Cocktail> {

    const cocktail = await this.cocktailRepository.findOne({
      where: {id},
      relations: {compositions: {ingredient: true}}
    })

    if (!cocktail){
      throw new NotFoundException(`Cocktail with ID ${id} not found`)
    }

    return cocktail;
  }

  async update(id: number, updateCocktailDto: UpdateCocktailDto): Promise<Cocktail> {
    const {compositions, ...cocktailData} = updateCocktailDto;

    const cocktail = await this.cocktailRepository.preload({
      id,
      ...cocktailData
    });

    if (!cocktail){
      throw new NotFoundException(`Cocktail with ID ${id} not found`)
    }

    if (compositions) {
      await this.compositionRepository.delete({cocktail_id: id})
      cocktail.compositions = compositions.map((comp => this.compositionRepository.create(comp)))
    }

    return await this.cocktailRepository.save(cocktail);
  }

  async remove(id: number): Promise<void> {
    const cocktail = await this.findOne(id);
    await this.cocktailRepository.remove(cocktail)
  }
}
