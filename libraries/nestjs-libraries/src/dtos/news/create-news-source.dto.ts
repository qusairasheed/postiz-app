import { IsString, IsOptional, IsInt, IsUrl, Min } from 'class-validator';

export class CreateNewsSourceDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(60000) // Minimum 1 minute
  fetchInterval?: number;
}
