import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: 'a1b2c3d4-1234-5678-1234-567812345678',
        description: 'This is the unique identifier for the product',
        format: 'uuid',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Nike Air Max 90',
        description: 'This is the title of the product',
        uniqueItems: true,
    })
    @Column('text', 
        { unique: true }
    )
    title: string;

    @ApiProperty({
        example: 100,
        description: 'This is the price of the product',
        format: 'float',
    })
    @Column('float',
        {default: 0}
    )
    price: number;

    @ApiProperty({
        example: 'This is a description of the product',
        description: 'This is the description of the product',
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 'nike_air_max_90',
        description: 'This is the slug of the product',
        uniqueItems: true,
    })
    @Column('text', {unique: true})
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'This is the stock of the product',
        format: 'int32',
    })
    @Column('int', {default: 0})
    stock: number;

    @ApiProperty({
        example: ['XL', 'XS', 'L'],
        description: 'This is the sizes of the product',
        type: 'array',
        items: {
            type: 'string'
        }
    })
    @Column('text', {array: true})
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'This is the gender of the product',
        format: 'string',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['nike', 'shoes', 'sneakers'],
        description: 'This is the tags of the product',
        type: 'array',
        items: {
            type: 'string'
        }
    })
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[];

    // this is a one-to-many relationship with the ProductImage entity
    @OneToMany(
        ()=> ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true} // this will load the user data when the product is loaded
    )
    user: User;


    // this is a lifecycle hook that will be called before the entity is inserted into the database
    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title;
        } 
        // convert the slug to lowercase and replace spaces with underscores
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    // this is a lifecycle hook that will be called before the entity is updated in the database
    @BeforeUpdate()
    checkSlugUpdate(){
        // convert the slug to lowercase and replace spaces with underscores
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
