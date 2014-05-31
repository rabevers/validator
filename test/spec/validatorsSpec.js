/**
 * Jasmine tests for the various validators
 */
describe("Validators tests", function(){

    var el = $('<input type="text" />');

    /**
     * Test if the required validator returns true if a 
     * string is provided as a value
     */
    it ("required returns true for string", function(){
        el.val('test');
        var result = Gp.Validators.required.validate(el);
        expect(result.isValid).toBe(true);
    });

    /**
     * Test if the required validator returns false if an
     * empty string is provided as a value
     */
    it ("required returns false for empty string", function(){
        el.val('');
        var result = Gp.Validators.required.validate(el);
        expect(result.isValid).toBe(false);
    });

    /**
     * Test if the required validator returns true if an
     * integer 0 is provided as a value
     */
    it ("required returns true for value 0", function(){
        el.val(0);
        var result = Gp.Validators.required.validate(el);
        expect(result.isValid).toBe(true);
    });

    /**
     * Test if the length validator returns true if a minLength
     * property has been specified, and the actual length of the 
     * string passed exactly matches the minLength specified.
     * A maxLength was not specified in this test
     */
    it ("length returns false for value length < minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('t');
        var result  = Gp.Validators.length.validate(el, {minLength: 2});
        expect(result.isValid).toBe(false);
    });

    /**
     * Test if the length validator returns true if a minLength
     * property has been specified, and the actual length of the 
     * string passed was exactly the minLength specified.
     * A maxLength was not specified in this test
     */
    it ("length returns true for value length == minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('te');
        var result  = Gp.Validators.length.validate(el, {minLength: 2});
        expect(result.isValid).toBe(true);
    });

    /**
     * Test if the length validator returns true if a minLength
     * property has been specified, and the actual length of the 
     * string passed was more.
     * A maxLength was not specified in this test
     */
    it ("length returns true for value length > minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('test');
        var result  = Gp.Validators.length.validate(el, {minLength: 2});
        expect(result.isValid).toBe(true);
    });

    /**
     * Test if the length validator returns false if the length of the 
     * value exceeds the length specified by the maxLength property.
     * A minLength property was not set for this test.
     */
    it ("length returns false for value length > maxLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('test');
        var result  = Gp.Validators.length.validate(el, {maxLength: 2});
        expect(result.isValid).toBe(false);
    });

    /**
     * Test if the length validator returs true if the length of the 
     * value exactly matches that specified by the maxLength property.
     * A minLength property was not set for this test.
     */
    it ("length returns true for value length == maxLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('te');
        var result  = Gp.Validators.length.validate(el, {maxLength: 2});
        expect(result.isValid).toBe(true);
    });

    /**
     * Test if the length validator returns true if the length of the 
     * value is smaller than specified by the maxLength property.
     * A minLength property was not set for this test.
     */
    it ("length returns true for value length < maxLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('t');
        var result  = Gp.Validators.length.validate(el, {maxLength: 2});
        expect(result.isValid).toBe(true);
    });

    /**
     * Test if the length validator returns true if the length of the 
     * value is smaller than specified by the maxLength property.
     * A minLength property was not set for this test.
     */
    it ("length returns true for value length < maxLength && > minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('tes');
        var result  = Gp.Validators.length.validate(el, {maxLength: 5, minLength : 2});
        expect(result.isValid).toBe(true);
    });
    
    /**
     * Test if the length validator returns false if the length of the 
     * value is higher than specified by the maxLength property.
     * A minLength property was set for this test.
     */
    it ("length returns true for value length < maxLength && > minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('test test');
        var result  = Gp.Validators.length.validate(el, {maxLength: 5, minLength : 2});
        expect(result.isValid).toBe(false);
    });
    
    /**
     * Test if the length validator returns false if the length of the 
     * value is lower than specified by the minLength property.
     * A maxLength property was set for this test.
     */
    it ("length returns true for value length < maxLength && > minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('t');
        var result  = Gp.Validators.length.validate(el, {maxLength: 5, minLength : 2});
        expect(result.isValid).toBe(false);
    });
    
    it ("rexexp returns false if the string is not matched", function(){
        var el  = $('<input type="text" /> ');
        el.val('cba');
        var result  = Gp.Validators.regexp.validate(el, {regexp : '^abc$'});
        expect(result.isValid).toBe(false);
    });

    it ("rexexp returns true if the string is matched", function(){
        var el  = $('<input type="text" /> ');
        el.val('abc');
        var result  = Gp.Validators.regexp.validate(el, {regexp : '^abc$'});
        expect(result.isValid).toBe(true);
    });

});
