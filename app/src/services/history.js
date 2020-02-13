import { uniqBy, filter } from "lodash/fp";

let historyOrderedSet = [];
const MAX_ITEMS = 200;

const add = item => {
  if (item) {
    historyOrderedSet.push(item);
    historyOrderedSet = uniqBy("id", historyOrderedSet);
    if (historyOrderedSet.length > MAX_ITEMS) {
      historyOrderedSet.pop();
    }
  }
};

const remove = item => {
  historyOrderedSet = filter(lemma => lemma.id !== item.id)(historyOrderedSet);
};

const getHistory = () => historyOrderedSet;

export default {
  add,
  remove,
  getHistory
};
