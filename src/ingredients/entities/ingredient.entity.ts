import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm'
import { Composition } from 'src/cocktails/entities/composition.entity';

export enum IngredientCategory {
    SYRUP = 'Syrup',
    FRUIT = 'Fruit',
    LIQUOR = 'Liquor',
    OTHER = 'Other'
}


@Entity('ingredients')
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column({type: 'enum', enum: IngredientCategory, default: IngredientCategory.OTHER})
    category: IngredientCategory

    @Column({type: 'varchar', length: 25000, nullable: true})
    description: string | null;
    
    @Column({type: 'boolean', nullable: true})
    alcoholic: boolean | null;

    @Column({type: 'int', nullable: true})
    percentage: number | null;
    
    @Column({type: 'varchar', length: 500, nullable: true})
    image_url: string | null;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(()=>Composition, (composition) => composition.ingredient)
    compositions: Composition[]
}
