import { CSSProperties, useContext, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { GameIdContext } from "../../context/Context";
import {
  useActionLog,
  useAgendas,
  useAttachments,
  useFactions,
  useGameState,
  useObjectives,
  useOptions,
  usePlanets,
  useRelics,
  useStrategyCards,
} from "../../context/dataHooks";
import {
  castVotesAsync,
  playActionCardAsync,
  playPromissoryNoteAsync,
  playRiderAsync,
  unplayActionCardAsync,
  unplayPromissoryNoteAsync,
  unplayRiderAsync,
} from "../../dynamic/api";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import {
  getActionCardTargets,
  getAllVotes,
  getFactionVotes,
  getPlayedRelic,
  getPlayedRiders,
  getPromissoryTargets,
} from "../../util/actionLog";
import {
  getCurrentPhasePreviousLogEntries,
  getCurrentTurnLogEntries,
} from "../../util/api/actionLog";
import { hasTech } from "../../util/api/techs";
import { getFactionColor, getFactionName } from "../../util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../../util/planets";
import { riderString } from "../../util/strings";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import NumberInput from "../NumberInput/NumberInput";
import { Selector } from "../Selector/Selector";
import styles from "./VoteBlock.module.scss";

// Checks whether or not a faction can use Blood Pact.
function canUseBloodPact(currentTurn: ActionLogEntry[], factionId: FactionId) {
  if (factionId === "Empyrean") {
    return false;
  }
  const factionVotes = getFactionVotes(currentTurn, factionId);
  const empyreanVotes = getFactionVotes(currentTurn, "Empyrean");
  if (!factionVotes || !empyreanVotes) {
    return false;
  }
  if (!factionVotes.target || !empyreanVotes.target) {
    return false;
  }
  return factionVotes.target === empyreanVotes.target;
}

export function getTargets(
  agenda: Agenda | undefined,
  factions: Partial<Record<FactionId, Faction>>,
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>,
  planets: Partial<Record<PlanetId, Planet>>,
  agendas: Partial<Record<AgendaId, Agenda>>,
  objectives: Partial<Record<ObjectiveId, Objective>>,
  intl: IntlShape
) {
  if (!agenda) {
    return [];
  }
  const abstain = {
    id: "Abstain",
    name: intl.formatMessage({
      id: "LaXLjN",
      defaultMessage: "Abstain",
      description: "Outcome choosing not to vote.",
    }),
  };
  switch (agenda.elect) {
    case "For/Against":
      return [
        {
          id: "For",
          name: intl.formatMessage({
            id: "ymJxS0",
            defaultMessage: "For",
            description: "Outcome choosing to pass a law.",
          }),
        },
        {
          id: "Against",
          name: intl.formatMessage({
            id: "SOC2Bh",
            defaultMessage: "Against",
            description: "Outcome choosing to vote down a law.",
          }),
        },
        abstain,
      ];
    case "Player":
      return [
        ...Object.values(factions).map((faction) => {
          return { id: faction.id, name: faction.name };
        }),
        abstain,
      ];
    case "Strategy Card":
      return [
        ...Object.values(strategyCards).map((card) => {
          return { id: card.id, name: card.name };
        }),
        abstain,
      ];
    case "Planet":
      const ownedPlanetNames = Object.values(planets)
        .filter((planet) => !!planet.owner)
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...ownedPlanetNames, abstain];
    case "Cultural Planet":
      const culturalPlanets = Object.values(planets)
        .filter((planet) => planet.type === "CULTURAL")
        .filter((planet) => !!planet.owner)
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...culturalPlanets, abstain];
    case "Hazardous Planet":
      const hazardousPlanets = Object.values(planets)
        .filter((planet) => planet.type === "HAZARDOUS")
        .filter((planet) => !!planet.owner)
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...hazardousPlanets, abstain];
    case "Industrial Planet":
      const industrialPlanets = Object.values(planets)
        .filter((planet) => planet.type === "INDUSTRIAL")
        .filter((planet) => !!planet.owner)
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...industrialPlanets, abstain];
    case "Non-Home Planet Other Than Mecatol Rex":
      const electablePlanets = Object.values(planets)
        .filter((planet) => !planet.home && planet.name !== "Mecatol Rex")
        .filter((planet) => !!planet.owner)
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...electablePlanets, abstain];
    case "Law":
      const passedLaws = Object.values(agendas)
        .filter((agenda) => agenda.type === "LAW" && agenda.passed)
        .map((law) => {
          return { id: law.id, name: law.name };
        });
      return [...passedLaws, abstain];
    case "Scored Secret Objective":
      const secrets = Object.values(objectives).filter((objective) => {
        return objective.type === "SECRET";
      });
      const scoredSecrets = secrets.filter((objective) => {
        return (objective.scorers ?? []).length > 0;
      });
      if (scoredSecrets.length === 0) {
        return [
          ...secrets.map((secret) => {
            return { id: secret.id, name: secret.name };
          }),
          abstain,
        ];
      }
      return [
        ...scoredSecrets.map((secret) => {
          return { id: secret.id, name: secret.name };
        }),
        abstain,
      ];
  }
  return [];
}

export function translateOutcome(
  target: string | undefined,
  elect: OutcomeType | undefined,
  planets: Partial<Record<PlanetId, Planet>>,
  factions: Partial<Record<FactionId, Faction>>,
  objectives: Partial<Record<ObjectiveId, Objective>>,
  agendas: Partial<Record<AgendaId, Agenda>>,
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>,
  intl: IntlShape
) {
  if (!target || !elect) {
    return undefined;
  }
  let displayText = target;
  switch (elect) {
    case "Cultural Planet":
    case "Hazardous Planet":
    case "Industrial Planet":
    case "Non-Home Planet Other Than Mecatol Rex":
    case "Planet":
      const planet = planets[target as PlanetId];
      if (!planet) {
        break;
      }
      displayText = planet.name;
      break;
    case "Player":
      const faction = factions[target as FactionId];
      displayText = getFactionName(faction);
      break;
    case "Scored Secret Objective":
      const objective = objectives[target as ObjectiveId];
      if (!objective) {
        break;
      }
      displayText = objective.name;
      break;
    case "Law":
      const agenda = agendas[target as AgendaId];
      if (!agenda) {
        break;
      }
      displayText = agenda.name;
      break;
    case "Strategy Card":
      const card = strategyCards[target as StrategyCardId];
      if (!card) {
        break;
      }
      displayText = card.name;
      break;
    case "For/Against":
      if (target === "For") {
        displayText = intl.formatMessage({
          id: "ymJxS0",
          defaultMessage: "For",
          description: "Outcome choosing to pass a law.",
        });
      } else {
        displayText = intl.formatMessage({
          id: "SOC2Bh",
          defaultMessage: "Against",
          description: "Outcome choosing to vote down a law.",
        });
      }
      break;
  }
  return displayText;
}

export function canFactionPredict(
  factionId: FactionId,
  currentTurn: ActionLogEntry[]
) {
  const politicalSecrets = getPromissoryTargets(
    currentTurn,
    "Political Secret"
  );
  return !politicalSecrets.includes(factionId);
}

export function canFactionVote(
  faction: Faction,
  agendas: Partial<Record<AgendaId, Agenda>>,
  state: GameState,
  currentTurn: ActionLogEntry[]
) {
  if (faction.id === "Nekro Virus") {
    return false;
  }
  if (
    faction.id === "Xxcha Kingdom" &&
    faction &&
    faction.commander === "readied"
  ) {
    return true;
  }
  const politicalSecrets = getPromissoryTargets(
    currentTurn,
    "Political Secret"
  );
  if (politicalSecrets.includes(faction.id)) {
    return false;
  }
  const assassinatedRep = getActionCardTargets(
    currentTurn,
    "Assassinate Representative"
  )[0];
  if (assassinatedRep === faction.id) {
    return false;
  }
  const riders = getPlayedRiders(currentTurn);
  for (const rider of riders) {
    if (rider.faction === faction.id) {
      return false;
    }
  }
  const publicExecution = agendas["Public Execution"];
  if (
    publicExecution &&
    publicExecution.resolved &&
    publicExecution.target === faction.id &&
    publicExecution.activeRound === state.round
  ) {
    return false;
  }
  return true;
}

export function computeRemainingVotes(
  factionId: FactionId,
  factions: Partial<Record<FactionId, Faction>>,
  planets: Partial<Record<PlanetId, Planet>>,
  attachments: Partial<Record<AttachmentId, Attachment>>,
  agendas: Partial<Record<AgendaId, Agenda>>,
  options: Options,
  state: GameState,
  currentPhasePrevious: ActionLogEntry[]
) {
  const representativeGovernment = agendas["Representative Government"];

  if (representativeGovernment && representativeGovernment.passed) {
    return {
      influence: 0,
      extraVotes: 1,
    };
  }
  const ownedPlanets = filterToClaimedPlanets(planets, factionId);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const filteredPlanets = updatedPlanets.filter((planet) => {
    if (factionId !== state?.ancientBurialSites) {
      return true;
    }
    return (
      planet.type !== "CULTURAL" && !planet.attributes.includes("all-types")
    );
  });

  const orderedPlanets = filteredPlanets.sort((a, b) => {
    const aRatio =
      a.resources > 0 ? a.influence / a.resources : Number.MAX_SAFE_INTEGER;
    const bRatio =
      b.resources > 0 ? b.influence / b.resources : Number.MAX_SAFE_INTEGER;
    if (aRatio !== bRatio) {
      return bRatio - aRatio;
    }
    if (a.influence !== b.influence) {
      return b.influence - a.influence;
    }
    if ((a.attributes ?? []).length !== (b.attributes ?? []).length) {
      return (a.attributes ?? []).length - (b.attributes ?? []).length;
    }
    return 0;
  });

  const faction = factions[factionId];
  if (!faction) {
    return {
      influence: 0,
      extraVotes: 0,
    };
  }

  const votesCast = getAllVotes(currentPhasePrevious)
    .filter((voteEvent) => {
      return voteEvent.faction === factionId;
    })
    .reduce((votes, voteEvent) => {
      return votes + voteEvent.votes;
    }, 0);

  let influenceNeeded = votesCast;
  let planetCount = 0;
  let remainingVotes = 0;
  for (const planet of orderedPlanets) {
    let planetInfluence = planet.influence;
    if (factionId === "Xxcha Kingdom") {
      if (
        options.expansions.includes("CODEX THREE") &&
        faction.hero === "readied"
      ) {
        planetInfluence += planet.resources;
      }
      if (faction.commander === "readied") {
        planetInfluence += 1;
      }
    }
    if (influenceNeeded > 0 && planetInfluence <= influenceNeeded) {
      influenceNeeded -= planetInfluence;
      continue;
    }
    if (factionId === "Xxcha Kingdom" && faction.commander === "readied") {
      planetInfluence -= 1;
    }
    planetCount++;

    remainingVotes += planetInfluence;
  }

  // Player cast an invalid number of votes. Forcibly adjust.
  if (influenceNeeded > 0) {
    remainingVotes = Math.max(remainingVotes - influenceNeeded, 0);
  }

  let extraVotes = 0;
  if (factionId === "Argent Flight") {
    extraVotes += Object.keys(factions).length;
  }
  if (factionId === "Xxcha Kingdom" && faction.commander === "readied") {
    extraVotes += planetCount;
  }
  const hasPredictiveIntelligence = hasTech(faction, "Predictive Intelligence");
  if (hasPredictiveIntelligence) {
    extraVotes += 3;
  }

  return {
    influence: remainingVotes,
    extraVotes: extraVotes,
  };
}

const RIDERS = [
  "Galactic Threat",
  "Leadership Rider",
  "Diplomacy Rider",
  "Politics Rider",
  "Construction Rider",
  "Trade Rider",
  "Warfare Rider",
  "Technology Rider",
  "Imperial Rider",
  "Sanction",
  "Keleres Rider",
];

interface VoteBlockProps {
  factionId: FactionId;
  agenda: Agenda | undefined;
}

export default function VoteBlock({ factionId, agenda }: VoteBlockProps) {
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const objectives = useObjectives();
  const planets = usePlanets();
  const state = useGameState();
  const strategyCards = useStrategyCards();

  const [overrideVotingBlock, setOverrideVotingBlock] = useState(false);

  const intl = useIntl();

  const faction = factions[factionId];

  if (!faction) {
    return null;
  }

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const completeRiders = getPlayedRiders(currentTurn).filter((rider) => {
    return rider.faction === faction.id && rider.outcome;
  });

  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
      noBlur
      style={{
        display: "grid",
        gridColumn: "span 4",
        gridTemplateColumns: "subgrid",
        rowGap: 0,
      }}
    >
      <div className="flexColumn" style={{ gridColumn: "span 4", gap: 0 }}>
        {completeRiders.map((rider) => {
          return (
            <div
              key={rider.rider}
              className="flexRow"
              style={{
                gap: "4px",
                fontSize: "14px",
              }}
            >
              {state.votingStarted ? (
                <div style={{ height: "20px" }}></div>
              ) : (
                <div
                  className="icon clickable negative"
                  style={{ marginRight: 0 }}
                  onClick={() => {
                    if (!gameId) {
                      return;
                    }
                    unplayRiderAsync(gameId, rider.rider);
                  }}
                >
                  &#x2715;
                </div>
              )}
              <i>{riderString(rider.rider, intl)}</i>:{" "}
              {translateOutcome(
                rider.outcome,
                agenda?.elect,
                planets,
                factions,
                objectives,
                agendas,
                strategyCards,
                intl
              )}
            </div>
          );
        })}
      </div>
      <div
        className="flexRow"
        style={{
          display: "grid",
          gridColumn: "span 4",
          gridTemplateColumns: "subgrid",
          gap: "16px",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!agenda ? (
          <>
            <div></div>
            <AvailableVotes factionId={factionId} />
          </>
        ) : null}
        {agenda && !state.votingStarted ? (
          <PredictionSection factionId={factionId} agenda={agenda} />
        ) : null}
        {agenda && state.votingStarted ? (
          !canFactionVote(faction, agendas, state, currentTurn) &&
          !overrideVotingBlock ? (
            <div
              className="flexRow"
              style={{
                boxSizing: "border-box",
                width: "100%",
                gridColumn: "span 4",
                justifyContent: "space-evenly",
              }}
            >
              <FormattedMessage
                id="c4LYqr"
                description="Text informing a player that they cannot vote."
                defaultMessage="Cannot Vote"
              />
              <button
                style={{ fontSize: "10px" }}
                onClick={() => setOverrideVotingBlock(true)}
              >
                Allow Voting
              </button>
            </div>
          ) : (
            <VotingSection factionId={factionId} agenda={agenda} />
          )
        ) : null}
      </div>
    </LabeledDiv>
  );
}

function PredictionSection({
  factionId,
  agenda,
}: {
  factionId: FactionId;
  agenda: Agenda | undefined;
}) {
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const strategyCards = useStrategyCards();

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const playedRiders = getPlayedRiders(currentTurn);

  const pendingRider = playedRiders.filter((rider) => {
    return rider.faction === factionId && !rider.outcome;
  })[0];

  const remainingRiders = RIDERS.filter((rider) => {
    if (rider === "Keleres Rider") {
      if (factionId === "Council Keleres" || !factions["Council Keleres"]) {
        return false;
      }
    }
    const secrets = getPromissoryTargets(currentTurn, "Political Secret");
    if (rider === "Galactic Threat") {
      if (factionId !== "Nekro Virus" || secrets.includes("Nekro Virus")) {
        return false;
      }
    }
    if (
      rider === "Sanction" &&
      options &&
      !options.expansions.includes("CODEX ONE")
    ) {
      return false;
    }

    if (
      pendingRider &&
      pendingRider.rider === rider &&
      pendingRider.faction === factionId
    ) {
      return true;
    }
    for (const playedRider of playedRiders) {
      if (playedRider.rider === rider) {
        return false;
      }
    }
    return true;
  });

  const targets = getTargets(
    agenda,
    factions,
    strategyCards,
    planets,
    agendas,
    objectives,
    intl
  ).filter((target) => target.id !== "Abstain");

  if (!canFactionPredict(factionId, currentTurn)) {
    return (
      <>
        <div
          style={{
            paddingLeft: "4px",
            fontSize: "14px",
          }}
        >
          Cannot Predict
        </div>
        <AvailableVotes factionId={factionId} />
      </>
    );
  }

  return (
    <>
      <Selector
        hoverMenuLabel={
          <FormattedMessage
            id="jGX605"
            description="Text on hover menu for selecting a rider to play."
            defaultMessage="Play Rider"
          />
        }
        options={remainingRiders.map((rider) => {
          return { id: rider, name: riderString(rider, intl) };
        })}
        selectedItem={pendingRider?.rider}
        toggleItem={(itemId, add) => {
          if (!gameId) {
            return;
          }
          if (add) {
            playRiderAsync(gameId, itemId, factionId, undefined);
          } else {
            unplayRiderAsync(gameId, itemId);
          }
        }}
      />
      <AvailableVotes factionId={factionId} />{" "}
      {pendingRider && targets.length > 0 ? (
        <div style={{ gridColumn: "span 2" }}>
          <Selector
            hoverMenuLabel={
              <FormattedMessage
                id="+x4AIR"
                description="Text on a hover menu for selecting a rider target."
                defaultMessage="Pending"
              />
            }
            options={targets}
            selectedItem={undefined}
            toggleItem={(itemId, add) => {
              if (!gameId) {
                return;
              }
              playRiderAsync(gameId, pendingRider.rider, factionId, itemId);
            }}
            style={{ minWidth: "154px" }}
          />
        </div>
      ) : null}
    </>
  );
}

function VotingSection({
  factionId,
  agenda,
}: {
  factionId: FactionId;
  agenda: Agenda | undefined;
}) {
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const attachments = useAttachments();
  const factions = useFactions();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const state = useGameState();
  const strategyCards = useStrategyCards();

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const faction = factions[factionId];

  if (!faction) {
    return null;
  }

  function castVotesLocal(
    target: string | undefined,
    votes: number,
    extraVotes: number
  ) {
    if (!gameId) {
      return;
    }

    if (target === "Abstain") {
      castVotesAsync(gameId, factionId, 0, 0, "Abstain");
    } else {
      castVotesAsync(gameId, factionId, votes, extraVotes, target);
    }
  }

  const targets = getTargets(
    agenda,
    factions,
    strategyCards,
    planets,
    agendas,
    objectives,
    intl
  );
  const factionVotes = getFactionVotes(currentTurn, factionId);

  const hasVotableTarget =
    !!factionVotes?.target && factionVotes?.target !== "Abstain";

  let { influence } = computeRemainingVotes(
    factionId,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(actionLog ?? [])
  );

  const mawOfWorlds = relics["Maw of Worlds"];
  if (mawOfWorlds && mawOfWorlds.owner === factionId) {
    const mawEvent: MawOfWorldsEvent | undefined = getPlayedRelic(
      actionLog,
      "Maw of Worlds"
    ) as MawOfWorldsEvent | undefined;
    if (mawEvent) {
      influence = 0;
    }
  }
  let castExtraVotes = factionVotes?.extraVotes ?? 0;
  const usingPredictive = getActionCardTargets(
    currentTurn,
    "Predictive Intelligence"
  ) as FactionId[];
  const currentCouncilor = getActionCardTargets(
    currentTurn,
    "Distinguished Councilor"
  )[0] as FactionId | undefined;
  const bloodPactUser = getPromissoryTargets(currentTurn, "Blood Pact")[0] as
    | FactionId
    | undefined;
  if (factionId === bloodPactUser) {
    castExtraVotes += 4;
  }
  if (factionId === currentCouncilor) {
    castExtraVotes += 5;
  }
  if (usingPredictive.includes(factionId)) {
    castExtraVotes += 3;
  }
  switch (factionId) {
    case "Argent Flight":
      if (factionVotes && factionVotes.votes > 0) {
        castExtraVotes += Object.keys(factions).length;
      }
      break;
  }

  return (
    <>
      <div className="flexRow" style={{ justifyContent: "flex-start" }}>
        {state.votingStarted && targets.length > 0 ? (
          <Selector
            hoverMenuLabel={
              <FormattedMessage
                id="cHsAYk"
                description="Text on hover menu for selecting voting outcome."
                defaultMessage="Select Outcome"
              />
            }
            options={targets}
            selectedItem={factionVotes?.target}
            toggleItem={(itemId, add) => {
              if (add) {
                castVotesLocal(itemId, 0, 0);
              } else {
                castVotesLocal(undefined, 0, 0);
              }
            }}
            style={{ minWidth: "154px" }}
          />
        ) : null}
      </div>
      <AvailableVotes factionId={factionId} />
      {hasVotableTarget ? (
        <NumberInput
          value={factionVotes.votes}
          maxValue={99}
          softMax={influence}
          minValue={0}
          onChange={(votes) => {
            castVotesLocal(factionVotes.target, votes, factionVotes.extraVotes);
          }}
        />
      ) : null}
      {hasVotableTarget && factionVotes.votes > 0 ? (
        <ClientOnlyHoverMenu
          label={castExtraVotes === 0 ? "-" : `+${castExtraVotes}`}
          buttonStyle={{ minWidth: "48px" }}
        >
          <div
            className="flexColumn"
            style={{
              padding: "4px",
              fontSize: "16px",
              alignItems: "flex-start",
            }}
          >
            {factionId === "Argent Flight"
              ? `+${
                  factionVotes.votes > 0 ? Object.keys(factions).length : 0
                } votes from Zeal`
              : null}
            {canUseBloodPact(currentTurn, factionId) ? (
              <button
                disabled={bloodPactUser && bloodPactUser !== factionId}
                className={bloodPactUser === factionId ? "selected" : ""}
                style={{ fontSize: "14px" }}
                onClick={() => {
                  if (!gameId) {
                    return;
                  }
                  if (bloodPactUser === factionId) {
                    unplayPromissoryNoteAsync(gameId, "Blood Pact", factionId);
                  } else {
                    playPromissoryNoteAsync(gameId, "Blood Pact", factionId);
                  }
                }}
              >
                <FormattedMessage
                  id="Components.Blood Pact.Title"
                  description="Title of Component: Blood Pact"
                  defaultMessage="Blood Pact"
                />
              </button>
            ) : null}
            {hasTech(faction, "Predictive Intelligence") ? (
              <button
                className={
                  usingPredictive.includes(factionId) ? "selected" : ""
                }
                style={{ fontSize: "14px" }}
                onClick={() => {
                  if (!gameId) {
                    return;
                  }
                  if (usingPredictive.includes(factionId)) {
                    unplayActionCardAsync(
                      gameId,
                      "Predictive Intelligence",
                      factionId
                    );
                  } else {
                    playActionCardAsync(
                      gameId,
                      "Predictive Intelligence",
                      factionId
                    );
                  }
                }}
              >
                <FormattedMessage
                  id="Techs.Predictive Intelligence.Title"
                  description="Title of Tech: Predictive Intelligence"
                  defaultMessage="Predictive Intelligence"
                />
              </button>
            ) : null}
            <button
              disabled={currentCouncilor && currentCouncilor !== factionId}
              className={currentCouncilor === factionId ? "selected" : ""}
              style={{ fontSize: "14px" }}
              onClick={() => {
                if (!gameId) {
                  return;
                }
                if (currentCouncilor === factionId) {
                  unplayActionCardAsync(
                    gameId,
                    "Distinguished Councilor",
                    factionId
                  );
                } else {
                  playActionCardAsync(
                    gameId,
                    "Distinguished Councilor",
                    factionId
                  );
                }
              }}
            >
              <FormattedMessage
                id="Components.Distinguished Councilor.Title"
                description="Title of Component: Distinguished Councilor"
                defaultMessage="Distinguished Councilor"
              />
            </button>
            {hasVotableTarget ? (
              <div
                className="flexRow"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <FormattedMessage
                  id="sgqLYB"
                  defaultMessage="Other"
                  description="Text on a button used to select a non-listed value"
                />
                <NumberInput
                  value={factionVotes.extraVotes}
                  maxValue={99}
                  minValue={0}
                  onChange={(votes) => {
                    castVotesLocal(
                      factionVotes.target,
                      factionVotes.votes,
                      votes
                    );
                  }}
                />
              </div>
            ) : null}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
    </>
  );
}

interface AvailableVotesStyle extends CSSProperties {
  "--width": string;
  "--height": string;
}

function AvailableVotes({ factionId }: { factionId: FactionId }) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const attachments = useAttachments();
  const factions = useFactions();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const state = useGameState();

  let { influence, extraVotes } = computeRemainingVotes(
    factionId,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(actionLog)
  );
  const mawOfWorlds = relics["Maw of Worlds"];
  if (mawOfWorlds && mawOfWorlds.owner === factionId) {
    const mawEvent: MawOfWorldsEvent | undefined = getPlayedRelic(
      actionLog,
      "Maw of Worlds"
    ) as MawOfWorldsEvent | undefined;
    if (mawEvent) {
      influence = 0;
    }
  }

  const availableVotesStyle: AvailableVotesStyle = {
    "--height": "35px",
    "--width": "28px",
  };

  return (
    <div className={styles.AvailableVotes} style={availableVotesStyle}>
      <div className={styles.InfluenceIcon}>&#x2B21;</div>
      <div className={styles.InfluenceText}>{influence}</div>
      <div>+ {extraVotes}</div>
    </div>
  );
}
