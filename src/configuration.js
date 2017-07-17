const fs = require('fs');

function loader(configPath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(configPath, function(err, data) {
      if (err) {
        return reject(err);
      }

      const parsedData = JSON.parse(data);
      resolve(parsedData);
    });
  });
}

module.exports = {
  loader: loader
};