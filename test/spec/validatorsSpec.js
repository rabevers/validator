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

    it ("length returns false for value length < minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('t');
        var result  = Gp.Validators.length.validate(el, {minLength: 2});
        expect(result.isValid).toBe(false);
    });

    it ("length returns true for value length == minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('te');
        var result  = Gp.Validators.length.validate(el, {minLength: 2});
        expect(result.isValid).toBe(true);
    });

    it ("length returns true for value length > minLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('te');
        var result  = Gp.Validators.length.validate(el, {minLength: 2});
        expect(result.isValid).toBe(true);
    });

    it ("length returns false for value length > maxLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('test');
        var result  = Gp.Validators.length.validate(el, {maxLength: 2});
        expect(result.isValid).toBe(false);
    });

    it ("length returns true for value length == maxLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('te');
        var result  = Gp.Validators.length.validate(el, {maxLength: 2});
        expect(result.isValid).toBe(true);
    });

    it ("length returns true for value length < maxLength", function(){
        var el  = $('<input type="text" /> ');
        el.val('t');
        var result  = Gp.Validators.length.validate(el, {maxLength: 2});
        expect(result.isValid).toBe(true);
    });

});
