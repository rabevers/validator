describe("Validators tests", function(){


    it ("required returns true for string", function(){
        var el = $('<input type="text" />');
        el.val('test');
        var result = Gp.Validators.required.validate(el);
        expect(result.isValid).toBe(true);
    });


    it ("required returns false for empty string", function(){
        var el = $('<input type="text" />');
        el.val('');
        var result = Gp.Validators.required.validate(el);
        expect(result.isValid).toBe(false);
    });


    it ("required returns true for value 0", function(){
        var el = $('<input type="text" />');
        el.val(0);
        var result = Gp.Validators.required.validate(el);
        expect(result.isValid).toBe(true);
    });
});
