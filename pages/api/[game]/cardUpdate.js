import { fetchStrategyCards } from '../../../server/util/fetch';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';

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
    case "ASSIGN_STRATEGY_CARD": {
      const factionString = `strategycards.${data.card}.faction`;
      const updates = {
        [factionString]: data.faction,
      };
      for (const [name, card] of Object.entries((gameRef.data().strategycards ?? {}))) {
        if (card.invalid) {
          const invalidString = `strategycards.${name}.invalid`;
          updates[invalidString] = FieldValue.delete();
        }
      }
      if (data.faction === "Naalu Collective") {
        const orderString = `strategycards.${data.card}.order`;
        updates[orderString] = 0;
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "SWAP_STRATEGY_CARDS": {
      const factionOneString = `strategycards.${data.cardOne}.faction`;
      const factionTwoString = `strategycards.${data.cardTwo}.faction`;
      const factionOne = gameRef.data().strategycards[data.cardOne].faction;
      const factionTwo = gameRef.data().strategycards[data.cardTwo].faction;

      await db.collection('games').doc(gameid).update({
        [factionOneString]: factionTwo,
        [factionTwoString]: factionOne,
      });
      break;
    }
    case "PUBLIC_DISGRACE": {
      const factionString = `strategycards.${data.card}.faction`;
      const currentFaction = gameRef.data().strategycards[data.card].faction;
      const updates = {
        [factionString]: FieldValue.delete(),
        "state.activeplayer": currentFaction,
      };
      let numPickedCards = 0;
      for (const [name, card] of Object.entries(gameRef.data().strategycards)) {
        if (card.invalid && name !== data.card) {
          const invalidString = `strategycards.${name}.invalid`;
          updates[invalidString] = FieldValue.delete();
        }
        if (card.faction) {
          numPickedCards++;
        }
      }
      // Don't block pick if it's the only one left.
      if (numPickedCards < 8) {
        const invalidString = `strategycards.${data.card}.invalid`;
        updates[invalidString] = true;
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "GIFT_OF_PRESCIENCE": {
      const orderString = `strategycards.${data.card}.order`;
      const updates = {
        [orderString]: 0,
      };
      for (const [name, card] of Object.entries(gameRef.data().strategycards)) {
        if (card.order === 0) {
          const orderString = `strategycards.${name}.order`;
          updates[orderString] = FieldValue.delete();
        }
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "USE_STRATEGY_CARD": {
      const usedString = `strategycards.${data.card}.used`;
      await db.collection('games').doc(gameid).update({
        [usedString]: true,
      });
      break;
    }
    case "CLEAR_STRATEGY_CARDS": {
      for (const card of Object.keys(gameRef.data().strategycards)) {
        const usedString = `strategycards.${card}.used`;
        const cardString = `strategycards.${card}.faction`;
        const orderString = `strategycards.${card}.order`;
        await db.collection('games').doc(gameid).update({
          [cardString]: FieldValue.delete(),
          [orderString]: FieldValue.delete(),
          [usedString]: FieldValue.delete(),
        });
      }
      break;
    }
  }

  
  const strategyCards = await fetchStrategyCards(gameid);

  res.status(200).json(strategyCards);
}