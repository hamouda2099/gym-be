const express = require("express");
const db = require("../../util/database");
const tokenValidator = require("../../logic/functions/token_validator");
const passwordEncryption = require("../../logic/functions/password_encryption");
const queryCreator = require("../../logic/functions/query_creator");

const router = express.Router();

router.put("/coaches/:id", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "admin",
    ]);

    if (tokenData.statusCode === 200) {
      var resBody = await updateCoach(req.body, req.params.id);
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function updateCoach(coach, id) {
  var resBody = {};

  var q = queryCreator.update(
    "coaches",
    `id = ${db.escape(id)}`,
    [
      {
        column: "name",
        value: coach.name,
      },
      {
        column: "salary",
        value: coach.salary,
      },
      {
        column: "hours",
        value: coach.hours,
      },
      {
        column: "phone",
        value: coach.phone,
      },
      {
        column: "password",
        value: coach.password == null ? null : await passwordEncryption.hash(coach.password),
      },
      {
        column: "role",
        value: coach.role,
      },
    ],
    false
  );

  await db
    .execute(`${q};`)
    .then((result) => {
      resBody = { statusCode: 200, message: "coach updated successfully" };
    })
    .catch((err) => {
      console.log(err);
      resBody = { statusCode: 400, message: err.message };
    });

  return resBody;
}
module.exports = router;
