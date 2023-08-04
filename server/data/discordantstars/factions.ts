import { BaseFaction } from "../../../src/util/api/factions";

// TODO: Add colors for factions.
export const DISCORDANT_STARS_FACTIONS: Record<
  DiscordantStars.FactionId,
  BaseFaction
> = {
  "Augurs of Ilyxum": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Augurs of Ilyxum",
    shortname: "Ilyxum",
    startswith: {
      planets: ["Chrion", "Demis"],
      techs: ["Scanlink Drone Network", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 2,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  // "Bentor Conglomerate": {
  //   colors: {},
  //   commodities: 2,
  //   expansion: "DISCORDANT STARS",
  //   name: "Bentor Conglomerate",
  //   shortname: "Bentor",
  //   startswith: {
  //     planets: ["Benc", "Hau"],
  //     choice: {
  //       options: [
  //         "Psychoarchaeology",
  //         "Dark Energy Tap",
  //         "Scanlink Drone Network",
  //       ],
  //       select: 2,
  //     },
  //     units: {
  //       Carrier: 1,
  //       Cruiser: 2,
  //       Fighter: 3,
  //       Infantry: 4,
  //       PDS: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  // "Berserkers of Kjalengard": {
  //   colors: {},
  //   commodities: 3,
  //   expansion: "DISCORDANT STARS",
  //   name: "Berserkers of Kjalengard",
  //   shortname: "Kjalengard",
  //   startswith: {
  //     planets: ["Kjalengard", "Hulgade"],
  //     choice: {
  //       options: [
  //         "Cruiser II",
  //         "Destroyer II",
  //         "Dreadnought II",
  //         "Fighter II",
  //         "Infantry II",
  //         "PDS II",
  //         "Space Dock II",
  //         "War Sun",
  //       ],
  //       select: 1,
  //     },
  //     units: {
  //       Carrier: 2,
  //       Destroyer: 1,
  //       Fighter: 4,
  //       Infantry: 4,
  //       PDS: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  // "Blex Pestilence": {
  //   colors: {},
  //   commodities: 2,
  //   expansion: "DISCORDANT STARS",
  //   name: "Blex Pestilence",
  //   shortname: "Blex",
  //   startswith: {
  //     planets: ["Avicenna"],
  //     choice: {
  //       options: ["Daxcive Animators", "Bio-Stims"],
  //       select: 1,
  //     },
  //     units: {
  //       Carrier: 1,
  //       Destroyer: 1,
  //       Dreadnought: 1,
  //       Infantry: 3,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Celdauri Trade Confederation": {
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    name: "Celdauri Trade Confederation",
    shortname: "Celdauri",
    startswith: {
      planets: ["Louk", "Auldane"],
      choice: {
        options: ["Antimass Deflectors", "Sarween Tools", "Plasma Scoring"],
        select: 2,
      },
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 4,
        Infantry: 3,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  // "Cheiran Hordes": {
  //   colors: {},
  //   commodities: 3,
  //   expansion: "DISCORDANT STARS",
  //   name: "Cheiran Hordes",
  //   shortname: "Cheiran",
  //   startswith: {
  //     planets: ["Gghurn Theta", "Arche"],
  //     choice: {
  //       options: ["Magen Defense Grid", "Self-Assembly Routines"],
  //       select: 1,
  //     },
  //     units: {
  //       Carrier: 1,
  //       Destroyer: 1,
  //       Dreadnought: 1,
  //       Fighter: 2,
  //       Infantry: 2,
  //       Mech: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Dih-Mohn Flotilla": {
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    name: "Dih-Mohn Flotilla",
    shortname: "Dih-Mohn",
    startswith: {
      planets: ["Abyssus"],
      techs: ["Dark Energy Tap", "Scanlink Drone Network"],
      units: {
        Destroyer: 2,
        Dreadnought: 2,
        Fighter: 2,
        Mech: 1,
        Infantry: 2,
        "Space Dock": 1,
      },
    },
  },
  // "Edyn Mandate": {
  //   colors: {},
  //   commodities: 3,
  //   expansion: "DISCORDANT STARS",
  //   name: "Edyn Mandate",
  //   shortname: "Edyn",
  //   startswith: {
  //     planets: ["Edyn", "Ekko", "Okke"],
  //     techs: [
  //       "Psychoarchaeology",
  //       "Dark Energy Tap",
  //       "Scanlink Drone Network",
  //       "AI Development Algorithm",
  //     ],
  //     units: {
  //       Carrier: 1,
  //       Destroyer: 2,
  //       Fighter: 4,
  //       Infantry: 2,
  //       PDS: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Florzen Profiteers": {
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    name: "Florzen Profiteers",
    shortname: "Florzen",
    startswith: {
      planets: ["Delmor", "Kyd"],
      techs: ["Neural Motivator", "Scanlink Drone Network"],
      units: {
        Carrier: 2,
        Fighter: 4,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
  },
  "Free Systems Compact": {
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    name: "Free Systems Compact",
    shortname: "Free Systems",
    startswith: {
      planets: ["Idyn", "Kroll", "Cyrra"],
      techs: ["Psychoarchaeology"],
      units: {
        Carrier: 1,
        Cruiser: 2,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  "Ghemina Raiders": {
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    name: "Ghemina Raiders",
    shortname: "Ghemina",
    startswith: {
      planets: ["Drah", "Trykk"],
      techs: ["Psychoarchaeology", "Dark Energy Tap"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 3,
        "Space Dock": 2,
      },
    },
  },
  // "Ghoti Wayfarers": {
  //   colors: {},
  //   commodities: 4,
  //   expansion: "DISCORDANT STARS",
  //   name: "Ghoti Wayfarers",
  //   shortname: "Ghoti",
  //   startswith: {
  //     planets: ["Ghoti"],
  //     choice: {
  //       options: ["Gravity Drive", "Sling Relay"],
  //       select: 1,
  //     },
  //     units: {
  //       Cruiser: 1,
  //       Flagship: 1,
  //       Fighter: 2,
  //       Infantry: 3,
  //     },
  //   },
  // },
  // "Gledge Union": {
  //   colors: {},
  //   commodities: 2,
  //   expansion: "DISCORDANT STARS",
  //   name: "Gledge Union",
  //   shortname: "Gledge",
  //   startswith: {
  //     planets: ["Last Stop"],
  //     choice: {
  //       options: [
  //         "Psychoarchaeology",
  //         "Scanlink Drone Network",
  //         "AI Development Algorithm",
  //       ],
  //       select: 2,
  //     },
  //     units: {
  //       Carrier: 1,
  //       Destroyer: 1,
  //       Dreadnought: 1,
  //       Fighter: 3,
  //       Infantry: 2,
  //       Mech: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Glimmer of Mortheus": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Glimmer of Mortheus",
    shortname: "Mortheus",
    startswith: {
      planets: ["Biaheo", "Empero"],
      techs: ["Dark Energy Tap", "Sarween Tools"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
  },
  "Kollecc Society": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Kollecc Society",
    shortname: "Kollecc",
    startswith: {
      planets: ["Susuros"],
      techs: ["Scanlink Drone Network"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 2,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
  },
  // "Monks of Kolume": {
  //   colors: {},
  //   commodities: 3,
  //   expansion: "DISCORDANT STARS",
  //   name: "Monks of Kolume",
  //   shortname: "Kolume",
  //   startswith: {
  //     planets: ["Alesna", "Azle"],
  //     choice: {
  //       options: ["Graviton Laser System", "Predictive Intelligence"],
  //       select: 1,
  //     },
  //     units: {
  //       Carrier: 2,
  //       Cruiser: 1,
  //       Fighter: 2,
  //       Infantry: 4,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Kortali Tribunal": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Kortali Tribunal",
    shortname: "Kortali",
    startswith: {
      planets: ["Ogdun", "Brthkul"],
      techs: ["Psychoarchaeology", "Plasma Scoring"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  // "Lanefir Remnants": {
  //   colors: {},
  //   commodities: 2,
  //   expansion: "DISCORDANT STARS",
  //   name: "Lanefir Remnants",
  //   shortname: "Lanefir",
  //   startswith: {
  //     planets: ["Aysis Rest", "Solitude"],
  //     choice: {
  //       options: [
  //         "Dark Energy Tap",
  //         "Scanlink Drone Network",
  //         "AI Development Algorithm",
  //       ],
  //       select: 2,
  //     },
  //     units: {
  //       Carrier: 2,
  //       Destroyer: 1,
  //       Fighter: 2,
  //       Infantry: 3,
  //       PDS: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Li-Zho Dynasty": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Li-Zho Dynasty",
    shortname: "Li-Zho",
    startswith: {
      planets: ["Pax", "Vess", "Kyr"],
      techs: ["Psychoarchaeology", "Antimass Deflectors"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  "L'tokk Khrask": {
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    name: "L'tokk Khrask",
    shortname: "Khrask",
    startswith: {
      planets: ["Bohl-Duhr"],
      techs: ["Scanlink Drone Network", "Plasma Scoring"],
      units: {
        Cruiser: 3,
        Fighter: 1,
        Infantry: 3,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  "Mirveda Protectorate": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Mirveda Protectorate",
    shortname: "Mirveda",
    startswith: {
      planets: ["Aldra", "Beata"],
      techs: ["AI Development Algorithm"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 5,
        Infantry: 2,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  "Myko-Mentori": {
    colors: {},
    commodities: 1,
    expansion: "DISCORDANT STARS",
    name: "Myko-Mentori",
    shortname: "Myko-Mentori",
    startswith: {
      planets: ["Shi-Halaum"],
      techs: ["Predictive Intelligence"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 1,
        Infantry: 6,
        "Space Dock": 1,
      },
    },
  },
  "Nivyn Star Kings": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Nivyn Star Kings",
    shortname: "Nivyn",
    startswith: {
      planets: ["Ellas"],
      techs: ["Dark Energy Tap", "Plasma Scoring"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Dreadnought: 1,
        Fighter: 3,
        Infantry: 3,
        Mech: 1,
        "Space Dock": 1,
      },
    },
  },
  "Olradin League": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Olradin League",
    shortname: "Olradin",
    startswith: {
      planets: ["Sanctuary"],
      techs: ["Psychoarchaeology", "Scanlink Drone Network"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 3,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
  },
  "Roh'Dhna Mechatronics": {
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    name: "Roh'Dhna Mechatronics",
    shortname: "Roh'Dhna",
    startswith: {
      planets: ["Prind"],
      techs: ["Psychoarchaeology", "Sarween Tools"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
  },
  "Savages of Cymiae": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Savages of Cymiae",
    shortname: "Cymiae",
    startswith: {
      planets: ["Cymiae"],
      techs: ["Neural Motivator", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
  },
  "Shipwrights of Axis": {
    colors: {},
    commodities: 5,
    expansion: "DISCORDANT STARS",
    name: "Shipwrights of Axis",
    shortname: "Axis",
    startswith: {
      planets: ["Axis"],
      techs: ["Sarween Tools", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
  },
  "Tnelis Syndicate": {
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    name: "Tnelis Syndicate",
    shortname: "Tnelis",
    startswith: {
      planets: ["Discordia"],
      choice: {
        options: ["Neural Motivator", "Antimass Deflectors", "Plasma Scoring"],
        select: 2,
      },
      units: {
        Carrier: 1,
        Destroyer: 2,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  "Vaden Banking Clans": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Vaden Banking Clans",
    shortname: "Vaden",
    startswith: {
      planets: ["Vadarian", "Norvus"],
      choice: {
        options: ["Neural Motivator", "Antimass Deflectors", "Sarween Tools"],
        select: 2,
      },
      units: {
        Carrier: 1,
        Cruiser: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
  },
  "Vaylerian Scourge": {
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    name: "Vaylerian Scourge",
    shortname: "Vaylerian",
    startswith: {
      planets: ["Vaylar"],
      techs: ["Neural Motivator", "Dark Energy Tap"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 3,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  "Veldyr Sovereignty": {
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    name: "Veldyr Sovereignty",
    shortname: "Veldyr",
    startswith: {
      planets: ["Rhune"],
      techs: ["Dark Energy Tap", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
  "Zealots of Rhodun": {
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    name: "Zealots of Rhodun",
    shortname: "Rhodun",
    startswith: {
      planets: ["Poh", "Orad"],
      techs: ["Bio-Stims"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
  },
  "Zelian Purifier": {
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    name: "Zelian Purifier",
    shortname: "Zelian",
    startswith: {
      planets: ["Zelian", "Gen"],
      techs: ["Antimass Deflectors", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 1,
        Infantry: 5,
        PDS: 1,
        "Space Dock": 1,
      },
    },
  },
};