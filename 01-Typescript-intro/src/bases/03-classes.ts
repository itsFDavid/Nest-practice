import axios from "axios";
import { Move, PokeapiResponse } from "../interfaces/pokeapi-responses.interface";

export class Pokemon{
    // public id: number;
    // public name: string;

    // constructor(id: number , name: string){
    //     this.id = id;
    //     this.name = name;
    //     console.log("Pokemon creado");
    // }
    constructor(
        public readonly id: number,
        public name: string,
    ){}

    public getImageUrl(): string{
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png`;
    }

    public scream(){
        console.log(`${this.name.toUpperCase()}!!!`);
        this.speak();
    }
    private speak(){
        console.log(`I'm ${this.name}`);
    }

    async getMoves(): Promise<Move[]>{
        //const moves = 0;
        const { data } = await axios.get<PokeapiResponse>('https://pokeapi.co/api/v2/pokemon/4');
        console.log(data.moves);

        return data.moves;
    }
}

export const charmander = new Pokemon(1, "Charmander");
console.log(charmander);  
charmander.scream();
console.log(charmander.getMoves());

// charmander.id = 2;
// charmander.name = "Pikachu";