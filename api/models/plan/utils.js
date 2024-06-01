import { Client } from '@gadget-client/ecomrag';

/**
 * @typedef { Awaited<ReturnType<typeof Client.prototype.plan.findOne>> } Plan
 */

/**
 * @template T
 * @typedef { { [P in keyof T]: NonNullable<T[P]>; } } NonNullableFields
 */

export const PLAN_TYPES = /** @type { const } */ (['Free', 'Growth', 'Premium', 'Enterprise']);
export const LIMIT_FIELDS = /**@type { const } */ ([
  'chatSessionsCount', // count of chat sessions
  'imageUploadCount', // image embed + caption
  'productSyncCount', // product embeds
]);

/**
 * @typedef { (NonNullableFields<Pick<Plan, typeof LIMIT_FIELDS[number]>>) } PlanLimit
 */

const unknownLimit = 10_000_000_000;

export const IMAGE_PER_PRODUCT = 2;

/**@type { Record<PLAN_TYPES[number], PlanLimit> } */
export const PLAN_LIMITS = {
  Free: {
    chatSessionsCount: 600,
    imageUploadCount: 100,
    productSyncCount: 100,
  },
  Growth: {
    chatSessionsCount: 3000,
    imageUploadCount: 1000,
    productSyncCount: 1000,
  },
  Premium: {
    chatSessionsCount: 15_000,
    imageUploadCount: 4000,
    productSyncCount: 2000,
  },
  Enterprise: {
    chatSessionsCount: unknownLimit,
    imageUploadCount: unknownLimit,
    productSyncCount: unknownLimit,
  },
};
