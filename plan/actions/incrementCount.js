import { Client } from '@gadget-client/ecomrag';
import { save, ActionOptions, IncrementCountPlanActionContext } from 'gadget-server';

/**
 * @typedef {Awaited<ReturnType<typeof Client.prototype.plan.findOne>>} Plan
 */

/**
 * @template T
 * @typedef {{[P in keyof T]: NonNullable<T[P]>;}} NonNullableFields
 */

const PLAN_TYPES = /** @type {const} */ (['Free', 'Growth', 'Premium']);
const ALLOWED_FIELDS = /**@type {const} */ ([
  'imageUploadCount',
  'productSyncCount',
  'productEmbedCount',
  'productImageEmbedCount',
]);

/**
 * @typedef { (NonNullableFields<Pick<Plan, typeof ALLOWED_FIELDS[number]>>) } PlanLimit
 */

const unknownLimit = 100_000_000;

/**@type { Record<PLAN_TYPES[number], PlanLimit> } */
const PLAN_LIMITS = {
  Free: {
    imageUploadCount: 100,
    productSyncCount: 100,
    productEmbedCount: unknownLimit,
    productImageEmbedCount: unknownLimit,
  },
  Growth: {
    imageUploadCount: 1000,
    productSyncCount: 1000,
    productEmbedCount: unknownLimit,
    productImageEmbedCount: unknownLimit,
  },
  Premium: {
    imageUploadCount: 4000,
    productSyncCount: 2000,
    productEmbedCount: unknownLimit,
    productImageEmbedCount: unknownLimit,
  },
};

/**
 * @param { IncrementCountPlanActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  logger.info(params, '[model:plan | action:incrementCount]');
  if (!params.field || !ALLOWED_FIELDS.includes(params.field)) {
    throw new Error('Invalid parameters passed.');
  }
  /**@type { Plan } */
  const { tier } = record;
  const limit = PLAN_LIMITS[record.tier]
  await save(record);
}

/**
 * @param { IncrementCountPlanActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'custom',
};

export const params = {
  field: { type: 'string' },
};
