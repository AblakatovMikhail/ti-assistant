import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../util/api/util";
import { computeVPs, FactionSummary } from "../FactionSummary";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import { responsivePixels } from "../util/util";
import { StaticFactionTimer } from "../Timer";
import { getInitiativeForFaction } from "../util/helpers";
import { Faction } from "../util/api/factions";
import { Objective } from "../util/api/objectives";
import { Options } from "../util/api/options";
import { StrategyCard } from "../util/api/cards";

function sortByOrder(a: [string, Faction], b: [string, Faction]) {
  if (a[1].order > b[1].order) {
    return 1;
  } else {
    return -1;
  }
}

export interface SummaryColumnProps {
  order?: "VICTORY_POINTS" | "SPEAKER";
  subOrder?: "INITIATIVE" | "SPEAKER";
}

export default function SummaryColumn({ order, subOrder }: SummaryColumnProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: objectives = {} }: { data?: Record<string, Objective> } =
    useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: options }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher
  );
  const { data: strategyCards = {} }: { data?: Record<string, StrategyCard> } =
    useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);

  if (!options || !factions) {
    return <div>Loading...</div>;
  }

  let sortFunction = sortByOrder;
  let title = "Speaker Order";
  switch (order) {
    case "VICTORY_POINTS":
      sortFunction = (a, b) => {
        const aVPs = computeVPs(factions, a[0], objectives);
        const bVPs = computeVPs(factions, b[0], objectives);
        if (aVPs !== bVPs) {
          if (bVPs > aVPs) {
            return 1;
          }
          return -1;
        }
        switch (subOrder) {
          case "INITIATIVE":
            const aInitiative = getInitiativeForFaction(strategyCards, a[0]);
            const bInitiative = getInitiativeForFaction(strategyCards, b[0]);
            if (aInitiative > bInitiative) {
              return 1;
            }
            return -1;
          case "SPEAKER":
            if (a[1].order > b[1].order) {
              return 1;
            }
            return -1;
        }
        if (a[1].order > b[1].order) {
          return 1;
        }
        return -1;
      };
      title = "Final Score";
      break;
  }

  const orderedFactions = Object.entries(factions).sort(sortFunction);

  const showTechs = options["faction-summary-show-techs"] ?? true;
  const showPlanets = options["faction-summary-show-planets"] ?? true;

  const factionSummaryOptions = {
    showIcon: true,
    hidePlanets: !showPlanets,
    hideTechs: !showTechs,
  };

  const numFactions = Object.keys(factions).length;

  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        alignItems: "stretch",
        height: "100vh",
        maxWidth: responsivePixels(800),
        gap: numFactions < 8 ? responsivePixels(12) : responsivePixels(4),
      }}
    >
      {numFactions < 8 ? <div className="flexRow">{title}</div> : null}

      {orderedFactions.map(([name, faction]) => {
        return (
          <div key={name} style={{ flex: `${responsivePixels(72)} 0 0` }}>
            <LabeledDiv
              label={getFactionName(faction)}
              rightLabel={
                <StaticFactionTimer
                  factionName={name}
                  style={{ fontSize: responsivePixels(16), width: "auto" }}
                />
              }
              color={getFactionColor(faction)}
              style={{ height: "100%" }}
            >
              <FactionSummary
                factionName={name}
                options={factionSummaryOptions}
              />
            </LabeledDiv>
          </div>
        );
      })}
    </div>
  );
}