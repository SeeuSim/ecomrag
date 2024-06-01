/**
 * @typedef { typeof import('gadget-server').api } Client
 */
/**
 * @typedef { typeof import('gadget-server').logger } Logger
 */

/**
 *
 * @param { { api: Client, logger: Logger, shopId: string, systemTime: Date } } param0
 */
export async function getOrCreateTimeseriesEntry({ api, logger, shopId, systemTime }) {
  let time = new Date(systemTime.getTime()); // new Date() will always return UTC

  // Timeseries Granularity: Day
  time.setUTCHours(0, 0, 0, 0);
  // Timeseries Granularity: Hour
  // time.setUTCMinutes(0, 0, 0);

  /**@type { import('@gadget-client/ecomrag').AnalyticsTimeSeries | undefined } */
  let timeSeriesEntry;
  try {
    timeSeriesEntry = await api.analyticsTimeSeries.findFirst({
      where: {
        shop: {
          equals: shopId,
        },
        dateTime: {
          equals: time,
        },
      },
    });
    if (!timeSeriesEntry) {
      timeSeriesEntry = await api.analyticsTimeSeries.create({
        shop: {
          _link: shopId,
        },
        dateTime: time,
      });
    }
  } catch (error) {
    const { name, message, stack, cause } = /**@type { Error } */ (error);
    logger.error({ name, message, stack, cause }, 'An error occurred');
  }
  return timeSeriesEntry;
}
