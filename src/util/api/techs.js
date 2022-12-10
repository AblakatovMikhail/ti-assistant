import { fetcher, poster } from './util'

/**
 * Checks whether a faction has unlocked a specific tech.
 * @param {Object} faction
 * @param {string} tech
 * @returns {bool}
 */
export function hasTech(faction, tech) {
  let techName = tech.replace(" Ω", "");
  if (techName === "Light/Wave Deflector") {
    techName = "LightWave Deflector";
  }
  return !!faction.techs[techName];
}

export async function unlockTech(mutate, gameid, factions, factionName, tech) {
  const data = {
    action: "ADD_TECH",
    faction: factionName,
    tech: tech,
    returnAll: true,
  };

  const updatedFactions = {...factions};
  const techString = tech.replace(" Ω", "");

  updatedFactions[factionName].techs[techString] = {
    ready: true,
  };

  const options = {
    optimisticData: updatedFactions,
  };

  await mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);

  const opts = {
    optimisticData: updatedFactions[factionName],
  };
  mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);
}

export async function lockTech(mutate, gameid, factions, factionName, tech) {
  const data = {
    action: "REMOVE_TECH",
    faction: factionName,
    tech: tech,
    returnAll: true,
  };

  const updatedFactions = {...factions};
  const techString = tech.replace(" Ω", "");

  delete updatedFactions[factionName].techs[techString];

  const options = {
    optimisticData: updatedFactions,
  };

  await mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);

  const opts = {
    optimisticData: updatedFactions[factionName],
  };
  mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);
}

export async function chooseStartingTech(mutate, gameid, factions, factionName, tech) {
  const data = {
    action: "CHOOSE_STARTING_TECH",
    faction: factionName,
    tech: tech,
    returnAll: true,
  };

  const updatedFactions = {...factions};

  updatedFactions[factionName].startswith.techs = [
    ...(updatedFactions[factionName].startswith.techs ?? []),
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

  const opts = {
    optimisticData: updatedFactions[factionName],
  };

  mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);

  if (!factions['Council Keleres'] || factionName === "Council Keleres") {
    return;
  }
  const councilOptions = {
    optimisticData: updatedFactions['Council Keleres'],
  };
  mutate(`/api/${gameid}/factions/Council Keleres`, fetcher(`/api/${gameid}/factions/Council Keleres`), councilOptions);
}

export async function removeStartingTech(mutate, gameid, factions, factionName, tech) {
  const data = {
    action: "REMOVE_STARTING_TECH",
    faction: factionName,
    tech: tech,
    returnAll: true,
  };

  const updatedFactions = {...factions};

  updatedFactions[factionName].startswith.techs = (updatedFactions[factionName].startswith.techs ?? []).filter((startingTech) => startingTech !== tech);
  
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

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
  
  const opts = {
    optimisticData: updatedFactions[factionName],
  };

  mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);

  if (!factions['Council Keleres'] || factionName === "Council Keleres") {
    return;
  }
  const councilOptions = {
    optimisticData: updatedFactions['Council Keleres'],
  };
  mutate(`/api/${gameid}/factions/Council Keleres`, fetcher(`/api/${gameid}/factions/Council Keleres`), councilOptions);
}