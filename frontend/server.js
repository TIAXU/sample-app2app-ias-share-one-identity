const xsenv = require("@sap/xsenv");
const CREDENTIALS = xsenv.getServices({ myIas: { label: "identity" } }).myIas;

const axios = require("axios");
const express = require("express");
const app = express();

app.listen(process.env.PORT);

app.get("/homepage", async (req, res) => {
  const jwtToken = await _fetchJwtToken();
  const result = await _callBackend(jwtToken);
  res.send(`<h3>Response from backend:</h3><p>${result}</p>`);
});

/* HELPER */

async function _fetchJwtToken() {
  const clientid = CREDENTIALS.clientid;
  const auth =
    "Basic " +
    Buffer.from(clientid + ":" + CREDENTIALS.clientsecret).toString("base64");

  const options = {
    method: "POST",
    url: `${CREDENTIALS.url}/oauth2/token?grant_type=client_credentials&client_id=${clientid}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: auth,
    },
  };
  const response = await axios(options);
  return response.data.access_token;
}

async function _callBackend(token) {
  const options = {
    method: "GET",
    url: "https://backendapp-tia.cfapps.eu12.hana.ondemand.com/endpoint",
    headers: {
      Accept: "application/json",
      Authorization: "bearer " + token,
    },
  };
  const response = await axios(options);
  return response.data;
}
