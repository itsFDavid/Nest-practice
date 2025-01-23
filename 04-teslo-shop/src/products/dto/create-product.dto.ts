import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        example: 'Nike Air Max 90',
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: 100,
        description: 'Product price',
        nullable: true,
        minimum: 0,
        default: 0,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    
    @ApiProperty({
        example: 'Shoes',
        description: 'Product description',
        nullable: true,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 100,
        description: 'Product stock',
        nullable: true,
        minimum: 0,
        default: 0,
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: 'nike_air_max_90',
        description: 'Product slug',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    slug?: string; 
    
    @ApiProperty({
        example: ['28', '29', '30'],
        description: 'Product sizes',
        nullable: true,
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product gender',
        nullable: true,
    })
    @IsIn(["men", "women", "kids", "unisex"])
    gender: string;

    @ApiProperty({
        example: ['nike', 'shoes', 'air max'],
        description: 'Product tags',
        nullable: true,
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        description: 'Product images',
        nullable: true,
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
