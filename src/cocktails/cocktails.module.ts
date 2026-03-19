import { Module } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Cocktail } from './entities/cocktail.entity';
import { Composition } from './entities/composition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cocktail, Composition])],
  controllers: [CocktailsController],
  providers: [CocktailsService],
})

export class CocktailsModule {}