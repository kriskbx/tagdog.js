# Tagdog

## Table of contents
1. [What is Tagdog?](#user-content-1-what-is-tagdog)
2. [How does Tagdog work?](#user-content-2-how-does-tagdog-work)
3. [Implementation and instantiation](#user-content-3-implementation-and-instantiation)
4. [Selectors and options](#user-content-4-selectors-and-options)
5. [The Tagdog API](#user-content-5-the-tagdog-api)
6. [Styling](#user-content-6-styling)

---

## 1. What is Tagdog?
Tagdog is a plugin written in vanilla JavaScript that turns simple form markup, like the following, into a tag input field.

```javascript
<p class="tag-field">
	<label for="tags">Tags</label>
	<input type="text" id="tags" name="tags" placeholder="Separate tags with commas" />
</p>
```


## 2. How does Tagdog work?		
Tagdog automatically adds two elements to the element that wrapping your original input field.

1. a hidden input field that receives the `name` attribute of the original input field
2. a container element that holds tag elements, which act as an interactive presentation of the added tags.

You can write your tags into the original input field, then press the `Enter` or `,` in order to add tags to Tagdog. Click the tag elements or press `Backspace` in order to delete them. You can also use the instance API to manipulate the tag field, adding and removing tags, for example.

#### tl;dr
Here's a live example of [Tagdog in action](https://showcase.letmeco.de/tagdog/).


## 3. Implementation and instantiation
To create one or more instances of Tagdog you just need to import the Tagdog JavaScript into your HTML. You should put it as close as possible before any scripts or modules that make use of Tagdog, and the closing `body` tag, like this:

```javascript
	[...]

	<script type="text/javascript" src="/tagdog/tagdog.min.js"></script>
	<script>
		(function() {
			"use strict";
			var tagFields = tagdog('.tagdog-field');
			console.log(tagFields);
		}).call(this);
	</script>
	</body>
</html>
```

The `tagdog` function acts as both the Tagdog namespace and as a decorator for the extensible Tagdog constructor.

When called (with or without arguments) it returns one or more Tagdog instances, which offer a set of [methods](#user-content-5-the-tagdog-api) to manipulate tag fields.

Tagdog can be configured by providing multiple options, and its prototype as well as its static properties can easily be extended or overloaded by providing the `protoProps` and/or `staticProps` (see below).


## 4. Selectors and options

### a) `selector` (optional)
- a falsy value, like `null`, in which case Tagdog will search for elements with the default CSS class of `.tagdog-field`
- a CSS selector, which of course is a `String`
- a `NodeList`, as returned by `document.querySelectorAll()`
- or an `HTMLElement`, as returned by `document.querySelector()`

### b) `options` (optional)
An Object with any of the following properties:

#### `options.patterns`
An Array of Objects with the properties `regex` and `replace`, whereby `regex` is a Regular Expression matching characters that should be removed and `replace` is an optional String replacement for these characters, which, if not provided, defaults to the empty String.

It might sem a little tedious, but this is a pretty powerful way of defining exactly what characters you'd want in your tag names, which ones you don't want and what character(s) to substitute unwanted characters and character sequences with. The default `options.patterns` Object is specified as follows:

```javascript
options = {
	[...]
	patterns: [{
		regex: /^\s+|\s+$/g
	}, {
		regex: /[^a-z0-9 -]+/gi
	}],
	[...]
};
```
The above means that leading and trailing white-space as well as everything that is **not** an alpha-numerical value will be replaced by the empty String.

#### `options.tooltipTitle`
The title for the tooltip (shown only on devices with a max resolution of 96dpi). The default text is *Click to delete*.

### c) `protoProps`
If provided as the third argument to `tagdog()` to  every property of this `protoProps` will be copied over to the `Tagdog.prototype`.

### d) `staticProps`
All Tagdog instances produced with `staticProps` as the fourth parameter to the instantiator function `tagdog()` will have `staticProps`'s properties copied over as static properties.  


## 5. The Tagdog API
There is a variety of methods you can use to manipulate Tagdog instances to build new things with Tagdog.

#### `addTag(tagName) -> {HTMLElement}`
Takes a `String` or an `HTMLElement`.  If it's a String an HTMLElement is created whose text content will be the provided String. The provided or newly created HTMLElement is then added and will also be returned.

#### `cleanTagName(tagName) -> {String}`
Cleans `String` value according to the Regular Expressions (provided by default or during instantiation).

#### `createTag(tagName [, unsafe]) -> {HTMLElement}`
Creates a new tag element whose text content is the provided `String`. The tagName will be cleaned via `cleanTagName()`, unless you explicitly set the `Boolean` parameter `unsafe` to true.

#### `getTags([asString]) -> {Array<String>|String}`
Returns a list of all the current tags.

#### `hasTag(tag) -> {Boolean}`
Returns a `Boolean` representation of whether the Tagdog instance contains the provided tag or not. `tag` can be an HTMLElement or a String.

#### `insertTagElement(tagElement) -> {HTMLElement}`
Adds the specified tag element to the current Tagdog instance and also returns it.

#### `removeTag(tag) -> {HTMLElement}`
Convenience method/decorator. Returns the specified tag, hwich can be a `String` or an `HTMLElement` from the current Tagdog instance and returns it.

#### `removeTagByElement(tagElement) -> {HTMLElement}`
Removes a tag based on its representation as an `HTMLElement` and returns it.

#### `removeTagByName(tagName) -> {HTMLElement}`
Removes a tag based on its representation as a `String` and returns it.

#### `resetTags() -> {void}`
Resets the current Tagdog instance by removing all tags.

#### `toLower(value) -> {String}`
Converts a value to a String first and then to lower case, so we can simply convert the whole currentTags Array to a lower case String. Explicitly returns the empty String for every value whose type is neither `String` nor `Array`.

#### `isHTMLElement(value) -> {Boolean}`
Checks, whether the provided value is an HTMLElement.

#### `isNodeList(value) -> {Boolean}`
Checks, whether the provided value is a NodeList.


## 6. Styling

There is a basic stylesheet called `tagdog.css` and of course a minified version called `tagdog.min.css` with accompanying source-maps that come with with Tagdog. Import it as you would any other stylesheet and overrride the styles you don't like of simply restyle Tagdog yourself, if you're so inclined. Styling should be very intuitive. All Tagdog CSS classes are prefixed with `tagdog-` to make styling less error prone. The actual CSS classes and element types are:

#### `.tagdog-field`
Applied to the element that wraps the text input field, which is turned into a tag field. `.tagdog-field` is the default CSS classname Tagdog will look for in case no selector or a falsy value is provided when Tagdog is instantiated.

#### `.tagdog-container`
Applied to a paragraph element that holds the visual tags elements. Tagdog doesn't care about the type of the wrapping element.

#### `.tagdog-tag`
The visual tags pushed in to the tag container are simple span elements with a CSS class of `.tagdog-tag`, to keep everything simple and semantic.


---

*That’s it – easy peasy and happy tagging!*
