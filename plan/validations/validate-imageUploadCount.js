/**
* Validation code for field imageUploadCount on plan
* @param {import("gadget-server").PlanImageUploadCountFieldValidationContext } context - All the useful bits for running this validation.
*/
export default async ({api, record, errors, logger, field}) => {
  // access things like `record.imageUploadCount` to get the fields's data
  // add to the `errors` with `errors.add('imageUploadCount', "did not pass the validation")`
  switch (record.tier) {
    case 'Free':
      if (record.imageUploadCount <= 100) {
        return;
      }
    case 'Growth':
      if (record.imageUploadCount <= 1000) {
        return;
      }
    case 'Premium':
      if (record.imageUploadCount <= 4000) {
        return;
      }
  }
  errors.add('imageUploadCount', 'Exceeded plan limit.');
};