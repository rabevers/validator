/**
 * @author Richard A. Bevers <richard.bevers@gmail.com>
 * Date: 25-1-14
 * Time: 12:45
 *
 * Concept
 * Validate input fields, We should be able to identify a form for which 
 * each field should be validated or we should be able to validate all 
 * input fields with a specific class. Perhaps we can do both at once.
 *
 * The validations should be either in html as data-type attributes or 
 * declarative through javascript. html will be step one.
 *
 * Programmers should be able to add custom validators just by loading 
 * the validator, specifically adding them should not be required (convention 
 * over configuration).
 *
 * Invalid values should be handled by programmer specified callback functions 
 * 
 * Notes:
 * We will have a dependency for JQuery though we will not create a JQuery 
 * plugin. Eventually I would like to abstract the need for JQuery so adapters 
 * for other libraries can be added.
 *
 * @module Validator
 * @todo create adapter system so there is no reliance on just jQuery
 * @todo allow for validator declaration using javascript instead of data attributes
 *
 */

/**
 * @namespace Gp
 */
var Gp = window.Gp || {};

/**
 * @namespace Gp
 * @class Validator
 */
Gp.Validator    = (function(){

    /**
     * For later use, a list of all the input types we can (or are allowed to) validate
     * @type {Array}
     * @property availableInputTypes
     * @private
     */
    var availableInputTypes = ['input', 'textarea'],

        /**
         * @private
         * @property validatorParts
         * @type {array}
         */
        validatorParts,

        /**
         *
         * Character used to seperate the various validators that should be used
         * @private
         * @property validatorStringSplitCharacter   
         * @type {string}
         */
        validatorStringSplitCharacter   = '&',
        
        valid = true;

    /**
     * Parse the validator string to determine which validators should be called
     * @param {string} validatorString 
     * @private
     * @method _parseValidatorString
     * @return {Array}
     */
    function _parseValidatorString(validatorString)
    {
        // Split the string into individual validations
        return validatorString.split(validatorStringSplitCharacter);
    }

    /**
     * Take the argument string and convert it into an object which, in turn, we can pass to the validator
     * @param validatorArgumentString
     * @returns Object
     * @private
     * @method _parseValidatorArgumentString
     */
    function _parseValidatorArgumentString(validatorArgumentString)
    {
        // Split the validator arguments
        var arr = validatorArgumentString.split(';');
        // Initialize an empty object for the various argument parts
        var parsedData = [];

        // Loop all the parts
        for (var i = 0; i < arr.length; i++) {
            // Split them into a key and value
            var keyValueArray   = arr[i].split("=");
            // Add them to the 
            parsedData[keyValueArray[0]] = keyValueArray[1];
        }
        return parsedData;
    }

    /**
     * http://stackoverflow.com/questions/14478914/javascript-dynamic-function-calls-with-namespace
     * @private
     * @method _callCustomValidator
     * @param {string} path
     * @param {mixed} params NOT YET USED!
     */
    function _callCustomValidator(path, params)
    {
        return [window].concat(path.split('.')).reduce(function(prev, curr) {
            return prev[curr];
        });
    }

    /**
     * Setup the validators and hook them up to the requested event
     * @param element
     * @param validatorString
     * @private
     * @method _setupValidation
     */
    function _setupValidation(element, validatorString)
    {
        var validatorArray   = _parseValidatorString(validatorString);
        element = $(element);

		// Make sure the validation is triggered at the requested moment
        element.on('doValidate', function(){

            var argumentObject   = {},
                returnValue     = true;

            // Loop all requested validations
            for (var i=0; i<validatorArray.length; i++){
                // Split the string to see what validation is requested and if it has parameters to pass
                validatorParts  = validatorArray[i].split(":");

                // validatorParts[1] == arguments for validator
                if (validatorParts[1]){
                    argumentObject   = _parseValidatorArgumentString(validatorParts[1])
                }

                var result;
                if (_callCustomValidator(validatorParts[0]) && 
                    typeof _callCustomValidator(validatorParts[0]).validate === 'function'){

                    // Custom validator requested
                    result      = _callCustomValidator(validatorParts[0]).validate(element, argumentObject);

                }else if (Gp.Validators[validatorParts[0]]){

                    // Gp Validator requested
                    result      = Gp.Validators[validatorParts[0]].validate(element, argumentObject);

                }else{

                    // Requested validator not found
                    throw new Error('Validator ' + validatorParts[0] + ' not found.');

                }

                // Fetch the callback function name
                var callback    = element.data('validator-callback');

                // See if it is actually a function
                if (typeof window[callback] != 'function') {
                    throw new Error('The defined callback method is not a function');
                }else{
                    window[callback](element, result);
                }

                if (result.isValid === false){
                    console.log('setting valid to false');
                    returnValue = false;
                    valid       = false;
                }else{
                    console.log('element is valid');
                }
            }
    
            return returnValue;
        });
        
    }

    return {

        /**
         * Find all elements with the provided class name and setup validations 
         * as they were specified
         * @param className Elements with this class name will be validated
         * @param containerId html id for the containing element. Only elements in this container are validated
         * @public
         * @method validate
         */
        validate    : function(className, containerId, validateFormOnSubmit)
        {
            /**
             * Check to see if we should only target elements
             * in a specific container.
             */
            var containerString = '';
     
            if (containerId){
                containerString = '#' + containerId + ' ';
            }
     
            /**
             * Loop all DOM elements that match validation criteria
             */
            $(containerString + '.' + className).each(function(index, element){
                
                if (element.tagName === 'FORM'){
                    console.log('reset valid to true');
                    // Attach on submit handler to validate all elements
                    $(element).submit(function(e){
                        var result = true;
                        valid   = true;
                        $(element).find('.' + className).each(function(index, element){
                            result = $(element).trigger('doValidate');
                        });
                        if (!valid){
                            console.log('not valid');
                            e.preventDefault();
                        }else{
                            console.log('form submitted');
                        }
                    });
                } else {
                    /**
                     * Handle individual elements
                     */
                    
                    var triggers = $(element).data('validator-trigger');
                    if (!triggers){
                        return false;
                        //throw new Error('No trigger for element validation, without a trigger validation will not occur.');
                    }else{
                        /**
                         * A trigger has been defined, split the string to see how many
                         */
                        triggers    = triggers.split(",");
                    }
                    
                    // Determine what should be validated
                    var validationInformation   = $(element).data('validator');
                    if (!validationInformation){
                        return false;
                        //throw new Error('No validation information found. Either the data-validator tag is missing or an incorrect class was assigned to this element');
                    }
                    
                    _setupValidation(element, validationInformation);

                    for (var x=0; x<triggers.length; x++){
                        // @todo seperate setting up validation and adding event handlers for the triggers
                        // We should add validation on the custom doValidate event and trigget that event
                        // when a requested trigger event is fired. That way the form submit van also use
                        // the generic doValidate events.
                        $(element).on(triggers[x].trim(), function(){ 
                            //_triggerDoValidate(); 
                            return $(element).trigger('doValidate');
                        } );
                    }
    
                }
            });
        },

        /**
         * Allow for passing in extra configuration objects
         * @todo implement the possibility of configuring an adapter
         * @param configurationObject
         * @method configure
         * @returns {*}
         * @chainable
         */
        configure : function(configurationObject)
        {
            if (configurationObject.validatorSplitter){
                validatorStringSplitCharacter  = configurationObject.validatorSplitter;
            }
            return this;
        }
    };

})();

/**
 * @namespace Gp.Validators
 */
Gp.Validators   = {

    /**
     * Validator to indicate a value is required.
     * @class required
     */
    required : {

        /**
         * Object literal containing the possible messages this validator can return
         * @type {Object}
         */
        messages : {
            notValid    : "The field is required, a value must be entered"
        },

        /**
         * @method validate
         * @public
         * @param element
         */
        validate : function(element){
            var value   = element.val();
            if (value.length > 0){
                return {
					isValid:true
				};
            }

            return {
                isValid : false,
                validator: 'required',
                messages : {
					inValid : this.messages.notValid
				}
            };
        }

    },

    /**
     * Length validator, can check for a minimum length, a maximum length or both.
     * @todo allow for messages to be changed
     * @class length
     */
    length : {

        messages : {
            tooShort    : "The value is too short",
            tooLong     : "The value is too long"
        },

        /**
         * @method validate
         * @public
         */
        validate : function(element, settings){

            /**
             * @property isValid
             * @type boolean
             * @default false
             */
            var isValid = false,

                /**
                 * @property returnObject
                 * @type object
                 * @default "{}"
                 */
                returnObject = {};

            /**
             * @property value
             * @type String
             */
            var value   = element.val();
            if (settings.minLength && value.length < settings.minLength){
                returnObject.tooShort   = this.messages.tooShort;
            }
            if (settings.maxLength && value.length > settings.maxLength){
                returnObject.tooLong    = this.messages.tooLong;
            }
            if (Object.keys(returnObject).length > 0){ // http://stackoverflow.com/questions/126100/how-to-efficiently-count-the-number-of-keys-properties-of-an-object-in-javascrip
                return {
                    isValid : false,
                    validator: 'length',
                    messages : returnObject
                }
            }
            return {
                isValid : true,
                validator: 'length'
            };
        }
    },

    /**
     * @class regexp
     */
    regexp : {

        messages : {
            notValid    : "Value doesn't match pattern"
        },

        /**
         * @method validate
         * @public
         */
        validate    : function(element, settings){

            /**
             * @property isValid
             * @type boolean
             * @default false
             */
            var isValid = false,

                /**
                 * @property returnObject
                 * @type object
                 * @default "{}"
                 */
                returnObject    = {},

                /**
                 * @property pattern
                 * @type RegExp
                 */
                pattern         = new RegExp(settings.regexp)
            ;

//            console.log( pattern.toString() );
//            console.log( element.val() );

            /**
             * @property value
             * @type String
             */
            var value   = element.val();
            if ( pattern.test(value) === true ){
                return {
                    isValid     : true,
                    validator   : 'regexp'
                }
            }
            return {
                isValid     : false,
                validator   : 'regexp',
                messages    : {
                    inValid : this.messages.notvalid
                }
            }
        }

    },

    digits : {

        messages : {
            notValid    : "Value should be only digits"
        },

        validate : function(element){
            settings = {
                regexp : /^[0-9]+&/
            }

            var result  = Gp.Validators.regexp.validate(element, settings);
            if (result.isValid === true){
                return {
                    isValid : true,
                    validator : 'digits'
                }
            }else{
                return {
                    isValid : false,
                    validator : 'digits',
                    messages : {
                        inValid : this.messages.notValid
                    }
                }
            }
        }

    },

    zipcode : {

        messages : {
            notValid    : "Value is not a zipcode"
        },

        validate : function(element){
            settings = {
                regexp : /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/
            }

            var result  = Gp.Validators.regexp.validate(element, settings);
            if (result.isValid === true){
                return {
                    isValid : true,
                    validator   : 'zipcode'
                }
            }else{
                return {
                    isValid : false,
                    validator : 'zipcode',
                    messages : {
                        inValid : this.messages.notValid
                    }
                }
            }

        }
    },

    phonenumber : {

        messages : {
            notValid    : "Value is not a phone number"
        },

        validate : function(element){
            return {
                isValid : true,
                validator : 'phonenumber'
            }
        }
    },

    emailaddress : {

        messages : {
            notValid    : "Value is not a valid email address"
        },

        validate : function(element){
            settings = {
                regexp : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            }

            var result  = Gp.Validators.regexp.validate(element, settings);
            if (result.isValid === true){
                return {
                    isValid : true,
                    validator   : 'emailaddress'
                }
            }else{
                return {
                    isValid : false,
                    validator : 'emailaddress',
                    messages : {
                        inValid : this.messages.notValid
                    }
                }
            }

        }
    },

    hostname : {

        messages : {
            notValid    : "Value is not a valid hostname"
        },

        validate : function(element){
            settings = {
                regexp : /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/
            }
            var result  = Gp.Validators.regexp.validate(element, settings);
            if (result.isValid === true){
                return {
                    isValid : true,
                    validator   : 'hostname'
                }
            }else{
                return {
                    isValid : false,
                    validator : 'hostname',
                    messages : {
                        inValid : this.messages.notValid
                    }
                }
            }
        }
    },

    iban : {

        messages : {
            notValid    : "Value is not a valid IBAN"
        },

        validate : function(element){
            // https://mxforum.mendix.com/questions/5257/Regex--separated-IBAN
            settings = {
                regexp : /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/
//                regexp : /^((NO)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{3}|(NO)[0-9A-Z]{13}|(BE)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}|(BE)[0-9A-Z]{14}|(DK|FO|FI|GL|NL)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{2}|(DK|FO|FI|GL|NL)[0-9A-Z]{16}|(MK|SI)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{3}|(MK|SI)[0-9A-Z]{17}|(BA|EE|KZ|LT|LU|AT)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}|(BA|EE|KZ|LT|LU|AT)[0-9A-Z]{18}|(HR|LI|LV|CH)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{1}|(HR|LI|LV|CH)[0-9A-Z]{19}|(BG|DE|IE|ME|RS|GB)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{2}|(BG|DE|IE|ME|RS|GB)[0-9A-Z]{20}|(GI|IL)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{3}|(GI|IL)[0-9A-Z]{21}|(AD|CZ|SA|RO|SK|ES|SE|TN)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}|(AD|CZ|SA|RO|SK|ES|SE|TN)[0-9A-Z]{22}|(PT)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{1}|(PT)[0-9A-Z]{23}|(IS|TR)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{2}|(IS|TR)[0-9A-Z]{24}|(FR|GR|IT|MC|SM)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{3}|(FR|GR|IT|MC|SM)[0-9A-Z]{25}|(AL|CY|HU|LB|PL)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}|(AL|CY|HU|LB|PL)[0-9A-Z]{26}|(MU)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{2}|(MU)[0-9A-Z]{28}|(MT)[0-9A-Z]{2}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{4}[ ][0-9A-Z]{3}|(MT)[0-9A-Z]{29})$/
            }

            var result  = Gp.Validators.regexp.validate(element, settings);
            if (result.isValid === true){
                return {
                    isValid : true,
                    validator   : 'hostname'
                }
            }else{
                return {
                    isValid : false,
                    validator : 'hostname',
                    messages : {
                        inValid : this.messages.notValid
                    }
                }
            }
        }

    },

};

