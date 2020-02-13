import { map, uniq } from "lodash/fp";
import { scaleOrdinal } from "d3-scale";
import { schemeSet3 } from "d3-scale-chromatic";
import { color } from "d3-color";

let groupList = [];
let groupColors;

const partyNames = {
  CDH: "cdH",
  DEFI: "DéFI",
  ECOLO: "Ecolo",
  MR: "MR",
  PP: "PP",
  PS: "PS",
  PTB: "PTB",
  total: "Global"
}

const partyNamesWithPronoun = {
  CDH: "Le cdH",
  DEFI: "DéFI",
  ECOLO: "Ecolo",
  MR: "Le MR",
  PP: "Le PP",
  PS: "Le PS",
  PTB: "Le PTB"
}

const partyColors = {
  CDH: color("rgb(212, 122, 46)"),
  DEFI: color("rgb(188, 54, 128)"),
  ECOLO: color("rgb(159, 201, 65)"),
  MR: color("rgb(60, 122, 168)"),
  PP: color("rgb(124, 48, 122)"),
  PS: color("rgb(213, 56, 31)"),
  PTB: color("rgb(151, 37, 20)")
};

const init = (data, key = "group") => {
  groupList = uniq(map(d => d[key], data));
  groupColors = scaleOrdinal(schemeSet3).domain(groupList);
};

const getPartyList = () => Object.keys(partyColors);

const getGroupList = () => groupList;

const getGroupColor = g => groupColors(g);

const getPartyColor = party => partyColors[party] || color("rgb(0, 232, 156)");

const getPartyName = party => partyNames[party];

const getPartyNameWithPronoun = party => partyNamesWithPronoun[party];

export default {
  init,
  getGroupList,
  getGroupColor,
  getPartyColor,
  getPartyList,
  getPartyName,
  getPartyNameWithPronoun
};
