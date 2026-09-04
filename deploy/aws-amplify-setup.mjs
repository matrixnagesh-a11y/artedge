import crypto from "crypto";
import https from "https";
import fs from "fs";

const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || "";
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const REGION = process.env.AWS_DEFAULT_REGION || "ap-southeast-1";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const REPO_URL = "https://github.com/matrixnagesh-a11y/artedge";

function awsRequest(service, host, region, method, path, headers = {}, payload = "") {
  return new Promise((resolve, reject) => {
    const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);
    const payloadHash = crypto.createHash("sha256").update(payload).digest("hex");

    const allHeaders = {};
    for (const key of Object.keys(headers)) {
      allHeaders[key.toLowerCase()] = String(headers[key]).trim();
    }
    allHeaders["host"] = host;
    allHeaders["x-amz-date"] = amzDate;
    allHeaders["x-amz-content-sha256"] = payloadHash;

    const sortedKeys = Object.keys(allHeaders).sort();
    const canonicalHeaders = sortedKeys.map(k => `${k}:${allHeaders[k]}`).join("\n") + "\n";
    const signedHeaders = sortedKeys.join(";");
    const canonicalRequest = `${method}\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;

    function getSignatureKey(key, dateStamp, regionName, serviceName) {
      const kDate = crypto.createHmac("sha256", "AWS4" + key).update(dateStamp).digest();
      const kRegion = crypto.createHmac("sha256", kDate).update(regionName).digest();
      const kService = crypto.createHmac("sha256", kRegion).update(serviceName).digest();
      return crypto.createHmac("sha256", kService).update("aws4_request").digest();
    }

    const signingKey = getSignatureKey(SECRET_KEY, dateStamp, region, service);
    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
    const authHeader = `${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const reqOptions = {
      hostname: host,
      port: 443,
      path,
      method,
      headers: { ...allHeaders, Authorization: authHeader }
    };

    const req = https.request(reqOptions, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode, data }));
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function connectAmplify() {
  console.log("=================================================================");
  console.log("   Connecting ArtEDGE to AWS Amplify Hosting                     ");
  console.log("=================================================================");
  console.log(`>> Target Region: ${REGION}`);
  console.log(`>> Repository: ${REPO_URL}`);

  // 1. Create Amplify App
  const createPayload = JSON.stringify({
    name: "artedge",
    repository: REPO_URL,
    oauthToken: GITHUB_TOKEN,
    platform: "WEB_COMPUTE",
    environmentVariables: {
      NODE_ENV: "production",
      NEXT_PUBLIC_APP_URL: "https://artedge.app"
    }
  });

  console.log("\n>> Step 1: Creating Amplify App...");
  const createRes = await awsRequest(
    "amplify",
    `amplify.${REGION}.amazonaws.com`,
    REGION,
    "POST",
    "/apps",
    { "content-type": "application/json" },
    createPayload
  );

  console.log(`>> Create App response [${createRes.status}]:`, createRes.data);
  if (createRes.status >= 300) {
    throw new Error(`Failed to create app: ${createRes.data}`);
  }

  const appData = JSON.parse(createRes.data).app;
  const appId = appData.appId;
  console.log(`>> Successfully created Amplify App! App ID: ${appId}`);
  console.log(`>> Default Domain: ${appData.defaultDomain}`);

  // 2. Create branch main
  console.log("\n>> Step 2: Linking 'main' branch...");
  const branchPayload = JSON.stringify({
    branchName: "main",
    enableAutoBuild: true,
    stage: "PRODUCTION",
    framework: "Next.js - SSR"
  });

  const branchRes = await awsRequest(
    "amplify",
    `amplify.${REGION}.amazonaws.com`,
    REGION,
    "POST",
    `/apps/${appId}/branches`,
    { "content-type": "application/json" },
    branchPayload
  );

  console.log(`>> Create Branch response [${branchRes.status}]:`, branchRes.data);

  // 3. Trigger initial deployment build job
  console.log("\n>> Step 3: Triggering initial deployment build job...");
  const jobPayload = JSON.stringify({
    jobType: "RELEASE"
  });

  const jobRes = await awsRequest(
    "amplify",
    `amplify.${REGION}.amazonaws.com`,
    REGION,
    "POST",
    `/apps/${appId}/branches/main/jobs`,
    { "content-type": "application/json" },
    jobPayload
  );

  console.log(`>> Start Job response [${jobRes.status}]:`, jobRes.data);

  console.log("\n=================================================================");
  console.log(">> [SUCCESS] ArtEDGE successfully connected to AWS Amplify!");
  console.log(`>> App ID: ${appId}`);
  console.log(`>> Production URL: https://main.${appData.defaultDomain}`);
  console.log(`>> AWS Amplify Console: https://${REGION}.console.aws.amazon.com/amplify/home?region=${REGION}#/${appId}`);
  console.log("=================================================================");
}

connectAmplify().catch(err => {
  console.error("Amplify deployment failed:", err);
  process.exit(1);
});
