const express = require("express");
const db = require("../../util/database");
const tokenValidator = require("../../logic/functions/token_validator");

const router = express.Router();

router.delete("/subscriptions/:id", async (req, res) => {
  try {
    var tokenData = await tokenValidator.tokenValidator(req.headers.token, [
      "admin",
    ]);

    if (tokenData.statusCode === 200) {
      var resBody = await deleteSubscription(req.params.id);
      res.status(resBody.statusCode).send(resBody);
    } else {
      res.status(tokenData.statusCode).send(tokenData);
    }
  } catch (e) {
    res.status(400).send({ statusCode: 400, message: e.message });
  }
});

async function deleteSubscription(id) {
  var resBody = {};

  await db
    .execute(
      `UPDATE subscriptions SET phone = CONCAT(phone, ' DELETED AT: ${String(
        new Date().toISOString()
      )}'), deleted_at = '${String(
        new Date().toISOString()
      )}' WHERE id = ${db.escape(id)};`
    )
    .then((result) => {
      resBody = { statusCode: 200, message: "subscription deleted successfully" };
    })
    .catch((error) => {
      console.log(error);
      resBody = { statusCode: 400, message: error.message };
    });

  return resBody;
}

module.exports = router;
