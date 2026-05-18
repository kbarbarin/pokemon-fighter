import type { RefObject } from "react";
import type { PokemonViewModel } from "../types";
import { PokemonCard } from "./PokemonCard";

interface PokemonListProps {
  pokemons: PokemonViewModel[];
  playerTeamIds: number[];
  opponentTeamIds: number[];
  onAddToPlayer: (pokemon: PokemonViewModel) => void;
  onAddToOpponent: (pokemon: PokemonViewModel) => void;
  sentinelRef?: RefObject<HTMLDivElement | null>;
  hasMore?: boolean;
}

export function PokemonList({
  pokemons,
  playerTeamIds,
  opponentTeamIds,
  onAddToPlayer,
  onAddToOpponent,
  sentinelRef,
  hasMore,
}: PokemonListProps) {
  if (pokemons.length === 0) {
    return (
      <p className="text-gray-400 text-sm mt-8 text-center">Aucun Pokémon trouvé.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemons.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            onAddToPlayer={onAddToPlayer}
            onAddToOpponent={onAddToOpponent}
            isInPlayerTeam={playerTeamIds.includes(p.id)}
            isInOpponentTeam={opponentTeamIds.includes(p.id)}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="h-12 flex items-center justify-center mt-4">
          <span className="text-xs text-gray-400 animate-pulse">Chargement…</span>
        </div>
      )}
    </>
  );
}
