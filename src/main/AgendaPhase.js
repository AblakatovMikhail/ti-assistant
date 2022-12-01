import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import SummaryColumn from './SummaryColumn';
import { AgendaTimer, useSharedCurrentAgenda } from '../Timer';
import { fetcher, poster } from '../util/api/util';
import { getTargets, VoteCount } from '../VoteCount';
import { BasicFactionTile } from '../FactionTile';
import { AgendaRow } from '../AgendaRow';
import { Modal } from '../Modal';
import { passAgenda, repealAgenda, resolveAgenda } from '../util/api/agendas';
import { LawsInEffect } from '../LawsInEffect';
import { SelectableRow } from '../SelectableRow';

function InfoContent({content}) {
  return (
    <div className="myriadPro" style={{maxWidth: "400px", minWidth: "320px", padding: "4px", whiteSpace: "pre-line", textAlign: "center", fontSize: "20px"}}>
      {content}
    </div>
  );
}

function AgendaSelectModal({ visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);

  if (!agendas) {
    return null;
  }

  const orderedAgendas = Object.values(agendas).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  })

  return (
  <Modal closeMenu={() => onComplete(null)} visible={visible} title={`Reveal Agenda`}
    content={
      <div className="flexColumn" style={{justifyContent: "flex-start", paddingTop: "4px", width: "900px", alignItems: "flex-start", flexWrap: "wrap", height: "80vh"}}>
        {orderedAgendas.map((agenda) => {
          return (
            <div style={{flex: "0 0 4%"}}>
              <AgendaRow key={agenda.name} agenda={agenda} addAgenda={() => onComplete(agenda.name)} />
            </div>
          );
        })}
      </div>
  } />
  );
}

function OutcomeSelectModal({ visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  if (!options) {
    return null;
  }

  const outcomes = [
    "For/Against",
    "Player",
    "Strategy Card",
    "Planet",
    "Cultural Planet",
    "Hazardous Planet",
    "Industrial Planet",
    "Non-Home Planet Other Than Mecatol Rex",
    "Law",
    "Scored Secret Objective",
  ];

  return (
  <Modal closeMenu={() => onComplete(null)} visible={visible} title={`Reveal Agenda`}
    content={
      <div className="flexColumn" style={{justifyContent: "flex-start", paddingTop: "4px", alignItems: "flex-start"}}>
        {outcomes.map((outcome) => {
          return (
            <div>
              <SelectableRow key={outcome} content={
                <div style={{ display: "flex", fontSize: "18px", zIndex: 2}}>
                  {outcome}
                 </div>} itemName={outcome} selectItem={() => onComplete(outcome)} />
            </div>
          );
        })}
      </div>
  } />
  );
}

export default function AgendaPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);
  const { data: factions, factionError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: planets, planetError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: strategycards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  const [ agenda, setAgenda ] = useState(null);
  const [ agendaModal, setAgendaModal ] = useState(null);
  // Only used for Covert Legislation.
  const [ subAgenda, setSubAgenda ] = useState(null);
  const [ subAgendaModal, setSubAgendaModal ] = useState(null);
  const [ outcome, setOutcome ] = useState(null);
  const [ outcomeModal, setOutcomeModal ] = useState(null);

  const [ factionVotes, setFactionVotes ] = useState({});

  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });
  const [ speakerTieBreak, setSpeakerTieBreak ] = useState(null);
  const [ miscount, setMiscount ] = useState(false);
  const { currentAgenda, advanceAgendaPhase, resetAgendaPhase } = useSharedCurrentAgenda();

  if (!agendas || !factions || !planets || !strategycards || !objectives || !state) {
    return <div>Loading...</div>;
  }

  const votes  = computeVotes();
  const maxVotes = Object.values(votes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(votes).filter(([target, voteCount]) => {
    return voteCount === maxVotes;
  }).map(([target, voteCount]) => {
    return target;
  });
  const isTie = selectedTargets.length !== 1;

  const localAgenda = {...agenda};
  if (outcome) {
    localAgenda.elect = outcome;
  }

  const allTargets = getTargets(localAgenda, factions, strategycards, planets, agendas, objectives);

  function toggleSpeakerTieBreak(target) {
    if (speakerTieBreak === target) {
      setSpeakerTieBreak(null);
    } else {
      setSpeakerTieBreak(target);
    }
  }

  function completeAgenda() {
    if (isTie && !speakerTieBreak) {
      throw Error("No selected target?");
    }
    const target = isTie ? speakerTieBreak : selectedTargets[0];
    if (subAgenda) {
      resolveAgenda(mutate, gameid, agendas, subAgenda.name, target);
      resolveAgenda(mutate, gameid, agendas, agenda.name, subAgenda.name);
    } else {
      resolveAgenda(mutate, gameid, agendas, agenda.name, target);
    }
    if (agenda.name === "Miscount Disclosed") {
      setAgenda(agendas[target]);
      repealAgenda(mutate, gameid, agendas, target);
      setMiscount(true);
    } else {
      setAgenda(null);
      advanceAgendaPhase();
      setMiscount(false);
    }
    setSubAgenda(null);
    setOutcome(null);
    setFactionVotes({});
    setSpeakerTieBreak(null);
  }

  function nextPhase(skipAgenda = false) {
    const data = {
      action: "ADVANCE_PHASE",
      skipAgenda: skipAgenda,
    };
    const phase = "STRATEGY";
    const activeFactionName = state.speaker;
    const round = state.round + 1;
    resetAgendaPhase();

    const updatedState = {...state};
    state.phase = phase;
    state.activeplayer = activeFactionName;
    state.round = round;

    const options = {
      optimisticData: updatedState,
    };

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
  }

  function showInfoModal(title, content) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }

  function selectAgenda(agendaName) {
    if (agendaName !== null) {
      setAgenda(agendas[agendaName]);
    }
    setAgendaModal(false);
    setSubAgenda(null);
    setFactionVotes({});
  }
  function selectSubAgenda(agendaName) {
    if (agendaName !== null) {
      setSubAgenda(agendas[agendaName]);
    }
    setSubAgendaModal(false);
  }
  function selectEligibleOutcome(outcome) {
    setOutcome(outcome);
    setSubAgenda(null);
    setOutcomeModal(false);
    setFactionVotes({});
  }

  function changeVote(factionName, castVotes, target) {
    if (target === "Abstain") {
      return;
    }
    const updatedVotes = {...factionVotes};
    updatedVotes[factionName] = {
      target: target,
      votes: castVotes,
    };
    setFactionVotes(updatedVotes);
  }

  function computeVotes() {
    const castVotes = agenda && agenda.elect === "For/Against" ? {"For": 0, "Against": 0} : {};
    Object.values(factionVotes).forEach((votes) => {
      if (!castVotes[votes.target]) {
        castVotes[votes.target] = 0;
      }
      castVotes[votes.target] += votes.votes;
    });
    const orderedVotes = Object.keys(castVotes).sort((a, b) => {
      if (a === "For") {
        return -1;
      }
      if (b === "For") {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 1;
    }).reduce(
      (obj, key) => { 
        obj[key] = castVotes[key]; 
        return obj;
      }, 
      {}
    );
    return orderedVotes;
  }

  const votingOrder = Object.values(factions).sort((a, b) => {
    if (a.name === "Argent Flight") {
      return -1;
    }
    if (b.name === "Argent Flight") {
      return 1;
    }
    if (a.order === 1) {
      return 1;
    }
    if (b.order === 1) {
      return -1;
    }
    return a.order - b.order;
  });

  const flexDirection = agenda && agenda.elect === "For/Against" ? "flexRow" : "flexColumn";
    
  return (
  <div className="flexRow" style={{gap: "40px", height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
    <AgendaSelectModal visible={agendaModal} onComplete={(agendaName) => selectAgenda(agendaName)} />
    <AgendaSelectModal visible={subAgendaModal} onComplete={(agendaName) => selectSubAgenda(agendaName)} />
    <OutcomeSelectModal visible={outcomeModal} onComplete={(eligibleOutcome) => selectEligibleOutcome(eligibleOutcome)} />
    <div className="flexColumn" style={{flexBasis: "30%", gap: "4px", alignItems: "stretch"}}>
      <div className="flexRow" style={{gap: "12px"}}>
        <div style={{textAlign: "center", flexGrow: 4}}>Voting Order</div>
        <div style={{textAlign: "center", width: "80px"}}>Available Votes</div>
        <div style={{textAlign: "center", width: "80px"}}>Cast Votes</div>
        <div style={{textAlign: "center", width: "80px"}}>Target</div>
      </div>
      {votingOrder.map((faction) => {
        return <VoteCount key={faction.name} factionName={faction.name} changeVote={changeVote} agenda={localAgenda} />
      })}
      <LawsInEffect />
    </div>
    <div className='flexColumn' style={{flexBasis: "30%", gap: "12px"}}> 
      <AgendaTimer />
      {currentAgenda > 2 ? <div style={{fontSize: "40px", width: "100%"}}>
        Agenda Phase Complete
        </div> : 
      <ol className='flexColumn' style={{alignItems: "flex-start", gap: "20px", margin: "0px", padding: "0px", fontSize: "24px", alignItems: "stretch"}}>
        <li>
          <div className="flexRow" style={{justifyContent: "flex-start", gap: "8px", whiteSpace: "nowrap"}}>
            {!miscount ? <div className="flexRow" style={{justifyContent: "flex-start", gap: "8px"}}>
              <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
              Reveal and read one Agenda</div>
            : "Re-voting on miscounted agenda"}
          </div>
          <div className='flexColumn' style={{gap: "4px"}}>
          {agenda ? 
          <AgendaRow agenda={agenda} removeAgenda={() => {setAgenda(null); setFactionVotes({});}} />
          : <button onClick={() => setAgendaModal(true)}>Reveal Agenda</button>}
          {agenda && agenda.name === "Covert Legislation" ? 
            (outcome ? 
              <SelectableRow itemName={outcome} content={
                <div style={{display: "flex", fontSize: "18px"}}>
                  {outcome}
                </div>} removeItem={() => selectEligibleOutcome(null)} /> : 
            <button onClick={() => setOutcomeModal(true)}>Reveal Eligible Outcomes</button>)
          : null}
        </div>
        </li>
        <li>In Speaker Order:
        <div className="flexColumn" style={{fontSize: "22px", paddingLeft: "8px", gap: "4px", alignItems: "flex-start"}}>
          <div>Perform any <i>When an Agenda is revealed</i> actions</div>
          <div>Perform any <i>After an Agenda is revealed</i> actions</div>
        </div>
        </li>
        <li>Discuss</li>
        <li>
          In Voting Order: Cast votes (or abstain)
          {votes && Object.keys(votes).length > 0 ? 
          <div className={flexDirection} style={{marginTop: "12px", gap: "4px", padding: "8px 20px", alignItems: "flex-start", width: "100%", border: "1px solid #555", borderRadius: "10px"}}>
          {Object.entries(votes).map(([target, voteCount]) => {
            return <div key={target}>{target}: {voteCount}</div>
          })}
          </div>
        : null}
        </li>
        <li>
          <div className="flexRow" style={{justifyContent: "flex-start", gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
              Choose outcome if tied
          </div>
          {isTie ? 
           <div className="flexRow" style={{paddingTop: "8px", gap: "4px", flexWrap: "wrap", maxWidth: "600px", width: "100%"}}>
            {selectedTargets.length > 0 ? selectedTargets.map((target) => {
              return <button key={target} className={speakerTieBreak === target ? "selected" : ""} onClick={() => toggleSpeakerTieBreak(target)}>{target}</button>;
            }) : 
            allTargets.map((target) => {
              if (target === "Abstain") {
                return null;
              }
              return <button key={target} className={speakerTieBreak === target ? "selected" : ""} onClick={() => toggleSpeakerTieBreak(target)}>{target}</button>;
            })}
            </div>
          : null}
        </li>
        <li>Resolve agenda outcome
          <div className="flexColumn" style={{paddingTop: "8px", width: "100%"}}>
          {agenda && agenda.name === "Covert Legislation" ? 
            subAgenda ? 
            <AgendaRow agenda={subAgenda} removeAgenda={() => setSubAgenda(null)} />
            : <button onClick={() => setSubAgendaModal(true)}>Reveal Covert Legislation Agenda</button>
          : null}
          {!isTie && selectedTargets.length > 0 ? 
            <div className="flexColumn" style={{paddingTop: "8px", width: "100%"}}>
              <button onClick={completeAgenda}>Resolve with target: {selectedTargets[0]}</button>
            </div>
          : null}
          {isTie && speakerTieBreak && (selectedTargets.length === 0 || selectedTargets.includes(speakerTieBreak)) ? 
            <div className="flexColumn" style={{paddingTop: "8px", width: "100%"}}>
              <button onClick={completeAgenda}>Resolve with target: {speakerTieBreak}</button>
            </div>
          : null}
          </div>
        </li>
        {currentAgenda === 1 ? <li>Repeat Steps 1 to 6</li> : null}
        <li>Ready all planets</li>
    </ol>}
      <button onClick={() => nextPhase()}>Start Next Round</button>
    </div>
    <div className="flexColumn" style={{flexBasis: "30%", maxWidth: "400px"}}>
      <SummaryColumn />
    </div>
  </div>
  );
}