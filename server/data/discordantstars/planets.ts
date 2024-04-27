const HOME_MIDDLE = { x: 0, y: -12 };
const MIDDLE = { x: 0, y: 0 };
const TOP_LEFT = { x: -22, y: -36 };
const HOME_BOTTOM_RIGHT = { x: 30, y: 32 };
const BOTTOM_RIGHT = { x: 18, y: 32 };
const MIDDLE_LEFT = { x: -48, y: -8 };
const TOP_RIGHT = { x: 22, y: -38 };
const FAR_BOTTOM_RIGHT = { x: 28, y: 42 };

export const DISCORDANT_STARS_PLANETS: Record<
  DiscordantStars.PlanetId,
  BasePlanet
> = {
  // Augurs of Ilyxum
  Demis: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Augurs of Ilyxum",
    home: true,
    influence: 2,
    id: "Demis",
    name: "Demis",
    position: TOP_LEFT,
    resources: 2,
    system: 1001,
    type: "NONE",
  },
  Chrion: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Augurs of Ilyxum",
    home: true,
    influence: 3,
    id: "Chrion",
    name: "Chrion",
    position: HOME_BOTTOM_RIGHT,
    resources: 2,
    system: 1001,
    type: "NONE",
  },
  // Bentor Conglomerate
  Benc: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Bentor Conglomerate",
    home: true,
    influence: 0,
    id: "Benc",
    name: "Benc",
    position: TOP_LEFT,
    resources: 2,
    system: 1002,
    type: "NONE",
  },
  Hau: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Bentor Conglomerate",
    home: true,
    influence: 2,
    id: "Hau",
    name: "Hau",
    position: HOME_BOTTOM_RIGHT,
    resources: 1,
    system: 1002,
    type: "NONE",
  },
  // Berserkers of Kjalengard
  Kjalengard: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Berserkers of Kjalengard",
    home: true,
    influence: 2,
    id: "Kjalengard",
    name: "Kjalengard",
    position: TOP_LEFT,
    resources: 3,
    system: 1003,
    type: "NONE",
  },
  Hulgade: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Berserkers of Kjalengard",
    home: true,
    influence: 0,
    id: "Hulgade",
    name: "Hulgade",
    position: HOME_BOTTOM_RIGHT,
    resources: 1,
    system: 1003,
    type: "NONE",
  },
  // Kyro Sodality
  Avicenna: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Kyro Sodality",
    home: true,
    influence: 0,
    id: "Avicenna",
    name: "Avicenna",
    position: HOME_MIDDLE,
    resources: 4,
    type: "NONE",
  },
  // Celdauri Trade Confederation
  Louk: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Celdauri Trade Confederation",
    home: true,
    influence: 1,
    id: "Louk",
    name: "Louk",
    position: TOP_LEFT,
    resources: 2,
    system: 1004,
    type: "NONE",
  },
  Auldane: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Celdauri Trade Confederation",
    home: true,
    influence: 3,
    id: "Auldane",
    name: "Auldane",
    position: HOME_BOTTOM_RIGHT,
    resources: 1,
    system: 1004,
    type: "NONE",
  },
  // Cheiran Hordes
  "Gghurn Theta": {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Cheiran Hordes",
    home: true,
    influence: 1,
    id: "Gghurn Theta",
    name: "Gghurn Theta",
    position: HOME_BOTTOM_RIGHT,
    resources: 2,
    system: 1005,
    type: "NONE",
  },
  Arche: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Cheiran Hordes",
    home: true,
    influence: 2,
    id: "Arche",
    name: "Arche",
    position: TOP_LEFT,
    resources: 2,
    system: 1005,
    type: "NONE",
  },
  // Dih-Mohn Flotilla
  Abyssus: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Dih-Mohn Flotilla",
    home: true,
    influence: 2,
    id: "Abyssus",
    name: "Abyssus",
    position: HOME_MIDDLE,
    resources: 4,
    system: 1006,
    type: "NONE",
  },
  // Edyn Mandate
  Edyn: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Edyn Mandate",
    home: true,
    influence: 3,
    id: "Edyn",
    name: "Edyn",
    position: MIDDLE_LEFT,
    resources: 3,
    system: 1007,
    type: "NONE",
  },
  Ekko: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Edyn Mandate",
    home: true,
    influence: 1,
    id: "Ekko",
    name: "Ekko",
    position: TOP_RIGHT,
    resources: 0,
    system: 1007,
    type: "NONE",
  },
  Okke: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Edyn Mandate",
    home: true,
    influence: 1,
    id: "Okke",
    name: "Okke",
    position: FAR_BOTTOM_RIGHT,
    resources: 0,
    system: 1007,
    type: "NONE",
  },
  // Florzen Profiteers
  Delmor: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Florzen Profiteers",
    home: true,
    influence: 1,
    id: "Delmor",
    name: "Delmor",
    position: TOP_LEFT,
    resources: 2,
    system: 1008,
    type: "NONE",
  },
  Kyd: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Florzen Profiteers",
    home: true,
    influence: 2,
    id: "Kyd",
    name: "Kyd",
    position: HOME_BOTTOM_RIGHT,
    resources: 1,
    system: 1008,
    type: "NONE",
  },
  // Free Systems Compact
  Idyn: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Free Systems Compact",
    home: true,
    influence: 0,
    id: "Idyn",
    name: "Idyn",
    position: MIDDLE_LEFT,
    resources: 1,
    system: 1009,
    type: "NONE",
  },
  Kroll: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Free Systems Compact",
    home: true,
    influence: 1,
    id: "Kroll",
    name: "Kroll",
    position: TOP_RIGHT,
    resources: 1,
    system: 1009,
    type: "NONE",
  },
  Cyrra: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Free Systems Compact",
    home: true,
    influence: 1,
    id: "Cyrra",
    name: "Cyrra",
    position: FAR_BOTTOM_RIGHT,
    resources: 0,
    system: 1009,
    type: "NONE",
  },
  // Ghemina Raiders
  Drah: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Ghemina Raiders",
    home: true,
    influence: 2,
    id: "Drah",
    name: "Drah",
    position: TOP_LEFT,
    resources: 1,
    system: 1010,
    type: "NONE",
  },
  Trykk: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Ghemina Raiders",
    home: true,
    influence: 1,
    id: "Trykk",
    name: "Trykk",
    position: HOME_BOTTOM_RIGHT,
    resources: 2,
    system: 1010,
    type: "NONE",
  },
  // Ghoti Wayfarers
  Ghoti: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Ghoti Wayfarers",
    influence: 3,
    locked: true,
    id: "Ghoti",
    name: "Ghoti",
    resources: 3,
    system: 1011,
    type: "NONE",
  },
  // Gledge Union
  "Last Stop": {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Gledge Union",
    home: true,
    influence: 0,
    id: "Last Stop",
    name: "Last Stop",
    position: HOME_MIDDLE,
    resources: 3,
    system: 1012,
    type: "NONE",
  },
  // Glimmer of Mortheus
  Biaheo: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Glimmer of Mortheus",
    home: true,
    influence: 0,
    id: "Biaheo",
    name: "Biaheo",
    position: TOP_LEFT,
    resources: 3,
    system: 1013,
    type: "NONE",
  },
  Empero: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Glimmer of Mortheus",
    home: true,
    influence: 3,
    id: "Empero",
    name: "Empero",
    position: HOME_BOTTOM_RIGHT,
    resources: 0,
    system: 1013,
    type: "NONE",
  },
  // Kollecc Society
  Susuros: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Kollecc Society",
    home: true,
    influence: 4,
    id: "Susuros",
    name: "Susuros",
    position: HOME_MIDDLE,
    resources: 4,
    system: 1014,
    type: "NONE",
  },
  // Monks of Kolume
  Alesna: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Monks of Kolume",
    home: true,
    influence: 0,
    id: "Alesna",
    name: "Alesna",
    position: TOP_LEFT,
    resources: 2,
    system: 1021,
    type: "NONE",
  },
  Azle: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Monks of Kolume",
    home: true,
    influence: 0,
    id: "Azle",
    name: "Azle",
    position: HOME_BOTTOM_RIGHT,
    resources: 2,
    system: 1021,
    type: "NONE",
  },
  // Kortali Tribunal
  Ogdun: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Kortali Tribunal",
    home: true,
    influence: 0,
    id: "Ogdun",
    name: "Ogdun",
    position: TOP_LEFT,
    resources: 2,
    system: 1015,
    type: "NONE",
  },
  Brthkul: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Kortali Tribunal",
    home: true,
    influence: 3,
    id: "Brthkul",
    name: "Brthkul",
    position: HOME_BOTTOM_RIGHT,
    resources: 1,
    system: 1015,
    type: "NONE",
  },
  // Lanefir Remnants
  "Aysis Rest": {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Lanefir Remnants",
    home: true,
    influence: 3,
    id: "Aysis Rest",
    name: "Aysis' Rest",
    position: TOP_LEFT,
    resources: 4,
    system: 1017,
    type: "NONE",
  },
  Solitude: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Lanefir Remnants",
    home: true,
    influence: 1,
    id: "Solitude",
    name: "Solitude",
    position: HOME_BOTTOM_RIGHT,
    resources: 0,
    system: 1017,
    type: "NONE",
  },
  // Li-Zho Dynasty
  Pax: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Li-Zho Dynasty",
    home: true,
    influence: 2,
    id: "Pax",
    name: "Pax",
    position: TOP_RIGHT,
    resources: 1,
    system: 1018,
    type: "NONE",
  },
  Kyr: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Li-Zho Dynasty",
    home: true,
    influence: 0,
    id: "Kyr",
    name: "Kyr",
    position: MIDDLE_LEFT,
    resources: 2,
    system: 1018,
    type: "NONE",
  },
  Vess: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Li-Zho Dynasty",
    home: true,
    influence: 1,
    id: "Vess",
    name: "Vess",
    position: FAR_BOTTOM_RIGHT,
    resources: 0,
    system: 1018,
    type: "NONE",
  },
  // L'tokk Khrask
  "Bohl-Dhur": {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "L'tokk Khrask",
    home: true,
    influence: 4,
    id: "Bohl-Dhur",
    name: "Bohl-Dhur",
    position: HOME_MIDDLE,
    resources: 3,
    system: 1019,
    type: "NONE",
  },
  // Mirveda Protectorate
  Aldra: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Mirveda Protectorate",
    home: true,
    influence: 3,
    id: "Aldra",
    name: "Aldra",
    position: TOP_LEFT,
    resources: 2,
    system: 1020,
    type: "NONE",
  },
  Beata: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Mirveda Protectorate",
    home: true,
    influence: 1,
    id: "Beata",
    name: "Beata",
    position: HOME_BOTTOM_RIGHT,
    resources: 2,
    system: 1020,
    type: "NONE",
  },
  // Myko-Mentori
  "Shi-Halaum": {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Myko-Mentori",
    home: true,
    influence: 0,
    id: "Shi-Halaum",
    name: "Shi-Halaum",
    position: HOME_MIDDLE,
    resources: 4,
    system: 1022,
    type: "NONE",
  },
  // Nivyn Star Kings
  Ellas: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Nivyn Star Kings",
    home: true,
    influence: 3,
    id: "Ellas",
    name: "Ellas",
    position: HOME_BOTTOM_RIGHT,
    resources: 3,
    system: 1023,
    type: "NONE",
  },
  // Nokar Sellships
  Zarr: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Nokar Sellships",
    home: true,
    influence: 1,
    id: "Zarr",
    name: "Zarr",
    position: TOP_LEFT,
    resources: 2,
    system: 1024,
    type: "NONE",
  },
  Nokk: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Nokar Sellships",
    home: true,
    influence: 1,
    id: "Nokk",
    name: "Nokk",
    position: HOME_BOTTOM_RIGHT,
    resources: 1,
    system: 1024,
    type: "NONE",
  },
  // Olradin League
  Sanctuary: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Olradin League",
    home: true,
    influence: 4,
    id: "Sanctuary",
    name: "Sanctuary",
    position: HOME_MIDDLE,
    resources: 3,
    system: 1025,
    type: "NONE",
  },
  // Roh'Dhna Mechatronics
  Prind: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Roh'Dhna Mechatronics",
    home: true,
    influence: 3,
    id: "Prind",
    name: "Prind",
    position: HOME_MIDDLE,
    resources: 3,
    system: 1026,
    type: "NONE",
  },
  // Savages of Cymiae
  Cymiae: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Savages of Cymiae",
    home: true,
    influence: 1,
    id: "Cymiae",
    name: "Cymiae",
    position: HOME_MIDDLE,
    resources: 3,
    system: 1027,
    type: "NONE",
  },
  // Shipwrights of Axis
  Axis: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Shipwrights of Axis",
    home: true,
    influence: 0,
    id: "Axis",
    name: "Axis",
    position: HOME_MIDDLE,
    resources: 5,
    system: 1028,
    type: "NONE",
  },
  // Tnelis Syndicate
  Discordia: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Tnelis Syndicate",
    home: true,
    influence: 1,
    id: "Discordia",
    name: "Discordia",
    position: HOME_MIDDLE,
    resources: 4,
    system: 1029,
    type: "NONE",
  },
  // Vaden Banking Clans
  Vadarian: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Vaden Banking Clans",
    home: true,
    influence: 0,
    id: "Vadarian",
    name: "Vadarian",
    position: TOP_LEFT,
    resources: 3,
    system: 1030,
    type: "NONE",
  },
  Norvus: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Vaden Banking Clans",
    home: true,
    influence: 2,
    id: "Norvus",
    name: "Norvus",
    position: HOME_BOTTOM_RIGHT,
    resources: 1,
    system: 1030,
    type: "NONE",
  },
  // Vaylerian Scourge
  Vaylar: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Vaylerian Scourge",
    home: true,
    influence: 2,
    id: "Vaylar",
    name: "Vaylar",
    position: HOME_MIDDLE,
    resources: 3,
    system: 1031,
    type: "NONE",
  },
  // Veldyr Sovereignty
  Rhune: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    home: true,
    influence: 4,
    id: "Rhune",
    name: "Rhune",
    position: HOME_MIDDLE,
    resources: 3,
    system: 1032,
    type: "NONE",
  },
  // Zealots of Rhodun
  Poh: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Zealots of Rhodun",
    home: true,
    influence: 0,
    id: "Poh",
    name: "Poh",
    position: TOP_LEFT,
    resources: 2,
    system: 1033,
    type: "NONE",
  },
  Orad: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Zealots of Rhodun",
    home: true,
    influence: 1,
    id: "Orad",
    name: "Orad",
    position: HOME_BOTTOM_RIGHT,
    resources: 3,
    system: 1033,
    type: "NONE",
  },
  // Zelian Purifier
  Zelian: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Zelian Purifier",
    home: true,
    influence: 3,
    id: "Zelian",
    name: "Zelian",
    position: HOME_BOTTOM_RIGHT,
    resources: 3,
    system: 1034,
    type: "NONE",
  },
  Gen: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    faction: "Zelian Purifier",
    home: true,
    influence: 0,
    id: "Gen",
    name: "Gen",
    position: TOP_LEFT,
    resources: 2,
    system: 1034,
    type: "NONE",
  },
  Silence: {
    ability:
      "You may exhaust this card at the end of your turn to place 1 cruiser from your reinforcements in any system that contains 1 or more of your ships.",
    attributes: ["legendary"],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Silence",
    name: "Silence",
    position: MIDDLE,
    resources: 2,
    system: 1037,
    type: "INDUSTRIAL",
  },
  Echo: {
    ability:
      "You may exhaust this card at the end of your turn to place 1 frontier token in a system that does not contain a planet.",
    attributes: ["legendary"],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Echo",
    name: "Echo",
    position: MIDDLE,
    resources: 1,
    system: 1038,
    type: "HAZARDOUS",
  },
  Tarrock: {
    ability:
      "After an agenda is revealed, you may exhaust this card to predict aloud an outcome of that agenda. If your prediction is correct, draw 1 secret objective.",
    attributes: ["legendary"],
    expansion: "DISCORDANT STARS",
    influence: 0,
    id: "Tarrock",
    name: "Tarrock",
    position: MIDDLE,
    resources: 3,
    system: 1039,
    type: "INDUSTRIAL",
  },
  Prism: {
    ability:
      "ACTION: Exhaust this card to replace 1 of your non-faction non-unit upgrade technologies with another technology from your technology deck with the same number of prerequisites.",
    attributes: ["legendary"],
    expansion: "DISCORDANT STARS",
    influence: 3,
    id: "Prism",
    name: "Prism",
    position: MIDDLE,
    resources: 0,
    system: 1040,
    type: "INDUSTRIAL",
  },
  Troac: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 4,
    id: "Troac",
    name: "Troac",
    position: MIDDLE,
    resources: 0,
    system: 1041,
    type: "CULTURAL",
  },
  "Etir V": {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 0,
    id: "Etir V",
    name: "Etir V",
    position: MIDDLE,
    resources: 4,
    system: 1042,
    type: "HAZARDOUS",
  },
  Vioss: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 3,
    id: "Vioss",
    name: "Vioss",
    position: MIDDLE,
    resources: 3,
    system: 1043,
    type: "CULTURAL",
  },
  Fakrenn: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Fakrenn",
    name: "Fakrenn",
    position: TOP_LEFT,
    resources: 2,
    system: 1044,
    type: "HAZARDOUS",
  },
  "San-Vit": {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 1,
    id: "San-Vit",
    name: "San-Vit",
    position: TOP_LEFT,
    resources: 3,
    system: 1045,
    type: "CULTURAL",
  },
  Lodran: {
    attributes: ["yellow-skip"],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Lodran",
    name: "Lodran",
    position: BOTTOM_RIGHT,
    resources: 0,
    system: 1045,
    type: "HAZARDOUS",
  },
  Dorvok: {
    attributes: ["red-skip"],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Dorvok",
    name: "Dorvok",
    position: TOP_LEFT,
    resources: 1,
    system: 1046,
    type: "INDUSTRIAL",
  },
  Derbrae: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 3,
    id: "Derbrae",
    name: "Derbrae",
    position: BOTTOM_RIGHT,
    resources: 2,
    system: 1046,
    type: "CULTURAL",
  },
  Rysaa: {
    attributes: ["blue-skip"],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Rysaa",
    name: "Rysaa",
    position: TOP_LEFT,
    resources: 1,
    system: 1047,
    type: "INDUSTRIAL",
  },
  Moln: {
    attributes: ["green-skip"],
    expansion: "DISCORDANT STARS",
    influence: 0,
    id: "Moln",
    name: "Moln",
    position: BOTTOM_RIGHT,
    resources: 2,
    system: 1047,
    type: "HAZARDOUS",
  },
  Salin: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Salin",
    name: "Salin",
    position: TOP_LEFT,
    resources: 1,
    system: 1048,
    type: "HAZARDOUS",
  },
  Gwiyun: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Gwiyun",
    name: "Gwiyun",
    position: BOTTOM_RIGHT,
    resources: 2,
    system: 1048,
    type: "HAZARDOUS",
  },
  Inan: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Inan",
    name: "Inan",
    position: TOP_LEFT,
    resources: 1,
    system: 1049,
    type: "INDUSTRIAL",
  },
  Swog: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 0,
    id: "Swog",
    name: "Swog",
    position: BOTTOM_RIGHT,
    resources: 1,
    system: 1049,
    type: "INDUSTRIAL",
  },
  Detic: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Detic",
    name: "Detic",
    position: TOP_LEFT,
    resources: 3,
    system: 1050,
    type: "CULTURAL",
  },
  Lliot: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 1,
    id: "Lliot",
    name: "Lliot",
    position: BOTTOM_RIGHT,
    resources: 0,
    system: 1050,
    type: "CULTURAL",
  },
  Qaak: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 1,
    id: "Qaak",
    name: "Qaak",
    position: TOP_RIGHT,
    resources: 1,
    system: 1051,
    type: "CULTURAL",
  },
  Larred: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 1,
    id: "Larred",
    name: "Larred",
    position: MIDDLE_LEFT,
    resources: 1,
    system: 1051,
    type: "INDUSTRIAL",
  },
  Nairb: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 1,
    id: "Nairb",
    name: "Nairb",
    position: FAR_BOTTOM_RIGHT,
    resources: 1,
    system: 1051,
    type: "HAZARDOUS",
  },
  Sierpin: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 0,
    id: "Sierpin",
    name: "Sierpin",
    position: TOP_RIGHT,
    resources: 2,
    system: 1052,
    type: "CULTURAL",
  },
  Mandle: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 1,
    id: "Mandle",
    name: "Mandle",
    position: MIDDLE_LEFT,
    resources: 1,
    system: 1052,
    type: "INDUSTRIAL",
  },
  Regnem: {
    attributes: [],
    expansion: "DISCORDANT STARS",
    influence: 2,
    id: "Regnem",
    name: "Regnem",
    position: FAR_BOTTOM_RIGHT,
    resources: 0,
    system: 1052,
    type: "HAZARDOUS",
  },
  Domna: {
    ability:
      "You may exhaust this card at the end of your turn to remove 1 of your ships from the game board and place that unit in an adjacent system that does not contain another player's ships.",
    attributes: ["legendary"],
    expansion: "DISCORDANT STARS",
    influence: 1,
    id: "Domna",
    name: "Domna",
    position: MIDDLE,
    resources: 2,
    system: 1053,
    type: "HAZARDOUS",
  },
};
