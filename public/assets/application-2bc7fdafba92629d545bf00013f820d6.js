(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  cacheSize = 10;

  currentState = null;

  referer = null;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(position) {
    var page;
    cacheCurrentPage();
    page = pageCache[position];
    if (xhr != null) {
      xhr.abort();
    }
    changePage(page.title, page.body);
    recallScrollPosition(page);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var state;
      state = event.state;
      if (state != null ? state.turbolinks : void 0) {
        if (pageCache[state.position]) {
          return fetchHistory(state.position);
        } else {
          return visit(event.target.location.href);
        }
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    visit = function(url) {
      referer = document.location.href;
      cacheCurrentPage();
      return fetchReplacement(url);
    };
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached
  };

}).call(this);
/**!
 * @preserve Shadow animation 1.11
 * http://www.bitstorm.org/jquery/shadow-animation/
 * Copyright 2011, 2013 Edwin Martin <edwin@bitstorm.org>
 * Contributors: Mark Carver, Xavier Lepretre and Jason Redding
 * Released under the MIT and GPL licenses.
 */


jQuery(function($, undefined) {
	/**
	 * Check whether the browser supports RGBA color mode.
	 *
	 * Author Mehdi Kabab <http://pioupioum.fr>
	 * @return {boolean} True if the browser support RGBA. False otherwise.
	 */
	function isRGBACapable() {
		var $script = $('script:first'),
		color = $script.css('color'),
		result = false;
		if (/^rgba/.test(color)) {
			result = true;
		} else {
			try {
				result = (color !== $script.css('color', 'rgba(0, 0, 0, 0.5)').css('color'));
				$script.css('color', color);
			} catch (e) {
			}
		}
		$script.removeAttr('style');

		return result;
	}

	$.extend(true, $, {
		support: {
			'rgba': isRGBACapable()
		}
	});

	/*************************************/

	// First define which property to use
	var styles = $('html').prop('style');
	var boxShadowProperty;
	$.each(['boxShadow', 'MozBoxShadow', 'WebkitBoxShadow'], function(i, property) {
		var val = styles[property];
		if (typeof val !== 'undefined') {
			boxShadowProperty = property;
			return false;
		}
	});

	// Extend the animate-function
	if (boxShadowProperty) {
		$['Tween']['propHooks']['boxShadow'] = {
			get: function(tween) {
				return $(tween.elem).css(boxShadowProperty);
			},
			set: function(tween) {
				var style = tween.elem.style;
				var p_begin = parseShadows($(tween.elem)[0].style[boxShadowProperty] || $(tween.elem).css(boxShadowProperty));
				var p_end = parseShadows(tween.end);
				var maxShadowCount = Math.max(p_begin.length, p_end.length);
				var i;
				for(i = 0; i < maxShadowCount; i++) {
					p_end[i] = $.extend({}, p_begin[i], p_end[i]);
					if (p_begin[i]) {
						if (!('color' in p_begin[i]) || $.isArray(p_begin[i].color) === false) {
							p_begin[i].color = p_end[i].color || [0, 0, 0, 0];
						}
					} else {
						p_begin[i] = parseShadows('0 0 0 0 rgba(0,0,0,0)')[0];
					}
				}
				tween['run'] = function(progress) {
					var rs = calculateShadows(p_begin, p_end, progress);
					style[boxShadowProperty] = rs;
				};
			}
		};
	}

	// Calculate an in-between shadow.
	function calculateShadows(beginList, endList, pos) {
		var shadows = [];
		$.each(beginList, function(i) {
			var parts = [], begin = beginList[i], end = endList[i];

			if (begin.inset) {
				parts.push('inset');
			}
			if (typeof end.left !== 'undefined') {
				parts.push(parseFloat(begin.left + pos * (end.left - begin.left)) + 'px '
				+ parseFloat(begin.top + pos * (end.top - begin.top)) + 'px');
			}
			if (typeof end.blur !== 'undefined') {
				parts.push(parseFloat(begin.blur + pos * (end.blur - begin.blur)) + 'px');
			}
			if (typeof end.spread !== 'undefined') {
				parts.push(parseFloat(begin.spread + pos * (end.spread - begin.spread)) + 'px');
			}
			if (typeof end.color !== 'undefined') {
				var color = 'rgb' + ($.support['rgba'] ? 'a' : '') + '('
				+ parseInt((begin.color[0] + pos * (end.color[0] - begin.color[0])), 10) + ','
				+ parseInt((begin.color[1] + pos * (end.color[1] - begin.color[1])), 10) + ','
				+ parseInt((begin.color[2] + pos * (end.color[2] - begin.color[2])), 10);
				if ($.support['rgba']) {
					color += ',' + parseFloat(begin.color[3] + pos * (end.color[3] - begin.color[3]));
				}
				color += ')';
				parts.push(color);
			}
			shadows.push(parts.join(' '));
		});
		return shadows.join(', ');
	}

	// Parse the shadow value and extract the values.
	function parseShadows(shadow) {
		var parsedShadows = [];
		var parsePosition = 0;
		var parseLength = shadow.length;

		function findInset() {
			var m = /^inset\b/.exec(shadow.substring(parsePosition));
			if (m !== null && m.length > 0) {
				parsedShadow.inset = true;
				parsePosition += m[0].length;
				return true;
			}
			return false;
		}
		function findOffsets() {
			var m = /^(-?[0-9\.]+)(?:px)?\s+(-?[0-9\.]+)(?:px)?(?:\s+(-?[0-9\.]+)(?:px)?)?(?:\s+(-?[0-9\.]+)(?:px)?)?/.exec(shadow.substring(parsePosition));
			if (m !== null && m.length > 0) {
				parsedShadow.left = parseInt(m[1], 10);
				parsedShadow.top = parseInt(m[2], 10);
				parsedShadow.blur = (m[3] ? parseInt(m[3], 10) : 0);
				parsedShadow.spread = (m[4] ? parseInt(m[4], 10) : 0);
				parsePosition += m[0].length;
				return true;
			}
			return false;
		}
		function findColor() {
			var m = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(shadow.substring(parsePosition));
			if (m !== null && m.length > 0) {
				parsedShadow.color = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16), 1];
				parsePosition += m[0].length;
				return true;
			}
			m = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(shadow.substring(parsePosition));
			if (m !== null && m.length > 0) {
				parsedShadow.color = [parseInt(m[1], 16) * 17, parseInt(m[2], 16) * 17, parseInt(m[3], 16) * 17, 1];
				parsePosition += m[0].length;
				return true;
			}
			m = /^rgb\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(shadow.substring(parsePosition));
			if (m !== null && m.length > 0) {
				parsedShadow.color = [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), 1];
				parsePosition += m[0].length;
				return true;
			}
			m = /^rgba\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(shadow.substring(parsePosition));
			if (m !== null && m.length > 0) {
				parsedShadow.color = [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), parseFloat(m[4])];
				parsePosition += m[0].length;
				return true;
			}
			return false;
		}
		function findWhiteSpace() {
			var m = /^\s+/.exec(shadow.substring(parsePosition));
			if (m !== null && m.length > 0) {
				parsePosition += m[0].length;
				return true;
			}
			return false;
		}
		function findComma() {
			var m = /^\s*,\s*/.exec(shadow.substring(parsePosition));
			if (m !== null && m.length > 0) {
				parsePosition += m[0].length;
				return true;
			}
			return false;
		}
		function normalizeShadow(shadow) {
			if ($.isPlainObject(shadow)) {
				var i, sColor, cLength = 0, color = [];
				if ($.isArray(shadow.color)) {
					sColor = shadow.color;
					cLength = sColor.length;
				}
				for(i = 0; i < 4; i++) {
					if (i < cLength) {
						color.push(sColor[i]);
					} else if (i === 3) {
						color.push(1);
					} else {
						color.push(0);
					}
				}
			}
			return $.extend({
				'left': 0,
				'top': 0,
				'blur': 0,
				'spread': 0
			}, shadow);
		}
		var parsedShadow = normalizeShadow();

		while (parsePosition < parseLength) {
			if (findInset()) {
				findWhiteSpace();
			} else if (findOffsets()) {
				findWhiteSpace();
			} else if (findColor()) {
				findWhiteSpace();
			} else if (findComma()) {
				parsedShadows.push(normalizeShadow(parsedShadow));
				parsedShadow = {};
			} else {
				break;
			}
		}
		parsedShadows.push(normalizeShadow(parsedShadow));
		return parsedShadows;
	}
});
// Stolen from jquery-ui and customized
(function($){
  $.fn.disableSelection = function(){
    return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
      ".disableSelection", function( event ) {
      event.preventDefault();
      });
  };
 
  $.fn.enableSelection = function(){
    return this.unbind('.disableSelection');
  };
})(jQuery);
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?(this._wrapped=n,void 0):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.5.2";var A=j.each=j.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var E="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(E);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(E);return r},j.find=j.detect=function(n,t,r){var e;return O(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var O=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:O(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,function(n){return n[t]})},j.where=function(n,t,r){return j.isEmpty(t)?r?void 0:[]:j[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},j.findWhere=function(n,t){return j.where(n,t,!0)},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&j.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>e.computed&&(e={value:n,computed:a})}),e.value},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);if(!t&&j.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a<e.computed&&(e={value:n,computed:a})}),e.value},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return arguments.length<2||r?n[j.random(n.length-1)]:j.shuffle(n).slice(0,Math.max(0,t))};var k=function(n){return j.isFunction(n)?n:function(t){return t[n]}};j.sortBy=function(n,t,r){var e=k(t);return j.pluck(j.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={},i=null==r?j.identity:k(r);return A(t,function(r,a){var o=i.call(e,r,a,t);n(u,o,r)}),u}};j.groupBy=F(function(n,t,r){(j.has(n,t)?n[t]:n[t]=[]).push(r)}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=null==r?j.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.indexOf(t,n)>=0})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:new Date,a=null,i=n.apply(e,u)};return function(){var l=new Date;o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u)):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o;return function(){i=this,u=arguments,a=new Date;var c=function(){var l=new Date-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u)))},l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u)),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=w||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};I.unescape=j.invert(I.escape);var T={escape:new RegExp("["+j.keys(I.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(I.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(T[n],function(t){return I[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
//# sourceMappingURL=underscore-min.map
;
Ajax = function () {

	Ajax.sendHumanMove = function(options){
		return $.ajax({
			url: '/send_human_move/',
			type: 'post',
			async: true,
			data: $.param(options),
			dataType: 'script',
			beforeSend: function (xhr) {
				
				// xhr.setRequestHeader("Accept", "text/javascript");
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		})
	}

	Ajax.prototype.startNewGame = function(){
		return $.ajax({
			url: '/games/new/',
			type: 'get',
			async: false,
			dataType: 'json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		})
	}

	Ajax.prototype.sendOptions = function(id, send_data){
		return $.ajax({
			url: '/games/' + id + '/update',
			type: 'put',
			async: false,
			data: send_data,
			// dataType: 'json',
			beforeSend: function (xhr) {
				// xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		})
	}
}
;
Timer = function () {
  var _this = this;
  var _timer;
  this.elapsed;

  this.startTimer = function (callback) {
      var start = new Date().getTime();
        _this.elapsed = '0.0';

      _timer = window.setInterval(function () {
        var time = new Date().getTime() - start;

        elapsed = Math.floor(time) / 1000;
        if (Math.round(elapsed) == elapsed) {
          _this.elapsed += '.0';
        }

        callback(elapsed);
      }, 1000);
    };

    this.endTimer = function () {
      window.clearInterval(_timer);

    };
};
var Game = function (id) {

	this.id = id;
	this.currentPlayer = null;
	this.winChain = null;
	this.forceMove = false;
};
GameController = function () {
	var _this = this;
	var view, board, menu, slider;
	var ajax = new Ajax();

	var ViewDelegate;
	ViewDelegate = function () {};

	function init(){
		_this.delegate = new ViewDelegate();
		view = new View(_this.delegate);
		board = new Board();
		menu = new Menu(_this.delegate);
		slider = new Slider();
		board.setRows($(".outer").data("rows"));

	}
	

/************
view requires: 
	sendHumanMove()
	startNewGame()
	sendOptions()
	getRows()
	*************/
	
	ViewDelegate.prototype.newGame = function(){
		game = new Game();
		board.clearPieces()
		board.enable()
	
		view.clearMenuTextBox();
		_this.startNewGame();
		view.removeSpinner();
		view.$board.empty();
		view.squareArray = new Array(board.getRows());
		view.renderBoard(board.getRows());
		view.addLoader();
	};

	ViewDelegate.prototype.forceMoveButton = function(){
		view.forceMove = true;
	}

	ViewDelegate.prototype.makeMove = function () {
		if (board.active() === true) {
			$square = $(this);
			coord = $square.data("coord");
			console.log(coord);
      // var isNewGame = boardEmpty();
      if (_this.addBlackPiece(coord) === true) {
      	view.applyLoader = true;

      	_this.sendHumanMove({
      		"coord": coord
      	});
      	board.disable();
      } else {

      }
  }
};

ViewDelegate.prototype.board = board;

this.addPiece = function(coord, element){
	view.squareArray[coord[0]][coord[1]].append(element);
	board.addPiece(element);
}

this.addWhitePiece = function (coord) {
	console.log("COORD: " + coord);
	_this.addPiece(coord, view.$whiteStone.clone());
	view.squareArray[coord[0]][coord[1]].children('.white-stone').css({
      opacity: 0,
      display: 'inline-block',
      boxShadow: '0 0 30px rgba(255, 255, 255, 0.75)'
    	}).fadeIn("slow").animate({opacity: 1,
    	boxShadow: '0 0 5px rgba(255, 255, 255, 0.75)'}, 750);;
};


this.addBlackPiece = function (coord) {
	if (view.squareArray[coord[0]][coord[1]].children(".stone").length > 0) {
	    // alert("NOT EMPTY" + squareArray[coord[0]][coord[1]].children())
	    return false;

	} else {
		_this.addPiece(coord, view.$blackStone.clone());
		return true;
	}

};

this.sendHumanMove = function (opt) {
	options = opt || {};
	view.forceMove = false;
	view.textBox.text("Black: " + JSON.stringify(opt.coord) + "\n" + view.textBox.val());	

	setTimeout(function () {
		view.startSpinner();
	}, 300);

	Ajax.sendHumanMove(options).done(function (data) {
		_this.getAIMove('/get_ai_move/', 0);
	});
};

ViewDelegate.prototype.getRows = function(){
	return board.getRows();
}
ViewDelegate.prototype.getRows = function(){
	return board.getRows();
}

this.startNewGame = function () {
	ajax.startNewGame().done(function (data) {
		view.$outer.data({
			"rows": data.rows,
			"win_chain": data.win_chain,
			"game_id": data.game_id
		});
	}).always(function () {
		view.removeTitleLoadingBackground();
	});
};

ViewDelegate.prototype.sendOptions = function (id, opt) {

	var options = opt || {};
	var sendData = $(".edit_game").serialize();
	ajax.sendOptions(view.$outer.data("game_id"), sendData).done(function (data) {}).fail(function (data) {}).always(function (data) {
		view.$outer.data({
			"rows": data.rows
		});
		board.setRows(data.rows)
	});
};

this.getAIMove = function (path, count) {
	opt = {
		force: view.forceMove
	};
	$.ajax({
		url: path,
		type: 'put',
		async: true,
		data: $.param(opt),
		timeout: 99999999,
		dataType: 'json',
		beforeSend: function (xhr) {
				// xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		}).always(function (data, xhr, jqXHR) {
			_this.aiMoveCallback(data, count);
		});
	};

	this.getAIMoveWithTimer = function (path, count) {
		setTimeout(function () {
			_this.getAIMove(path, count);
		}, 1000 * count / 4);
	};

	this.aiMoveCallback = function (data, count) {
		xmlhttp = new XMLHttpRequest();
			if (data !== null) {
				console.log(data);
				if (data["status"] !== undefined){
					var status = data["status"];
					console.log(status)
					// view.textBox.text(status + "\n" + view.textBox.val())
					if (status == "in_progress"){
						_this.checkMoveCount(data, count, function(){
							_this.addWhitePiece(data.coord);
							board.enable();
							view.removeSpinner();
							view.textBox.text("White: " + JSON.stringify(data.coord) + "\n" + view.textBox.val())		

						});
					}else if (status == "processing"){
						_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
					}else if (status == "established"){
						_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
					}else if (status == "black_winner"){
						view.win(data["win_chain_array"]);
					}else if (status == "white_winner"){
						_this.addWhitePiece(data.coord);
						view.win(data["win_chain_array"]);
					}else if (status == "tie"){
						view.removeSpinner();
					}else if (status == "error"){

					}
				} else {
					console.log("data does not provide a status")
					_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);

				}
			} else { // data is null
				console.log("data null");
				_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
			}
	};

	this.checkMoveCount = function(data, count, callback){
		if (data.p2_moves.length > ((board.moveCount() - 1) / 2)) {
			callback()
		} else {
			console.log("RETURNED WRONG MOVE, KEEP CHECKING");
			_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
		}
	}

	init()

};
var Board = function () {

	var _this = this;
	var _rows = 0;
	var _pieceArray = [];
	this.squareArray = [];
	var _active = true;

	this.active = function(){
		return _active;
	};

	this.setRows = function(rows){
		_rows = rows;
	};

	this.getRows = function(){
		return _rows;
	}

	this.getSquare = function(x,y){

	};

	this.squareEmpty = function(x, y){

	};

	this.boardEmpty = function(){
		if (_pieceArray.length === 0){
			return true;
		} else return false;
	};

	this.clearPieces = function(){
		_pieceArray = []
	}

	this.moveCount = function(){
		return _pieceArray.length;
	}

	this.addPiece = function(element){
		_pieceArray.push(element);
	};

	this.addWhitePiece = function(){

	};

	this.addBlackPiece = function(){

	};

	this.enable = function(){
		_active = true;
	};

	this.disable = function(){
		_active = false;
	};
};
var Menu = function (delegate) {
  var $window = $(window);

  var dragging = false;
  var slideMenuWidth = 10;
  var orig = 0;
  var $slider = $(".slide-left");
  var moveLeft = 0; // The two variables define the distance
  var moveDown = 0;
  var MAX_WIDTH = 160;
  var MIN_WIDTH = 30;
  var INITIAL_WIDTH_ON_MD;
  var wasDragged;
  $slideLeft = $(".slide-left")
  $window.on("mouseup", function (p) {
    dragging = false;
    if (INITIAL_WIDTH_ON_MD - $slideLeft.width() == 0   && !$(p.target).is("input")){
      if ($slideLeft.width() > MIN_WIDTH){
      //click
      $slideLeft.animate({width: MIN_WIDTH})
    } else{
      $slideLeft.animate({width: MAX_WIDTH})
    } 

  }
  });

  $window.on("mousemove", _.throttle(function (p) {
    p.preventDefault();
    var dist = $window.width() - p.pageX;

    if (dragging && $slider.width() <= MAX_WIDTH && $slider.width() >= MIN_WIDTH) {
      slideMenuWidth = dist;
      $slider.width(Math.max(Math.min(dist + orig, MAX_WIDTH), MIN_WIDTH));

    } else if ($slider.width() >= MAX_WIDTH) {
      $slider.width(MAX_WIDTH);
    }
  }, 50));


 

  $(".slide-left").on("mousedown", function (p) {
    console.log($(this).attr('class'));
    // p.preventDefault()
    INITIAL_WIDTH_ON_MD = $(".slide-left").width()

    orig = $(".slide-left").width() - ($(window).width() - p.pageX);
    console.log("ORIG: " + orig);
    dragging = true;

    // $(window).disableSelection();

  });
  $(".slide-left").on("click", function (p) {
    // p.preventDefault()
    if  ($(".slide-left").width() > INITIAL_WIDTH_ON_MD){

  } else{ //closing 

  }


    // $(window).disableSelection();

  });
};
var Slider = function (delegate) {
  var $window = $(window);

  var dragging = false;
  var slideMenuWidth = 10;
  var orig = 0;
  var $slider = $(".title");
  var moveLeft = 0; // The two variables define the distance
  var moveDown = 0;
  var MAX_WIDTH = 300;
  var MIN_WIDTH = 180;
  var INITIAL_WIDTH_ON_MD;
  var wasDragged;
  var origClick;
  var origDiff;
  $slideLeft = $(".title")
  $window.on("mouseup", function (p) {
    dragging = false;
    $slider.data({"dragging" : false});
    if (INITIAL_WIDTH_ON_MD - $slideLeft.width() == 0   && !$(p.target).is("input")){
      if ($slideLeft.width() > MIN_WIDTH){
      //click
      $slideLeft.animate({width: MIN_WIDTH})
    } else{
      $slideLeft.animate({width: MAX_WIDTH})
    } 

  }
  });

  $window.on("mousemove", _.throttle(function (p) {
    p.preventDefault();
    mouseX = p.pageX
    $slider.data({"isDragging" : true});

    offSetOrig = $slider.offset();
    offsetObj = {top : offSetOrig.top, left : p.pageX - origDiff }
    var dist = $window.width() - p.pageX;

    if (dragging && $slider.position().left >= 0 && $slider.position().left <= 118) {
         var setVal = p.pageX - origDiff
         var gap = $slider.offset().left - $slider.position().left;
         console.log(gap);
         console.log("S-G " + (setVal - gap));
         if (setVal - gap <= 0) setVal = 0 + gap;
         if (setVal - gap >= 119) setVal = 118 + gap;
         // setVal = Math.max(Math.min(setVal, MAX_WIDTH), MIN_WIDTH)
         // $slider.offset({top : offSetOrig.top, left : setVal })
         $slider.offset({top : offSetOrig.top, left : setVal});
      // $slider.width(Math.max(Math.min(dist + orig, MAX_WIDTH), MIN_WIDTH));

    } else if ($slider.width() >= MAX_WIDTH) {
      $slider.width(MAX_WIDTH);
    }
  }, 50));


  $(".title").on("mousedown", function (p) {

    mouseX = p.pageX
    origDiff = mouseX - $slider.offset().left
    console.log("MOUSE: " + mouseX)
    origClick = $(window).width() - p.pageX;

    offSetOrig = $slider.offset();
    posOrig = $slider.position();
    offsetObj = {top : offSetOrig.top, left : p.pageX }
    // p.preventDefault()
    var val = parseInt($(this).css("left").match(/\d+/))
    INITIAL_WIDTH_ON_MD = $(".slide-left").width()

    orig = $(".title").width() - ($(window).width() - p.pageX);
    $slider.data({"dragging" : false});
    $slider.data({"isDragging" : false});

    dragging = true;

    // $(window).disableSelection();

  });
  $(".title").on("click", function (p) {
    // p.preventDefault()
    if  ($(".slide-left").width() > INITIAL_WIDTH_ON_MD){

  } else{ //closing 

  }


    // $(window).disableSelection();

  });
};
var View = function (delegate) {

  /* private variables */
  var _this = this;
  var loaderContainerHTML = '<div class="loader"> <div class="spinner-holder"></div></div>';
  var loaderHTML = '<div id="floatingBarsG"><div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div><div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div><div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div></div>';

  /* public variables */
  this.textBox = $('.info-box');
  this.$blackStone = $("<div class='stone black-stone' ></div>");
  this.$whiteStone = $("<div class='stone white-stone' ></div>");
  this.$board = $('.board');
  this.$outer = $('.outer');
  this.applyLoader = true;
  this.squareArray = [];
  this.forceMove = false;
  this.timer = null;
  $window = $(window)
   this.$outer.data({
     "rows": _this.$board.attr('id')
   });

  $(".title").on("click", function () {
    if ($(".title").data("isDragging") != true){
    delegate.newGame();
  }
  });

  $(".force-move").on("click", function () {
    // _this.forceMove = true;
    delegate.forceMoveButton();
    $('.force-move').addClass('loading-background');
  });

  $(window).on("resize", function () {
    var varWidth = Math.min($window.height() * 0.7, $window.width() * 0.7);
    $(".square").width(varWidth / delegate.getRows());
    $(".square").height($(".square").width());
    // $(".slide-left").css('left',$(window).width() - slideMenuWidth);

  });
  this.addLoader = function(){
    $('.board').append(loaderContainerHTML);
  }
 

  this.clearMenuTextBox = function(){
    $(".info-box").text("");

  }

  this.addTitleButtonLoadBackground = function() {

  }

  $(".outer").on("click", ".square", _.debounce(delegate.makeMove, 100));

  

  this.removeTitleLoadingBackground = function () {
    $(".title-cont").removeClass('loading-background');
  };

  $(".edit_game").on("submit", function (e) {
    delegate.sendOptions();

    e.preventDefault();
  });

  this.renderBoard = function(rows) {
    for (var i = 0; i < rows; i++) {
      _this.squareArray[i] = new Array(rows);
      $(".board").append("<div class='row'id='row" + i + "'>");
      for (var j = 0; j < rows; j++) {
        var newSquare = $("<div class='square'><div/>");
        newSquare.data({
          coord: [i, j]
        });
        $("#row" + i).append(newSquare);
        _this.squareArray[i][j] = newSquare;
      }
      $(".board").append("</div>");
    }
    var varWidth = Math.min($(window).height() * 0.7, $(window).width() * 0.7);

    $(".square").width(varWidth / rows);
    $(".square").height($(".square").width());
  };

  this.win = function (thisData) {
    for (var i = 0; i < thisData.length; i++) {
      _this.squareArray[thisData[i][0]][thisData[i][1]].children().addClass("highlight");
    }
    _this.removeSpinner();
  };

  this.tie = function () {
    _this.removeSpinner();
  };


  this.removeSpinner = function () {
    if (this.timer != null){
      this.timer.endTimer();
      this.timer = null;
    }
    _this.applyLoader = false;
    $('.spinner-holder').empty();
    $('.loader').fadeOut();
    $('.force-move').fadeOut();
  };

  var appendForceButton = function () {
    $('.force-move').removeClass('loading-background');
    $('.force-move').css({
      opacity: 0,
      display: 'inline-block'
    }).animate({
      opacity: 1
    }, 600);
  };

  this.startSpinner = function () {
    this.timer = new Timer();
    if (_this.applyLoader === true) {
      this.timer.startTimer(function (elapsed) {
        console.log(elapsed);
        if (elapsed > 1 && _this.applyLoader === true){
          $('.spinner-holder').append(loaderHTML);
          $('.loader').fadeIn("slow");
          _this.applyLoader = false;
        }

        if (elapsed > 5) {

          // alert("5 seconds")
          if ($('.force-move').css('display') == "none") {
            appendForceButton();
          }
        }
      });

      
    }
  };

};
$(document).ready(function(){
	cont = new GameController()
	cont.delegate.newGame();
});
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//















 
;
