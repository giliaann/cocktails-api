import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cocktail } from './entities/cocktail.entity';
import { Composition } from './entities/composition.entity';
import { Repository } from 'typeorm';

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

  async findAll(): Promise<Cocktail[]> {
    return await this.cocktailRepository.find({
      relations: {compositions: {ingredient: true}}
    })
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
      throw new NotFoundException('Cocktail with ID ${id} not found')
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
