import { Client } from '@gadget-client/ecomrag';

export const api = new Client({ environment: window.gadgetConfig.environment });
