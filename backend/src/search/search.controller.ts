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
    name: 'isMine',
    description: "Search only in user's files and folders",
    type: Boolean,
    required: false,
  })
  async search(
    @Query('query') query: string,
    @GetCurrentUserId() userId: number,
    @Query('folderId') folderId?: number,
    @Query('isMine') isMine?: boolean,
  ) {
    return this.searchService.search(query, userId, folderId, isMine);
  }
}
