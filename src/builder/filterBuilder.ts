import type { PokemonType, PokemonViewModel } from "../types";

export interface PokemonFilterCriteria {
  type1: PokemonType | "";
  type2: PokemonType | "";
  name: string;
  powerLevelMin: string;
  powerLevelMax: string;
  moves: string;
  evolution: string;
  abilities: string;
}

export const EMPTY_FILTER_CRITERIA: PokemonFilterCriteria = {
  type1: "",
  type2: "",
  name: "",
  powerLevelMin: "",
  powerLevelMax: "",
  moves: "",
  evolution: "",
  abilities: "",
};

export class PokemonFilterBuilder {
  private criteria: PokemonFilterCriteria = { ...EMPTY_FILTER_CRITERIA };

  withType1(type: PokemonType | ""): this {
    this.criteria.type1 = type;
    return this;
  }

  withType2(type: PokemonType | ""): this {
    this.criteria.type2 = type;
    return this;
  }

  withName(name: string): this {
    this.criteria.name = name;
    return this;
  }

  withPowerLevelMin(min: string): this {
    this.criteria.powerLevelMin = min;
    return this;
  }

  withPowerLevelMax(max: string): this {
    this.criteria.powerLevelMax = max;
    return this;
  }

  withMoves(moves: string): this {
    this.criteria.moves = moves;
    return this;
  }

  withEvolution(evolution: string): this {
    this.criteria.evolution = evolution;
    return this;
  }

  withAbilities(abilities: string): this {
    this.criteria.abilities = abilities;
    return this;
  }

  reset(): this {
    this.criteria = { ...EMPTY_FILTER_CRITERIA };
    return this;
  }

  build(): PokemonFilterCriteria {
    return { ...this.criteria };
  }
}

export function applyPokemonFilter(
  pokemons: PokemonViewModel[],
  criteria: PokemonFilterCriteria
): PokemonViewModel[] {
  const nameQuery = criteria.name.trim().toLowerCase();
  const movesQuery = criteria.moves.trim().toLowerCase();
  const evolutionQuery = criteria.evolution.trim().toLowerCase();
  const abilitiesQuery = criteria.abilities.trim().toLowerCase();
  const minPower = criteria.powerLevelMin !== "" ? Number(criteria.powerLevelMin) : null;
  const maxPower = criteria.powerLevelMax !== "" ? Number(criteria.powerLevelMax) : null;

  return pokemons.filter((pokemon) => {
    if (criteria.type1 && pokemon.types[0] !== criteria.type1) return false;
    if (criteria.type2 && pokemon.types[1] !== criteria.type2) return false;

    if (nameQuery && !pokemon.name.toLowerCase().includes(nameQuery)) return false;

    const power = pokemon.powerLevel;
    if (minPower !== null && !Number.isNaN(minPower) && (power === undefined || power < minPower)) {
      return false;
    }
    if (maxPower !== null && !Number.isNaN(maxPower) && (power === undefined || power > maxPower)) {
      return false;
    }

    if (movesQuery) {
      const hasMove = pokemon.moves?.some((m) => m.toLowerCase().includes(movesQuery));
      if (!hasMove) return false;
    }

    if (evolutionQuery && !pokemon.evolution.toLowerCase().includes(evolutionQuery)) {
      return false;
    }

    if (abilitiesQuery) {
      const hasAbility = pokemon.abilities?.some((a) =>
        a.toLowerCase().includes(abilitiesQuery)
      );
      if (!hasAbility) return false;
    }

    return true;
  });
}
