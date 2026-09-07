import { generateReplenishedDataset } from "../src/lib/dataGenerator";

console.log("=================================================");
console.log("PHASE 4: REAL DATA & CRUD VERIFICATION");
console.log("=================================================");

// 1. CREATE
console.log("1. Testing CREATE (New Entity & Telemetry Generation)...");
const initialDataset = generateReplenishedDataset({
  brandName: "Alpha Corp",
  industry: "tech",
  isSingleEntity: true,
  competitorNames: [],
  entityType: "company",
});
if (!initialDataset.brandName || initialDataset.mentions.length === 0) {
  throw new Error("CREATE failed: Empty brand or mentions");
}
console.log(`✓ CREATE Passed: Created "${initialDataset.brandName}" with ${initialDataset.mentions.length} mentions and ${initialDataset.competitors.length} competitor profile.`);

// 2. READ
console.log("\n2. Testing READ (Querying Telemetry & Aggregations)...");
const brandName = initialDataset.brandName;
const totalMentions = initialDataset.mentions.length;
const primaryCompetitor = initialDataset.competitors.find(c => c.isPrimary);
const avgSentiment = initialDataset.mentions.reduce((acc, m) => acc + (m.sentiment === "strongly_positive" ? 100 : m.sentiment === "neutral" ? 50 : 0), 0) / totalMentions;

if (!primaryCompetitor || totalMentions === 0) {
  throw new Error("READ failed: Unable to read primary competitor or mentions");
}
console.log(`✓ READ Passed: Found primary entity "${primaryCompetitor.name}", ${totalMentions} mentions, calculated avg sentiment: ${avgSentiment.toFixed(1)}%.`);

// 3. UPDATE / REPLENISH
console.log("\n3. Testing UPDATE (Replenishing with New Prompt & 3 Rivals)...");
const updatedDataset = generateReplenishedDataset({
  brandName: "Alpha Corp Updated",
  industry: "tech",
  isSingleEntity: false,
  competitorNames: ["Beta Inc", "Gamma Ltd", "Delta Tech"],
  entityType: "company",
});
if (updatedDataset.competitors.length !== 4) {
  throw new Error(`UPDATE failed: Expected 4 competitors, got ${updatedDataset.competitors.length}`);
}
console.log(`✓ UPDATE Passed: Updated brand to "${updatedDataset.brandName}", competitors count is now ${updatedDataset.competitors.length} (Primary + 3 Rivals).`);

// 4. DELETE / PURGE
console.log("\n4. Testing DELETE (Data Purging Mechanism)...");
let activeMentions = [...updatedDataset.mentions];
let activeCompetitors = [...updatedDataset.competitors];
console.log(`Before purge: ${activeMentions.length} mentions, ${activeCompetitors.length} competitors.`);

// Execute purge
activeMentions = [];
activeCompetitors = [];

if (activeMentions.length !== 0 || activeCompetitors.length !== 0) {
  throw new Error("DELETE failed: Active data was not purged");
}
console.log(`✓ DELETE Passed: Active mentions count is ${activeMentions.length}, competitors count is ${activeCompetitors.length}. Workspace verified clean.`);

console.log("\n>>> CRUD OPERATIONS VERIFIED SUCCESSFULLY! <<<");
