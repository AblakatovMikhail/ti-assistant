import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router'
import { AddPlanetList } from "/src/AddPlanetList.js";
import { AddTechList } from "/src/AddTechList.js";
import { Resources } from "/src/Resources.js";
import { PlanetRow, PlanetAttributes, PlanetSymbol } from "/src/PlanetRow.js";
import { TechRow } from "/src/TechRow.js";
import { Tab, TabBody } from "/src/Tab.js";
import { Modal } from "/src/Modal.js";
import useSWR, { useSWRConfig } from 'swr'
import { ObjectiveList } from "/src/ObjectiveList";
import { fetcher, poster } from '../../../src/util/api/util';
import { pluralize } from "../../../src/util/util";
import { hasTech, lockTech, unlockTech } from "../../../src/util/api/techs";
import { claimPlanet, exhaustPlanets, readyPlanets, unclaimPlanet } from "../../../src/util/api/planets";
import { FactionCard, StartingComponents } from "../../../src/FactionCard";
import { BasicFactionTile } from "../../../src/FactionTile";
import { TechIcon } from "../../../src/TechRow";
import { FactionSummary } from "../../../src/FactionSummary";
import { FactionTimer } from "../../../src/Timer";
import { applyAllPlanetAttachments, filterToClaimedPlanets } from "../../../src/util/planets";
import { filterToOwnedTechs, filterToUnownedTechs, sortTechs } from "../../../src/util/techs";
import { Updater, useSharedUpdateTimes } from "../../../src/Updater";
import { LabeledDiv } from "../../../src/LabeledDiv";
import { StrategyCard } from "../../../src/StrategyCard";
import { assignStrategyCard } from "../../../src/util/api/cards";
import { nextPlayer } from "../../../src/util/api/state";
import { ActivePlayerColumn, AdditionalActions, FactionActionButtons, FactionActions, NextPlayerButtons } from "../../../src/main/ActionPhase";
import { getFactionColor, getFactionName } from "../../../src/util/factions";
import { HoverMenu } from "../../../src/HoverMenu";
import { castSubStateVotes, finalizeSubState, hideSubStateAgenda, hideSubStateObjective, revealSubStateAgenda, revealSubStateObjective, scoreSubStateObjective, setSubStateOther, unscoreSubStateObjective } from "../../../src/util/api/subState";
import { SelectableRow } from "../../../src/SelectableRow";
import { ObjectiveRow } from "../../../src/ObjectiveRow";
import { scoreObjective, unscoreObjective } from "../../../src/util/api/objectives";
import { AgendaRow } from "../../../src/AgendaRow";
import { getTargets, VoteCount } from "../../../src/VoteCount";
import { computeVotes } from "../../../src/main/AgendaPhase";
import { repealAgenda, resolveAgenda } from "../../../src/util/api/agendas";
import { updateCastVotes } from "../../../src/util/api/factions";

const techOrder = [
  "green",
  "blue",
  "yellow",
  "red",
  "upgrade",
];

function PhaseSection() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid, faction: factionName } = router.query;
  const { data: agendas = {} } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);
  const { data: attachments = {} } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: strategycards = {} } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions = {}, error: factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: planets = {} } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: objectives = {} } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: state = {}, error: stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: subState = {}, error: subStateError } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);
  const { data: strategyCards = {} } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  


  if (!state) {
    return null;
  }

  function assignCard(card) {
    assignStrategyCard(mutate, gameid, strategyCards, card.name, factionName);
    nextPlayer(mutate, gameid, state, factions, strategyCards);
  }
  function addObj(objective) {
    revealSubStateObjective(mutate, gameid, subState, objective.name);
  }
  function removeObj(objectiveName) {
    hideSubStateObjective(mutate, gameid, subState, objectiveName);
  }
  function scoreObj(factionName, objective) {
    scoreObjective(mutate, gameid, objectives, factionName, objective.name);
    scoreSubStateObjective(mutate, gameid, subState, factionName, objective.name);
  }
  function unscoreObj(factionName, objectiveName) {
    unscoreObjective(mutate, gameid, objectives, factionName, objectiveName);
    unscoreSubStateObjective(mutate, gameid, subState, factionName, objectiveName);
  }
  function selectAgenda(agendaName) {
    revealSubStateAgenda(mutate, gameid, subState, agendaName);
  }
  function hideAgenda(agendaName) {
    hideSubStateAgenda(mutate, gameid, subState, agendaName);
  }
  function selectEligibleOutcome(outcome) {
    setSubStateOther(mutate, gameid, subState, "outcome", outcome);
  }
  function selectSpeakerTieBreak(tieBreak) {
    setSubStateOther(mutate, gameid, subState, "tieBreak", tieBreak);
  }
  const orderedAgendas = Object.values(agendas ?? {}).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });
  const outcomes = new Set();
  Object.values(agendas ?? {}).forEach((agenda) => {
    if (agenda.target || agenda.elect === "???") return;
    outcomes.add(agenda.elect);
  });
  let currentAgenda = null;
  const agendaNum = subState.agendaNum ?? 1;
  if (agendaNum > 2) {
    return null;
  }
  if (subState.agenda) {
    currentAgenda = agendas[subState.agenda];
  }
  const factionSubState = ((subState.factions ?? {})[factionName] ?? {});
  
  const localAgenda = {...currentAgenda};
  if (subState.outcome) {
    localAgenda.elect = subState.outcome;
  }
  const targets = getTargets(localAgenda, factions, strategycards, planets, agendas, objectives);
  const totalVotes = computeVotes(currentAgenda, subState.factions);
  const maxVotes = Object.values(totalVotes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(totalVotes).filter(([target, voteCount]) => {
    return voteCount === maxVotes;
  }).map(([target, voteCount]) => {
    return target;
  });
  const isTie = selectedTargets.length !== 1;
  const ownedPlanets = filterToClaimedPlanets(planets, factionName);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  let influence = 0;
  for (const planet of updatedPlanets) {
    if (planet.ready || opts.total) {
      influence += planet.influence;
    }
  }
  influence -= Math.min(factions[factionName].votes ?? 0, influence);
  let extraVotes = 0;
  if (factionName === "Argent Flight") {
    extraVotes += Object.keys(factions).length;
  }
  if (hasTech(factions[factionName], "Predictive Intelligence")) {
    extraVotes += 3;
  }
  const label = !!subState.miscount ? "Re-voting on Miscounted Agenda" : agendaNum === 1 ? "FIRST AGENDA" : "SECOND AGENDA";
  async function completeAgenda() {
    const target = subState.tieBreak ? subState.tieBreak : selectedTargets[0];
    let activeAgenda = subState.agenda;
    if (subState.subAgenda) {
      activeAgenda = subState.subAgenda;
      resolveAgenda(mutate, gameid, agendas, subState.agenda, subState.subAgenda);
    }
    resolveAgenda(mutate, gameid, agendas, activeAgenda, target);

    updateCastVotes(mutate, gameid, factions, subState.factions);
    hideSubStateAgenda(mutate, gameid, subState);
    // await finalizeSubState(mutate, gameid, subState);
    if (activeAgenda === "Miscount Disclosed") {
      repealAgenda(mutate, gameid, agendas, target);
      revealSubStateAgenda(mutate, gameid, subState, target);
      setSubStateOther(mutate, gameid, subState, "miscount", true);
    } else {
      const agendaNum = subState.agendaNum ?? 1;
      setSubStateOther(mutate, gameid, subState, "agendaNum", agendaNum + 1);
    }
  }
  function castVotes(target, votes) {
    if (!target || target === "Abstain") {
      castSubStateVotes(mutate, gameid, subState, factionName, "Abstain", 0);
    } else {
      castSubStateVotes(mutate, gameid, subState, factionName, target, votes);
    }
  }

  const isSpeaker = state.speaker === factionName;
  let phaseName = `${state.phase} PHASE`;
  let phaseContent = null;
  switch (state.phase) {
    case "SETUP": {
      const revealedObjectiveNames = (subState.objectives ?? []);
      const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
        return objective.type === "stage-one" && !revealedObjectiveNames.includes(objective.name);
      });
      phaseName = "SETUP PHASE"
      phaseContent = 
      <React.Fragment>
              {isSpeaker ? <LabeledDiv label="Speaker Actions">
          {(subState.objectives ?? []).length > 0 ? 
              <LabeledDiv label="REVEALED OBJECTIVES">
                {(subState.objectives ?? []).map((objectiveName) => {
                  return <ObjectiveRow key={objectiveName} objective={objectives[objectiveName]} removeObjective={() => removeObj(objectiveName)} viewing={true} />;
                })}
              </LabeledDiv>
            : null}
        {(subState.objectives ?? []).length < 2 ? 
          <HoverMenu label="Reveal Objective">
            <div className="flexRow" style={{writingMode: "vertical-lr", justifyContent: "flex-start", maxHeight: "400px", flexWrap: "wrap", whiteSpace: "nowrap", padding: "8px", gap: "4px", alignItems: "stretch", maxWidth: "85vw", overflowX: "scroll"}}>
              {Object.values(availableObjectives).filter((objective) => {
                return objective.type === "stage-one"
              })
                .map((objective) => {
                  return <button key={objective.name} onClick={() => addObj(objective)}>{objective.name}</button>
                })}
            </div>
          </HoverMenu>
        : null}
        </LabeledDiv> : null}
        <LabeledDiv label="Starting Components">
          <div style={{fontSize: "16px", whiteSpace: "nowrap"}}>
            <StartingComponents faction={factions[factionName]} />
          </div>
        </LabeledDiv>
      </React.Fragment>;
      break;
    }
    case "STRATEGY":
      if (factionName === state.activeplayer) {
        phaseName = "SELECT STRATEGY CARD";
        phaseContent = 
          <div className="flexColumn" style={{alignItems: "stretch", width: "100%", gap: "4px"}}>
          {Object.values(strategyCards).filter((card) => !card.faction)
            .map((card) => {
              return <StrategyCard key={card.name} card={card} active={true} onClick={() => assignCard(card)} />;
            })}
          </div>;
      }
      break;
    case "ACTION":
      if (factionName === state.activeplayer) {
        phaseName = "ACTION PHASE";
        phaseContent = 
          <React.Fragment>
            <FactionActionButtons factionName={factionName} />
            <AdditionalActions
              factionName={factionName}
              visible={!!subState.selectedAction}
              style={{width: "100%"}}
              hoverMenuStyle={{overflowX: "scroll", maxWidth: "85vw"}} 
              factionOnly={true} />
            {subState.selectedAction ? <div className="flexRow" style={{width: "100%", paddingTop: "8px"}}>
              <NextPlayerButtons factionName={factionName} buttonStyle={{fontSize: "20px"}} />
            </div> : null}
          </React.Fragment>;
          // <React.Fragment>

          //   <AdditionalActions visible={!!subState.selectedAction} />
          // </React.Fragment>;
      } else if (subState.selectedAction === "Technology") {
        // TODO: Let faction select technology.
        phaseContent = <AdditionalActions
          factionName={factionName}
          visible={!!subState.selectedAction}
          style={{width: "100%"}}
          hoverMenuStyle={{overflowX: "scroll", maxWidth: "85vw"}} 
          factionOnly={true} />
      }
      break;
    case "STATUS": {
      const type = (state.round < 4) ? "stage-one" : "stage-two";
      const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
        return objective.selected && (objective.type === "stage-one" || objective.type === "stage-two") && !(objective.scorers ?? []).includes(factionName);
      });
      const secrets = Object.values(objectives ?? {}).filter((objective) => {
        return objective.type === "secret" &&
          !(objective.scorers ?? []).includes(factionName) &&
          objective.phase === "status";
      })
      const scoredPublics = (((subState.factions ?? {})[factionName] ?? {}).objectives ?? []).filter((objective) => {
        return objectives[objective].type === "stage-one" || objectives[objective].type === "stage-two";
      });
      const scoredSecrets = (((subState.factions ?? {})[factionName] ?? {}).objectives ?? []).filter((objective) => {
        return objectives[objective].type === "secret";
      });
      const revealableObjectives = Object.values(objectives ?? {}).filter((objective) => {
        return objective.type === type && !objective.selected;
      });
      phaseName = "STATUS PHASE";
      phaseContent =
        // <LabeledDiv label="SCORE OBJECTIVES">
        <React.Fragment>
        <div className='flexColumn' style={{gap: "4px", padding: "8px", flexWrap: "wrap", alignItems: "stretch"}}>
        {scoredPublics.length > 0 ?
          <LabeledDiv label="SCORED PUBLIC" style={{whiteSpace: "nowrap"}}>
            <SelectableRow itemName={scoredPublics[0]} removeItem={() => unscoreObj(factionName, scoredPublics[0])}>
              {scoredPublics[0]}
            </SelectableRow>
          </LabeledDiv>
        : <HoverMenu label="Score Public Objective">
          <div className="flexColumn" style={{whiteSpace: "nowrap", padding: "8px", gap: "4px", alignItems: "stretch"}}>
          {availableObjectives.length === 0 ? "No unscored public objectives" : null}
          {availableObjectives.map((objective) => {
            return <button key={objective.name} onClick={() => scoreObj(factionName, objective)}>{objective.name}</button>
          })}
          </div> 
        </HoverMenu>}
        {scoredSecrets.length > 0 ? 
          <LabeledDiv label="SCORED SECRET" style={{whiteSpace: "nowrap"}}>
          <SelectableRow itemName={scoredSecrets[0]} removeItem={() => unscoreObj(factionName, scoredSecrets[0])}>
            {scoredSecrets[0]}
          </SelectableRow>
          </LabeledDiv>
          : <HoverMenu label="Score Secret Objective">
          <div className="flexRow" style={{writingMode: "vertical-lr", justifyContent: "flex-start", maxHeight: "400px", flexWrap: "wrap", whiteSpace: "nowrap", padding: "8px", gap: "4px", alignItems: "stretch", maxWidth: "85vw", overflowX: "scroll"}}>
          {secrets.map((objective) => {
            return <button key={objective.name} onClick={() => scoreObj(factionName, objective)}>{objective.name}</button>
          })}
          </div>
        </HoverMenu>}
        </div>
        {isSpeaker ?
          <LabeledDiv label="Speaker Actions">
          {(subState.objectives ?? []).length > 0 ? 
            <LabeledDiv label="REVEALED OBJECTIVE"><ObjectiveRow objective={objectives[subState.objectives[0]]} removeObjective={() => removeObj(subState.objectives[0])} viewing={true} /></LabeledDiv>
          :
          <div className='flexRow' style={{whiteSpace: "nowrap"}}>
            {(subState.objectives ?? []).map((objective) => {
              return <ObjectiveRow objective={objectives[objective]} removeObjective={() => removeObj(objective.name)} viewing={true} />;
            })}
            {(subState.objectives ?? []).length < 1 ? 
              <HoverMenu label={`Reveal one Stage ${state.round > 3 ? "II" : "I"} objective`} style={{maxHeight: "400px"}}>
                <div className='flexRow' style={{maxWidth: "85vw", gap: "4px", whiteSpace: "nowrap", padding: "8px", flexWrap: "wrap", alignItems: "stretch", writingMode: "vertical-lr", justifyContent: "flex-start", overflowX: "scroll"}}>
                  {Object.values(revealableObjectives).filter((objective) => {
                    return objective.type === (state.round > 3 ? "stage-two" : "stage-one");
                  })
                    .map((objective) => {
                      return <button key={objective.name} onClick={() => addObj(objective)}>{objective.name}</button>
                    })}
                </div>
              </HoverMenu>
            : null}
            </div>}
          </LabeledDiv>
        : null}
        </React.Fragment>;
        break;
    }
    case "AGENDA": {
      phaseName = "AGENDA PHASE";
      phaseContent = <React.Fragment>
        {isSpeaker ? 
            (!currentAgenda ? <HoverMenu label="Reveal and Read one Agenda">
            <div className='flexRow' style={{maxWidth: "85vw", gap: "4px", whiteSpace: "nowrap", padding: "8px", flexWrap: "wrap", alignItems: "stretch", writingMode: "vertical-lr", justifyContent: "flex-start", overflowX: "scroll"}}>
              {orderedAgendas.map((agenda) => {
                  return <button key={agenda.name} onClick={() => selectAgenda(agenda.name)}>{agenda.name}</button>
                })}
              </div>
            </HoverMenu> :
            <React.Fragment>
              <LabeledDiv label={label}>
                <AgendaRow agenda={currentAgenda} removeAgenda={() => {hideAgenda(currentAgenda.name)}} />
              </LabeledDiv>
              {currentAgenda.name === "Covert Legislation" ?
                (subState.outcome ? 
                  <LabeledDiv label="ELIGIBLE OUTCOMES">
                  <SelectableRow itemName={subState.outcome} content={
                    <div style={{display: "flex", fontSize: "18px"}}>
                      {subState.outcome}
                    </div>} removeItem={() => selectEligibleOutcome(null)} />
                  </LabeledDiv> :
                <HoverMenu label="Reveal Eligible Outcomes">
                  <div className='flexColumn' style={{padding: "8px", gap: "4px", alignItems: "stretch", justifyContent: 'flex-start'}}>
                  {Array.from(outcomes).map((outcome) => {
                    return <button key={outcome} onClick={() => selectEligibleOutcome(outcome)}>{outcome}</button>
                  })}
                  </div>
                </HoverMenu>)
              : null}
            </React.Fragment>
            )
        : null}
        {currentAgenda ? 
          <div className="flexColumn" style={{alignItems: "stretch", width: "100%"}}>
            <LabeledDiv label="VOTE ON AGENDA">
              <LabeledDiv label={<div style={{fontFamily: "Myriad Pro"}}>Target</div>}>
          <HoverMenu label={factionSubState.target ? factionSubState.target : "Select Vote Target"}>
            <div className="flexRow" style={{maxWidth: "85vw", gap: "4px", whiteSpace: "nowrap", padding: "8px", flexWrap: "wrap", alignItems: "stretch", writingMode: "vertical-lr", justifyContent: "flex-start", overflowX: "scroll"}}>
                  {targets.map((target) => {
                    return (
                      <button key={target} onClick={() => {castVotes(target, 0)}}>{target}</button>
                    );
                  })}
                </div>
              </HoverMenu>
            </LabeledDiv>
            <div className="flexRow" style={{width: '100%', gap: "12px", alignItems: "stretch"}}>
              <LabeledDiv label={<div style={{fontFamily: "Myriad Pro"}}>Available Votes</div>}>
                
        <div className="votingBlock">
              <div className="influenceSymbol">
                &#x2B21;
              </div>
              <div className="influenceTextWrapper">
                {influence}
              </div>
              <div style={{fontSize: "16px"}}>
            + {extraVotes}
            </div>
            </div>
              </LabeledDiv>
            <LabeledDiv label={<div style={{fontFamily: "Myriad Pro"}}>Cast Votes</div>}>
            <div className="flexRow" style={{justifyContent: "flex-start", flexShrink: 0, gap: "12px", fontSize: "24px", paddingLeft: "12px"}}>
            {factionSubState.votes > 0 ? <div className="arrowDown" onClick={() => castVotes(factionSubState.target, factionSubState.votes - 1)}></div> : <div style={{width: "12px"}}></div>}
            <div className="flexRow" style={{width: "32px"}}>{factionSubState.votes ?? 0}</div>
            {factionSubState.target && factionSubState.target !== "Abstain" ? <div className="arrowUp" onClick={() => castVotes(factionSubState.target, factionSubState.votes + 1)}></div> : null}
          </div>
            </LabeledDiv>
            </div>
          </LabeledDiv>
          {isSpeaker && isTie ?
              (!subState.tieBreak ?
              <HoverMenu label="Choose outcome (vote tied)">
                <div className="flexRow" style={{maxWidth: "85vw", gap: "4px", whiteSpace: "nowrap", padding: "8px", flexWrap: "wrap", alignItems: "stretch", writingMode: "vertical-lr", justifyContent: "flex-start", overflowX: "scroll"}}>
                  {selectedTargets.length > 0 ? selectedTargets.map((target) => {
                    return <button key={target} className={subState.tieBreak === target ? "selected" : ""} onClick={() => selectSpeakerTieBreak(target)}>{target}</button>;
                  }) : 
                  targets.map((target) => {
                    if (target === "Abstain") {
                      return null;
                    }
                    return <button key={target} className={subState.tieBreak === target ? "selected" : ""} onClick={() => selectSpeakerTieBreak(target)}>{target}</button>;
                  })}
                </div>
              </HoverMenu> : 
            <LabeledDiv label="TIE BREAK">
              <SelectableRow itemName={subState.tieBreak} removeItem={() => selectSpeakerTieBreak(null)}>
                {subState.tieBreak}
              </SelectableRow>
            </LabeledDiv>
              )
          : null}
          {isSpeaker && (selectedTargets.length === 1 || subState.tieBreak) ? 
            <div className="flexRow" style={{width: "100%", justifyContent: "center"}}>
              <button onClick={completeAgenda}>Resolve with target: {selectedTargets.length === 1 ? selectedTargets[0] : subState.tieBreak}</button>
            </div>
          : null}
          </div>
          // <VoteCount factionName={factionName} agenda={currentAgenda} />
        : null}
      </React.Fragment>;
      break;
    }
  }
  if (!phaseContent) {
    return null;
  }
  return (
    <LabeledDiv label={phaseName}>
      {phaseContent}
    </LabeledDiv>
  )
}

function Actions({faction}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  switch (state.phase) {
    case "ACTION":
      return <div className="flexColumn">
        {state.activeplayer === faction.name ?
          <React.Fragment>
            Select Action
            <div className="flexRow" style={{gap: "8px", flexWrap: "wrap"}}>
            <button style={{fontSize: "12px"}}>Construction</button>
            <button style={{fontSize: "12px"}}>Technology</button>
            <button style={{fontSize: "12px"}}>Tactical</button>
            <button style={{fontSize: "12px"}}>Component</button>
            <button style={{fontSize: "12px"}}>Pass</button>

            </div>
            <button>End Turn</button>
          </React.Fragment>
        : null}
      </div>

  }
  return <div>
    TODO: Get subState info.
    {state.activeplayer === faction.name ?
      <div>Current player</div> 
    : null}
  </div>
}

function Prompt({ faction, prompt }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: techs, techError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  
  if (factionsError) {
    return (<div>Failed to load factions</div>);
  }
  if (techError) {
    return (<div>Failed to load techs</div>);
  }
  if (!techs || !factions) {
    return (<div>Loading...</div>);
  }

  const startswith = faction.startswith;
  const startingTechs = filterToStartingTechs(techs, faction);
  sortTechs(startingTechs);
  // const orderedTechs = (startswith.techs ?? []).map((tech) => {
  //   return techs[tech];
  // }).sort((a, b) => {
  //   const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
  //   if (typeDiff !== 0) {
  //     return typeDiff;
  //   }
  //   const prereqDiff = a.prereqs.length - b.prereqs.length;
  //   if (prereqDiff !== 0) {
  //     return prereqDiff;
  //   }
  //   if (a.name < b.name) {
  //     return -1;
  //   } else {
  //     return 1;
  //   }
  // });
  const orderedChoices = ((startswith.choice ?? {}).options ?? []).filter((tech) => {
    return !(startswith.techs ?? []).includes(tech);
  }).map((tech) => {
    return techs[tech];
  }).sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
  async function addTech(tech) {
    const data = {
      action: "CHOOSE_STARTING_TECH",
      faction: faction.name,
      tech: tech,
      returnAll: true,
    };

    const updatedFactions = {...factions};

    updatedFactions[faction.name].startswith.techs = [
      ...(updatedFactions[faction.name].startswith.techs ?? []),
      tech,
    ];
    if (updatedFactions["Council Keleres"]) {
      const councilChoice = new Set(updatedFactions["Council Keleres"].startswith.choice.options);
      councilChoice.add(tech);
      updatedFactions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
    }

    const options = {
      optimisticData: updatedFactions,
    };

    await mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
  }

  async function removeTech(tech) {
    const data = {
      action: "REMOVE_STARTING_TECH",
      faction: faction.name,
      tech: tech,
      returnAll: true,
    };

    const updatedFactions = {...factions};

    updatedFactions[faction.name].startswith.techs = (updatedFactions[faction.name].startswith.techs ?? []).filter((startingTech) => startingTech !== tech);
    
    if (updatedFactions["Council Keleres"]) {
      const councilChoice = new Set();
      for (const [name, faction] of Object.entries(factions)) {
        if (name === "Council Keleres") {
          continue;
        }
        (faction.startswith.techs ?? []).forEach((tech) => {
          councilChoice.add(tech);
        });
      }
      updatedFactions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
      for (const [index, tech] of (factions["Council Keleres"].startswith.techs ?? []).entries()) {
        if (!councilChoice.has(tech)) {
          delete updatedFactions["Council Keleres"].techs[tech];
          factions["Council Keleres"].startswith.techs.splice(index, 1);
        }
      }
    }

    const options = {
      optimisticData: updatedFactions,
    };

    await mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
  }

  const numToChoose = !startswith.choice ? 0 : startswith.choice.select - (startswith.techs ?? []).length;

  function confirmChoice() {
    // TODO: This should clear the prompt on the server (or mark as completed)
  }

  switch (prompt.type) {
    case "STARTING_TECH":
      return <div> 
        Techs {startswith.choice ? "(Choice)" : null}
        <div style={{paddingLeft: "4px"}}>
          {startingTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} removeTech={startswith.choice ? () => removeTech(tech.name) : null} />;
          })}
        </div>
        {numToChoose > 0 ?
          <div>
            Choose {numToChoose} more {pluralize("tech", numToChoose)}
            <div>
              {orderedChoices.map((tech) => {
                return <TechRow key={tech.name} tech={tech} addTech={() => addTech(tech.name)} />;
              })}
            </div>
          </div>
        : <button onClick={confirmChoice}>Confirm</button>}
      </div>;
  }
}

function FactionContent() {
  const [showAddTech, setShowAddTech] = useState(false);
  const [showAddPlanet, setShowAddPlanet] = useState(false);
  const [tabShown, setTabShown] = useState("planets");
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: factions, error: factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: planets, error: planetsError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: techs, error: techsError } = useSWR(gameid && playerFaction ? `/api/${gameid}/techs` : null, fetcher);
  const { data: strategyCards, error: cardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: options, error: optionsError } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const { data: state, error: stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);


  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (factionsError) {
    return (<div>Failed to load factions</div>);
  }
  if (objectivesError) {
    return (<div>Failed to load objectives</div>);
  }
  if (planetsError) {
    return (<div>Failed to load planets</div>);
  }
  if (techsError) {
    return (<div>Failed to load technologies</div>);
  }
  if (cardsError) {
    return (<div>Failed to load cards</div>);
  }
  // if (!strategyCards || !attachments || !factions || !objectives || !planets || !technologies) {
  //   return (<div>Loading...</div>);
  // }

  if (!factions[playerFaction]) {
    router.push(`/game/${gameid}`);
    return;
  }

  const ownedPlanets = filterToClaimedPlanets(planets, playerFaction);

  function toggleAddTechMenu() {
    setShowAddTech(!showAddTech);
  }

  function removePlanet(toRemove) {
    unclaimPlanet(mutate, gameid, planets, toRemove, playerFaction);
  }

  function addPlanet(toAdd) {
    claimPlanet(mutate, gameid, planets, toAdd, playerFaction, options);
  }
  
  function removeTech(toRemove) {
    lockTech(mutate, gameid, factions, playerFaction, toRemove);
  }

  function addTech(toAdd) {
    unlockTech(mutate, gameid, factions, playerFaction, toAdd);
  }

  function readyAll() {
    const planetNames = ownedPlanets.map((planet) => planet.name);
    readyPlanets(mutate, gameid, planets, planetNames, playerFaction);
  }

  function exhaustAll() {
    const planetNames = ownedPlanets.map((planet) => planet.name);
    exhaustPlanets(mutate, gameid, planets, planetNames, playerFaction);
  }

  function updatePlanet(name, updatedPlanet) {
    if (updatedPlanet.ready) {
      readyPlanets(mutate, gameid, planets, [name], playerFaction);
    } else {
      exhaustPlanets(mutate, gameid, planets, [name], playerFaction);
    }
  }
  
  const faction = factions[playerFaction];

  const techsObj = {};
  Object.values(techs ?? {}).forEach((tech) => {
    if (tech.faction) {
      if (playerFaction === "Nekro Virus" && !factions[tech.faction]) {
        return;
      } else if (playerFaction !== "Nekro Virus" && tech.faction !== playerFaction) {
        return;
      }
    }
    techsObj[tech.name] = tech;
  });
  if (playerFaction !== "Nekro Virus") {
    Object.values(techsObj).forEach((tech) => {
      if (tech.replaces) {
        delete techsObj[tech.replaces];
      }
    });
  }


  const ownedTechs = filterToOwnedTechs(techsObj, faction);
  ownedTechs.sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
  const remainingTechs = filterToUnownedTechs(techsObj, faction);

  const claimedPlanets = filterToClaimedPlanets(planets, playerFaction);
  const updatedPlanets = applyAllPlanetAttachments(claimedPlanets, attachments);

  let VPs = 0;
  for (const objective of Object.values(objectives ?? {})) {
    if ((objective.scorers ?? []).includes(playerFaction)) {
      VPs += objective.points;
    }
  }

  function remainingResources() {
    return updatedPlanets.reduce((prev, current) => {
      if (!current.ready) {
        return prev;
      }
      return prev + current.resources;
    }, 0);
  }
  function remainingInfluence() {
    return updatedPlanets.reduce((prev, current) => {
      if (!current.ready) {
        return prev;
      }
      return prev + current.influence;
    }, 0);
  }

  function allPlanetsExhausted() {
    for (const planet of updatedPlanets) {
      if (planet.ready) {
        return false;
      }
    }
    return true;
  }

  function allPlanetsReady() {
    for (const planet of updatedPlanets) {
      if (!planet.ready) {
        return false;
      }
    }
    return true;
  }

  const orderedFactions = Object.values(factions ?? {}).sort((a, b) => a.order - b.order);

  function toggleAddPlanetMenu() {
    setShowAddPlanet(!showAddPlanet);
  }

  const maxHeight = screen.height - 420;
  return (<div className="flexColumn" style={{gap: "8px", width: "100%"}}>
          <Modal closeMenu={toggleAddTechMenu} visible={showAddTech} title="Research Tech"
        content={
          <AddTechList techs={remainingTechs} addTech={addTech} />
        } />
      <Modal closeMenu={toggleAddPlanetMenu} visible={showAddPlanet} title="Add Planet"
        content={
          <AddPlanetList planets={planets} addPlanet={addPlanet} />
      } />
  <FactionSummary factionName={playerFaction} VPs={VPs} ownedTechs={ownedTechs} ownedPlanets={updatedPlanets} options={{showIcon: true}} />
  <div
    style={{
      width: "100%",
      maxWidth: "800px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexBasis: "100%"
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", width: "100%", padding: "8px"}}
      >
      <PhaseSection />
        {/* Tabs */}
        <div className="flexRow" style={{ margin: "0px 4px", borderBottom: "1px solid grey"}}>
          <Tab selectTab={setTabShown} id="techs" selectedId={tabShown} content="Techs" />
          <Tab selectTab={setTabShown} id="planets" selectedId={tabShown} content="Planets" />
          <Tab selectTab={setTabShown} id="objectives" selectedId={tabShown} content="Objectives" />
        </div>
        <TabBody id="techs" selectedId={tabShown} content={
        <div>
          <div className="flexRow" style={{height: "32px"}}>
            <button onClick={toggleAddTechMenu}>Research Tech</button>
          </div>
          <div className="flexColumn" style={{gap: "8px", maxHeight: `${maxHeight}px`, padding: "6px", overflow: "auto", justifyContent: "space-between", alignItems: "stretch"}}>
            {ownedTechs.map((tech) => {
              return <TechRow key={tech.name} tech={tech} removeTech={removeTech} />
            })}
          </div>
        </div>} />
        <TabBody id="planets" selectedId={tabShown} content={
        <div>
        <div className="flexRow" style={{height: "32px"}}>
          <button onClick={toggleAddPlanetMenu}>Add Planet</button>
          <button onClick={readyAll} disabled={allPlanetsReady()}>Ready All</button>
          <button onClick={exhaustAll} disabled={allPlanetsExhausted()}>Exhaust All</button>
        </div>
        <div style={{maxHeight: `${maxHeight}px`, overflow: "auto", paddingBottom: "4px"}}>
          {updatedPlanets.map((planet) => {
            return <PlanetRow key={planet.name} factionName={playerFaction} planet={planet} updatePlanet={updatePlanet} removePlanet={removePlanet} opts={{showAttachButton: true}} />;
          })}
        </div>
        </div>} />

        <TabBody id="objectives" selectedId={tabShown} content={
          <ObjectiveList objectives={objectives} faction={factions[playerFaction]} />
        } />
      </div>
    </div>
  </div>
</div>);
}

export default function GamePage() {
  const router = useRouter();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: factions, error: factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state, error: stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards, error: cardsError } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);

  if (factionsError || cardsError || stateError) {
    return (<div>Failed to load factions</div>);
  }
  if (!factions || !strategyCards || !state) {
    return (<div>Loading...</div>);
  }

  if (!factions[playerFaction]) {
    router.push(`/game/${gameid}`);
    return
  }
  
  function swapToFaction(factionName) {
    router.push(`/game/${gameid}/${factionName}`);
    return;
  }

  let orderedFactions = [];
  let orderTitle = "";
  switch (state.phase) {
    case "SETUP":
    case "STRATEGY":
    case "AGENDA":
      orderTitle = "Speaker Order";
      orderedFactions = Object.values(factions).sort((a, b) => a.order - b.order);
      break;
    case "ACTION":
    case "STATUS":
      orderTitle = "Initiative Order";
      const orderedCards = Object.values(strategyCards).sort((a, b) => a.order - b.order);
      for (const card of orderedCards) {
        if (card.faction) {
          orderedFactions.push(factions[card.faction]);
        }
      }
      break;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Updater />
      <div className="flexColumn" style={{width: "100%", maxWidth: "800px"}}>
      {/* TODO: Uncomment after putting in server-side functionality for adding/removing prompts */}
      {/* <Modal closeMenu={ignorePrompt} visible={validPrompts.length > 0} title={validPrompts[0].title}
        content={
          <Prompt prompt={validPrompts[0]} faction={faction} />
        } /> */}
      <h2
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "8px 0",
          fontWeight: "normal",
        }}
      >
        Twilight Imperium Assistant
      </h2>
  <div className="flexColumn" style={{ height: "60px", width: "100%", gap: "4px", fontSize: "18px", marginBottom: "8px"}}>
    {orderTitle}
    <div className="flexRow" style={{width: "100%", alignItems: "space-evenly"}}>
      {orderedFactions.map((faction) => {
        return <BasicFactionTile key={faction.name} faction={faction} onClick={() => swapToFaction(faction.name)} opts={{hideName: true, iconSize: 28}} />
      })}
    </div>
  </div>
      <div style={{width: "100%", margin: "4px"}}>
        {/* <LabeledDiv>
          <FactionContent />
        </LabeledDiv> */}
        <FactionCard faction={factions[playerFaction]} style={{width: "100%"}} opts={{hideTitle: true}}>
          <FactionContent />
        </FactionCard>
      </div>
      </div>
    </div>);
}
