import { useEffect, useRef, useState } from "react";
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
import { presentPokemon } from "./presenter/PokemonPresenter";

function App() {
  const [pokemons, setPokemons] = useState<PokemonViewModel[]>([]);
  const [team, setTeam] = useState<PokemonViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState<PokemonFilterCriteria>(EMPTY_FILTER_CRITERIA);
  const [sortBy, setSortBy] = useState<"none" | "name" | "hp" | "attack" | "speed">("none");
  const [canUndo, setCanUndo] = useState(false);
  const teamRef = useRef<PokemonViewModel[]>([]);
  const history = useRef(new CommandHistory());

  useEffect(() => { teamRef.current = team; }, [team]);

  useEffect(() => {
    const repository = new PokeAPIRepository();
    setLoading(true);
    repository.getAllPokemon().then((data) => {
      setPokemons(data.map((p) => presentPokemon(p)));
      setLoading(false);
    });
  }, []);

  function handleAdd(pokemon: PokemonViewModel) {
    if (team.length >= AppConfig.MAX_TEAM_SIZE) {
      teamEvents.emit<string>("team:full", "Équipe complète ! Retirez un Pokémon pour en ajouter un autre.");
      return;
    }
    if (team.find((p) => p.id === pokemon.id)) return;
    const cmd = new AddPokemonCommand(pokemon, () => teamRef.current, setTeam);
    history.current.execute(cmd);
    setCanUndo(history.current.canUndo());
  }

  function handleRemove(id: number) {
    const cmd = new RemovePokemonCommand(id, () => teamRef.current, setTeam);
    history.current.execute(cmd);
    setCanUndo(history.current.canUndo());
  }

  function handleUndo() {
    history.current.undo();
    setCanUndo(history.current.canUndo());
  }

  const filtered = new BySortStrategy(sortBy).apply(
    applyPokemonFilter(pokemons, filterCriteria)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-500 text-white px-8 py-4 shadow">
        <h1 className="text-2xl font-bold tracking-tight">Pokémon Team Builder</h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
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
              pokemons={filtered}
              teamIds={team.map((p) => p.id)}
              onAdd={handleAdd}
            />
          )}
        </div>

        <TeamPanel team={team} onRemove={handleRemove} onUndo={handleUndo} canUndo={canUndo} />
      </main>
      <Notification />
    </div>
  );
}

export default App;
