import { StatTile } from "@/components/data/stat-tile";
import type { LeagueRiderWithSkills } from "@/sports/speedway/types/league";
import type { Venue } from "../../search-params";
import { getRiderStats } from "../../standings";

/** Lines 2 and 3 of a detailed rider row (line 1 is the row itself with the AH badge). */
export function RiderDetail({ rider, venue }: { rider: LeagueRiderWithSkills; venue: Venue }) {
  const s = getRiderStats(rider, venue);

  return (
    <div className="space-y-1.5 pb-1">
      <div className="grid grid-cols-5 gap-1.5">
        <StatTile label="Matches" value={s.matches} />
        <StatTile label="Heats" value={s.heats} />
        <StatTile label="Bonus" value={s.bonus} />
        <StatTile label="Points" value={s.points} />
        <StatTile label="Avg match" value={s.avgMatch.toFixed(2)} />
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        <StatTile label="1st" value={s.firsts} />
        <StatTile label="2nd" value={s.seconds} />
        <StatTile label="3rd" value={s.thirds} />
        <StatTile label="4th" value={s.fourths} />
        <StatTile label="T" title="Tape" value={s.t} />
        <StatTile label="W" title="Exclusion" value={s.w} tone={s.w > 0 ? "negative" : "default"} />
        {/* TODO: the mock calls `d` "defects"; here it is shown as falls (U). Rename when the model is settled. */}
        <StatTile label="U" title="Fall" value={s.d} tone={s.d > 0 ? "negative" : "default"} />
      </div>
    </div>
  );
}