import { getFirestore, FieldValue } from 'firebase-admin/firestore';

import { fetchStrategyCards } from '../../../server/util/fetch';
import { getOnDeckFaction } from '../../../src/util/helpers';

function getNextFaction(factions, nextorder) {
  for (const faction of Object.values(factions)) {
    if (faction.order === nextorder) {
      return faction;
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const data = req.body;

  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  switch (data.action) {
    case "ADVANCE_PHASE":
      let nextPhase;
      let activeFaction;
      let round = gameRef.data().state.round ?? 1;
      switch (gameRef.data().state.phase) {
        case "SETUP":
          nextPhase = "STRATEGY";
          activeFaction = gameRef.data().factions[gameRef.data().state.speaker];
          break;
        case "STRATEGY":
          nextPhase = "ACTION";
          let minCard = {
            order: Number.MAX_SAFE_INTEGER,
          };
          const strategyCards = await fetchStrategyCards(gameid);
          for (const strategyCard of Object.values(strategyCards)) {
            if (strategyCard.faction && strategyCard.order < minCard.order) {
              minCard = strategyCard;
            }
          }
          if (!minCard.faction) {
            throw Error("Transition to ACTION phase w/o selecting cards?");
          }
          activeFaction = gameRef.data().factions[minCard.faction];
          break;
        case "ACTION":
          nextPhase = "STATUS";
          break;
        case "STATUS":
          // TODO(jboman): Update to handle agenda phase not starting.
          nextPhase = "AGENDA";
          break;
        case "AGENDA":
          nextPhase = "STRATEGY";
          activeFaction = gameRef.data().factions[gameRef.data().state.speaker];
          ++round;
          break;
      }
      if (!nextPhase) {
        return res.status(500);
      }
      await db.collection('games').doc(gameid).update({
        "state.phase": nextPhase,
        "state.activeplayer": activeFaction ? activeFaction.name : "None",
        "state.round": round,
      });
      break;
    case "ADVANCE_PLAYER":
      const factions = gameRef.data().factions;
      const strategyCards = await fetchStrategyCards(gameid);
      const onDeckFaction = getOnDeckFaction(gameRef.data().state, factions, strategyCards);
      await db.collection('games').doc(gameid).update({
        "state.activeplayer": onDeckFaction ? onDeckFaction.name : "None",
      });
      break;
    case "SET_SPEAKER": {
      const updates = {
        "state.speaker": data.speaker,
      };
      const currentOrder = gameRef.data().factions[data.speaker].order;
      for (const [name, faction] of Object.entries(gameRef.data().factions)) {
        let factionOrder = faction.order - currentOrder + 1;
        if (factionOrder < 1) {
          factionOrder += Object.keys(gameRef.data().factions).length;
        }
        const factionString = `factions.${name}.order`;
        updates[factionString] = factionOrder;
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
  }

  const responseRef = await db.collection('games').doc(gameid).get();

  return res.status(200).json(responseRef.data().state);
}