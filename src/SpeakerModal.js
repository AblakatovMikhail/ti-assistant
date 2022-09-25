import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'

import { fetcher, poster } from './util/api/util'
import { setSpeaker } from './util/api/state';
import { FactionTile } from "/src/FactionCard.js";
import { Modal } from "/src/Modal.js";

export function SpeakerModal({ forceSelection, visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: gameState, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  if (factionsError) {
    return (<div>Failed to load factions</div>);
  }
  if (stateError) {
    return (<div>Failed to load state</div>);
  }
  if (!factions || !gameState) {
    return (<div>Loading...</div>);
  }

  function selectSpeaker(name) {
    setSpeaker(mutate, gameid, gameState, name);
    onComplete();
  }

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  return (
  <Modal closeMenu={forceSelection ? null : onComplete} visible={visible} title="Select Speaker"
    content={
      <div className="flexRow" style={{gap: "8px", alignItems: "center", justifyContent: "space-evenly", padding: "40px 4px"}}>
        {orderedFactions.map(([name, faction]) => {
          if (forceSelection && name === gameState.state.speaker) {
            return null;
          }
          return (
            <FactionTile
              key={name}
              faction={faction}
              onClick={() => selectSpeaker(name)}
            />
          );
        })}
      </div>
  } />
  );
}