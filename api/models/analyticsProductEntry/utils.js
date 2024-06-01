/**
 * @typedef { import('gadget-server').api } Client
 */

/**
 * @typedef { import('gadget-server').logger } Logger
 */

/**
 *
 * @param { { api: Client, logger: Logger, timeSeriesId: string, productId: string } } params
 */
export const getOrCreateAnalyticsProductEntry = async ({
  api,
  logger,
  timeSeriesId,
  productId,
}) => {
  /**@type { import('@gadget-client/ecomrag').AnalyticsProductEntry | undefined } */
  let analyticsProductEntry;
  try {
    analyticsProductEntry = await api.analyticsProductEntry.maybeFindFirst({
      filter: {
        timeseries: {
          equals: timeSeriesId,
        },
        product: {
          equals: productId,
        },
      },
    });
    if (!analyticsProductEntry) {
      analyticsProductEntry = await api.analyticsProductEntry.create({
        timeseries: {
          _link: timeSeriesId,
        },
        product: {
          _link: productId,
        },
      });
    }
  } catch (error) {
    const { name, message, stack, cause } = /**@type { Error } */ (error);
    logger.error({ name, message, stack, cause }, 'An error occurred finding the product entry');
  }
  return analyticsProductEntry;
};
