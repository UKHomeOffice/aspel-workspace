const fs = require('fs/promises');
const path = require('path');
const OpenAPIResponseValidator = require('openapi-response-validator').default;
const request = require('supertest');

const eventualOpenApiSpec =
  fs.readFile(path.join(__dirname, '../../openapi.json'), 'utf8')
    .then(json => JSON.parse(json));

/**
 * Injects values into openAPI style path templates
 *
 * @param {string} path the path to be injected e.g. `establishment/{establishmentId}`
 * @param {{[key: string]: string|number}} params the parameters to inject, e.g. `{establishmentId: '123'}`
 *
 * @returns {string} the resulting url, e.g `establishment/123`
 */
function injectParameters(path, params) {
  return path.replaceAll(/\{([^}]+)}/g, (_, key) => params[key]);
}

module.exports = {
  async validateGet(api, path, params = {}, expectedStatus = 200) {
    const openApiSpec = await eventualOpenApiSpec;
    const validator = new OpenAPIResponseValidator({
      responses: openApiSpec.paths[path].get.responses,
      components: openApiSpec.components
    });

    const requestUrl = injectParameters(path, params);

    const res = await request(api).get(requestUrl).expect(expectedStatus);
    const validationError = validator.validateResponse(res.status, res.body);
    if (validationError) {
      throw new Error(`Response does not match OpenAPI spec: ${JSON.stringify(validationError)}`);
    }

    return res;
  }
};
