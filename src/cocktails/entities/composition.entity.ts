import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import {Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from 'typeorm'
import { Cocktail } from './cocktail.entity';

@Entity('compositions')
export class Composition {
    
    @PrimaryGeneratedColumn()
    cocktail_id: number;

    @PrimaryGeneratedColumn()
    ingredient_id: number;

    @Column({type: 'varchar', length: 255})
    measure: string;

    @ManyToOne(()=> Ingredient, (ingredient) => ingredient.compositions, {onDelete: 'RESTRICT'})
    @JoinColumn({name: 'ingredient_id'})
    ingredient: Ingredient

    @ManyToOne(()=> Cocktail, (cocktail) => cocktail.compositions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'cocktail_id'})
    cocktail: Cocktail


}