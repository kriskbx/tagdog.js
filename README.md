# Tagdog

## Table of contents
1. [What is Tagdog?](#)
2. [How does Tagdog work?](#)
3. [Implementation and instatiation](#)
4. [Selectors and options](#)
5. [Selection methods and return values](#)
6. [The Tagdog API](#)
7. [Styling](#)

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

You can write your tags into the original input field, then press the `Enter` or `,` in order to add tags to Tagdog. Click the tag elements or press `Backspace` in order to delete them. You can also use the intsnace API to manipulate the tag field, adding and removing tags, for example.


## 3. Implementation and instatiation
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

The variable `tagFields` now holds the Tagdog instance, which offers a set of [methods](#) to manipulate your tag field.


## 4. Selectors and options

### 1. `selector` (optional)

- a falsy value, like `null`, in which case Tagdog will search for elements with the default CSS class of `.tagdog-field`
- a CSS selector, which of course is a `String`
- a `NodeList`, as returned by `document.querySelectorAll()`
- or an `HTMLElement`, as returned by `document.querySelector()`

### 2: `options` (optional)
An Object with any or all of the following properties:

#### `options.patterns`
An Array of Objects with the properties `regex` and `replace` (optional), whereby `regex` is a Regular Expression matching characters that should be removed and `replace` is the String replacement for these characters. 

It might sem a little tedious, but this is a pretty powerful way of defining exactly what characters you'd want in your tag names, which ones you don't want and what character(s) to substitute unwanted characters and character sequences with. The default `options.patterns` Object is specified as follows:

```javascript
options = {
	[...]
	patterns: [{
		regex: /^\s+|\s+$/g
	}, {
		regex: /[^a-z0-9-]+/gi
	}],
	[...]
};
```
Since the default value for `replace` is the empty String, the above means that leading and trailing white-space as well as everything that is **not** an alpha-numerical value shall be replaced by the empty String.

#### `options.tooltipTitle`
The title for the tooltip (shown only on devices with a max resolution of 96dpi). The default text is *Click to delete*.


## 4. The Tagdog API
There is a variety of methods you can use to manipulate Tagdog instances to build new things with Tagdog.

### `addTag(String tagName) -> {HTMLElement}`
Takes a `String` or an `HTMLElement`.  If it's a String an HTMLElement will be created whose text content is the provided String. The provided or newly created HTMLElement is then added to the instance and to the HTML.

### `cleanTagName(String tagName) -> {String}`
Cleans a `String` value according to some Regular Expressions. Will be changed in the near future, so that it is possible to provide your own criteria.

### `createTag(String tagName [, Boolean unsafe]) -> {HTMLElement}`
Creates a new tag element whose text content is the provided `String` value. The tagName will be cleaned via `cleanTagName()`, unless you explicitly set `unsafe` to true.

### `getTags([Boolean asString]) -> {Array<String>}`
Returns a list of all the current tags.

### `hasTag(String|HTMLElement tag) -> {Boolean}`
Returns `true`, if the Tagdog instance contains the provided tag, otherwise `false`. 

### `insertTagElement(HTMLElement tagElement) -> {HTMLElement}`
Adds the specified tag element to the current Tagdog instance and returns it.

### `removeTag(String|HTMLElement tag) -> {HTMLElement}`
Convenience method/decorator. Returns the specified tag from the current Tagdog instance and returns it.

### `removeTagByElement(HTMLElement tagElement) -> {HTMLElement}`
Removes a tag based on its representation as an `HTMLElement` and returns it.

### `removeTagByName(String tagName) -> {HTMLElement}`
Removes a tag based on its representation as a `String` and returns it.

### `resetTags() -> {void}`
Resets the current Tagdog instance by removing all tags from it.

### `toLower(String|Array string) -> {String}`
Converts a value to a String first and then to lower case, so we can simply convert the whole currentTags Array to a lower case String. Explicitly returns the empty String for every value whose type is neither String nor Array.

### `isHTMLElement(* value) -> {Boolean}`
Checks, whether the provided value is an HTMLElement.

### `isNodeList(* value) -> {Boolean}`
Checks, whether the provided value is a NodeList.


## 5. Styling

There is a basic stylesheet called `tagdog.css` and of course a minified version called `tagdog.min.css` with accompanying source-maps that come with with Tagdog. Import it as you would any other stylesheet and overrride the styles you don't like of simply restyle Tagdog yourself, if you're so inclined. Styling should be very intuitive. All Tagdog CSS classes are prefixed with `tagdog-` to make styling less error prone. The actual CSS classes and element types are:

### `.tagdog-field`
Applied to the element that wraps the text input field, which is turned into a tag field. `.tagdog-field` is the default CSS classname Tagdog will look for in case no selector or a falsy value is provided when Tagdog is instantiated.

### `.tagdog-container`
Applied to a paragraph element that holds the visual tags elements. Tagdog doesn't care about the type of the wrapping element.

### `.tagdog-tag`
The visual tags pushed in to the tag container are simple span elements with a CSS class of `.tagdog-tag`, to keep everything simple and semantic.


---

*That’s it – happy tagging!*