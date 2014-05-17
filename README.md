=========
Console.js
=========

![](https://travis-ci.org/uupaa/Console.js.png)

Console with style.

# Document

- [Console.js wiki](https://github.com/uupaa/Console.js/wiki/Console)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))

# How to use

## Browser

```js
<script src="lib/Console.js">
<script>
console.log( Console.link("http://example.com") );
</script>
```

## WebWorkers

```js
importScripts("lib/Console.js");

console.log( Console.link("http://example.com") );
```

## Node.js

```js
var Zzz = require("lib/Console.js");

console.log( Console.link("http://example.com") );
```

