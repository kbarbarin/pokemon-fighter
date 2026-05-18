import type { PokemonViewModel } from "../types";

export interface Iterator<T> {
  hasNext(): boolean;
  next(): T[];
  reset(): void;
}

export class PokemonPaginator implements Iterator<PokemonViewModel> {
  private cursor = 0;
  private source: PokemonViewModel[];
  private pageSize: number;

  constructor(source: PokemonViewModel[], pageSize = 20) {
    this.source = source;
    this.pageSize = pageSize;
  }

  hasNext(): boolean {
    return this.cursor < this.source.length;
  }

  next(): PokemonViewModel[] {
    if (!this.hasNext()) return [];
    const slice = this.source.slice(this.cursor, this.cursor + this.pageSize);
    this.cursor += slice.length;
    return slice;
  }

  reset(): void {
    this.cursor = 0;
  }

  totalLoaded(): number {
    return this.cursor;
  }

  total(): number {
    return this.source.length;
  }
}
