const Joi = require("joi");

require("dotenv").config({ path: ".env.local" });

const env_shecma = Joi.object({
  GYM_SERVER_PORT: Joi.number().positive().integer().required(),
  GYM_DB_HOST: Joi.string().required(),
  GYM_DB_PORT: Joi.number().positive().integer().required(),
  GYM_DB_USER: Joi.string().required(),
  GYM_DB_PASS: Joi.optional(),
  GYM_DB_NAME: Joi.string().required(),
  GYM_JWT_SECRET: Joi.string().required(),
});

const valid = (function validate() {
  const { error, value } = env_shecma.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error)
    throw {
      name: "EnvironmentValidationError",
      message: error.message.split("."),
    };
  return value;
})();

exports.env = {
  SERVER_PORT: valid.GYM_SERVER_PORT,
  DB_HOST: valid.GYM_DB_HOST,
  DB_PORT: valid.GYM_DB_PORT,
  DB_USER: valid.GYM_DB_USER,
  DB_PASS: valid.GYM_DB_PASS,
  DB_NAME: valid.GYM_DB_NAME,
  JWT_SECRET: valid.GYM_JWT_SECRET,
};
