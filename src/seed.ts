import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SeederService } from "./seeder/seeder.service";

async function bootstrap() {
    const logger = new Logger('SeedScript');
    try {
        const app = await NestFactory.createApplicationContext(AppModule);

        const seederService = app.get(SeederService);

        await seederService.seed()

        await app.close()

        process.exit(0)

    } catch (error) {
        logger.error('Seeder failed', error)
        process.exit(1)
    }
}

bootstrap();