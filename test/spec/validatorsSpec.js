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
     * Test if the length validator returns false if a minLength
     * property has been specified, but the actual length of the 
     * string passed was less.
     * A maxLength was not specified in this test
     */
    it ("length returns false for too few characters", function(){
        
    });


    /**
     * Test if the length validator returns true if a minLength
     * property has been specified, and the actual length of the 
     * string passed was exactly the minLength specified.
     * A maxLength was not specified in this test
     */
    it ("length returns true for enough characters", function(){

    });

    /**
     * Test if the length validator returns true if a minLength
     * property has been specified, and the actual length of the 
     * string passed was more.
     * A maxLength was not specified in this test
     */
    it ("length returns false for too few characters", function(){
    });

});
