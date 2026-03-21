import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm'
import { Composition } from './composition.entity';


export enum CocktailCategory {
    TROPICAL = 'Tropical',
    CLASSIC = 'Classic',
    OTHER = 'Other'
}

@Entity('cocktails')
export class Cocktail {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column({type: 'enum', enum: CocktailCategory, default: CocktailCategory.OTHER})
    category: CocktailCategory

    @Column({type: 'varchar', length: 25000, nullable: true})
    description: string | null;

    @Column({type: 'varchar', length: 50000, nullable: true})
    instruction: string | null;
    
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

    @OneToMany(()=>Composition, (composition) => composition.cocktail, {cascade: true})
    compositions: Composition[]
}
