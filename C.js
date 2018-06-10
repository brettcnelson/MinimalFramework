var C = (function() {
	var entry = null;
	var root = null;
	var VDOM = null;

	function DOMdiff(DOMparent,updated,curr,child) {
		if (!curr) {
			DOMparent.appendChild(DOM(updated));
		}
		else if (isDifferentType(updated,curr)) {
			DOMparent.replaceChild(DOM(updated),DOMparent.childNodes[child]);
		}
		else if (updated.tag) {
			var DOMchild = DOMparent.childNodes[child];
			updateFeeds(Object.assign({}, updated.feed, curr.feed), DOMchild , updated.feed, curr.feed);
			for (var i = 0 ; i < updated.children.length ; i++) {
				DOMdiff(DOMchild, updated.children[i], curr.children[i], i);
			}
			for (i ; i < curr.children.length ; i++) {
				DOMchild.removeChild(DOMchild.lastChild);
			}
		}
	}

	function isDifferentType(updated,curr) {
		if (typeof updated === 'object') {
			return updated.tag !== curr.tag || updated.feed.forceSync;
		}
		return updated !== curr;
	}

	function updateFeeds(feeds,DOMtarget,updated,curr) {
		Object.keys(feeds).forEach(key => {
			if (typeof feeds[key] === 'boolean') {
				if (updated[key] === undefined) {
					DOMtarget.removeAttribute(key);
					DOMtarget[key] = false;
				}
				else if (curr[key] === undefined || curr[key] !== updated[key]) {
					if (updated[key]) {
						DOMtarget.setAttribute(key,true);
						DOMtarget[key] = true;
					}
					else {
						DOMtarget[key] = false;
					}
				}
			}
			else if (key === 'style') {
				var updatedStyle = updated[key];
				var currStyle = curr[key];
				var styles = Object.assign({}, updatedStyle, currStyle);
				for (var styleKey in styles) {
					if (!updatedStyle[styleKey]) {
						DOMtarget.style[styleKey] = '';
					}
					else if (!currStyle[styleKey] || currStyle[styleKey] !== updatedStyle[styleKey]) {
						DOMtarget.style[styleKey] = updatedStyle[styleKey];
					}
				}
			}
			else {
				if (!updated[key]) {
					DOMtarget.removeAttribute(key);
				}
				else if (!curr[key] || curr[key] !== updated[key]) {
					DOMtarget.setAttribute(key, feeds[key]);
				}
			}
		});
	}

	function DOM(node) {
		if (typeof node !== 'object' || node === null) {
			return document.createTextNode(node);
		}
		var { tag,feed,children } = node;
		var DOMel = document.createElement(tag);
		Object.keys(feed).forEach(prop => {
			if (typeof feed[prop] === 'boolean') {
				if (feed[prop]) {
					DOMel.setAttribute(prop, true);
				}
				DOMel[prop] = feed[prop];
			}
			else if (prop === 'style') {
				for (var key in feed[prop]) {
					DOMel.style[key] = feed[prop][key];
				}
			}
			else if (prop === 'listeners') {
				Object.keys(feed[prop]).forEach(key => {
					DOMel.addEventListener(key.slice(2), feed[prop][key]);
				});
			}
			else {
				DOMel.setAttribute(prop, feed[prop]);
			}
		});
		children.forEach(c=>DOMel.appendChild(DOM(c)));
		return DOMel;
	}

	function C(tag,feed={},children=[]) {
		if (Array.isArray(feed)) {
			children = feed;
			feed = {};
		}
		return { tag,feed,children };
	}

	C.sync = function() {
		var updatedVDOM = entry();
		DOMdiff(root,updatedVDOM,VDOM,0);
		VDOM = updatedVDOM;
		// *************** re-write entire DOM
		// if (root.childNodes.length) {root.removeChild(root.lastChild)}
		// root.appendChild(DOM(entry()));
	}

	C.attach = function(component,rootNode) {
		entry = component;
		root = rootNode;
		C.sync();
	}

	return C;
}());
