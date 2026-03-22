import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cocktail } from "src/cocktails/entities/cocktail.entity";
import { Composition } from "src/cocktails/entities/composition.entity";
import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { SeederService } from "./seeder.service";

@Module({
    imports: [TypeOrmModule.forFeature([Ingredient, Cocktail, Composition])],
    providers: [SeederService],
})
export class SeederModule {}