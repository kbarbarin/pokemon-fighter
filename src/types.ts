import type { DecoratedPokemon } from "./decorator/pokemonDecorators";

export type PokemonType =
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy"
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel";

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: PokemonType[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  moves: string[];
  abilities: string[];
  evolution: string;
}

export interface RawPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: { type: { name: PokemonType } }[];
  stats: { base_stat: number }[];
  moves: { move: { name: string } }[];
  abilities: { ability: { name: string } }[];
  species: { name: string };
}

export interface PokemonViewModel extends DecoratedPokemon{
  typeColor: string[];
  formattedId: string;
}

export interface TeamSlot {
  pokemon: Pokemon;
}
