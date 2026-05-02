require("dotenv").config({ path: "../notification_app_be/.env" });

const axios = require("axios");
const Log = require("../notification_app_be/middleware/logger");

const runScheduler = async () => {
  try {
    await Log("backend", "info", "service", "Fetching depots and vehicles");

    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    };

    const depotsRes = await axios.get(
      "http://20.207.122.201/evaluation-service/depots",
      { headers }
    );

    const vehiclesRes = await axios.get(
      "http://20.207.122.201/evaluation-service/vehicles",
      { headers }
    );

    const depots =
      depotsRes.data?.data ||
      depotsRes.data?.depots ||
      depotsRes.data;

    const vehicles =
      vehiclesRes.data?.data ||
      vehiclesRes.data?.vehicles ||
      vehiclesRes.data;

    if (!Array.isArray(depots) || !Array.isArray(vehicles)) {
      throw new Error("Invalid API response format");
    }

    console.log("Depots:", depots);
    console.log("Vehicles:", vehicles);

    await Log("backend", "info", "service", "Starting optimization");

    vehicles.sort(
      (a, b) => b.Impact / b.Duration - a.Impact / a.Duration
    );

    const results = depots.map((depot) => {
      let remainingTime = depot.MechanicHours;

      let selectedTasks = [];
      let totalImpact = 0;
      let timeUsed = 0;

      Log(
        "backend",
        "debug",
        "service",
        `Depot ${depot.ID} processing`
      );

      for (let v of vehicles) {
        if (v.Duration <= remainingTime) {
          selectedTasks.push(v.TaskID);
          remainingTime -= v.Duration;
          totalImpact += v.Impact;
          timeUsed += v.Duration;
        }
      }

      Log(
        "backend",
        "info",
        "service",
        `Tasks selected for depot ${depot.ID}`
      );

      return {
        depot: depot.ID,
        selectedTasks,
        totalImpact,
        timeUsed,
      };
    });

    await Log("backend", "info", "service", "Optimization complete");

    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    console.error("Error:", err.message);
  }
};

runScheduler();