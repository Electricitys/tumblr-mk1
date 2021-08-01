const assert = require('assert');
const app = require('../../src/app');

describe('\'doctor\' service', () => {
  it('registered the service', () => {
    const service = app.service('doctor');

    assert.ok(service, 'Registered the service');
  });
});
