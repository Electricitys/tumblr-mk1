const { AuthenticationBaseStrategy } = require("@feathersjs/authentication/lib");
const { NotAuthenticated } = require("@feathersjs/errors");
const omit = require("lodash.omit");

class DeviceStrategy extends AuthenticationBaseStrategy {
  verifyConfiguration() {
    const config = this.configuration;
    ['entity', 'service', 'authEntity', 'authService'].forEach(prop => {
      if (typeof config[prop] !== 'string') {
        throw new Error(`'${this.name}' authentication strategy requires a '${prop}' setting`);
      }
    })
  }
  get configuration() {
    const authConfig = this.authentication?.configuration;
    const config = super.configuration || {};
    return {
      authEntity: authConfig.entity,
      authService: authConfig.service,
      errorMessage: 'Invalid token',
      ...config
    }
  }
  async getEntityQuery(query, _params) {
    return {
      $limit: 1,
      ...query
    }
  }
  async findEntity(accessToken, params) {
    const { errorMessage, service, field, authService } = this.configuration;
    const entityService = this.app?.service(service);
    const query = await this.getEntityQuery({
      [field]: accessToken
    }, params);
    const findParams = Object.assign({}, params, { query });
    const result = await entityService.find(findParams);
    const list = Array.isArray(result) ? result : result.data;

    if (!Array.isArray(list) || list.length === 0) {
      throw new NotAuthenticated(errorMessage);
    }
    const [entity] = list;
    return entity;
  }
  async getEntity(result, params) {
    const { entityService } = this;
    const { entity } = this.configuration;
    if (!params.provider) {
      return result;
    }
    return entityService.get(result.id, { ...params, [entity]: result })
  }
  async authenticate(authentication, params) {
    const { entity, authService, authEntity } = this.configuration;
    const { id: key } = authentication;

    const result = await this.findEntity(key, omit(params, 'provider'));
    const patient = await this.app.service("patient").get(result["patientId"]);
    const value = await this.app?.service(authService).get(patient["userId"], params);
    return {
      authentication: { strategy: this.name, key },
      [entity]: await this.getEntity(result, params),
      [authEntity]: value,
      patient: patient,
    }
  }
}

module.exports = DeviceStrategy;