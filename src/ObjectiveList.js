import { useState } from "react";
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'

import { fetcher, poster } from './util/api/util'
import { ObjectiveRow } from "/src/ObjectiveRow.js";
import { Tab, TabBody } from "/src/Tab.js";
import { revealObjective, removeObjective, scoreObjective, unscoreObjective } from "./util/api/objectives";
import { FactionSymbol } from "./FactionCard";


function sortObjectives(objectives, field, descending = false) {
  objectives.sort((a, b) => {
    if (a[field] > b[field]) {
      return descending ? -1 : 1;
    }
    if (a[field] < b[field]) {
      return descending ? 1 : -1;
    }
    return 0;
  });
}

function SecretTab() {
  const router = useRouter();
  const { game: gameid, faction: factionName } = router.query;
  const { mutate } = useSWRConfig();
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher, { refreshInterval: 5000 });
  const { data: factions, error: factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [tabShown, setTabShown] = useState(factionName);
  const [editMode, setEditMode] = useState(false);

  const secretObjectives = Object.values(objectives).filter((obj) => {
    return obj.type === "secret";
  });
  sortObjectives(secretObjectives, "name");


  function changeTab(tabName) {
    if (tabShown === tabName) {
      return;
    }
    setTabShown(tabName);
  }

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function addObj(objective) {
    revealObjective(mutate, gameid, objectives, factionName, objective);
    setEditMode(false);
  }
  function removeObj(objective) {
    removeObjective(mutate, gameid, objectives, factionName, objective);
  }
  function scoreObj(objective, add) {
    if (add) {
      scoreObjective(mutate, gameid, objectives, factionName, objective);
    } else {
      unscoreObjective(mutate, gameid, objectives, factionName, objective);
    }
  }

  const orderedFactions = Object.keys(factions).sort((a, b) => {
    if (a < b) {
      return -1;
    }
    return 1;
  });

  const secretObjectivesByFaction = [];
  for (const factionName of Object.keys(factions)) {
    secretObjectivesByFaction[factionName] = new Set();
  }
  for (const objective of secretObjectives) {
    if (!editMode) {
      for (const factionName of (objective.factions ?? [])) {
        secretObjectivesByFaction[factionName].add(objective);
      }
      for (const factionName of (objective.scorers ?? [])) {
        secretObjectivesByFaction[factionName].add(objective);
      }
    } else {
      for (const factionName of Object.keys(factions)) {
        if (!(objective.factions ?? []).includes(factionName) && !(objective.scorers ?? []).includes(factionName)) {
          secretObjectivesByFaction[factionName].add(objective);
        }
      }
    }
  }

  const maxHeight = screen.height - 450;

  function editModeButton(objs) {
    if (editMode) {
      return (<button onClick={toggleEditMode}>Done</button>);
    }
    if (objs.size <= 3) {
      return (<div className="flexColumn" style={{gap: "4px"}}>
        <button onClick={toggleEditMode}>Pick Objective</button>
        <div style={{fontSize: "16px", textAlign: "center"}}>Secret Objectives will only be revealed to other players when scored</div>
      </div>);
    }
    return null;
  }

  return <div>
    <div className="flexRow" style={{ position: "sticky", top: "41px", backgroundColor: "#222", padding: "4px 4px 0px 4px", borderBottom: "1px solid grey"}}>
      {orderedFactions.map((factionName) => {
        return <Tab key={factionName} selectTab={changeTab} id={factionName} selectedId={tabShown} content={
          <FactionSymbol faction={factionName} size={24} />
        } />
      })}
    </div>
    <div>
      {orderedFactions.map((faction) => {
        const isSelf = faction === factionName;
        return <TabBody key={faction} id={faction} selectedId={tabShown} content={
            <div>
              {secretObjectivesByFaction[faction].length !== 0 ? <div className="flexColumn" style={{borderBottom: "1px solid grey", maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
              {Array.from(secretObjectivesByFaction[faction]).map((obj) => {
                return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={isSelf ? scoreObj : null} removeObjective={editMode || !isSelf ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} viewing={factionName !== faction} />;
              })}
              </div> : null}
              {isSelf ? editModeButton(secretObjectivesByFaction[faction]) : null}
            </div>
        } />
      })}
    </div>
  </div>;
}

// TODO: Rename to Objective Tab
export function ObjectiveList() {
  const router = useRouter();
  const { game: gameid, faction: factionName } = router.query;
  const { mutate } = useSWRConfig();
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher, { refreshInterval: 5000 });
  const [tabShown, setTabShown] = useState("stage-one");
  const [editMode, setEditMode] = useState(false);

  if (objectivesError) {
    return (<div>Failed to load objectives</div>);
  }
  if (!objectives) {
    return (<div>Loading...</div>);
  }

  function addObj(objective) {
    revealObjective(mutate, gameid, objectives, factionName, objective);
    setEditMode(false);
  }
  function removeObj(objective) {
    removeObjective(mutate, gameid, objectives, factionName, objective);
  }
  function scoreObj(objective, add) {
    if (add) {
      scoreObjective(mutate, gameid, objectives, factionName, objective);
    } else {
      unscoreObjective(mutate, gameid, objectives, factionName, objective);
    }
  }

  let filteredObjectives = Object.values(objectives).filter((obj) => {
    return (editMode && !obj.selected) || (!editMode && obj.selected);
  })

  const stageOneObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "stage-one";
  });
  sortObjectives(stageOneObjectives, "name");
  
  const stageTwoObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "stage-two";
  });
  sortObjectives(stageTwoObjectives, "name");

  const secretObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "secret";
  });
  sortObjectives(secretObjectives, "name");

  const otherObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "other";
  });
  sortObjectives(otherObjectives, "name");

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function editModeButton(stage) {
    if (editMode) {
      return (<button onClick={toggleEditMode}>Done</button>);
    }
    switch (stage) {
      case "stage-one":
        if (stageOneObjectives.length < 5) {
          return (<button onClick={toggleEditMode}>Reveal Objective</button>);
        } else if (stageOneObjectives.length === 5 && stageTwoObjectives.length !== 6) {
          return (<button onClick={toggleEditMode}>Reveal Objective (Incentive Program [For])</button>);
        }
        return null;
      case "stage-two":
        if (stageTwoObjectives.length < 5) {
          return (<button onClick={toggleEditMode}>Reveal Objective</button>);
        } else if (stageTwoObjectives.length === 5 && stageOneObjectives.length !== 6) {
          return (<button onClick={toggleEditMode}>Reveal Objective (Incentive Program [Against])</button>);
        }
        return null;
      case "secret":
        if (secretObjectives.length < 3) {
          return (<div className="flexColumn" style={{gap: "4px"}}>
            <button onClick={toggleEditMode}>Reveal Objective</button>
            <div>This will not reveal to other players</div>
          </div>);
        } else if (secretObjectives.length === 3) {
          return (<button onClick={toggleEditMode}>Reveal Objective (Classified Document Leaks [For])</button>);
        }
        return null;
      case "other":
        return (<button onClick={toggleEditMode}>Select Objective</button>);
    }
    return null;
  }

  function changeTab(tabName) {
    if (tabShown === tabName) {
      return;
    }
    setEditMode(false);
    setTabShown(tabName);
  }

  const maxHeight = screen.height - 420;

  return (
    <div>
      <div className="flexRow" style={{ position: "sticky", top: "41px", backgroundColor: "#222", padding: "4px 4px 0px 4px", borderBottom: "1px solid grey"}}>
        <Tab selectTab={changeTab} id="stage-one" selectedId={tabShown} content={
          "Stage I"
        } />
        <Tab selectTab={changeTab} id="stage-two" selectedId={tabShown} content={
          "Stage II"
        } />
        <Tab selectTab={changeTab} id="secret" selectedId={tabShown} content={
          "Secrets"
        } />
        <Tab selectTab={changeTab} id="other" selectedId={tabShown} content={
          "Other"
        } />
      </div>
      <TabBody id="stage-one" selectedId={tabShown} content={
        <div>
          {stageOneObjectives.length !== 0 ? <div className="flexColumn" style={{borderBottom: "1px solid grey", maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
            {stageOneObjectives.map((obj) => {
              return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={scoreObj} removeObjective={editMode ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} />;
            })}
          </div> : null}
          {editModeButton("stage-one") ? <div className="flexRow" style={{padding: "8px 0px"}}>
            {editModeButton("stage-one")}
          </div> : null }
        </div>
      } />
      <TabBody id="stage-two" selectedId={tabShown} content={
        <div>
          {stageTwoObjectives.length !== 0 ? <div className="flexColumn" style={{borderBottom: "1px solid grey", maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
            {stageTwoObjectives.map((obj) => {
              return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={scoreObj} removeObjective={editMode ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} />;
            })}
          </div> : null}
          {editModeButton("stage-two") ? <div className="flexRow" style={{padding: "8px 0px"}}>
          {editModeButton("stage-two")}
          </div> : null}
        </div>
      } />
      <TabBody id="secret" selectedId={tabShown} content={
        <SecretTab secretObjectives={secretObjectives} factionName={factionName} editMode={editMode} editModeButton={editModeButton("secret")} />
        // <div>
        //   {secretObjectives.length !== 0 ? <div className="flexColumn" style={{borderBottom: "1px solid grey", maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
        //   {secretObjectives.map((obj) => {
        //     return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={scoreObj} removeObjective={editMode ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} />;
        //   })}
        //   </div> : null}
        //   {editModeButton("secret") ? <div className="flexRow" style={{padding: "8px 0px"}}>
        //     {editModeButton("secret")}
        //   </div> : null}
        // </div>
      } />
      <TabBody id="other" selectedId={tabShown} content={
        <div>
          {otherObjectives.length !== 0 ? <div className="flexColumn" style={{borderBottom: "1px solid grey", maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
          {otherObjectives.map((obj) => {
            return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={scoreObj} removeObjective={editMode ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} />;
          })}
          </div> : null}
          {editModeButton("other") ? <div className="flexRow" style={{padding: "8px 0px"}}>
            {editModeButton("other")}
          </div> : null}
        </div>
      } />
    </div>
  )
}