const express = require("express");
const db = require("../../util/database");
const queries = require("../../logic/functions/query_creator");
const tokenValidator = require("../../logic/functions/token_validator");

const router = express.Router();

router.get("/sessions", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "admin",
      "coach"
    ]);
    if (tokenData.statusCode === 200) {
      var resBody = await getSessions(
        req.query.page,
        req.query.limit,
        req.query.query
      );
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function getSessions(page, limit, query) {
  var resBody = {};
  var sqlQuery = queries.craeteQuery(
    page,
    limit,
    [
      { column: "name", value: query, key: "LIKE" },
    ],
    "deleted_at"
  );

  await db
    .execute(
      `SELECT * FROM sessions ${sqlQuery.query} ORDER BY created_at DESC LIMIT ${sqlQuery.from},${sqlQuery.limit};`
    )
    .then((result) => {
      resBody = { statusCode: 200, message: "sessions found", sessions: result[0] };
    })
    .catch((error) => {
      console.log(error);
      resBody = { statusCode: 400, message: error.message };
    });

  return resBody;
}

module.exports = router;
