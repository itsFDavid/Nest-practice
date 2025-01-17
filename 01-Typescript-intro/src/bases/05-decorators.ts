class NewPokemon{
    constructor(
        public readonly id: number,
        public name: string,
    ){}

    scream(){
        return `NO QUIEROOO  !!!`;
    }
    speak(){
        return `No quiero hablar`;
    }
}

const MyDecorator = () =>{
    return (target: Function) =>{
        // console.log('MyDecorator', target);
        return NewPokemon;
    }
}


@MyDecorator()
export class Pokemon{
    constructor(
        public readonly id: number,
        public name: string,
    ){}

    scream(){
        return `${this.name.toUpperCase()}!!!`;
    }
    speak(){
        return `${this.name} ${this.id}`;
    }
}

export const charmander = new Pokemon(4, 'Charmander');
console.log(charmander.scream());
console.log(charmander.speak());