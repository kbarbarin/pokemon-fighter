import type { PokemonViewModel } from "../types";

interface PokemonCardProps {
  pokemon: PokemonViewModel;
  onAddToPlayer: (pokemon: PokemonViewModel) => void;
  onAddToOpponent: (pokemon: PokemonViewModel) => void;
  isInPlayerTeam: boolean;
  isInOpponentTeam: boolean;
}

export function PokemonCard({
  pokemon,
  onAddToPlayer,
  onAddToOpponent,
  isInPlayerTeam,
  isInOpponentTeam,
}: PokemonCardProps) {
  return (
    <div className={`bg-white border rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow ${pokemon.isLegendary ? "border-yellow-400 ring-1 ring-yellow-300" : "border-gray-200"}`}>
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className="w-24 h-24 object-contain"
      />
      <p className="font-semibold capitalize text-gray-800 flex items-center gap-1">
        #{pokemon.formattedId} {pokemon.name}
        {pokemon.isLegendary && <span title="Légendaire">★</span>}
      </p>
      {pokemon.powerLevel !== undefined && (
        <p className="text-xs text-gray-400">Puissance : {pokemon.powerLevel}</p>
      )}
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map((type, index) => (
          <span
            key={type}
            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${pokemon.typeColor[index] ?? "bg-gray-100 text-gray-600"}`}
          >
            {type}
          </span>
        ))}
      </div>
      <div className="mt-1 w-full flex flex-col gap-1.5">
        <button
          onClick={() => onAddToPlayer(pokemon)}
          disabled={isInPlayerTeam}
          className="text-xs py-1.5 rounded-lg font-medium transition-colors
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            bg-red-500 text-white hover:bg-red-600 cursor-pointer"
        >
          {isInPlayerTeam ? "Dans mon équipe" : "Ajouter à mon équipe"}
        </button>
        <button
          onClick={() => onAddToOpponent(pokemon)}
          disabled={isInOpponentTeam}
          className="text-xs py-1.5 rounded-lg font-medium transition-colors
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        >
          {isInOpponentTeam ? "Chez l'adversaire" : "Ajouter à l'adversaire"}
        </button>
      </div>
    </div>
  );
}
