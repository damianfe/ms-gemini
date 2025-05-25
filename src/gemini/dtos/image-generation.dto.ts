import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageGenerationDto {
  @ApiProperty({
    description: 'Prompt descriptivo para la generación de imágenes',
    example: 'Un paisaje futurista con ciudades flotantes al atardecer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({
    description:
      'Imágenes de referencia para estilo o modificación (máx. 5 archivos)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    maxItems: 5,
  })
  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];
}
