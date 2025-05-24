import { Module, DynamicModule } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common/interfaces';

@Module({})
export class SwaggerConfigModule {
  static setup(app: INestApplication): DynamicModule {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('Endpoints disponibles en la API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    return {
      module: SwaggerConfigModule,
      providers: [
        {
          provide: 'SWAGGER_CONFIG',
          useValue: document,
        },
      ],
      exports: ['SWAGGER_CONFIG'],
    };
  }
}
