const fs = require('fs');
const path = require('path');

function check(configPath, defaultPath) {
  if (configPath !== defaultPath) {
    return true;
  }
  
  const exist = fs.existsSync(defaultPath);
  if (configPath === defaultPath && exist) {
    return true;
  }
  return false;
}

function load(configPath) {
  const fileContent = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(fileContent);
}

function merge(configObj, program) {
  const commandLineConf = {
    port: program.port,
    path: program.path ? path.resolve(program.path) : null,
    endpoint: program.endpoint,
    'pfer-api': program.preferApi,
    log: program.log,
    root: program.root,
    dynpath: program.dynpath,
    timeout: program.timeout
  };

  Object
    .keys(commandLineConf)
    .forEach(key => (commandLineConf[key] == null) && delete commandLineConf[key]);

  return Object.assign({}, configObj, commandLineConf);
}

module.exports = {
  check: check,
  load: load,
  merge: merge
};