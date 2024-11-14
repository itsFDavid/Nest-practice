import { Move, PokeapiResponse } from "../interfaces/pokeapi-responses.interface";
import { HttpAdapter, PokeApiAdapter, PokeApiFetchAdapter } from "../api/pokeApi.Adapter";

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
        private readonly http: HttpAdapter,
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
        const data = await this.http.get<PokeapiResponse>(`https://pokeapi.co/api/v2/pokemon/4`);
        console.log(data.moves);
        return data.moves;
    }
}
const pokeApiAxios = new PokeApiAdapter();
const pokeApiFetch = new PokeApiFetchAdapter();

export const charmander = new Pokemon(1, "Charmander", pokeApiFetch);
console.log(charmander);
charmander.scream();
console.log(charmander.getMoves());
