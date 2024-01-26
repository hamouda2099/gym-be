const express = require("express");
const db = require("../../util/database");
const queries = require("../../logic/functions/query_creator");
const tokenValidator = require("../../logic/functions/token_validator");

const router = express.Router();

router.get("/subscriptions/:id", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "admin",
      "coach"
    ]);

    if (tokenData.statusCode === 200) {
      var resBody = await getSubscription(req.params.id);
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function getSubscription(id) {
  var resBody = {};

  var sqlQuery = queries.craeteQuery(
    1,
    1,
    [
      { column: "subscriptions.id", value: id, key: "=" },
    ],
    "subscriptions.deleted_at"
  );

  await db
    .execute(
      `SELECT subscriptions.*, JSON_OBJECT('id',coaches.id,'name',coaches.name,'phone',coaches.phone) as coach FROM subscriptions
      LEFT JOIN coaches ON subscriptions.coach_id = coaches.id ${sqlQuery.query} ORDER BY created_at DESC LIMIT ${sqlQuery.from},${sqlQuery.limit};`
    )
    .then((result) => {
      if (result[0].length == 0) {
        resBody = { statusCode: 400, message: "subscription not found" };
      } else {
        result[0][0].coach = JSON.parse(result[0][0].coach);
        resBody = {
          statusCode: 200,
          message: "subscription found",
          subscription: result[0][0],
        };
      }
    })
    .catch((error) => {
      console.log(error);
      resBody = { statusCode: 400, message: error.message };
    });

  return resBody;
}

module.exports = router;
