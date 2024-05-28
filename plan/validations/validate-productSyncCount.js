/**
 * Validation code for field productSyncCount on plan
 * @param {import("gadget-server").PlanProductSyncCountFieldValidationContext } context - All the useful bits for running this validation.
 */
export default async ({ api, record, errors, logger, field }) => {
  // access things like `record.productSyncCount` to get the fields's data
  // add to the `errors` with `errors.add('productSyncCount', "did not pass the validation")`
  switch (record.tier) {
    case 'Free':
      if (record.productSyncCount <= 100) {
        return;
      }
    case 'Growth':
      if (record.productSyncCount <= 1000) {
        return;
      }
    case 'Premium':
      if (record.productSyncCount <= 2000) {
        return;
      }
  }
  errors.add('productSyncCount', 'Exceeded plan limit.');
};
