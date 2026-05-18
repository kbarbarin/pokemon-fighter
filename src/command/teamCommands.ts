import type { PokemonViewModel } from "../types";

export interface Command {
  execute(): void;
  undo(): void;
}

export class AddPokemonCommand implements Command {
  pokemon: PokemonViewModel;
  getTeam: () => PokemonViewModel[];
  setTeam: (team: PokemonViewModel[]) => void;

  constructor(
    pokemon: PokemonViewModel,
    getTeam: () => PokemonViewModel[],
    setTeam: (team: PokemonViewModel[]) => void
  ) {
    this.pokemon = pokemon;
    this.getTeam = getTeam;
    this.setTeam = setTeam;
  }

  execute() {
    this.setTeam([...this.getTeam(), this.pokemon]);
  }

  undo() {
    this.setTeam(this.getTeam().filter((p) => p.id !== this.pokemon.id));
  }
}

export class RemovePokemonCommand implements Command {
  id: number;
  snapshot: PokemonViewModel[];
  getTeam: () => PokemonViewModel[];
  setTeam: (team: PokemonViewModel[]) => void;

  constructor(
    id: number,
    getTeam: () => PokemonViewModel[],
    setTeam: (team: PokemonViewModel[]) => void
  ) {
    this.id = id;
    this.getTeam = getTeam;
    this.setTeam = setTeam;
    this.snapshot = [...getTeam()];
  }

  execute() {
    this.setTeam(this.getTeam().filter((p) => p.id !== this.id));
  }

  undo() {
    this.setTeam(this.snapshot);
  }
}

export class CommandHistory {
  private stack: Command[] = [];

  execute(command: Command) {
    command.execute();
    this.stack.push(command);
  }

  undo() {
    this.stack.pop()?.undo();
  }

  canUndo() {
    return this.stack.length > 0;
  }
}
