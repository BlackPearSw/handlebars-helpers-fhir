const fhirpath = require('fhirpath');
fhirpath.debug = false;
const utils = require ('handlebars-utils');

function makeIf() {
    return function (conditional, options) {
        let match = fhirpath.evaluate(conditional, options.hash.expression);
        if (utils.isEmpty(match)) {
            return options.inverse(conditional);
        }
        else {
            return options.fn(conditional);
        }
    }
}

function makeUnless() {
    return function (conditional, options) {
        let match = fhirpath.evaluate(conditional, options.hash.expression);
        if (utils.isEmpty(match)) {
            return options.fn(conditional);
        }
    }
}

function makeEach(handlebars) {
    return function (context, options) {
        let match = fhirpath.evaluate(context, options.hash.expression);

        return handlebars.helpers.each(match, options);
    }
}

function makeWith(){
    return function(context, options) {
        let match = fhirpath.evaluate(context, options.hash.expression)[0];

        if (utils.isEmpty(match)) {
            return options.inverse();
        }
        else {
            return options.fn(match);
        }
    }
}

function makeResolve() {
    return function (context, options) {
        //TODO: are there refs with # prefix?
        let reference = fhirpath.evaluate(context, options.hash.expression)[0];
        if (!reference) {
            return options.inverse();
        }

        let type = reference.split('/')[0];
        let id = reference.split('/')[1];

        let criteria = `where(resourceType=\'${type}\').where(id=\'${id}\')`;
        let expression = `entry.content.${criteria}|entry.resource.${criteria}|contained.${criteria}`;
        let match = fhirpath.evaluate(options.data.root, expression)[0];

        return match ? options.fn(match) : options.inverse();
    }
}

//TODO: unless FHIR

module.exports.registerWith = function (handlebars) {
    handlebars.registerHelper('if-fhir', makeIf());
    handlebars.registerHelper('unless-fhir', makeUnless());
    handlebars.registerHelper('each-fhir', makeEach(handlebars));
    handlebars.registerHelper('with-fhir', makeWith());
    handlebars.registerHelper('resolve-fhir', makeResolve());
};