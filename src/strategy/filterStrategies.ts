import type { PokemonType, PokemonViewModel } from "../types";

export interface FilterStrategy {
  apply(pokemons: PokemonViewModel[]): PokemonViewModel[];
}

export class ByNameStrategy implements FilterStrategy {
  query: string;
  constructor(query: string) { this.query = query; }
  apply(pokemons: PokemonViewModel[]) {
    return pokemons.filter((p) =>
      p.name.toLowerCase().includes(this.query.toLowerCase())
    );
  }
}

export class ByTypeStrategy implements FilterStrategy {
  type: string;
  constructor(type: string) { this.type = type; }
  apply(pokemons: PokemonViewModel[]) {
    if (this.type === "all") return pokemons;
    return pokemons.filter((p) => p.types.includes(this.type as PokemonType));
  }
}

type StatKey = "hp" | "attack" | "speed";

export class BySortStrategy implements FilterStrategy {
  criterion: "none" | "name" | StatKey;
  constructor(criterion: "none" | "name" | StatKey) { this.criterion = criterion; }
  apply(pokemons: PokemonViewModel[]) {
    if (this.criterion === "none") return pokemons;
    if (this.criterion === "name") {
      return [...pokemons].sort((a, b) => a.name.localeCompare(b.name));
    }
    const key = this.criterion;
    return [...pokemons].sort((a, b) => b.stats[key] - a.stats[key]);
  }
}
