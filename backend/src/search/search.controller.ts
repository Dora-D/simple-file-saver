import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from '@app/search/search.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentUserId } from '@app/common/decprators/get-current-user-id.decorator';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search files and folders by name' })
  @ApiOkResponse({ description: 'Search results' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({
    name: 'query',
    description: 'Search query',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'folderId',
    description: 'ID of the folder to search in (optional)',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'searchIn',
    description: "Search only in user's files and folders",
    type: String,
    enum: ['own', 'available'],
    required: false,
  })
  async search(
    @Query('query') query: string,
    @GetCurrentUserId() userId: number,
    @Query('searchIn') searchIn: 'own' | 'available',
    @Query('folderId') folderId?: number,
  ) {
    return await this.searchService.search(query, userId, searchIn, folderId);
  }
}
