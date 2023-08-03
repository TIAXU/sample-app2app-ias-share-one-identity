const xsenv = require("@sap/xsenv");
const IAS_CREDENTIALS = xsenv.getServices({
  myIas: { label: "identity" },
}).myIas;

const xssec = require("@sap/xssec");
const passport = require("passport");
const JWTStrategy = xssec.JWTStrategy;
passport.use("JWT", new JWTStrategy(IAS_CREDENTIALS, "IAS"));
const express = require("express");
const app = express();
app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false, failWithError: true }));

app.listen(process.env.PORT);

app.get("/endpoint", async (req, res) => {
  const claims = _formatClaims(req.tokenInfo);
  res.send(`<h5>Content of received JWT:</h5>${claims}`);
});

/* HELPER */
function _formatClaims(tokenInfo) {
  const jwtDecoded = tokenInfo.getPayload();
  console.log(`===> The full JWT decoded: ${JSON.stringify(jwtDecoded)}`);

  const claims = new Array();
  claims.push(`subject: ${tokenInfo.getSubject()}`);
  claims.push(`<br>zone_uuid: ${tokenInfo.getZoneId()}</br>`);
  claims.push(`issuer: ${tokenInfo.getIssuer()}`);
  claims.push(`<br>aud: ${jwtDecoded.aud}</br>`);

  return claims.join("");
}
