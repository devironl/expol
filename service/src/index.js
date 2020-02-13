const express = require("express");
const bodyParser = require("body-parser");
const knexConfig = require("../db/knexfile");
const knex = require("knex")(knexConfig);
const app = express();

const stringToTsQuery = string => string.trim().replace(/ +/g, ":* & ") + ":*";
const unpackOrEmptyList = key => responseArray =>
  responseArray.length ? responseArray[0][key] : [];

app.use(bodyParser.json());

app.post("/api/search", (req, res) => {
  knex("lemma")
    .select(["id", "display_word"])
    .whereRaw("variants @@ to_tsquery(?)", stringToTsQuery(req.body.query))
    .limit(30)
    .then(d => res.json(d))
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

app.post("/api/count_search/:id", (req, res) => {
  knex
    .transaction(trx =>
      trx.raw(
        "INSERT INTO lemma_search_count (lemma_id, count) VALUES (?, 1) ON CONFLICT (lemma_id) DO UPDATE SET count = lemma_search_count.count + 1;",
        [req.params.id]
      )
    )
    .then(() => {
      res.status(201);
      res.send();
    })
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

app.get("/api/top_search", (req, res) => {
  knex
    .select([
      "lemma_search_count.lemma_id",
      "lemma.id",
      "count",
      "lemma.display_word"
    ])
    .from("lemma_search_count")
    .innerJoin("lemma", "lemma_search_count.lemma_id", "lemma.id")
    .orderBy("count", "desc")
    .limit(20)
    .then(d => {
      res.json(d);
    })
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

app.get("/api/years", (req, res) => {
  knex("lemma_usage")
    .distinct("year")
    .select()
    .then(d => res.json(d))
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

app.get("/api/lemma/:id", (req, res) => {
  knex("lemma")
    .select(["id", "display_word"])
    .where(req.params)
    .then(d => {
      if (d && d.length > 0) {
        res.json(d[0]);
      } else {
        res.status(404);
        res.send();
      }
    })
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

app.get("/api/lemma_usage/:id/:year", (req, res) => {
  knex("lemma_usage")
    .select("usage_list")
    .where({
      id: req.params.id,
      year: req.params.year
    })
    .then(unpackOrEmptyList("usage_list"))
    .then(d => res.json(d))
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

app.get("/api/lemma_concordance/:id/:year/:party/:page", (req, res) => {
  knex("lemma_concordance_page")
    .select()
    .where(req.params)
    .then(d => res.json(d.pop() || []))
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

app.get("/api/lemma_similarity/:id", (req, res) => {
  knex("lemma_similarity")
    .select("similar_list")
    .where("id", req.params.id)
    .then(unpackOrEmptyList("similar_list"))
    .then(d => res.json(d))
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

app.get("/api/lemma_time_usage/:id", (req, res) => {
  knex("lemma_time_usage")
    .select("historical_trend")
    .where("id", req.params.id)
    .then(unpackOrEmptyList("historical_trend"))
    .then(d => res.json(d))
    .catch(error => {
      console.log("ERROR: ", error);
      res.status(500);
      res.send();
    });
});

const server = app.listen(process.env.PORT, () => {
  console.log("Started at http://localhost:%d\n", server.address().port);
});
