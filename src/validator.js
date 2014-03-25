/**
 * @author Richard A. Bevers <richard.bevers@gmail.com>
 * Date: 25-1-14
 * Time: 12:45
 *
 * Concept
 * Validate input fields, We should be able to identify a form for which each field should be validated or we should be
 * able to validate all input fields with a specific class. Perhaps we can do both at once.
 * The validations should be either in html as data-type attributes or declarative through javascript. html will be
 * step one.
 * Programmers should be able to add custom validators just by loading the validator, specifically adding them should
 * not be required (convention over configuration)
 * Invalid values should be handled in one of several ways.
 * - Add a class and a custom html element which can be filled with an error message from the validator
 * - A programmer specified callback function (both for javascript as well as html data elements)
 *
 * Notes:
 * We will have a dependency for JQuery though we will not create a JQuery plugin. Eventually I would like to abstract
 * the need for JQuery so adapters for other libraries can be added.
 *
 * @todo create adapter system so there is no reliance on just jQuery
 * @todo allow for validator declaration using javascript instead of data attributes
 *
 */

var Gp = {}

Gp.Validator    = (function(){

    // private members
    /**
     * For later use, a list of all the input types we can (or are allowed to) validate
     * @type {Array}
     */
    var availableInputTypes = ['input', 'textarea'],
        validatorParts,
        validatorStringSplitCharacter   = '&';

    /**
     * Parse the validator string to determine which validators should be called
     * @param validatorString
     * @private
     * @todo make the split character configurable
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
     */
    function _parseValidatorArgumentString(validatorArgumentString)
    {
        var arr = validatorArgumentString.split(';');
        var parsedData = {};
        for (var i = 0; i < arr.length; i++) {
            var keyValueArray   = arr[i].split("=");
            parsedData[keyValueArray[0]] = keyValueArray[1];
        }
        return parsedData;
    }

    /**
     * http://stackoverflow.com/questions/14478914/javascript-dynamic-function-calls-with-namespace
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
     * @param trigger
     * @param validatorString
     * @private
     */
    function _setupValidation(element, trigger, validatorString)
    {
        var validatorArray   = _parseValidatorString(validatorString);
        element = $(element);

		// Make sure the validation is triggered at the requested moment
        element.bind(trigger, function(){

            var argumentObject   = {};

            // Loop all requested validations
            for (var i=0; i<validatorArray.length; i++){
                // Split the string to see what validation is requested and if it has parameters to pass
                validatorParts  = validatorArray[i].split(":");
                if (validatorParts[1]){
                    argumentObject   = _parseValidatorArgumentString(validatorParts[1])
                }
                var result;
                if (_callCustomValidator(validatorParts[0]) && typeof _callCustomValidator(validatorParts[0]).validate === 'function'){
                    result      = _callCustomValidator(validatorParts[0]).validate(element, argumentObject);
                }else if (Gp.Validators[validatorParts[0]]){
                    result      = Gp.Validators[validatorParts[0]].validate(element, argumentObject);
                }else{
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
            }
        });
    }

    // public members
    return {

        /**
         * Find all elements with the provided class name and setup validations as they were specified
         * @param className
         */
        validate    : function(className)
        {
            $('.' + className).each(function(index, element){
                if (element.tagName == 'form'){
                    /**
                     * Handle all elements, that have been defined in 'availableInputTypes' in the form.
                     * Each should have its own data declarations for validation. Javascript declarations
                     * will be added later.
                     * @todo handle entire form
                     */
                }else{
                    /**
                     * Handle individual elements
                     */

                    var trigger = $(element).data('validator-trigger');
                    if (!trigger){
                        throw new Error('No trigger for element validation, without a trigger validation will not occur.');
                    }

                    // Determine what should be validated
                    var validationInformation   = $(element).data('validator');
                    if (!validationInformation){
                        throw new Error('No validation information found. Either the data-validator tag is missing or an incorrect class was assigned to this element');
                    }
                    _setupValidation(element, trigger, validationInformation);
                }
            });
        },

        /**
         * Allow for passing in extra configuration objects
         * @todo implement the possibility of configuring an adapter
         * @param configurationObject
         * @returns {*}
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

Gp.Validators   = {

    /**
     * Validator to indicate a value is required.
     */
    required : {

        messages : {
            notValid    : "The field is required, a value must be entered"
        },

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
     */
    length : {

        messages : {
            tooShort    : "The value is too short",
            tooLong     : "The value is too long"
        },

        validate : function(element, settings){
            var isValid = false,
                returnObject = {};


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
    }
};
