import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { esewaSignature, interpretEsewaStatus } from '../../lib/server/payments/esewa';
import { interpretKhaltiLookup } from '../../lib/server/payments/khalti';

describe('eSewa', () => {
  it('signs exactly like eSewa\'s documented example', () => {
    // Example from eSewa's ePay v2 developer guide, with the public test key.
    assert.equal(
      esewaSignature(
        { total_amount: '110', transaction_uuid: '241028', product_code: 'EPAYTEST' },
        '8gBm/:&EnhH.1/q'
      ),
      'i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME='
    );
  });

  it('only treats COMPLETE for the expected amount as paid', () => {
    assert.deepEqual(interpretEsewaStatus({ status: 'COMPLETE', ref_id: 'R1', total_amount: 1500 }, '1500'), {
      status: 'paid',
      ref: { provider: 'esewa', transactionCode: 'R1' },
    });
    assert.equal(interpretEsewaStatus({ status: 'COMPLETE', total_amount: 15 }, '1500').status, 'failed');
    assert.deepEqual(interpretEsewaStatus({ status: 'NOT_FOUND' }, '1500'), { status: 'pending', started: false });
    assert.deepEqual(interpretEsewaStatus({ status: 'PENDING' }, '1500'), { status: 'pending', started: true });
    assert.deepEqual(interpretEsewaStatus({ status: 'AMBIGUOUS' }, '1500'), { status: 'pending', started: true });
    assert.equal(interpretEsewaStatus({ status: 'CANCELED' }, '1500').status, 'failed');
    assert.equal(interpretEsewaStatus({ status: 'FULL_REFUND' }, '1500').status, 'failed');
    assert.equal(interpretEsewaStatus({}, '1500').status, 'pending', 'unknown answers never grant access');
  });
});

describe('Khalti', () => {
  it('only treats Completed for the expected amount as paid', () => {
    assert.deepEqual(
      interpretKhaltiLookup({ status: 'Completed', pidx: 'P1', transaction_id: 'T1', total_amount: 150000 }, 150000),
      { status: 'paid', ref: { provider: 'khalti', pidx: 'P1', transactionId: 'T1' } }
    );
    assert.equal(interpretKhaltiLookup({ status: 'Completed', total_amount: 1000 }, 150000).status, 'failed');
    assert.deepEqual(interpretKhaltiLookup({ status: 'Initiated' }, 150000), { status: 'pending', started: false });
    assert.deepEqual(interpretKhaltiLookup({ status: 'Pending' }, 150000), { status: 'pending', started: true });
    assert.equal(interpretKhaltiLookup({ status: 'Expired' }, 150000).status, 'failed');
    assert.equal(interpretKhaltiLookup({ status: 'User canceled' }, 150000).status, 'failed');
    assert.equal(interpretKhaltiLookup({ status: 'Refunded' }, 150000).status, 'failed');
    assert.equal(interpretKhaltiLookup({}, 150000).status, 'pending');
  });
});
