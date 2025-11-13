import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum NewsItemStatus {
  PENDING = 'PENDING',
  ENHANCED = 'ENHANCED',
  SCHEDULED = 'SCHEDULED',
  POSTED = 'POSTED',
  SKIPPED = 'SKIPPED',
  ERROR = 'ERROR',
}

export class GetNewsItemsDto {
  @IsOptional()
  @IsEnum(NewsItemStatus)
  status?: NewsItemStatus;

  @IsOptional()
  @IsString()
  sourceId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
