import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useRef, useState } from "react";
import { FactionCard } from '../FactionCard';
import { fetcher, poster } from '../util/api/util';
import { ObjectiveModal } from '../ObjectiveModal';
import { BasicFactionTile } from '../FactionTile';
import { ObjectiveRow } from '../ObjectiveRow';
import { removeObjective, revealObjective } from '../util/api/objectives';
import { claimPlanet, readyPlanets } from '../util/api/planets';
import { useSharedUpdateTimes } from '../Updater';
import { HoverMenu } from '../HoverMenu';

export default function SetupPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const [ showObjectiveModal, setShowObjectiveModal ] = useState(false);
  const [ subState, setSubState ] = useState({});
  const [ revealedObjectives, setRevealedObjectives ] = useState([]);
  const { setUpdateTime } = useSharedUpdateTimes();

  if (!state || !planets || !factions || !objectives || !options) {
    return <div>Loading...</div>;
  }

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  function factionTechChoicesComplete() {
    let complete = true;
    orderedFactions.forEach(([name, faction]) => {
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

  function factionSubFactionChoicesComplete() {
    if (!factions['Council Keleres']) {
      return true;
    }
    return (factions['Council Keleres'].startswith.planets ?? []).length !== 0;
  }

  function nextPhase(skipAgenda = false) {
    const data = {
      action: "ADVANCE_PHASE",
      skipAgenda: skipAgenda,
    };
    if (factions['Council Keleres']) {
      for (const planet of factions['Council Keleres'].startswith.planets) {
        claimPlanet(mutate, setUpdateTime, gameid, planets, planet, "Council Keleres", options);
      }
      readyPlanets(mutate, setUpdateTime, gameid, planets, factions['Council Keleres'].startswith.planets, "Council Keleres");
    }
    (subState.objectives ?? []).forEach((objective) => {
      revealObjective(mutate, setUpdateTime, gameid, objectives, null, objective.name);
    });
    const activeFactionName = state.speaker;
    const phase = "STRATEGY";

    const updatedState = {...state};
    state.phase = phase;
    state.activeplayer = activeFactionName;

    const updateOptions = {
      optimisticData: updatedState,
    };

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data, setUpdateTime), updateOptions);
  }

  function addObj(objective) {
    setSubState({
      ...subState,
      objectives: [...(subState.objectives ?? []), objective],
    })
  }

  function removeObj(objectiveName) {
    setSubState({
      ...subState,
      objectives: (subState.objectives ?? []).filter((objective) => objective.name !== objectiveName),
    });
    setRevealedObjectives(revealedObjectives.filter((objective) => objective.name !== objectiveName));
    removeObjective(mutate, setUpdateTime, gameid, objectives, null, objectiveName);
  }

  const stageOneObjectives = Object.values(objectives ?? {}).filter((objective) => objective.type === "stage-one");
  const selectedStageOneObjectives = stageOneObjectives.filter((objective) => objective.selected);

  function statusPhaseComplete() {
    return factionSubFactionChoicesComplete() &&
      factionTechChoicesComplete() &&
      (subState.objectives ?? []).length > 1;
      // selectedStageOneObjectives.length > 1;
  }

  const flexBasis = 100 / Object.keys(factions ?? {}).length;

  const revealedObjectiveNames = (subState.objectives ?? []).map((objective) => objective.name);
  const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
    return objective.type === "stage-one" && !revealedObjectiveNames.includes(objective.name);
  });

  return (
    <div className="flexColumn" style={{alignItems: "center", height: "100vh"}}>
      <ObjectiveModal visible={showObjectiveModal} type="stage-one" onComplete={() => setShowObjectiveModal(false)} />
      <ol className='flexColumn' style={{alignItems: "center", margin: "0px", padding: "0px", fontSize: "24px", gap: "8px"}}>
        <li>Build the galaxy</li>
        <li>Shuffle decks</li>
        <li>Gather starting components</li>
        <div className="flexRow" style={{alignItems:"stretch", justifyContent: "space-between", gap: "8px"}}>
          {orderedFactions.map(([name, faction]) => {
            return <div style={{flexBasis: `${flexBasis}%`, height: "100%"}}>
            <FactionCard key={name} faction={faction} opts={{
              displayStartingComponents: true,
              fontSize: "16px",
            }} />
            </div>
          })}
        </div>
        <li>Draw 2 secret objectives and keep one</li>
        <li>Re-shuffle secret objectives</li>
        <li>
          <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
            Draw 5 stage one objectives and reveal 2
          </div>
        </li>
        {(subState.objectives ?? []).map((objective) => {
          return <ObjectiveRow objective={objective} removeObjective={() => removeObj(objective.name)} viewing={true} />;
        })}
        {(subState.objectives ?? []).length < 2 ? 
          <HoverMenu label="Reveal Objective" direction="up">
            <div className='flexColumn' style={{gap: "4px", alignItems: "stretch", whiteSpace: "nowrap", padding: "8px"}}>
              {Object.values(availableObjectives).filter((objective) => {
                return objective.type === "stage-one"
              })
                .map((objective) => {
                  return <button onClick={() => addObj(objective)}>{objective.name}</button>
                })}
            </div>
          </HoverMenu>
        : null}
        <li>
          <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
            Draw 5 stage two objectives
          </div>
        </li>
      </ol>
      {!factionTechChoicesComplete() ?
        <div style={{color: "darkred"}}>Select all faction tech choices</div> :
        null}
      {!factionSubFactionChoicesComplete() ?
        <div style={{color: "darkred"}}>Select Council Keleres sub-faction</div> :
        null}
      {(subState.objectives).length < 2 ? <div style={{color: "darkred"}}>Reveal two stage one objectives</div> : null}
      <button disabled={!statusPhaseComplete()} style={{fontSize: "24px"}} onClick={() => nextPhase()}>Start Game</button>
    </div>
  );
}