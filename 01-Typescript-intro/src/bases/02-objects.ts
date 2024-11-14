export const pokemonsIds= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


interface Pokemon {
    id: number;
    name: string;
    age?: number;
}

export const pikachu: Pokemon ={
    id: 1,
    name: 'Pikachu'
}
export const charmander: Pokemon ={
    id: 2,
    name: 'Charmander'
}
export const bulbasaur: Pokemon ={
    id: 3,
    name: 'Bulbasaur'
}

export const pokemons: Pokemon[] = []

pokemons.push(pikachu);
pokemons.push(charmander);

console.log(pokemons);
