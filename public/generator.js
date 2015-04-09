var path = require('path'),
  fs = require('fs'),
  config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '', '../config', 'runtime.json'), 'utf8'));

var output = JSON.parse(fs.readFileSync(path.resolve(__dirname, '', 'api-docs', 'vehicle-history.json'), 'utf8'));


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
output.models.Type.properties.type.enum = variants;

var kinds = getEnumValues(config.resolver.variant.kinds, true);
output.models.Type.properties.kind.enum = kinds;

var engineFuels = getEnumValues(config.resolver.variant.engineFuels, true);
output.models.Engine.properties.fuel.enum = engineFuels;

var policyStatus = getEnumValues(config.resolver.variant.policyStatus);
output.models.Policy.properties.status.enum = policyStatus;

var registrationStatus = getEnumValues(config.resolver.variant.registrationStatus, true);
output.models.Registration.properties.status.enum = registrationStatus;

var inspectionStatus = getEnumValues(config.resolver.variant.inspectionStatus);
output.models.Inspection.properties.status.enum = inspectionStatus;

var mileageStatus = getEnumValues(config.resolver.variant.mileageStatus);
output.models.Mileage.properties.type.enum = mileageStatus;

var countries = getEnumValues(config.resolver.variant.countries, true);
output.models.Location.properties.country.enum = countries;
output.models.Plate.properties.country.enum = countries;

var makes = getEnumValues(config.resolver.variant.makes);
output.models.Name.properties.make.enum = makes;

var owners = getEnumValues(config.resolver.variant.owners, true);
output.models.Event.properties.ownerType.enum = owners;

var events = getEnumValues(config.resolver.variant.events, true, 'ABROAD_REGISTRATION');
output.models.Event.properties.type.enum = events;

console.log(JSON.stringify(output));
