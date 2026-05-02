const axios = require("axios");

const Log = async (stack, level, pkg, message) => {
  try {
    const res = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Log success:", res.data);
  } catch (err) {
    console.error("Logging failed:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
  }
};

module.exports = Log;