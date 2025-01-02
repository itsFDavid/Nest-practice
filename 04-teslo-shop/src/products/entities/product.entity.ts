import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', 
        { unique: true }
    )
    title: string;

    @Column('float',
        {default: 0}
    )
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {unique: true})
    slug: string;

    @Column('int', {default: 0})
    stock: number;

    @Column('text', {array: true})
    sizes: string[];

    @Column('text')
    gender: string;

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

    @BeforeUpdate()
    checkSlugUpdate(){
        // convert the slug to lowercase and replace spaces with underscores
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
