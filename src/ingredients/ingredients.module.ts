import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Ingredient } from './entities/ingredient.entity';
import { Composition } from 'src/cocktails/entities/composition.entity';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [TypeOrmModule.forFeature([Ingredient, Composition])],
})
export class IngredientsModule {}
