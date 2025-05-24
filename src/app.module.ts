import { INestApplication, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { GeminiModule } from './gemini/gemini.module';
import { SwaggerConfigModule } from './config/swagger/swagger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    GeminiModule,
  ],
})
export class AppModule {
  static setupSwagger(app: INestApplication): void {
    SwaggerConfigModule.setup(app);
  }
}
