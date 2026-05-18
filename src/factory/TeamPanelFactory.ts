export type TeamKind = "player" | "opponent";

export interface TeamPanelConfig {
  kind: TeamKind;
  title: string;
  accentBorderClass: string;
  accentTextClass: string;
  emptyMessage: string;
}

export class TeamPanelFactory {
  static create(kind: TeamKind): TeamPanelConfig {
    switch (kind) {
      case "player":
        return {
          kind,
          title: "Mon équipe",
          accentBorderClass: "border-red-300",
          accentTextClass: "text-red-500",
          emptyMessage: "Choisis 6 Pokémon",
        };
      case "opponent":
        return {
          kind,
          title: "Équipe adverse",
          accentBorderClass: "border-blue-300",
          accentTextClass: "text-blue-500",
          emptyMessage: "Compose l'équipe adverse",
        };
    }
  }
}
