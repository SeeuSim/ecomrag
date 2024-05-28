import { Client } from '@gadget-client/ecomrag';

/**
 * @typedef {Awaited<ReturnType<typeof Client.prototype.plan.findOne>>} Plan
 */

/**
 * @template T
 * @typedef {{[P in keyof T]: NonNullable<T[P]>;}} NonNullableFields
 */

export const PLAN_TYPES = /** @type {const} */ (['Free', 'Growth', 'Premium', 'Enterprise']);
export const LIMIT_FIELDS = /**@type {const} */ ([
  'imageUploadCount',
  'productSyncCount',
]);

/**
 * @typedef { (NonNullableFields<Pick<Plan, typeof LIMIT_FIELDS[number]>>) } PlanLimit
 */

const unknownLimit = 100_000_000;

/**@type { Record<PLAN_TYPES[number], PlanLimit> } */
export const PLAN_LIMITS = {
  Free: {
    imageUploadCount: 100,
    productSyncCount: 100
  },
  Growth: {
    imageUploadCount: 1000,
    productSyncCount: 1000
  },
  Premium: {
    imageUploadCount: 4000,
    productSyncCount: 2000
  },
  Enterprise: {
    imageUploadCount: unknownLimit,
    productSyncCount: unknownLimit,
  }
};