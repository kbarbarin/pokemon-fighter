import type { Pokemon, PokemonType, RawPokemon } from "../types";

export class PokemonFactory {
  static create(raw: RawPokemon): Pokemon {
    return {
      id: raw.id,
      name: raw.name,
      sprite: raw.sprites.front_default,
      types: raw.types.map((t: { type: { name: string } }) => t.type.name as PokemonType),
      stats: {
        hp: raw.stats[0].base_stat,
        attack: raw.stats[1].base_stat,
        defense: raw.stats[2].base_stat,
        speed: raw.stats[5].base_stat,
      },
      moves: raw.moves?.slice(0, 12).map((m) => m.move.name) ?? [],
      abilities: raw.abilities?.map((a) => a.ability.name) ?? [],
      evolution: raw.species?.name ?? "",
    };
  }
}
