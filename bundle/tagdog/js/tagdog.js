(function() {
	"use strict";

	/*
	 * Private variables.
	 **/

	var counter = 0;

	var eventType = window.ontouchend ? 'touchend' : 'click';

	var keyCodes = {
		8: 'backspace',
		13: 'enter',
		188: ','
	};


	/*
	 * Mostly private shortcuts and helper functions.
	 **/

	var slice = Array.prototype.slice;

	var toString = Object.prototype.toString;

	var typeError = function error(message) {
		throw new TypeError(message);
	};

	var getType = function getType(obj) {
		return toString.call(obj).slice(8, -1);
	};

	var isString = function isString(obj) {
		return getType(obj) === 'String';
	};

	var isHTMLElement = function isHTMLElement(obj) {
		return obj instanceof HTMLElement;
	};

	var isNodeList = function isNodeList(obj) {
		return getType(obj) === 'NodeList';
	};

	var isArray = function isArray(obj) {
		return getType(obj) === 'Array';
	};

	var isObject = function isObject(obj) {
		return getType(obj) === 'Object';
	};

	var toArray = function toArray(obj) {
		return slice.call(obj);
	};

	var arrayContains = function arrayContains(array, value) {
		return array.indexOf(value) > -1;
	};

	var qs = function qs(selector, element) {
		return (element || document).querySelector(selector);
	};

	var qsa = function qsa(selector, element) {
		return (element || document).querySelectorAll(selector);
	};

	// A basic extend function always helps making things easier.
	var extend = function extend(receiver /*, emitters */) {
		var emitters = slice.call(arguments, 1),
				n = emitters.length,
				i, key, emitter;

		if(!n) return receiver;

		for(i = 0; i < n; i++) {
			emitter = emitters[i];
			for(key in emitter) {
				receiver[key] = emitter[key];
			}
		}

		return receiver;
	};


	/**
	 * Event Handlers.
	 */

	var keydownHandler = function keydownHandler(event) {
		var hiddenValue = this.hiddenInput.value,
				keyCode = keyCodes[event.keyCode],
				tag, tags;

		if(keyCode === 'enter' || keyCode === ',') {
			event.preventDefault();

			tag = this.cleanTagName(this.originalInput.value);

			if(tag.length <= 0) return false;

			if(!arrayContains(this.currentTags, tag)) {
				this.addTag(tag);
			}
		}

		if(keyCode === 'backspace' && hiddenValue.length > 0 ) {
			if( this.originalInput.value.length > 0) return false;
			tags = qsa('.tagdog-tag', this.tagContainer);
			this.removeTag(tags[tags.length - 1]);
		}
	};

	var preventDefault = function preventDefault(event) {
		event.preventDefault();
	};

	var clickTagHandler = function clickTagHandler(event) {
		var target = event.target;

		while(target.className !== 'tagdog-tag') {
			if(target === this.tagContainer) return;
			target = target.parentNode;
		}

		this.removeTag(target);

		// Refocussing makes for a nicer mobile experience.
		this.originalInput.focus();
	};


	/**
	 * Private setup functions. Avoid polluting the instance API with
	 * setup functions that should be called only once. rather call the
	 * functions from within the constructor.
	 */

	// Creates all the needed elements for each instance
	var createElements = function createElements(field, options) {

		this.options = extend({
			// Default replacement patterns
			patterns: [{
				// Replace all leading and trailing white-space with the empty String.
				regex: /^\s+|\s+$/g
			}, {
				// Replace everything that does not match this pattern with the empty String.
				regex: /[^a-z0-9 -]+/gi
			}],
			tooltipTitle: "Click to delete"
		}, options);

		// Assign the Tagdog element and add the actual tagdog CSS class, if not already defined.
		this.field = isHTMLElement(field) ? field : qs(field);
		this.field.classList.add('tagdog-field');

		// This is where the tags are saved.
		this.currentTags = [];

		// originalInput is the provided input field used to enter the tags.
		this.originalInput = qs('input', this.field);
		this.name = this.originalInput.getAttribute('name') || 'tagdog_' + (++counter);

		// The hidden input field is the actual input field. It receives the name attribute of the dummy input field.
		this.hiddenInput = document.createElement('input');
		this.hiddenInput.setAttribute('type', 'hidden');
		this.hiddenInput.setAttribute('value', '');
		this.hiddenInput.setAttribute('name', this.name);

		// This new element contains the visual tags (tag nodes).
		this.tagContainer = document.createElement('div');
		this.tagContainer.setAttribute('aria-hidden', true);
		this.tagContainer.className = 'tagdog-container';

		// Append the new elements.
		this.field.appendChild(this.hiddenInput);
		this.field.insertBefore(this.tagContainer, this.originalInput);
	};


	// Attach all the needed event listeners.
	var addListeners = function addListeners() {
		// TODO: Implement proper plain text pasting.
		this.field.addEventListener('paste', preventDefault, false);

		// Make the dummy input field listen for keystrokes.
		this.originalInput.addEventListener('keydown', keydownHandler.bind(this), false);

		// Delegate click/touchend events to the tag Elements.
		this.tagContainer.addEventListener(eventType, clickTagHandler.bind(this), false);
	};


	// Updates Tagdog instances in case there are predefined tags.
	var updateInstance = function updateInstance() {
		var dummy = this.originalInput,
				dummyValue = (dummy.getAttribute('value') || "").split(',');

		dummyValue.forEach(function addTags(tag) {
			this.addTag(tag);
		}, this);

		// We don't need the name attribute.
		dummy.removeAttribute('name');
	};


	/**
	 * Tagdog constructor.
	 */
	var Tagdog = function Tagdog(field, options) {
		if( !(this instanceof Tagdog) ) {
			return new Tagdog(field, options);
		}

		createElements.call(this, field, options);
		addListeners.call(this);
		updateInstance.call(this);
	};


	/**
	 * Tagdog prototype functions.
	 */

	// Cleans tag names of unwanted characters.
	Tagdog.prototype.cleanTagName = function cleanTagName(tagName) {
		return this.options.patterns.reduce(function replacer(tagName, pattern) {
			return tagName.replace(pattern.regex, pattern.replace || '');
		}, tagName);
	};


	// Checks whether a tag already exists.
	Tagdog.prototype.hasTag = function hasTag(tag) {
		var tagName = isHTMLElement(tag) ? tag.textContent : tag;
		return arrayContains(this.currentTags, tagName);
	};


	// Creates and returns new tag element.
	Tagdog.prototype.createTag = function createTag(tagName, unsafe) {
		var title = unsafe ? tagName : this.cleanTagName(tagName),
				tagNode = document.createElement('span');

		tagNode.textContent = title;
		tagNode.setAttribute('aria-hidden', true);
		tagNode.setAttribute('role', 'button');
		tagNode.setAttribute('data-title', this.options.tooltipTitle);
		tagNode.className = "tagdog-tag";

		return tagNode;
	};


	// Adds a new tag element to the current Tagdog instance.
	Tagdog.prototype.insertTagElement = function insertTagElement(tag, duplicates) {
		if(!duplicates && this.hasTag(tag.textContent)) return null;

		tag.classList.add('tagdog-tag');

		this.currentTags.push(tag.textContent);
		this.tagContainer.appendChild(tag);
		this.hiddenInput.value = this.currentTags.join(',');
		this.originalInput.value = '';

		return tag;
	};


	// Adds a new tag to the current Tagdog instance.
	Tagdog.prototype.addTag = function addTag(tagName) {
		if(!isString(tagName) || !tagName.trim() || this.hasTag(tagName)) {
			return null;
		}

		return this.insertTagElement(this.createTag(tagName));
	};


	// Removes a tag based on its title (tag name).
	Tagdog.prototype.removeTagByName = function removeTagByName(tagName) {
		var tags = toArray(qsa('.tagdog-tag', this.tagContainer)),
				n = tags.length,
				tagElem, tag;

		this.currentTags.splice(this.currentTags.indexOf(tagName), 1);
		this.hiddenInput.value = this.currentTags.join(",");

		while(n > 0) {
			tagElem = tags[--n];
			if(tagElem.textContent === tag) {
				tag = this.tagContainer.removeChild(tagElem);
				return removed;
			}
		}

		return null;
	};


	//Removes a tag element.
	Tagdog.prototype.removeTagByElement = function removeTagByElement(tagElement) {
		this.currentTags.splice(this.currentTags.indexOf(tagElement.textContent), 1);
		this.hiddenInput.value = this.currentTags.join(",");
		var tag = this.tagContainer.removeChild(tagElement);

		return tag;
	};


	// Removes a tag and returns it.
	Tagdog.prototype.removeTag = function removeTag(tag) {
		return (typeof tag === 'string') ? this.removeTagByName(tag) : this.removeTagByElement(tag);
	};


	// Returns an Array with all current tag names.
	Tagdog.prototype.getTags = function getTags(asString) {
		return !asString ? this.currentTags : this.toLower(this.currentTags);
	};


	// Resets the Tagdog instance.
	Tagdog.prototype.resetTags = function reset() {
		this.originalInput.setAttribute('value', '');
		this.hiddenInput.setAttribute('value', '');
		this.tagContainer.innerHTML = "";
		this.currentTags.splice(0, this.currentTags.length);
	};


	// Converts a value to a String first and then to lower case, so we can
	// simply convert the whole currentTags Array to a lower case String.
	Tagdog.prototype.toLower = function toLower(value) {
		if(!isString(value) && !isArray(value)) return '';
		return String(value).toLowerCase();
	};

	// Checks, whether the provided value is an HTMLElement.
	Tagdog.prototype.isHTMLElement = isHTMLElement;


	// Checks, whether the provided value is a NodeList.
	Tagdog.prototype.isNodeList = isNodeList;


	var extendTagdog = function extendTagdog(protoProps, staticProps) {
		var Extended = function Extended(field, options) {
			if( !(this instanceof Extended) ) {
				return new Extended(field, options);
			}

			Tagdog.apply(this, arguments);

			if(staticProps) extend(this, staticProps);
		};

		Extended.prototype = extend(Tagdog.prototype, protoProps);
		Extended.prototype.constructor = Tagdog.prototype.constructor;

		return Extended;
	};


	/*
	 * The namespace is a decorator function. You can provide either a
	 * CSS selector, an HTMLElement, a NodeList or nothing. The return
	 * value will either be a single Tagdog instance or an Object which
	 * property names are the name attributes of the input fields inside
	 * the respective selected elements. If no field param is provided
	 * the function will simply return instances for all elements that
	 * match the selector `.tagdog-field`. No matches will result in a
	 * return value of `null`.
	 **/
	this.tagdog = function tagdog(field, options, protoProps, staticProps) {

		// If `field` is falsy, simply call tagdog again
		// recursively and pass the default Tagdog selector.
		if(!field) {
			return tagdog('.tagdog-field', options, protoProps, staticProps);
		}

		// If `field` is an HTMLElelent, return a single instance.
		if(isHTMLElement(field)) {
			return (protoProps || staticProps) ?
				extendTagdog(protoProps, staticProps)(field, options) :
				new Tagdog(field, options);
		}

		// If `field` is a String, it's assumed it's a CSS selector.
		// Try to match as many elements as possible. If there is no
		// match, return `null`. If there is one match call tagdog
		// recursively and pass the HTMLElement so that tagdog can
		// return a single instance. If there are two or more matches
		// do the same, but instead provide the whole NodeList.
		if(isString(field)) {
			var elements = qsa(field),
					n = elements.length;

			if(!n) return null;

			field = n > 1 ? elements : elements[0];

			return tagdog(field, options, protoProps, staticProps);
		}

		// If `field` is a NodeList return an Object of Tagdog instances.
		if(isNodeList(field)) {
			field = toArray(field);
			return field.reduce(function(obj, element) {
				var inst = tagdog(element, options, protoProps, staticProps);
				obj[inst.name] = inst;
				return obj;
			}, {});
		}
	};

}).call(this);
