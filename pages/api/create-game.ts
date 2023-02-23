import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseFaction, GameFaction } from "../../src/util/api/factions";
import { GameObjective } from "../../src/util/api/objectives";
import { Options } from "../../src/util/api/options";
import { GamePlanet } from "../../src/util/api/planets";
import { SetupFaction } from "../../src/util/api/setup";
import { GameData } from "../../src/util/api/util";

function makeid(length: number) {
  var result = "";
  var characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  let factions: SetupFaction[] = req.body.factions;
  let speaker: number = req.body.speaker;

  let options: Options = req.body.options;

  const db = getFirestore();

  const factionPromises = factions.map(async (faction, index) => {
    if (!faction.name || !faction.color) {
      throw new Error("Faction missing name or color.");
    }
    // Determine speaker order for each faction.
    let order: number;
    if (index >= speaker) {
      order = index - speaker + 1;
    } else {
      order = index + factions.length - speaker + 1;
    }

    // Get home planets for each faction.
    // TODO(jboman): Handle Council Keleres choosing between Mentak, Xxcha, and Argent Flight.
    const homePlanetsRef = await db
      .collection("planets")
      .where("faction", "==", faction.name)
      .get();
    const homePlanets: Record<string, { ready: boolean }> = {};
    homePlanetsRef.forEach((planet) => {
      homePlanets[planet.id] = {
        ready: true,
      };
    });

    // Get starting techs for each faction.
    // TODO(jboman): Handle factions that have a choice in starting techs.
    const factionRef = await db.collection("factions").doc(faction.name).get();
    const factionData: BaseFaction | undefined = factionRef.data() as
      | BaseFaction
      | undefined;
    if (!factionData) {
      throw new Error("Failed to fetch faction.");
    }
    const startingTechs: Record<string, { ready: boolean }> = {};
    (factionData.startswith.techs ?? []).forEach((tech) => {
      startingTechs[tech] = {
        ready: true,
      };
    });

    return {
      ...faction,
      // Client specified values
      name: faction.name,
      color: faction.color,
      order: order,
      mapPosition: index,
      // Faction specific values
      planets: homePlanets,
      techs: startingTechs,
      startswith: factionData.startswith,
      // State values
      hero: "locked",
      commander: "locked",
    };
  });

  const gameFactions: GameFaction[] = await Promise.all(factionPromises);

  let baseFactions: Record<string, GameFaction> = {};
  let basePlanets: Record<string, GamePlanet> = {};
  let speakerName: string | undefined;
  gameFactions.forEach((faction, index) => {
    if (index === req.body.speaker) {
      speakerName = faction.name;
    }
    const localFaction = { ...faction };
    if (faction.name === "Winnu" && !options.expansions.includes("pok")) {
      localFaction.startswith.choice = {
        select: 1,
        options: [
          "Neural Motivator",
          "Sarween Tools",
          "Antimass Deflectors",
          "Plasma Scoring",
        ],
      };
    }
    baseFactions[faction.name] = localFaction;
    Object.entries(faction.planets).forEach(([name, planet]) => {
      basePlanets[name] = {
        ...planet,
        owner: faction.name,
        owners: [faction.name],
      };
    });
  });

  let baseObjectives: Record<string, GameObjective> = {
    "Custodians Token": {
      selected: true,
    },
    "Imperial Point": {
      selected: true,
    },
    "Support for the Throne": {
      selected: true,
    },
  };

  if (!speakerName) {
    throw new Error("No speaker selected.");
  }

  const gameState: GameData = {
    state: {
      speaker: speakerName,
      phase: "SETUP",
      round: 1,
    },
    factions: baseFactions,
    planets: basePlanets,
    options: options,
    objectives: baseObjectives,
  };

  let gameid = makeid(6);

  let game = await db.collection("games").doc(gameid).get();
  while (game.exists) {
    gameid = makeid(6);
    game = await db.collection("games").doc(gameid).get();
  }

  await db.collection("games").doc(gameid).set(gameState);

  // console.log(req.body);
  res.status(200).json({ gameid: gameid });
}