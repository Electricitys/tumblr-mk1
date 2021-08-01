const assert = require('assert');
const app = require('../../src/app');

describe('\'medicine\' service', () => {
  it('registered the service', () => {
    const service = app.service('medicine');

    assert.ok(service, 'Registered the service');
  });
});
