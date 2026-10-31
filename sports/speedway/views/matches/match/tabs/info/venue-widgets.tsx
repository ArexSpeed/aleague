import { Cloud, CloudRain, Gauge, Layers, MapPin, Sun } from "lucide-react";

import { InfoTile } from "@/components/data/info-tile";
import type { Match } from "@/sports/speedway/types/match";

const WEATHER_ICON = { Sunny: Sun, Cloudy: Cloud, Rain: CloudRain } as const;

export function VenueWidgets({ match }: { match: Match }) {
  const { stadium } = match;
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      <InfoTile icon={MapPin} label="Stadium" value={stadium.name} />
      <InfoTile icon={Gauge} label="Track length" value={`${stadium.trackLength} m`} />
      <InfoTile icon={Layers} label="Surface" value={stadium.surface} />
      <InfoTile
        icon={WEATHER_ICON[stadium.weather.condition]}
        label="Weather"
        value={`${stadium.weather.condition} (${stadium.weather.temp}°C)`}
      />
    </div>
  );
}
