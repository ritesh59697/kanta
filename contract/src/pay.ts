// SPDX-License-Identifier: Apache-2.0
// Reference calculator for the pay rule. The platform uses it to work out what to pay;
// the contract independently checks the result inside the proof.
import type { PayRule, Trip } from './managed/kanta/contract/index.js';

/** Scale of grossScaled in the contract: metres (x1000) and surge x100. */
export const PAY_SCALE = 100_000n;

/** Payout in paise: max(floor(gross / PAY_SCALE), minPayout). */
export const expectedPayout = (rule: PayRule, trip: Omit<Trip, 'payout'>, surgeX100: bigint): bigint => {
  const perOrderMilli = rule.baseFare * 1000n + rule.perMinute * trip.minutes * 1000n;
  const distanceMilli = rule.perKm * trip.distanceMetres;
  const gross = (perOrderMilli + distanceMilli) * surgeX100;
  const formula = gross / PAY_SCALE;
  return formula < rule.minPayout ? rule.minPayout : formula;
};
