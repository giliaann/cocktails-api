import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cocktail } from "src/cocktails/entities/cocktail.entity";
import { Composition } from "src/cocktails/entities/composition.entity";
import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { Repository } from 'typeorm';

import * as z from 'zod';

import ingredientsData from './seeds/ingredients.json';
import cocktailsData from './seeds/cocktails.json';
import { createCocktailSchema } from "src/cocktails/dto/create-cocktail.dto";
import { createIngredientSchema } from "src/ingredients/dto/create-ingredient.dto";


@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    async seed() {

        //checking whether database was used before
        const sequenceCheck = await this.ingredientRepository.query("SELECT is_called FROM ingredients_id_seq")

        const isCalled = sequenceCheck[0]?.is_called;

        if (isCalled){
            this.logger.error(`Seeding impossible - database is not clean`)
            throw new Error('Database has traces of old records ')
        }

        this.logger.log('Seedind process started');
        try {
            await this.seedIngredients();
            await this.seedCocktails();
            this.logger.log('Seeding process completed sucessfully');
        } catch (error) {
            this.logger.error('Seeding process failed');
            throw error;
        }

    }

    constructor (
        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>,
        @InjectRepository(Cocktail)
        private readonly cocktailRepository: Repository<Cocktail>,
        @InjectRepository(Composition)
        private readonly compositionRepository: Repository<Composition>,
    ) {}

    private async seedIngredients(){
        try{
            const validatedIngredients = z.array(createIngredientSchema).parse(ingredientsData);

            const ingredientsToSave = this.ingredientRepository.create(validatedIngredients);

            await this.ingredientRepository.save(ingredientsToSave);

            this.logger.log(`Added ${validatedIngredients.length} coktails to database`);
        } catch(error) {
                this.logger.error('Seeding ingredients failed, check seed files', error);
                throw error
            }
    }

    private async seedCocktails(){
        try {
        
            const validatedCocktails = z.array(createCocktailSchema).parse(cocktailsData);

            for(const cocktailItem of validatedCocktails) {
                const {compositions, ...cocktailData} = cocktailItem;

                const cocktail = this.cocktailRepository.create(cocktailData);

                if(compositions && compositions.length > 0) {
                    cocktail.compositions = compositions.map((comp) => this.compositionRepository.create(comp));
                }

                await this.cocktailRepository.save(cocktail);
            }

            this.logger.log(`Added ${validatedCocktails.length} coktails to database`)
            
        } catch(error) {
                this.logger.error('Seeding cocktails failed, check seed files', error);
                throw error
            }
    }
    
    

}

