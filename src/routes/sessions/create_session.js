const express = require("express");
const db = require("../../util/database");
const tokenValidator = require("../../logic/functions/token_validator");
const query = require("../../logic/functions/query_creator");

const router = express.Router();

router.post("/sessions", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "admin",
      "coach"
    ]);

    if (tokenData.statusCode === 200) {
      var resBody = await createSession(req.body);
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function createSession(session) {
  if (
    session.name == null ||
    session.name == "" ||
    session.cost == null ||
    session.cost == "" 
  ) {
    return {
      statusCode: 400,
      message:
        "name and cost are required",
    };
  }

  var resBody = {};

  var q = query.insert("sessions", [
    {
      column: "name",
      value: session.name,
    },
    {
      column: "cost",
      value: session.cost,
    },
  ]);

  await db
    .execute(`${q};`)
    .then((result) => {
      resBody = {
        statusCode: 200,
        message: "session created successfully",
        id: result[0]?.insertId,
      };
    })
    .catch((err) => {
      console.log(err);
      resBody = { statusCode: 400, message: err.message };
    });

  return resBody;
}
module.exports = router;
