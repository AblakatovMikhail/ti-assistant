import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import React, { useMemo } from "react";
import { StartingComponents } from "../FactionCard";
import { fetcher, poster } from "../util/api/util";
import { ObjectiveRow } from "../ObjectiveRow";
import { claimPlanet } from "../util/api/planets";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import {
  finalizeSubState,
  hideSubStateObjective,
  revealSubStateObjective,
  SubState,
} from "../util/api/subState";
import { responsivePixels } from "../util/util";
import { NumberedItem } from "../NumberedItem";
import { Faction } from "../util/api/factions";
import { GameState, StateUpdateData } from "../util/api/state";
import {
  Objective,
  removeObjective,
  revealObjective,
} from "../util/api/objectives";
import { SelectableRow } from "../SelectableRow";
import { LockedButtons } from "../LockedButton";

export function startFirstRound(
  gameid: string,
  subState: SubState,
  factions: Record<string, Faction>
) {
  finalizeSubState(gameid, subState);
  const data: StateUpdateData = {
    action: "ADVANCE_PHASE",
  };
  if (factions["Council Keleres"]) {
    for (const planet of factions["Council Keleres"].startswith.planets ?? []) {
      claimPlanet(gameid, planet, "Council Keleres");
    }
  }

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.phase = "STRATEGY";
        updatedState.activeplayer = state.speaker;

        return updatedState;
      },
      revalidate: false,
    }
  );
}

function factionTechChoicesComplete(
  factions: Record<string, Faction>
): boolean {
  let complete = true;
  Object.values(factions).forEach((faction) => {
    if (faction.startswith.choice) {
      const numSelected = (faction.startswith.techs ?? []).length;
      const numRequired = faction.startswith.choice.select;
      const numAvailable = faction.startswith.choice.options.length;
      if (numSelected !== numRequired && numSelected !== numAvailable) {
        complete = false;
      }
    }
  });
  return complete;
}

function factionSubFactionChoicesComplete(
  factions: Record<string, Faction>
): boolean {
  if (!factions["Council Keleres"]) {
    return true;
  }
  return (factions["Council Keleres"].startswith.planets ?? []).length !== 0;
}

export function setupPhaseComplete(
  factions: Record<string, Faction>,
  subState: SubState
): boolean {
  return (
    factionSubFactionChoicesComplete(factions) &&
    factionTechChoicesComplete(factions) &&
    (subState.objectives ?? []).length === 2
  );
}

function getSetupPhaseText(
  factions: Record<string, Faction>,
  subState: SubState
) {
  const textSections = [];
  if (
    !factionSubFactionChoicesComplete(factions) ||
    !factionTechChoicesComplete(factions)
  ) {
    textSections.push("Select all faction choices");
  }
  if ((subState.objectives ?? []).length !== 2) {
    textSections.push("Reveal 2 objectives");
  }
  return textSections.join(" and ");
}

export default function SetupPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const orderedFactions = useMemo(() => {
    if (!factions) {
      return [];
    }
    return Object.entries(factions).sort((a, b) => {
      return a[1].order - b[1].order;
    });
  }, [factions]);

  const availableObjectives = useMemo(() => {
    return Object.values(objectives ?? {}).filter((objective) => {
      return (
        objective.type === "STAGE ONE" &&
        !subState?.objectives?.includes(objective.name)
      );
    });
  }, [subState?.objectives, objectives]);

  const speaker = (factions ?? {})[state?.speaker ?? ""];

  return (
    <div
      className="flexColumn"
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: responsivePixels(100),
      }}
    >
      <ol
        className="flexColumn"
        style={{
          alignItems: "flex-start",
          padding: 0,
          fontSize: responsivePixels(24),
          margin: `0 ${responsivePixels(20)} 0 ${responsivePixels(40)}`,
        }}
      >
        <NumberedItem>Build the galaxy</NumberedItem>
        <NumberedItem>Shuffle decks</NumberedItem>
        <NumberedItem>
          <LabeledDiv label="Gather starting components">
            <div
              className="flexRow"
              style={{
                position: "relative",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-evenly",
              }}
            >
              {orderedFactions.map(([name, faction]) => {
                return (
                  <ClientOnlyHoverMenu
                    key={name}
                    label={getFactionName(faction)}
                    borderColor={getFactionColor(faction)}
                  >
                    <div
                      style={{
                        padding: `0 ${responsivePixels(8)} ${responsivePixels(
                          8
                        )} ${responsivePixels(8)}`,
                      }}
                    >
                      <StartingComponents faction={faction} />
                    </div>
                  </ClientOnlyHoverMenu>
                );
              })}
            </div>
          </LabeledDiv>
        </NumberedItem>
        <NumberedItem>Draw 2 secret objectives and keep one</NumberedItem>
        <NumberedItem>Re-shuffle secret objectives</NumberedItem>
        <NumberedItem>
          <LabeledDiv
            label={getFactionName(speaker)}
            color={getFactionColor(speaker)}
          >
            Draw 5 stage one objectives and reveal 2
            {(subState?.objectives ?? []).length > 0 ? (
              <LabeledDiv label="Revealed Objectives">
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {(subState?.objectives ?? []).map((objectiveName) => {
                    const objective = (objectives ?? {})[objectiveName];
                    if (!objective) {
                      return (
                        <SelectableRow
                          key={objectiveName}
                          itemName={objectiveName}
                          removeItem={() => {
                            if (!gameid) {
                              return;
                            }
                            hideSubStateObjective(gameid, objectiveName);
                            removeObjective(gameid, undefined, objectiveName);
                          }}
                        >
                          {objectiveName}
                        </SelectableRow>
                      );
                    }
                    return (
                      <ObjectiveRow
                        key={objectiveName}
                        objective={objective}
                        removeObjective={() => {
                          if (!gameid) {
                            return;
                          }
                          hideSubStateObjective(gameid, objectiveName);
                        }}
                        viewing={true}
                      />
                    );
                  })}
                </div>
              </LabeledDiv>
            ) : null}
            {(subState?.objectives ?? []).length < 2 ? (
              <ClientOnlyHoverMenu
                label="Reveal Objective"
                renderProps={(closeFn) => (
                  <div
                    className="flexRow"
                    style={{
                      padding: `${responsivePixels(8)}`,
                      display: "grid",
                      gridAutoFlow: "column",
                      gridTemplateRows: "repeat(5, auto)",
                      justifyContent: "flex-start",
                      gap: `${responsivePixels(4)}`,
                      maxWidth: "80vw",
                      overflowX: "auto",
                    }}
                  >
                    {Object.values(availableObjectives)
                      .filter((objective) => {
                        return objective.type === "STAGE ONE";
                      })
                      .map((objective) => {
                        return (
                          <button
                            key={objective.name}
                            style={{ writingMode: "horizontal-tb" }}
                            onClick={() => {
                              if (!gameid) {
                                return;
                              }
                              closeFn();
                              revealSubStateObjective(gameid, objective.name);
                              revealObjective(
                                gameid,
                                undefined,
                                objective.name
                              );
                            }}
                          >
                            {objective.name}
                          </button>
                        );
                      })}
                  </div>
                )}
              ></ClientOnlyHoverMenu>
            ) : null}
          </LabeledDiv>
        </NumberedItem>
        <NumberedItem>
          <LabeledDiv
            label={getFactionName(speaker)}
            color={getFactionColor(speaker)}
          >
            Draw 5 stage two objectives
          </LabeledDiv>
        </NumberedItem>
      </ol>
      {!setupPhaseComplete(factions ?? {}, subState ?? {}) ? (
        <div
          style={{
            color: "firebrick",
            fontFamily: "Myriad Pro",
            fontWeight: "bold",
          }}
        >
          {getSetupPhaseText(factions ?? {}, subState ?? {})}
        </div>
      ) : null}
      <LockedButtons
        unlocked={setupPhaseComplete(factions ?? {}, subState ?? {})}
        buttons={[
          {
            text: "Start Game",
            onClick: () => {
              if (!gameid) {
                return;
              }
              startFirstRound(gameid, subState ?? {}, factions ?? {});
            },
            style: { fontSize: responsivePixels(40) },
          },
        ]}
      />
    </div>
  );
}
