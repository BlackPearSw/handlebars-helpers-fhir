![Handlebars](./logo.png)

# handlebars-helpers-fhir
Helper functions for the [Handlebars](https://handlebarsjs.com/) templating engine using [fhirpath](https://github.com/jmandel/fhirpath.js)
to reference [HL7 FHIR](http://hl7.org/fhir/) resources from within templates.

## Prerequisites
Handlebars!

    $ npm install handlebars --save

## Installation
Install package

    $ npm install handlebars-helpers-fhir --save

Register helpers with handlebars

    const Handlebars = require('handlebars');
    require('handlebars-helpers-fhir').registerWith(Handlebars);

## Use

### `#if-fhir`
The `if-fhir` block helper will conditionally render a block based on
a fhirpath expression. If the fhirpath expression returns an empty
array, Handlebars will not render the block.
````
{{#if-fhir . expression='Patient.address.where(use=\'temp\')'}}
  <p>Patient has a temporary address.</p>
{{/if-fhir}}
````

The helper can render an `{{else}}` section.
````
{{#if-fhir . expression='Patient.address.where(use=\'temp\')'}}
  <p>Patient has a temporary address.</p>
{{else}}
  <p>Patient does not have a temporary address.</p>
{{/if-fhir}}
````

### `#unless-fhir`
The `unless-fhir` block helper will conditionally render a block based on
a fhirpath expression. If the fhirpath expression returns an empty
array, Handlebars will render the block.
````
{{#unless-fhir . expression='Patient.address.where(use=\'temp\')'}}
  <p class="button">Add temporary address</p>
{{/unless-fhir}}
````

### `#each-fhir`
The `each-fhir` block helper will render a block for each item found
 using a fhirpath expression.
````
{{#each-fhir . expression='Patient.address'}}
  <p>{{use}}: {{text}}</p>
{{/each-fhir}}
````

You can optionally supply an `{{else}}` section which will render only
 if evaluating the fhirpath expression returns no matches.
````
{{#each-fhir . expression='Patient.address'}}
  <p>{{use}}: {{text}}</p>
{{else}}
  <p>No address found</p>
{{/each-fhir}}
````

The `each-fhir` block helper supports the `@index`, `@key`, `@first`
and `@last` loop variables.

The `each-fhir` block helper does not support block parameters.

### #with-fhir
The `with-fhir` block helper will render a block after switching context
 to the *first* item found using a fhirpath expression.
````
{{#with-fhir . expression='Patient.address.first()'}}
  <p>{{text}}</p>
{{/with-fhir}}
````

You can optionally supply an `{{else}}` section which will render only
if evaluating the fhirpath expression returns no matches.
````
{{#with-fhir . expression='Patient.address.first()'}}
  <p>{{text}}</p>
{{else}}
  No address
{{/with-fhir}}
````

### #resolve-fhir
The `resolve-fhir` block helper will render a block after switching
context to the *first* FHIR resource from the first reference found
by evaluating the fhirpath expression.
````
{{#resolve-fhir . expression='Patient.managingOrganization.reference'}}
  <p>Healthcare provider is {{name}}</p>
{{/resolve-fhir}}
````

You can optionally supply an `{{else}}` section which will render when
with the fhirpath expression returns no matches OR the referenced
FHIR resource cannot be found.

````
{{#resolve-fhir . expression='Patient.managingOrganization.reference'}}
  <p>Healthcare provider is {{name}}</p>
{{else}}
  <p>Healthcare provider unknown</p>
{{/resolve-fhir}}
````

The `resolve-fhir` block helper suppports only internal references
(_i.e._ within @root.entry and @root.contained).

License
-------
handlebars-helpers-fhir is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

handlebars-helpers-fhir is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Acknowledgements
----------------
Supported by [Black Pear Software](www.blackpear.com)
