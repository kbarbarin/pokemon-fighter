import type { Pokemon } from "../types";
import type { PokemonRepository } from "../repository/PokemonRepository";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export class CachedPokemonProxy implements PokemonRepository {
  private memory: Pokemon[] | null = null;
  private inFlight: Promise<Pokemon[]> | null = null;
  private real: PokemonRepository;
  private storageKey: string;
  private ttlMs: number;

  constructor(real: PokemonRepository, storageKey = "pokemons:v1", ttlMs = ONE_DAY_MS) {
    this.real = real;
    this.storageKey = storageKey;
    this.ttlMs = ttlMs;
  }

  async getAllPokemon(): Promise<Pokemon[]> {
    if (this.memory) return this.memory;

    const cached = this.readStorage();
    if (cached) {
      this.memory = cached;
      return cached;
    }

    if (this.inFlight) return this.inFlight;

    this.inFlight = this.real.getAllPokemon().then((data) => {
      this.memory = data;
      this.writeStorage(data);
      this.inFlight = null;
      return data;
    });

    return this.inFlight;
  }

  private readStorage(): Pokemon[] | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw) as { ts: number; data: Pokemon[] };
      if (Date.now() - ts > this.ttlMs) return null;
      return data;
    } catch {
      return null;
    }
  }

  private writeStorage(data: Pokemon[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({ ts: Date.now(), data }));
    } catch {
      // quota dépassé ou storage indisponible — on ignore, le cache mémoire suffit
    }
  }
}
