#validator
_Validator_ is a client-side javascript form validation system. It aims to have the programmer write as little as possible and use html data attributes to define the various validations.

So far a javascript function is only used to handle the actual displaying of validation results. I say validation results and not errors since you could display information on success as well.

Please keep in mind that _Validator_ is on **beta status**. It has not yet been extensively tested.

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
The data-validator attribute specifies which validations should be perfomed and what parameters should be used.
```html
data-validator="required&length:minLength=5;maxLength=6"
```
Validators are seperated by the & character. A different character can be set by calling the configure method and passing in an object literal like so ```.configure({validatorSplitter : '&'})```.

in the above example a required and length validator are added. The required validator doesn take any extra arguments. The length on the other hand has two. A minLength and a maxLength argument. The arguments are seperated by a ```;```, argument values are assigned with a ```=```.

### data-validator-trigger
This is the event on which _Validator_ should start validation. For now it is the same as the jQuery events you would use in the ```.bind()``` function.

### data-validator-callback
This attribute must contain the name of a funtion in the global namespace. This function will be given the element that was validated as well as the validator result object.

## Custom validators
Since there is no way for me to add validators for everyones need, there is an option to add your own.

You can add it to the ```Gp.Validators``` namespace. Or better yet you can create your own namspace and use that.
If you create your own namespace you can use it as demonstrated below.

```html
<input type="text" name="number" class="validate" data-validator="Tst.required" data-validator-trigger="blur" data-validator-callback="showError" />
```
In this example the required validator from the Tst namespace is used to validate the field on the blur event.
## Roadmap
* Create an adapter setup so _Validator_ is no longer dependant on jQuery. You should be able to use whatever library you choose.
