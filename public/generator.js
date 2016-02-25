'use strict';

var path = require('path');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '', '../config', 'runtime.json'), 'utf8'));

var output = JSON.parse(fs.readFileSync(path.resolve(__dirname, '', 'api-docs', 'swagger.json'), 'utf8'));

var getEnumValues = function (values, addUnknown, skipName) {
  var result = [];

  for (var i in values) {

    if (skipName !== values[i].name) {
      result.push(values[i].name);
    }
  }

  if (addUnknown) {
    result.push('UNKNOWN');
  }

  return result;
};

var variants = getEnumValues(config.resolver.variant.types, true);
output.definitions.Type.properties.type.enum = variants;

var kinds = getEnumValues(config.resolver.variant.kinds, true);
output.definitions.Type.properties.kind.enum = kinds;

var engineFuels = getEnumValues(config.resolver.variant.engineFuels, true);
output.definitions.Engine.properties.fuel.enum = engineFuels;

var policyStatus = getEnumValues(config.resolver.variant.policyStatus);
output.definitions.Policy.properties.status.enum = policyStatus;

var registrationStatus = getEnumValues(config.resolver.variant.registrationStatus, true);
output.definitions.Registration.properties.status.enum = registrationStatus;

var inspectionStatus = getEnumValues(config.resolver.variant.inspectionStatus);
output.definitions.Inspection.properties.status.enum = inspectionStatus;

var mileageStatus = getEnumValues(config.resolver.variant.mileageStatus);
output.definitions.Mileage.properties.type.enum = mileageStatus;

var countries = getEnumValues(config.resolver.variant.countries, true);
output.definitions.Location.properties.country.enum = countries;
output.definitions.Plate.properties.country.enum = countries;

var makes = getEnumValues(config.resolver.variant.makes);
output.definitions.Name.properties.make.enum = makes;

var owners = getEnumValues(config.resolver.variant.owners, true);
output.definitions.Event.properties.ownerType.enum = owners;

var events = getEnumValues(config.resolver.variant.events, true, 'ABROAD_REGISTRATION');
output.definitions.Event.properties.type.enum = events;

console.log(JSON.stringify(output));
