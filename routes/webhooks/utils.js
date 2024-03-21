const crypto = require('crypto');

const { SHOPIFY_APP_CLIENT_SECRET } = process.env;

export const verifyHmac = (data, hMac) => {
  const computed = crypto
    .createHmac('sha256', SHOPIFY_APP_CLIENT_SECRET)
    .update(data)
    .digest('hex');
  return hMac === computed;
}
