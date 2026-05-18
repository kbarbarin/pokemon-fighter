import AppConfig from "../config";
import { PokemonFactory } from "../factory/PokemonFactory";

export class PokeAPIRepository {
    baseUrl = AppConfig.API_URL
    limit = AppConfig.POKEMON_LIMIT

    async getAllPokemon()
    {
        const res = await fetch(`${this.baseUrl}/pokemon?limit=${this.limit}`);
        const data = await res.json();
    
        const details = await Promise.all(
            data.results.map((entry: { url: string }) =>
            fetch(entry.url).then((r) => r.json())
            )
        );
    
        return details.map(PokemonFactory.create);   
    }

    async getPokemon(id: number)
    {
        const res = await fetch(`${this.baseUrl}/pokemon/${id}`);
        const data = await res.json();
    
        return PokemonFactory.create(data);   
    }
}