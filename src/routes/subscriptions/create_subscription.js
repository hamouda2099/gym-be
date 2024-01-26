const express = require("express");
const db = require("../../util/database");
const tokenValidator = require("../../logic/functions/token_validator");
const query = require("../../logic/functions/query_creator");

const router = express.Router();

router.post("/subscriptions", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "admin",
      "coach"
    ]);

    if (tokenData.statusCode === 200) {
      var resBody = await createSubscription(req.body);
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function createSubscription(subscription) {
  if (
    subscription.name == null ||
    subscription.name == "" ||
    subscription.phone == null ||
    subscription.phone == "" ||
    subscription.startDate == null ||
    subscription.endDate == "" ||
    subscription.price == null ||
    subscription.price == "" ||
    subscription.paid == null ||
    subscription.paid == "" 
  ) {
    return {
      statusCode: 400,
      message:
        "name, phone, startDate, endDate, price and paid are required",
    };
  }

  var resBody = {};

  var q = query.insert("subscriptions", [
    {
      column: "name",
      value: subscription.name,
    },
    {
      column: "phone",
      value: subscription.phone,
    },
    {
      column: "status",
      value: "activeted",
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
  ]);

  await db
    .execute(`${q};`)
    .then((result) => {
      resBody = {
        statusCode: 200,
        message: "subscription created successfully",
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
