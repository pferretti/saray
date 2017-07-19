const assert = require('assert');
const path = require('path');

const configuration = require('../../src/configuration');

describe('Integration for configuration file', function() {
  
  it('check if config file has default path and exists', function(done) {
    const configFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.conf.json')
    );
    const defaultConfigFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.conf.json')
    );
    const check = configuration.check(configFilePath, defaultConfigFilePath);
    assert.strictEqual(check, true);
    done();
  });

  it('check if config file has default path and not exists', function(done) {
    const configFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.wrong.conf.json')
    );
    const defaultConfigFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.wrong.conf.json')
    );
    const check = configuration.check(configFilePath, defaultConfigFilePath);
    assert.strictEqual(check, false);
    done();
  });

  it('check if config file has not default path', function(done) {
    const configFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.other.conf.json')
    );
    const defaultConfigFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.conf.json')
    );
    const check = configuration.check(configFilePath, defaultConfigFilePath);
    assert.strictEqual(check, true);
    done();
  });

  it('configuration file loaded correctly', function(done) {
    const configFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.conf.json')
    );
    const data = configuration.load(configFilePath);
    assert.deepEqual(data.port, 8080);
    assert.deepEqual(data.timeout, 10000);
    assert.deepEqual(data.endpoint, 'http://localhost:3000');
    done();
  });

  it('configuration file not existing', function(done) {
    const configFilePath = path.resolve(
      path.join(__dirname, '..', 'extra', 'saray.wrong.conf.json')
    );
    assert.throws(
      function() {
        configuration.load(configFilePath);
      },
      Error
    );
    done();
  });

  it('merge: configuration in file and in parameters', function(done) {
    const configObj = {
      port: 8000,
      path: 'my/path'
    };
    const program = {
      port: 9000,
      log: 'my/log'
    };

    const mergedConfig = configuration.merge(configObj, program);
    assert.deepEqual(mergedConfig.port, 9000);
    assert.deepEqual(mergedConfig.log, 'my/log');
    assert.deepEqual(mergedConfig.path, 'my/path');
    done();
  });

  it('merge: configuration in file and not in parameters', function(done) {
    const configObj = {
      port: 8000,
      path: 'my/path'
    };
    const program = {
      log: 'my/log'
    };

    const mergedConfig = configuration.merge(configObj, program);
    assert.deepEqual(mergedConfig.port, 8000);
    assert.deepEqual(mergedConfig.log, 'my/log');
    assert.deepEqual(mergedConfig.path, 'my/path');
    done();
  });

  it('merge: configuration not in file but in parameters', function(done) {
    const configObj = {
      path: 'my/path'
    };
    const program = {
      port: 9000,
      log: 'my/log'
    };

    const mergedConfig = configuration.merge(configObj, program);
    assert.deepEqual(mergedConfig.port, 9000);
    assert.deepEqual(mergedConfig.log, 'my/log');
    assert.deepEqual(mergedConfig.path, 'my/path');
    done();
  });

  it('merge: configuration not in file and not in parameters', function(done) {
    const configObj = {
      path: 'my/path'
    };
    const program = {
      log: 'my/log'
    };

    const mergedConfig = configuration.merge(configObj, program);
    assert.deepEqual(mergedConfig.port, undefined);
    assert.deepEqual(mergedConfig.log, 'my/log');
    assert.deepEqual(mergedConfig.path, 'my/path');
    done();
  });

});