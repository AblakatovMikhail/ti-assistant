import { fetchPlanets } from "../../../server/util/fetch";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }

  const planets = await fetchPlanets(gameId);

  res.status(200).json(planets);
}