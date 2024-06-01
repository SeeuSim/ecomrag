import {
  ActionOptions,
  CreateShopifyOrderLineItemActionContext,
  applyParams,
  deleteRecord,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { getOrCreateAnalyticsProductEntry } from '../../analyticsProductEntry/utils';
import { getOrCreateTimeseriesEntry } from '../../analyticsTimeSeries/utils';

/**
 * @param { CreateShopifyOrderLineItemActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

const DELTA_IN_MINUTES = 60;
const ONE_MINUTE_IN_MILLIS = 60 * 1000;

/**
 * @param { CreateShopifyOrderLineItemActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
  const orderLineItem = /**@type { import('@gadget-client/ecomrag').ShopifyOrderLineItem } */ (
    record
  );
  const gadgetApi = /**@type { typeof import('gadget-server').api } */ (api);
  if (!orderLineItem.product) {
    return;
  }
  const systemTime = new Date();
  const timeFilter = new Date(systemTime.getTime() - DELTA_IN_MINUTES * ONE_MINUTE_IN_MILLIS);

  const product = orderLineItem.product;

  // If this product was recommended in the past hour - create a conversion entry
  // TODO: Have a robust checkout mechanism from the chat UI instead of this
  const recommendedProduct = await gadgetApi.recommendedProduct.maybeFindFirst({
    filter: {
      shop: {
        equals: orderLineItem.shopId,
      },
      product: {
        equals: product.id,
      },
      createdAt: {
        greaterThanOrEqual: timeFilter,
      },
    },
  });
  if (recommendedProduct) {
    // Create timeseries and join model record
    const timeSeries = await getOrCreateTimeseriesEntry({
      api,
      logger,
      shopId: orderLineItem.shopId,
      systemTime: new Date(),
    });
    if (!timeSeries) {
      return;
    }
    const productEntry = await getOrCreateAnalyticsProductEntry({
      api,
      logger,
      timeSeriesId: timeSeries.id,
      productId: product.id,
    });
    await gadgetApi.internal.analyticsProductEntry.update(productEntry.id, {
      _atomics: {
        count: {
          increment: 1,
        },
      },
      timeSeries: {
        _link: timeSeries.id,
      },
    });

    // Update plan count
    const plan = await gadgetApi.plan.maybeFindFirst({
      filter: {
        shop: {
          equals: orderLineItem.shopId,
        },
      },
    });
    if (plan) {
      await gadgetApi.internal.plan.update(plan.id, {
        _atomics: {
          conversionCount: {
            increment: 1,
          },
        },
      });
    }
  }

  // Remove for GDPR purposes
  await deleteRecord(record);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
  triggers: { api: false },
};
