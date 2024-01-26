const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const db = require("../../util/database");

async function tokenValidator(token, roles) {
  var user = null;
  if (token == "" || token == null || token == "undefiend") {
    user = { statusCode: 401, message: "unauthorized user" };
  } else {
    jwt.verify(token, env.jwtKey, async (error, data) => {
      if (error) {
        user = { statusCode: 401, message: "unauthorized user" };
      } else {
        if (roles.includes(data.role)) {
          user = { statusCode: 200, user: data };
        } else {
          user = { statusCode: 403, message: "access denied" };
        }
      }
    });
  }
  var valid = await getTokenId(user?.user?.tokenId ?? "-");
  if (valid) {
    return user;
  } else {
    return { statusCode: 401, message: "unauthorized user" };
  }
}

function generateRandomTokenId(id, role) {
  var tokenId = `${role}-${id}-${Math.floor(
    Math.random() * Date.now()
  ).toString(36)}-${Math.floor(Math.random() * Date.now()).toString(36)}`;
  saveTokenId(tokenId, role, id);
  return tokenId;
}

function saveTokenId(tokenId, role, userId) {
  db.execute(
    `INSERT INTO tokens_ids (token_id, user_type, user_id) VALUES ("${tokenId}", "${role}", "${userId}");`
  );
}

async function getTokenId(id) {
  return true;
  var valid = false;
  await db
    .execute(`SELECT * FROM tokens_ids WHERE token_id = "${id}" LIMIT 0,1;`)
    .then((result) => {
      if (result[0].length > 0) {
        valid = result[0][0].valid == 1 ? true : false;
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  return valid;
}

module.exports = { tokenValidator, generateRandomTokenId };
