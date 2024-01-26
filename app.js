const express = require("express");
const cors = require("cors");
const bodyParser = require("busboy-body-parser");

/// ROUTES ENDPOINTS
const login = require("./src/routes/auth/login");

const createCoach = require("./src/routes/coaches/create_coach");
const deleteCoach = require("./src/routes/coaches/delete_coach");
const updateCoach = require("./src/routes/coaches/update_coach");
const getCoaches = require("./src/routes/coaches/get_coaches");

const createSessions = require("./src/routes/sessions/create_session");
const getSessions = require("./src/routes/sessions/get_sessions");

const createSubscription = require("./src/routes/subscriptions/create_subscription");
const getSubscriptionById = require("./src/routes/subscriptions/get_subscription_by_id");
const getSubscriptions = require("./src/routes/subscriptions/get_subscriptions");
const activeSubscription = require("./src/routes/subscriptions/active");
const pauseSubscription = require("./src/routes/subscriptions/pause");
const suspendSubscription = require("./src/routes/subscriptions/suspend");
const payReminderSubscription = require("./src/routes/subscriptions/pay_reminder");


const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(bodyParser());

/// ROUTES INIT
 
app.use(login);
app.use(createCoach);
app.use(updateCoach);
app.use(deleteCoach);
app.use(getCoaches);
app.use(getSessions);
app.use(createSessions);
app.use(activeSubscription);
app.use(createSubscription);
app.use(getSubscriptionById);
app.use(getSubscriptions);
app.use(pauseSubscription);
app.use(suspendSubscription);
app.use(payReminderSubscription);



app.get("/", (req, res) => {
    res.status(200).send("root");
  });
  
  app.use((req, res) => {
    res.status(404).send({ statusCode: 404, message: "page not found" });
  });
  
  exports.app = app;