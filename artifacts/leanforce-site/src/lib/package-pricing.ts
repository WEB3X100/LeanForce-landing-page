/**
 * Internal commercial configuration. Do not import this module from a page,
 * component, or stylesheet. Amounts stay null until LeanForce approves a
 * currency, rate, billing basis, and any agent limit. A null field must never
 * be replaced with a placeholder, a "starting at" figure, or a calculator total.
 */
export const unpublishedPackagePricing = {
  visibleToVisitors: false,
  currency: null,
  assessmentAndMap: { billing: 'one-time' as const, amount: null, agentLimit: null },
  sprintBuild: { billing: 'one-time' as const, amount: null, agentLimit: null },
  managedRun: { billing: 'recurring' as const, amount: null, agentLimit: null },
  thirdPartyUsage: { includedInLeanForceFee: false, amount: null },
};
