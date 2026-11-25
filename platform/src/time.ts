// SPDX-License-Identifier: Apache-2.0
export const nowSeconds = (): number => Math.floor(Date.now() / 1000);

/** Start of the slot containing `at` (unix seconds). */
export const currentSlot = (slotSeconds: bigint, at: number = nowSeconds()): bigint =>
  (BigInt(at) / slotSeconds) * slotSeconds;
