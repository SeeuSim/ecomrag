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
const LIMIT_FIELDS = /**@type {const} */ ([
  'imageUploadCount',
  'productSyncCount',
  'productEmbedCount',
  'productImageEmbedCount',
]);

/**
 * @typedef { (NonNullableFields<Pick<Plan, typeof LIMIT_FIELDS[number]>>) } PlanLimit
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
  if (!params.field || !LIMIT_FIELDS.includes(params.field)) {
    return {
      error: 'Invalid Parameters',
      success: false,
    };
  }

  const { tier } = /**@type { Plan } */ (record);
  const field = /**@type { typeof LIMIT_FIELDS[number]} */ (params.field);

  const limit = PLAN_LIMITS[tier][field];
  const newVal = /**@type { !Plan[typeof field]}*/ (record[field] ?? 0) + 1;

  if (newVal > limit) {
    const shop = await api.shopifyShop.findOne(record.shop);
    return {
      error: `Plan allowance for \`${field}\` exceeded for shop: ${shop.name}`,
      success: false,
    };
  }

  try {
    await api.internal.plan.update(record.id, {
      _atomics: {
        [field]: {
          increment: 1,
        },
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    const { name, cause, message, stack } = /** @type { Error } */ (error);
    logger.error(
      { name, message, stack, cause },
      '[actions:plan/incrementCount] An error occurred.'
    );
    return {
      error: message,
      success: false,
    };
  }
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
  returnType: true,
};

export const params = {
  field: { type: 'string' },
};
