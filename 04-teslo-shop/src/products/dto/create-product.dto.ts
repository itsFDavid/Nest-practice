import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    
    @IsString()
    @MinLength(1)
    @IsOptional()
    description?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    slug?: string; 
    
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @IsIn(["men", "women", "kids", "unisex"])
    gender: string;
}
