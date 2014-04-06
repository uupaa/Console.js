=========
Console.js
=========

console.log for WebWorkers.

# Document

- https://github.com/uupaa/Console.js/wiki/Console

and 

- https://github.com/uupaa/WebModule and [slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
- https://github.com/uupaa/Help.js and [slide](http://uupaa.github.io/Slide/slide/Help.js/index.html)

# How to use

```js
// for WebWorkers
importScripts("lib/Console.js");

console.log( console.log() );
```

# for Developers

1. Install development dependency tools

    ```sh
    $ brew install closure-compiler
    $ brew install node
    $ npm install -g plato
    ```

2. Clone Repository and Install

    ```sh
    $ git clone git@github.com:uupaa/Console.js.git
    $ cd Console.js
    $ npm install
    ```

3. Build and Minify

    `$ npm run build`

4. Test

    `$ npm run test`

5. Lint

    `$ npm run lint`

