import { fetchAttachments } from '../../../server/util/fetch';

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
    case "ATTACH_TO_PLANET": {
      const attachString = `attachments.${data.attachment}.planet`;
      await db.collection('games').doc(gameid).update({
        [attachString]: data.planet,
      });
      break;
    }
    case "REMOVE_FROM_PLANET": {
      const attachString = `attachments.${data.attachment}.planet`;
      await db.collection('games').doc(gameid).update({
        [attachString]: FieldValue.delete(),
      });
      break;
    }
  }

  
  const attachments = await fetchAttachments(gameid);

  res.status(200).json(attachments);
}