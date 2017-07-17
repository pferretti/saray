const assert = require('assert');
const path = require('path');

const configuration = require('../../src/configuration');

describe('Integration for configuration file', function() {
  it('configuration file loaded correctly', function(done) {
    const configFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.conf.json')
    );
    configuration.loader(configFilePath).then(function (data) {
      assert.deepEqual(data.port, 8080);
      assert.deepEqual(data.timeout, 10000);
      assert.deepEqual(data.endpoint, 'http://localhost:3000');
      done();
    });
  });

});