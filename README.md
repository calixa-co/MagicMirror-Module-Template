# calixa-MM-module

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Basic tutorial => https://forum.magicmirror.builders/topic/8534/head-first-developing-mm-module-for-extreme-beginners

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'calixa-MM-module',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `option1`        | *Required* DESCRIPTION HERE
| `option2`        | *Optional* DESCRIPTION HERE TOO <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
