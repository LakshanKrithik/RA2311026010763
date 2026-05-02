require("dotenv").config({ path: "../notification_app_be/.env" });

const axios = require("axios");
const Log = require("../notification_app_be/middleware/logger");

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

const getTopNotifications = async () => {
  try {
    await Log("backend", "info", "service", "Fetching notifications");

    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN.trim()}`
    };

    const res = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      { headers }
    );

    const notifications =
      res.data?.data ||
      res.data?.notifications ||
      res.data;

    await Log("backend", "info", "service", "Sorting notifications");

    notifications.sort((a, b) => {
      return (
        (priorityMap[b.Type] || 0) - (priorityMap[a.Type] || 0) ||
        new Date(b.Timestamp) - new Date(a.Timestamp)
      );
    });

    const top10 = notifications.slice(0, 10);

    await Log("backend", "info", "service", "Top 10 computed");

    console.log(JSON.stringify(top10, null, 2));
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    console.error(err.message);
  }
};

getTopNotifications();