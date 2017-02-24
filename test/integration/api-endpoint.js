const supertest = require('supertest');
const assert = require('assert');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const app = require('../../index');
const utils = require('../../utils');

describe('Integration with api endpoint', function() {
  it('HTTP GET call to a stubbed address', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8082/call', opts)
      .then(function(response) {
        assert.deepEqual(response.status, 200);
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value');
        return done();
      });
  });

  it('HTTP GET call to a not stubbed address', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8082/call1', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 404);
        return done();
      });
  });

  it('HTTP GET call to an address stubbed by the endpoint', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8082/call_endpoint', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint not stubbed by caller');
        return done();
      });
  });

  it('HTTP GET call to an address not stubbed by the endpoint and by the caller', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8082/call_totally_wrong', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 404);
        return done();
      });
  });
});

describe('Integration with api endpoint with prefer api', function() {
  it('HTTP GET call to a stubbed address by endpoint and caller', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8083/call', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint');
        return done();
      });
  });

  it('HTTP GET call to a stubbed address by caller', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8083/call3', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.keyWithParam, 'value');
        return done();
      });
  });

  it('HTTP GET call to a stubbed address by endpoint', function(done) {
    const opts = {
      method: 'GET'
    };
    fetch('http://localhost:8083/call_endpoint', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'false');
        assert.deepEqual(response.status, 200);
        return response.text();
      })
      .then(function(response) {
        const j = JSON.parse(response);
        assert.deepEqual(j.key, 'value endpoint not stubbed by caller');
        return done();
      });
  });

  it('HTTP GET call to a not stubbed address', function(done) {
    const opts = {
      method: 'GET'
    };

    fetch('http://localhost:8082/call1', opts)
      .then(function(response) {
        assert.deepEqual(response.headers.get('saray-stubbed'), 'true');
        assert.deepEqual(response.status, 404);
        return done();
      });
  });
});