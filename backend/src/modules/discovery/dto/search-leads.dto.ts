import { IsArray, IsOptional, IsString } from 'class-validator';

export class SearchLeadsDto {
  @IsString()
  city!: string;

  @IsString()
  country!: string;

  @IsString()
  niche!: string;

  @IsOptional()
  @IsArray()
  boundingBox?: [number, number, number, number];
}
