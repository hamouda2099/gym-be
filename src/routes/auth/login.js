const express = require("express");
const db = require("../../util/database");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const validatePassword = require("../../logic/functions/password_encryption");
const tokenValidator = require("../../logic/functions/token_validator");

const router = express.Router();

router.post("/login", async (req, res) => {
  res.send(await login(req.body));
});

async function login(body) {
  if (
    body.name == "" ||
    body.name == null ||
    body.password == "" ||
    body.password == null
  ) {
    return { statusCode: 400, message: "name and password is required" };
  }

  var resBody = {};

  await db
    .execute(
      `SELECT * FROM coaches WHERE name = ${db.escape(body.name)} LIMIT 0,1;`
    )
    .then(async (result) => {
      if (result[0].length == 0) {
        resBody.statusCode = 400;
        resBody.message = "coach not found";
      } else {
        if (
          await validatePassword.decrypt(body.password, result[0][0].password)
        ) {
          resBody.statusCode = 200;
          resBody.message = "coach found";
          resBody.coach = result[0][0];
          resBody.coach.id = String(resBody.coach.id);
          resBody.coach.tokenId = tokenValidator.generateRandomTokenId(
            String(result[0][0].id),
            resBody.coach.role
          );
          resBody.coach.token = jwt.sign(resBody.coach, env.jwtKey, {
            expiresIn: "30d",
          });
          delete resBody.tokenId;
        } else {
          resBody.statusCode = 400;
          resBody.message = "incorrect password";
        }
      }
    })
    .catch((err) => {
      console.log(err);
      resBody.statusCode = 400;
      resBody.message = err.message;
    });
  return resBody;
}

module.exports = router;
