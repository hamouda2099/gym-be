const express = require("express");
const db = require("../../util/database");
const tokenValidator = require("../../logic/functions/token_validator");
const queryCreator = require("../../logic/functions/query_creator");

const router = express.Router();

router.put("/subscriptions/pay_reminder/:id", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "coach",
      "admin"
    ]);

    if (tokenData.statusCode === 200) {
      var resBody = await payReminderSubscription(req.params.id,req.body);
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function payReminderSubscription(id,body) {
  var resBody = {};

  var q = queryCreator.update(
    "subscriptions",
    `id = ${db.escape(id)}`,
    [
      {
        column: "paid",
        value: body.paid,
      },
    ],
    false
  );

  await db
    .execute(`${q};`)
    .then((result) => {
      resBody = { statusCode: 200, message: "paid successfully" };
    })
    .catch((err) => {
      console.log(err);
      resBody = { statusCode: 400, message: err.message };
    });

  return resBody;
}
module.exports = router;
