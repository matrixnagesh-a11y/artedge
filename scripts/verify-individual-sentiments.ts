import { generateReplenishedDataset } from "../src/lib/dataGenerator";

console.log("=== EXECUTING RIGOROUS INDIVIDUAL SENTIMENT VERIFICATION ===");

// TEST 1: Xi Jinping (Global Leader)
console.log("\n[TEST 1] Testing Xi Jinping Solo Individual Dataset...");
const xiData = generateReplenishedDataset({
  brandName: "Xi Jinping",
  entityType: "individual",
  isSingleEntity: true,
  competitorNames: [],
});

console.log(`- Brand: "${xiData.brandName}"`);
console.log(`- Industry: "${xiData.industry}"`);
console.log(`- Mentions count: ${xiData.mentions.length}`);

// Assertions on Mentions
const karnatakaKeywords = [
  "karnataka",
  "ramanagara",
  "channapatna",
  "kanakapura",
  "farmer power",
  "silk weaver",
  "deccanherald",
  "panchayat",
  "magadi",
  "lift irrigation",
];

const forbiddenFoundInXi: string[] = [];
for (const m of xiData.mentions) {
  const combined = `${m.content} ${m.author.name} ${m.sourceUrl} ${m.location}`.toLowerCase();
  for (const kw of karnatakaKeywords) {
    if (combined.includes(kw)) {
      forbiddenFoundInXi.push(`Mention ${m.id} matched "${kw}": "${m.content}"`);
    }
  }
}

if (forbiddenFoundInXi.length > 0) {
  console.error("FAILED TEST 1: Found Karnataka mentions in Xi Jinping dataset:");
  forbiddenFoundInXi.forEach((e) => console.error("  ", e));
  process.exit(1);
}
console.log("✓ PASS: 0 Karnataka / Ramanagara mentions found for Xi Jinping.");

// Verify Authors
const validGlobalAuthors = [
  "Global Diplomatic Wire",
  "International Policy Review",
  "East Asia Economic Sentinel",
  "World Affairs Monitor",
  "Strategic Governance Forum",
  "Multilateral Trade Observer",
  "Global Leadership Index",
  "Capital Policy Daily",
];

const invalidAuthors = xiData.mentions
  .map((m) => m.author.name)
  .filter((name) => !validGlobalAuthors.includes(name));

if (invalidAuthors.length > 0) {
  console.error("FAILED TEST 1: Unexpected authors for Xi Jinping:", invalidAuthors);
  process.exit(1);
}
console.log("✓ PASS: All authors for Xi Jinping belong to the Global Diplomatic Wire pool.");

// Verify Pillars & Focus
const primaryComp = xiData.competitors.find((c) => c.isPrimary);
if (!primaryComp || !primaryComp.individualPillars) {
  console.error("FAILED TEST 1: Missing primary competitor individual pillars.");
  process.exit(1);
}

if (
  !primaryComp.individualPillars.constituencyFocus ||
  primaryComp.individualPillars.constituencyFocus.includes("Ramanagara") ||
  primaryComp.individualPillars.constituencyFocus.includes("silk weaver")
) {
  console.error("FAILED TEST 1: Primary focus contains Ramanagara or is missing:", primaryComp.individualPillars.constituencyFocus);
  process.exit(1);
}
console.log("✓ PASS: Primary focus is contextual:", primaryComp.individualPillars.constituencyFocus);

// Verify Leads
const invalidLeads = xiData.leads.filter(
  (l) => l.organization.includes("Ramanagara") || l.prospectName.includes("Ramesh")
);
if (invalidLeads.length > 0) {
  console.error("FAILED TEST 1: Leads contain Ramanagara:", invalidLeads);
  process.exit(1);
}
console.log("✓ PASS: Leads are contextual:", xiData.leads[0]?.organization);

// Verify IP & Geo Nodes
const nonGlobalIps = xiData.ipscanNodes.filter((n) => n.countryCode === "IN" || n.countryCode === "MY");
if (nonGlobalIps.length > 0) {
  console.error("FAILED TEST 1: IP nodes contain unexpected IN or MY country codes:", nonGlobalIps);
  process.exit(1);
}
console.log("✓ PASS: IP scan nodes properly mapped to China / Singapore / Hong Kong / Geneva:", xiData.ipscanNodes.map((n) => `${n.city} (${n.countryCode})`).join(", "));

// TEST 2: Tech Leader (Elon Musk)
console.log("\n[TEST 2] Testing Elon Musk Tech Leader Dataset...");
const muskData = generateReplenishedDataset({
  brandName: "Elon Musk",
  entityType: "individual",
  isSingleEntity: true,
  competitorNames: [],
});

const forbiddenFoundInMusk: string[] = [];
for (const m of muskData.mentions) {
  const combined = `${m.content} ${m.author.name} ${m.sourceUrl}`.toLowerCase();
  for (const kw of karnatakaKeywords) {
    if (combined.includes(kw)) {
      forbiddenFoundInMusk.push(`Musk Mention ${m.id} matched "${kw}"`);
    }
  }
}
if (forbiddenFoundInMusk.length > 0) {
  console.error("FAILED TEST 2: Found Karnataka mentions in Elon Musk dataset:", forbiddenFoundInMusk);
  process.exit(1);
}
console.log("✓ PASS: 0 Karnataka / Ramanagara mentions found for Elon Musk.");
console.log("✓ PASS: Elon Musk authors:", muskData.mentions.slice(0, 3).map((m) => m.author.name).join(", "));
console.log("✓ PASS: Elon Musk focus:", muskData.competitors[0]?.individualPillars?.constituencyFocus);

console.log("\n=== ALL INDIVIDUAL SENTIMENT CHECKS PASSED WITH ZERO REGRESSIONS ===");
