import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { ChatPromptDto } from './dtos/chat-prompt.dto';
import { GenerateContentResponse } from '@google/genai';
import { ImageGenerationDto } from './dtos/image-generation.dto';
import { PokemonHelperDto } from './dtos/pokemon-helper.dto';
import { TriviaQuestionDto } from './dtos/trivia-question.dto';

@ApiTags('Gemini') // Agrupa en Swagger UI
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStreamResponse(
    res: Response,
    stream: AsyncGenerator<GenerateContentResponse, any, any>,
  ) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    let resultText = '';
    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      res.write(piece);
    }

    res.end();
    return resultText;
  }

  @Post('basic-prompt')
  @ApiOperation({ summary: 'Send a basic prompt to Gemini' })
  @ApiBody({ type: BasicPromptDto })
  basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'Send a basic prompt with streaming response and optional files',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: BasicPromptDto })
  async basicPromptStream(
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    basicPromptDto.files = files;
    const stream = await this.geminiService.basicPromptStream(basicPromptDto);
    void this.outputStreamResponse(res, stream);
  }

  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'Start a streaming chat session with optional files',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ChatPromptDto })
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    chatPromptDto.files = files;
    const stream = await this.geminiService.chatStream(chatPromptDto);
    const data = await this.outputStreamResponse(res, stream);

    const geminiMessage = {
      role: 'model',
      parts: [{ text: data }],
    };
    const userMessage = {
      role: 'user',
      parts: [{ text: chatPromptDto.prompt }],
    };

    this.geminiService.saveMessage(chatPromptDto.chatId, userMessage);
    this.geminiService.saveMessage(chatPromptDto.chatId, geminiMessage);
  }

  @Get('chat-history/:chatId')
  @ApiOperation({ summary: 'Get chat history by chat ID' })
  @ApiParam({ name: 'chatId', type: String })
  getChatHistory(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHistory(chatId).map((message) => ({
      role: message.role,
      parts: message.parts?.map((part) => part.text).join(''),
    }));
  }

  @Post('image-generation')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'Generate an image based on input and optional files',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImageGenerationDto })
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    imageGenerationDto.files = files;
    const { imageUrl, text } =
      await this.geminiService.imageGeneration(imageGenerationDto);
    return { imageUrl, text };
  }

  @Post('pokemon-helper')
  @ApiOperation({
    summary: 'Get assistance related to Pokémon based on prompt',
  })
  @ApiBody({ type: PokemonHelperDto })
  getPokemonHelp(@Body() pokemonHelperDto: PokemonHelperDto) {
    return this.geminiService.getPokemonHelp(pokemonHelperDto);
  }

  @Get('trivia/question/:topic')
  @ApiOperation({ summary: 'Get a trivia question for a specific topic' })
  @ApiParam({ name: 'topic', type: String })
  getTriviaQuestion(@Param() triviaQuestionDto: TriviaQuestionDto) {
    return this.geminiService.getTriviaQuestion(triviaQuestionDto);
  }
}
