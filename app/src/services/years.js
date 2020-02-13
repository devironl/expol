import axios from "axios";
import { flow, map, get } from "lodash/fp";

const extractAndSortYears = flow(map(get("year")), array =>
  array.sort((a, b) => b - a)
);

const years = Promise.resolve()
  .then(() =>
    axios({
      method: "get",
      url: `/api/years`
    })
  )
  .then(get("data"))
  .then(data => [extractAndSortYears(data), null])
  .catch(errorLoading => [null, errorLoading]);

const getYears = () => years;

export default {
  getYears
};
