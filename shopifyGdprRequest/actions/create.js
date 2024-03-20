import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyGdprRequestActionContext,
} from 'gadget-server';

/**
 * @param { CreateShopifyGdprRequestActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyGdprRequestActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections, emails }) {
  switch (record.topic) {
    case 'customers/data_request':
      // This process is a manual one. You must provide the customer's data to the store owners directly.
      // See https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request for more information.
      // eslint-disable-next-line no-case-declarations
      const customerData = {
        id: record.customer.id,
        domain: record.shop.domain,
      };
      // Send the customer data to the store owner
      // eslint-disable-next-line no-case-declarations
      const CustomTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Customer Data Request</title>
          <style>
            /* Add your email styles here */
          </style>
        </head>
        <body>
          <p>Hello,</p>
          <p>You requested your Shopify user data and here it is:</p>
          <pre>${JSON.stringify(customerData, null, 2)}</pre>
          <p>Best regards,</p>
          <p>AskShop.ai</p>
        </body>
        </html>
      `;

      // Use the emails object to send the email
      try {
        await emails.sendMail({
          to: record.customer.email, // The customer's email address
          subject: 'Your Data Request',
          html: CustomTemplate, // Pass the custom email template
        });
        logger.info(`Sent data request email to customer ID: ${record.customer.id}`);
      } catch (error) {
        logger.error('Failed to send data request email:', error);
      }
      break;
    case 'customers/redact':
      // Any modifications that are initiated by Shopify and emitted via webhook will automatically be handled by your existing model actions.
      // The responsibility falls on you to redact any additional customer related data you may have in custom models.
      try {
        await redactCustomerData(record.customer.id);
        logger.info(`Successfully redacted data for customer ID: ${record.customer.id}`);
      } catch (error) {
        logger.error(`Error redacting data for customer ID: ${record.customer.id}: ${error}`);
      }
      break;
    case 'shop/redact':
      // This will be received 48 hours after a store owner uninstalls your app. Any modifications that are initiated by Shopify and emitted via webhook will automatically be handled by your existing model actions.
      // The responsibility falls on you to redact any additional shop related data you may have in custom models.
      // See https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact for more information.
      try {
        await redactShopData(record.shop.domain);
        logger.info(`Successfully redacted data for shop domain: ${record.shop.domain}`);
      } catch (error) {
        logger.error(`Error redacting data for shop domain: ${record.shop.domain}: ${error}`);
      }
      break;
  }
}

// Example function to redact customer data
async function redactCustomerData(customerId) {
  // Access the api object to interact with your Gadget models
  const { api } = this;

  // Fetch all records associated with the customer ID
  const customerRecords = await api.allowedTag.findMany({
    where: { customerId: customerId },
  });

  // Iterate over the records and redact or delete each one
  for (const record of customerRecords) {
    // Replace sensitive data with anonymized values or delete the record
    // For example, anonymizing the customer's data:
    await api.allowedTag.update({
      where: { id: record.id },
      data: {
        name: 'REDACTED',
        email: 'REDACTED',
      },
    });
    // Use this line if we want to delete the record, but redacting is better for data integrity
    //await api.allowedTag.delete({ where: { id: record.id } });
  }

  // Log the completion of the redaction process
  console.log(`Redacted data for customer ID: ${customerId}`);
}

// Example function to redact shop data
async function redactShopData(shopDomain) {
  // Access the api object to interact with your Gadget models
  const { api } = this;

  // Fetch all records associated with the shop domain
  const shopRecords = await api.shopifyShop.findMany({
    where: { domain: shopDomain },
  });

  // Iterate over the records and redact or delete each one
  for (const record of shopRecords) {
    // Replace sensitive data with anonymized values or delete the record
    // For example, anonymizing the shop's data:
    await api.shopifyShop.update({
      where: { id: record.id },
      data: {
        name: 'REDACTED',
        customerEmail: 'REDACTED',
        email: 'REDACTED',
        myShopifyDomain: 'REDACTED',
        shopOwner: 'REDACTED',
        domain: 'REDACTED',
      },
    });
    //await api.shopifyShop.delete({ where: { id: record.id } });
  }

  // Log the completion of the redaction process
  console.log(`Redacted data for shop domain: ${shopDomain}`);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
