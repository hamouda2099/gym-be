const express = require("express");
const db = require("../../util/database");
const tokenValidator = require("../../logic/functions/token_validator");
const query = require("../../logic/functions/query_creator");
const passwordEncryption = require("../../logic/functions/password_encryption");

const router = express.Router();

router.post("/coaches", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "admin"
    ]);

    if (tokenData.statusCode === 200) {
      var resBody = await createCoach(req.body);
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function createCoach(coach) {
  if (
    coach.name == null ||
    coach.name == "" ||
    coach.phone == null ||
    coach.phone == "" ||
    coach.salary == null ||
    coach.salary == "" ||
    coach.password == null ||
    coach.password == "" ||
    coach.hours == null ||
    coach.hours == "" ||
    coach.role == null ||
    coach.role == ""
  ) {
    return {
      statusCode: 400,
      message:
        "name, phone, salary, hours, password role are required",
    };
  }

  var resBody = {};

  var q = query.insert("coaches", [
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
      value: await passwordEncryption.hash(coach.password),
    },
    {
      column: "role",
      value: coach.role,
    },
  ]);

  await db
    .execute(`${q};`)
    .then((result) => {
      resBody = {
        statusCode: 200,
        message: "coach created successfully",
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
