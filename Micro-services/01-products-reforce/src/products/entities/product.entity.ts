interface updateWithOptions{
  name?: string;
  description?: string;
  price?: number;
}

export class Product {

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number
  ){}


  // TODO: updateWith

  updatewith({name, description, price}: updateWithOptions): Product {
    if(name) this.name = name;
    if(description) this.description = description;
    if(price) this.price = price;
    return this;
  }
}
