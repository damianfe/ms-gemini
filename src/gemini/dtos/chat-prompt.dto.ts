import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatPromptDto {
  @ApiProperty({
    description: 'Mensaje de texto para la conversación con Gemini',
    example: '¿Cómo evoluciona Pikachu?',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({
    description: 'Archivos adjuntos (opcionales)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];

  @ApiProperty({
    description: 'ID único de la conversación (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID()
  chatId: string;
}
