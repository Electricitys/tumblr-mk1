const assert = require('assert');
const app = require('../../src/app');

describe('\'patient\' service', () => {
  it('registered the service', () => {
    const service = app.service('patient');

    assert.ok(service, 'Registered the service');
  });

  describe("register new patient", () => {
    const userInfo = {
      email: "example@patient.com",
      password: "secretpatient",
      role: "patient"
    }
    before(async () => {
      try {
        await app.services("users").create(userInfo);
      } catch (error) {

      }
    });
    it("user with role `patient` registered", async () => {
      
    })
  })
});
