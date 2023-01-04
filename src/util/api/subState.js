import { setSpeaker } from './state';
import { fetcher, poster } from './util'

export function clearSubState(mutate, gameid, subState) {
  const data = {
    action: "CLEAR_SUB_STATE",
  };

  const updatedSubState = {};

  const options = {
    optimisticData: updatedSubState,
  };

  return mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function setSubStateSelectedAction(mutate, gameid, subState, actionName) {
  const data = {
    action: "SET_ACTION",
    actionName: actionName,
  };

  const updatedSubState = {
    selectedAction: actionName,
  };

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function setSubStateSpeaker(mutate, gameid, subState, factionName) {
  const data = {
    action: "SET_SPEAKER",
    factionName: factionName,
  };

  const updatedSubState = {...subState};
  updatedSubState.speaker = factionName;

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function undoSubStateSpeaker(mutate, gameid, subState) {
  const data = {
    action: "UNDO_SPEAKER",
  };

  const updatedSubState = {...subState};
  delete updatedSubState.speaker;

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function addSubStateTech(mutate, gameid, subState, factionName, techName) {
  const data = {
    action: "ADD_TECH",
    factionName: factionName,
    techName: techName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].techs) {
    updatedSubState.factions[factionName].techs = [];
  }
  updatedSubState.factions[factionName].techs.push(techName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function removeSubStateTech(mutate, gameid, subState, factionName, techName) {
  const data = {
    action: "REMOVE_TECH",
    factionName: factionName,
    techName: techName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].techs) {
    updatedSubState.factions[factionName].techs = [];
  }
  updatedSubState.factions[factionName].techs =
    updatedSubState.factions[factionName].techs.filter((tech) => tech !== techName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function addSubStatePlanet(mutate, gameid, subState, factionName, planetName) {
  const data = {
    action: "ADD_PLANET",
    factionName: factionName,
    planetName: planetName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].planets) {
    updatedSubState.factions[factionName].planets = [];
  }
  updatedSubState.factions[factionName].planets.push(planetName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function removeSubStatePlanet(mutate, gameid, subState, factionName, planetName) {
  const data = {
    action: "REMOVE_PLANET",
    factionName: factionName,
    planetName: planetName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].planets) {
    updatedSubState.factions[factionName].planets = [];
  }
  updatedSubState.factions[factionName].planets =
    updatedSubState.factions[factionName].planets.filter((planet) => planet !== planetName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function scoreSubStateObjective(mutate, gameid, subState, factionName, objectiveName) {
  const data = {
    action: "SCORE_OBJECTIVE",
    factionName: factionName,
    objectiveName: objectiveName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].objectives) {
    updatedSubState.factions[factionName].objectives = [];
  }
  updatedSubState.factions[factionName].objectives.push(objectiveName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function unscoreSubStateObjective(mutate, gameid, subState, factionName, objectiveName) {
  const data = {
    action: "UNSCORE_OBJECTIVE",
    factionName: factionName,
    objectiveName: objectiveName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].objectives) {
    updatedSubState.factions[factionName].objectives = [];
  }
  updatedSubState.factions[factionName].objectives =
    updatedSubState.factions[factionName].objectives.filter((objective) => objective !== objectiveName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function castSubStateVotes(mutate, gameid, subState, factionName, target, numVotes) {
  const data = {
    action: "CAST_VOTES",
    factionName: factionName,
    target: target,
    numVotes: numVotes,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  updatedSubState.factions[factionName].votes = numVotes;
  updatedSubState.factions[factionName].target = target;

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function revealSubStateObjective(mutate, gameid, subState, objectiveName) {
  const data = {
    action: "REVEAL_OBJECTIVE",
    objectiveName: objectiveName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.objectives) {
    updatedSubState.objectives = [];
  }
  updatedSubState.objectives.push(objectiveName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function hideSubStateObjective(mutate, gameid, subState, objectiveName) {
  const data = {
    action: "HIDE_OBJECTIVE",
    objectiveName: objectiveName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.objectives) {
    updatedSubState.objectives = [];
  }
  updatedSubState.factions = {};
  delete updatedSubState.tieBreak;
  updatedSubState.objectives = updatedSubState.objectives.filter((objective) => objective !== objectiveName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function revealSubStateAgenda(mutate, gameid, subState, agendaName) {
  const data = {
    action: "REVEAL_AGENDA",
    agendaName: agendaName,
  };

  const updatedSubState = {...subState};
  updatedSubState.agenda = agendaName;

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function hideSubStateAgenda(mutate, gameid, subState, agendaName) {
  const data = {
    action: "HIDE_AGENDA",
  };

  const updatedSubState = {...subState};
  delete updatedSubState.agenda;

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function setSubStateOther(mutate, gameid, subState, fieldName, value) {
  const data = {
    action: "SET_OTHER_FIELD",
    fieldName: fieldName,
    value: value,
  };

  const updatedSubState = {...subState};
  updatedSubState[fieldName] = value;

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}

export function finalizeSubState(mutate, gameid, subState) {
  const data = {
    action: "FINALIZE_SUB_STATE",
  };

  const updatedSubState = {};

  const options = {
    optimisticData: {},
  };

  return mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data), options);
}