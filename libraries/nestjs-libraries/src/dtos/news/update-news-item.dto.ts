import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum NewsItemStatus {
  PENDING = 'PENDING',
  ENHANCED = 'ENHANCED',
  SCHEDULED = 'SCHEDULED',
  POSTED = 'POSTED',
  SKIPPED = 'SKIPPED',
  ERROR = 'ERROR',
}

export class UpdateNewsItemDto {
  @IsOptional()
  @IsString()
  enhancedContent?: string;

  @IsOptional()
  @IsEnum(NewsItemStatus)
  status?: NewsItemStatus;
}
