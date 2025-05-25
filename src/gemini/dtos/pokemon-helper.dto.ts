import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PokemonHelperDto {
  @ApiProperty({
    description: 'Nombre del Pokémon para obtener información',
    example: 'pikachu',
    required: true,
    type: String,
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z-]+$',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
