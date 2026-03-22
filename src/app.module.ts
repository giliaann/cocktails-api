import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CocktailsModule } from './cocktails/cocktails.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'cocktails_database',
      autoLoadEntities: true,
      synchronize: true
    }),
    CocktailsModule, 
    IngredientsModule,
    SeederModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
