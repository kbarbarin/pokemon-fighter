import type { Pokemon } from "../types";

export interface PokemonRepository {
  getAllPokemon(): Promise<Pokemon[]>;
}
