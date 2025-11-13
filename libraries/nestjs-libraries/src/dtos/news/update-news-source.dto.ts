import { IsString, IsOptional, IsInt, IsUrl, IsBoolean, Min } from 'class-validator';

export class UpdateNewsSourceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(60000) // Minimum 1 minute
  fetchInterval?: number;
}
