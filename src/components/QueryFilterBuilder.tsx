import type { PokemonFilterCriteria } from "../builder/filterBuilder";
import { EMPTY_FILTER_CRITERIA } from "../builder/filterBuilder";
import type { PokemonType } from "../types";

const TYPES: PokemonType[] = [
  "fire", "water", "grass", "electric", "psychic", "ice",
  "dragon", "dark", "fairy", "normal", "fighting", "flying",
  "poison", "ground", "rock", "bug", "ghost", "steel",
];

interface QueryFilterBuilderProps {
  criteria: PokemonFilterCriteria;
  onChange: (criteria: PokemonFilterCriteria) => void;
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400";
const labelClass = "block text-xs font-medium text-gray-600 mb-1 capitalize";

export function QueryFilterBuilder({ criteria, onChange }: QueryFilterBuilderProps) {
  function update<K extends keyof PokemonFilterCriteria>(key: K, value: PokemonFilterCriteria[K]) {
    onChange({ ...criteria, [key]: value });
  }

  function handleReset() {
    onChange({ ...EMPTY_FILTER_CRITERIA });
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Filtres avancés</h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="filter-type1" className={labelClass}>
            Type 1
          </label>
          <select
            id="filter-type1"
            value={criteria.type1}
            onChange={(e) => update("type1", e.target.value as PokemonType | "")}
            className={`${inputClass} capitalize`}
          >
            <option value="">Tous</option>
            {TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-type2" className={labelClass}>
            Type 2
          </label>
          <select
            id="filter-type2"
            value={criteria.type2}
            onChange={(e) => update("type2", e.target.value as PokemonType | "")}
            className={`${inputClass} capitalize`}
          >
            <option value="">Tous</option>
            {TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-name" className={labelClass}>
            Nom
          </label>
          <input
            id="filter-name"
            type="text"
            placeholder="ex. pikachu"
            value={criteria.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="filter-power-min" className={labelClass}>
            Puissance min.
          </label>
          <input
            id="filter-power-min"
            type="number"
            min={0}
            placeholder="0"
            value={criteria.powerLevelMin}
            onChange={(e) => update("powerLevelMin", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="filter-power-max" className={labelClass}>
            Puissance max.
          </label>
          <input
            id="filter-power-max"
            type="number"
            min={0}
            placeholder="999"
            value={criteria.powerLevelMax}
            onChange={(e) => update("powerLevelMax", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="filter-moves" className={labelClass}>
            Attaques
          </label>
          <input
            id="filter-moves"
            type="text"
            placeholder="ex. thunderbolt"
            value={criteria.moves}
            onChange={(e) => update("moves", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="filter-evolution" className={labelClass}>
            Évolution
          </label>
          <input
            id="filter-evolution"
            type="text"
            placeholder="ex. pikachu"
            value={criteria.evolution}
            onChange={(e) => update("evolution", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="filter-abilities" className={labelClass}>
            Talents
          </label>
          <input
            id="filter-abilities"
            type="text"
            placeholder="ex. static"
            value={criteria.abilities}
            onChange={(e) => update("abilities", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
