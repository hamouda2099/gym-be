const express = require("express");
const db = require("../../util/database");
const tokenValidator = require("../../logic/functions/token_validator");
const passwordEncryption = require("../../logic/functions/password_encryption");
const queryCreator = require("../../logic/functions/query_creator");

const router = express.Router();

router.put("/subscriptions/:id", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "admin",
    ]);

    if (tokenData.statusCode === 200) {
      var resBody = await updateSubscription(req.body, req.params.id);
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function updateSubscription(subscription, id) {
  var resBody = {};

  var q = queryCreator.update(
    "subscriptions",
    `id = ${db.escape(id)}`,
    [
      {
        column: "name",
        value: subscription.name,
      },
      {
        column: "phone",
        value: subscription.phone,
      },
      {
        column: "start_date",
        value: subscription.startDate,
      },
      {
        column: "end_date",
        value:subscription.endDate,
      },
    
      {
        column: "price",
        value: subscription.price,
      },
      {
        column: "paid",
        value: subscription.paid,
      },
      {
        column: "coach_id",
        value: subscription.coachId,
      },
    ],
    false
  );

  await db
    .execute(`${q};`)
    .then((result) => {
      resBody = { statusCode: 200, message: "subscription updated successfully" };
    })
    .catch((err) => {
      console.log(err);
      resBody = { statusCode: 400, message: err.message };
    });

  return resBody;
}
module.exports = router;
