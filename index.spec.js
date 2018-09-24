'use strict';

const handlebars = require('handlebars');
require('./index').registerWith(handlebars);

const should = require('chai').should();

describe('handlebars-helpers-fhir', () => {
    describe('#if-fhir', () => {
        it('should render block when fhirpath evaluates to not empty', () => {
            let template = "{{#if-fhir . expression='Foo.bar.val'}}{{resourceType}}{{/if-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('Foo');
        });

        it('should not render block when fhirpath evaluates to empty', () => {
            let template = "{{#if-fhir . expression='Bar.foo.val'}}{{resourceType}}{{/if-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('');
        });

        it('should render {{else}} section', () => {
            let template = "{{#if-fhir . expression='Bar.foo.val'}}nothing{{else}}{{resourceType}}{{/if-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('Foo');
        });
    });

    describe('#unless-fhir', () => {
        it('should render block when fhirpath evaluates to empty', () => {
            let template = "{{#unless-fhir . expression='Foo.bar.fubar'}}{{resourceType}}{{/unless-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('Foo');
        });

        it('should not render block when fhirpath evaluates to not empty', () => {
            let template = "{{#unless-fhir . expression='Foo.bar.val'}}{{resourceType}}{{/unless-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('');
        });
    });

    describe('#each-fhir', () => {
        it('should render block for each item found by evaluating the fhirpath expression', () => {
            let template = "{{#each-fhir . expression='Foo.bar'}}{{val}}{{/each-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('abc');
        });

        it('should evaluate against root context', () => {
            let template = "{{#each-fhir . expression='foo.bar.val'}}{{.}}{{/each-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                foo: {
                    bar: {
                        val: 'd'
                    }
                }
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('d');
        });

        it('should evaluate against child context', () => {
            let template = "{{#each-fhir foo expression='bar.val'}}{{.}}{{/each-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                foo: {
                    bar: {
                        val: 'd'
                    }
                }
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('d');
        });

        it('should evaluate against grandchild context', () => {
            let template = "{{#each-fhir foo.bar expression='val'}}{{.}}{{/each-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                foo: {
                    bar: {
                        val: 'd'
                    }
                }
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('d');
        });

        it('should support data variables: @first, @index, @last', () => {
            let template = "{{#each-fhir . expression='Foo.bar.val'}}{{@index}}:{{.}}[{{#if @first}}@first{{/if}}{{#if @last}}@last{{/if}}]{{/each-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('0:a[@first]1:b[]2:c[@last]');
        });

        it('should not render block when fhirpath evaluates to empty', () => {
            let template = "{{#each-fhir . expression='Foo.bar.val'}}{{.}}{{/each-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Bar',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('');
        });

        it('should render {{else}} section', () => {
            let template = "{{#each-fhir . expression='Foo.bar.val'}}{{.}}{{else}}nothing{{/each-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Bar',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('nothing');
        });
    });

    describe('#with-fhir', () => {
        it('should render block for first item found by evaluating the fhirpath expression', () => {
            let template = "{{#with-fhir . expression='Foo.bar'}}Value is: {{val}}{{/with-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('Value is: a');
        });

        it('should not render block when fhirpath evaluates to empty', () => {
            let template = "{{#with-fhir . expression='Foo.bar.fubar'}}{{.}}{{/with-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('');
        });

        it('should render {{else}} section', () => {
            let template = "{{#with-fhir . expression='Foo.bar.fubar'}}{{.}}{{else}}nothing{{/with-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: [
                    {
                        val: 'a'
                    },
                    {
                        val: 'b'
                    },
                    {
                        val: 'c'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('nothing');
        });
    });

    describe('#resolve-fhir', () => {
        it('should render block using a bundled resource', () => {
            let template = "{{#resolve-fhir . expression='entry.resource.Foo.bar.reference'}}Value is: {{val}}{{/resolve-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                entry: [
                    {
                        resource: {
                            resourceType: 'Foo',
                            bar: {
                                reference: 'Bar/1'
                            },
                            val: 'a'
                        }
                    },
                    {
                        resource: {
                            resourceType: 'Bar',
                            id: '1',
                            val: 'b'
                        }
                    }

                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('Value is: b');
        });

        it('should render block using a bundled resource (DSTU1 bundle syntax)', () => {
            let template = "{{#resolve-fhir . expression='entry.content.Foo.bar.reference'}}Value is: {{val}}{{/resolve-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                entry: [
                    {
                        content: {
                            resourceType: 'Foo',
                            bar: {
                                reference: 'Bar/1'
                            },
                            val: 'a'
                        }
                    },
                    {
                        content: {
                            resourceType: 'Bar',
                            id: '1',
                            val: 'b'
                        }
                    }

                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('Value is: b');
        });

        it('should render block using a contained resource', () => {
            let template = "{{#resolve-fhir . expression='Foo.bar.reference'}}Value is: {{val}}{{/resolve-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                resourceType: 'Foo',
                bar: {
                    reference: 'Bar/1'
                },
                val: 'a',
                contained: [
                    {
                        resourceType: 'Bar',
                        id: '1',
                        val: 'b'
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('Value is: b');
        });

        it('should not render block when referenced resource not found', () => {
            let template = "{{#resolve-fhir . expression='entry.resource.Foo.bar.reference'}}Value is: {{val}}{{/resolve-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                entry: [
                    {
                        resource: {
                            resourceType: 'Foo',
                            bar: {
                                reference: 'Bar/1'
                            },
                            val: 'a'
                        }
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('');
        });

        it('should not render block when reference not found', () => {
            let template = "{{#resolve-fhir . expression='entry.resource.Foo.bar.reference'}}Value is: {{val}}{{/resolve-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                entry: [
                    {
                        resource: {
                            resourceType: 'Foo',
                            bar: {
                                display: 'Bar no. 1'
                            },
                            val: 'a'
                        }
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('');
        });

        it('should render {{else}} section when referenced resource not found', () => {
            let template = "{{#resolve-fhir . expression='entry.resource.Foo.bar.reference'}}Value is: {{val}}{{else}}nothing{{/resolve-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                entry: [
                    {
                        resource: {
                            resourceType: 'Foo',
                            bar: {
                                reference: 'Bar/1'
                            },
                            val: 'a'
                        }
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('nothing');
        });

        it('should render {{else}} section when reference not found', () => {
            let template = "{{#resolve-fhir . expression='entry.resource.Foo.bar.reference'}}Value is: {{val}}{{else}}nothing{{/resolve-fhir}}";
            let compiledTemplate = handlebars.compile(template);

            let resource = {
                entry: [
                    {
                        resource: {
                            resourceType: 'Foo',
                            bar: {
                                display: 'Bar no. 1'
                            },
                            val: 'a'
                        }
                    }
                ]
            };

            let result = compiledTemplate(resource);

            should.exist(result);
            result.should.equal('nothing');
        });
    });

});