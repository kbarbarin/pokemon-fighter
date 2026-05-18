import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PokemonViewModel } from "./types";
import AppConfig from "./config";
import { teamEvents } from "./observer/teamEvents";
import { BySortStrategy } from "./strategy/filterStrategies";
import { AddPokemonCommand, RemovePokemonCommand, CommandHistory } from "./command/teamCommands";
import { applyPokemonFilter, EMPTY_FILTER_CRITERIA } from "./builder/filterBuilder";
import type { PokemonFilterCriteria } from "./builder/filterBuilder";
import { QueryFilterBuilder } from "./components/QueryFilterBuilder";
import { PokemonList } from "./components/PokemonList";
import { TeamPanel } from "./components/TeamPanel";
import { Notification } from "./components/Notification";
import { PokeAPIRepository } from "./repository/apiRepository";
import type { PokemonRepository } from "./repository/PokemonRepository";
import { CachedPokemonProxy } from "./proxy/CachedPokemonProxy";
import { presentPokemon } from "./presenter/PokemonPresenter";
import { TeamPanelFactory } from "./factory/TeamPanelFactory";
import { PokemonPaginator } from "./iterator/PokemonPaginator";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

const PAGE_SIZE = 20;

const playerPanelConfig = TeamPanelFactory.create("player");
const opponentPanelConfig = TeamPanelFactory.create("opponent");

function App() {
  const [pokemons, setPokemons] = useState<PokemonViewModel[]>([]);
  const [playerTeam, setPlayerTeam] = useState<PokemonViewModel[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<PokemonViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState<PokemonFilterCriteria>(EMPTY_FILTER_CRITERIA);
  const [sortBy, setSortBy] = useState<"none" | "name" | "hp" | "attack" | "speed">("none");
  const [canUndoPlayer, setCanUndoPlayer] = useState(false);
  const [canUndoOpponent, setCanUndoOpponent] = useState(false);
  const [displayed, setDisplayed] = useState<PokemonViewModel[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const playerTeamRef = useRef<PokemonViewModel[]>([]);
  const opponentTeamRef = useRef<PokemonViewModel[]>([]);
  const playerHistory = useRef(new CommandHistory());
  const opponentHistory = useRef(new CommandHistory());
  const repositoryRef = useRef<PokemonRepository>(
    new CachedPokemonProxy(new PokeAPIRepository())
  );
  const paginatorRef = useRef<PokemonPaginator | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { playerTeamRef.current = playerTeam; }, [playerTeam]);
  useEffect(() => { opponentTeamRef.current = opponentTeam; }, [opponentTeam]);

  useEffect(() => {
    setLoading(true);
    repositoryRef.current.getAllPokemon().then((data) => {
      setPokemons(data.map((p) => presentPokemon(p)));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () => new BySortStrategy(sortBy).apply(applyPokemonFilter(pokemons, filterCriteria)),
    [pokemons, filterCriteria, sortBy]
  );

  useEffect(() => {
    paginatorRef.current = new PokemonPaginator(filtered, PAGE_SIZE);
    const firstPage = paginatorRef.current.next();
    setDisplayed(firstPage);
    setHasMore(paginatorRef.current.hasNext());
  }, [filtered]);

  const loadMore = useCallback(() => {
    const paginator = paginatorRef.current;
    if (!paginator || !paginator.hasNext()) return;
    const nextPage = paginator.next();
    setDisplayed((prev) => [...prev, ...nextPage]);
    setHasMore(paginator.hasNext());
  }, []);

  useInfiniteScroll(sentinelRef, loadMore, hasMore && !loading);

  function handleAddToPlayer(pokemon: PokemonViewModel) {
    if (playerTeam.length >= AppConfig.MAX_TEAM_SIZE) {
      teamEvents.emit<string>("team:full", "Mon équipe est complète !");
      return;
    }
    if (playerTeam.find((p) => p.id === pokemon.id)) return;
    const cmd = new AddPokemonCommand(pokemon, () => playerTeamRef.current, setPlayerTeam);
    playerHistory.current.execute(cmd);
    setCanUndoPlayer(playerHistory.current.canUndo());
  }

  function handleAddToOpponent(pokemon: PokemonViewModel) {
    if (opponentTeam.length >= AppConfig.MAX_TEAM_SIZE) {
      teamEvents.emit<string>("team:full", "L'équipe adverse est complète !");
      return;
    }
    if (opponentTeam.find((p) => p.id === pokemon.id)) return;
    const cmd = new AddPokemonCommand(pokemon, () => opponentTeamRef.current, setOpponentTeam);
    opponentHistory.current.execute(cmd);
    setCanUndoOpponent(opponentHistory.current.canUndo());
  }

  function handleRemovePlayer(id: number) {
    const cmd = new RemovePokemonCommand(id, () => playerTeamRef.current, setPlayerTeam);
    playerHistory.current.execute(cmd);
    setCanUndoPlayer(playerHistory.current.canUndo());
  }

  function handleRemoveOpponent(id: number) {
    const cmd = new RemovePokemonCommand(id, () => opponentTeamRef.current, setOpponentTeam);
    opponentHistory.current.execute(cmd);
    setCanUndoOpponent(opponentHistory.current.canUndo());
  }

  function handleUndoPlayer() {
    playerHistory.current.undo();
    setCanUndoPlayer(playerHistory.current.canUndo());
  }

  function handleUndoOpponent() {
    opponentHistory.current.undo();
    setCanUndoOpponent(opponentHistory.current.canUndo());
  }

  const playerTeamIds = playerTeam.map((p) => p.id);
  const opponentTeamIds = opponentTeam.map((p) => p.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-500 text-white px-8 py-4 shadow">
        <h1 className="text-2xl font-bold tracking-tight">Pokémon Team Builder</h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        <TeamPanel
          config={playerPanelConfig}
          team={playerTeam}
          onRemove={handleRemovePlayer}
          onUndo={handleUndoPlayer}
          canUndo={canUndoPlayer}
        />

        <div className="flex-1 min-w-0">
          <QueryFilterBuilder criteria={filterCriteria} onChange={setFilterCriteria} />

          <div className="flex justify-end mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="none">Trier par...</option>
              <option value="name">Nom</option>
              <option value="hp">HP</option>
              <option value="attack">Attaque</option>
              <option value="speed">Vitesse</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400 animate-pulse">Chargement des Pokémon...</p>
            </div>
          ) : (
            <PokemonList
              pokemons={displayed}
              playerTeamIds={playerTeamIds}
              opponentTeamIds={opponentTeamIds}
              onAddToPlayer={handleAddToPlayer}
              onAddToOpponent={handleAddToOpponent}
              sentinelRef={sentinelRef}
              hasMore={hasMore}
            />
          )}
        </div>

        <TeamPanel
          config={opponentPanelConfig}
          team={opponentTeam}
          onRemove={handleRemoveOpponent}
          onUndo={handleUndoOpponent}
          canUndo={canUndoOpponent}
        />
      </main>
      <Notification />
    </div>
  );
}

export default App;
