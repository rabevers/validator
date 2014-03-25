/**
 * Third party validator test
 */
var Tst = {};

Tst.required = {
        messages : {
            notValid    : "TST: The field is required, a value must be entered"
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
                validator: 'Tst.required',
                messages : {
					inValid : this.messages.notValid
				}
            };
        }
}
