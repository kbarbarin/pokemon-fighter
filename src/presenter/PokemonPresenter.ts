import { withLegendary, withPowerLevel } from "../decorator/pokemonDecorators";
import type { Pokemon, PokemonViewModel } from "../types";

const TYPE_COLORS: Record<string, string> = {
    fire: "bg-orange-100 text-orange-700",
    water: "bg-blue-100 text-blue-700",
    grass: "bg-green-100 text-green-700",
    electric: "bg-yellow-100 text-yellow-700",
    psychic: "bg-pink-100 text-pink-700",
    ice: "bg-cyan-100 text-cyan-700",
    dragon: "bg-indigo-100 text-indigo-700",
    dark: "bg-gray-800 text-gray-100",
    fairy: "bg-pink-100 text-pink-500",
    normal: "bg-gray-100 text-gray-600",
    fighting: "bg-red-100 text-red-700",
    flying: "bg-sky-100 text-sky-700",
    poison: "bg-purple-100 text-purple-700",
    ground: "bg-yellow-200 text-yellow-800",
    rock: "bg-stone-100 text-stone-700",
    bug: "bg-lime-100 text-lime-700",
    ghost: "bg-violet-100 text-violet-700",
    steel: "bg-slate-100 text-slate-600",
  };

export function presentPokemon(pokemon: Pokemon) : PokemonViewModel
{
    const pokemonDecoratted = withLegendary(withPowerLevel(pokemon))

    return {
        ...pokemonDecoratted,
       typeColor: pokemonDecoratted.types.map((t) => TYPE_COLORS[t]),
       formattedId: String(pokemon.id).padStart(3, "0")
    }
}