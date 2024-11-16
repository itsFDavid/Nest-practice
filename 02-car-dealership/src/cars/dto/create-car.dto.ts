import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateCarDto{

    @IsString()
    @MinLength(1)
    readonly brand: string;

    @IsString()
    @MinLength(1)
    readonly model: string;
    
    @IsNumber()
    readonly year: number;

    
}