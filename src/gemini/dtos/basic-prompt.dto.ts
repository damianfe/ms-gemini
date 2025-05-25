// src/gemini/dtos/basic-prompt.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class BasicPromptDto {
  @ApiProperty({
    description: 'El texto del prompt para Gemini',
    example: 'Explica cómo funciona NestJS',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description: 'Archivos adjuntos (opcional)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];
}
