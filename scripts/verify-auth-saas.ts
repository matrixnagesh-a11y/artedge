/**
 * Verification script for Multi-Client SaaS Auth, 2FA, Superadmin, and RM99 Pricing
 */
import { MOCK_SUPERADMIN_USER, MOCK_TENANTS, MOCK_SUBSCRIPTION_PLANS, MOCK_USERS } from "../src/data/mockData";

function runTests() {
  console.log("=== RUNNING MULTI-CLIENT SAAS VERIFICATION ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${description}`);
      failed++;
    }
  }

  // 1. Superadmin verification
  assert(
    MOCK_SUPERADMIN_USER.email === "matrixnagesh@gmail.com",
    "Superadmin email is matrixnagesh@gmail.com"
  );
  assert(
    MOCK_SUPERADMIN_USER.password === "Change54321!@#$%",
    "Superadmin password is Change54321!@#$%"
  );
  assert(
    MOCK_SUPERADMIN_USER.role === "platform_super_admin",
    "Superadmin has platform_super_admin role"
  );
  assert(
    MOCK_SUPERADMIN_USER.mfaEnabled === true,
    "Superadmin has 2FA (MFA) enabled"
  );

  // 2. Multi-client tenants verification
  assert(
    MOCK_TENANTS.length >= 5,
    `Multiple client tenants configured (Total: ${MOCK_TENANTS.length})`
  );
  const maybank = MOCK_TENANTS.find((t) => t.id === "tenant-01");
  const petronas = MOCK_TENANTS.find((t) => t.id === "tenant-02");
  const nexus = MOCK_TENANTS.find((t) => t.id === "tenant-03");
  assert(!!maybank && !!petronas && !!nexus, "Key enterprise client tenants exist");

  // 3. Pricing and Trial removal verification
  const basicPlan = MOCK_SUBSCRIPTION_PLANS.find((p) => p.id === "basic");
  assert(!!basicPlan, "Basic plan exists in subscription plans");
  assert(
    basicPlan?.monthlyPriceMYR === 99,
    `Basic plan price is RM 99 / month (got: RM ${basicPlan?.monthlyPriceMYR})`
  );
  assert(
    basicPlan?.annualPriceMYR === 990,
    `Basic plan annual price is RM 990 / year (got: RM ${basicPlan?.annualPriceMYR})`
  );
  assert(
    basicPlan?.isTrial === false,
    "Basic plan is not a trial"
  );
  const freeTrialPlan = MOCK_SUBSCRIPTION_PLANS.find((p) => p.id === "free_trial");
  assert(
    !freeTrialPlan,
    "Free trial plan has been completely removed from active plans"
  );

  // 4. Support Email and Phone Numbers
  const usersWithPhone = MOCK_USERS.filter((u) => !!u.phone);
  assert(
    usersWithPhone.length === 0,
    `All phone numbers removed from mock users (found: ${usersWithPhone.length})`
  );

  console.log("\n===============================================");
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("ALL SAAS AUTH & PRICING VERIFICATIONS PASSED!");
  }
}

runTests();
