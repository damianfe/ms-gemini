import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriviaQuestionDto {
  @ApiProperty({
    description: 'Topic for trivia question generation',
    example: 'science',
    required: true,
    type: String,
    minLength: 3,
    maxLength: 50,
    examples: ['history', 'pop culture', 'technology'],
    enum: ['science', 'history', 'sports', 'movies', 'geography'],
  })
  @IsString()
  @IsNotEmpty()
  topic: string;
}
