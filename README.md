#validator
_Validator_ is a client-side javascript form validation system. It aims to have the programmer write as little as possible and use html data attributes to define the various validations.

So far a javascript function is only used to handle the actual displaying of validation results. I say validation results and not errors since you could display information on success as well.

Please keep in mind that _Validator_ is still on **alpha status**. I haven't worked everything out yet and things may change as I get better insights.

##Usage

In order to use the validator you will need to include the javascript file in your page. the build directory contains a minified version of the file. The src directory contains the original including comments. Have a look if you are interested in the workings.

Once the file is available on the page you can use 

```javascript
$(document).ready(function(){
  var validator = Gp.Validator.validate('class-of-elements-to-validate');
});
```

to initialize it. Change 'class-of-elements-to-validate' to whatever class name you find appropriate. 

_Validator_ will now look for elements with the provided class. Below is a sample input field.

```html
<input type="text" class="validate" name="username" data-validator="required&length:minLength=5;maxLength=6" data-validator-trigger="blur" data-validator-callback="showError" />
```

In this example ```validate``` is the class name provided to _Validator_. Other than that we add at least three html5 data attributes. 

* data-validator, Describe what validators should be used and what parameters they have;
* data-validator-trigger, tell Validator when to start validation of the element
* data-validator-callback, a callback function to display the validation results

### data-validator
TODO
### data-validator-trigger
This is the event on which _Validator_ should start validation. For now it is the same as the jQuery events you would use in the ```.bind()``` function.

### data-validator-callback
This attribute must contain the name of a funtion in the global namespace. This function will be given the element that was validated as well as the validator result object.

## Custom validators
Since there is no way for me to add validators for everyones need, there is an option to add your own.
For now you can just add it to the ```Gp.Validators``` namespace. In the future I would like to add an option of keeping them in your own namespace to avoid any naming conflicts. 

## Roadmap
* Create an adapter setup so _Validator_ is no longer dependant on jQuery. You should be able to use whatever library you choose.
* Allow for using custom validators in another namespace. Placing additional validators in the ```Gp.Validators``` namespace might cause naming conflicts.
