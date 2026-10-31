/*
 * dc-mini: a tiny renderer for Speakerfolio's page templates.
 * Supports {{path}} holes in text and attributes, <sc-if value>, <sc-for list as>,
 * onClick/onChange/onInput handlers, and components with state (DCLogic).
 * DOM updates go through morphdom so typed form values and focus are kept.
 */
(function () {
  'use strict';

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, p);
    if (this.__app) { this.__app.schedule(); }
  };
  DCLogic.prototype.renderVals = function () { return {}; };

  var HOLE = /\{\{\s*([^{}]+?)\s*\}\}/g;
  var EVENTS = { onclick: 'click', onchange: 'change', oninput: 'input', onsubmit: 'submit', onkeydown: 'keydown' };

  function lookup(expr, scope) {
    expr = expr.trim();
    if (expr === 'true') { return true; }
    if (expr === 'false') { return false; }
    if (expr === 'null') { return null; }
    if (/^-?\d+(\.\d+)?$/.test(expr)) { return Number(expr); }
    var parts = expr.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v === null || v === undefined) { return undefined; }
      v = v[parts[i]];
    }
    return v;
  }
  function single(text) {
    var m = /^\s*\{\{\s*([^{}]+?)\s*\}\}\s*$/.exec(text);
    return m ? m[1] : null;
  }
  function interp(text, scope) {
    return text.replace(HOLE, function (_, e) {
      var v = lookup(e, scope);
      return v === undefined || v === null || v === false ? (v === false ? 'false' : '') : String(v);
    });
  }

  function App(container, template, Cls, props) {
    this.container = container;
    this.tpl = document.createElement('template');
    this.tpl.innerHTML = template;
    this.instance = new Cls(props || {});
    this.instance.__app = this;
    this.handlers = {};
    this.queued = false;
    var self = this;
    Object.keys(EVENTS).forEach(function (k) {
      var type = EVENTS[k];
      container.addEventListener(type, function (ev) {
        var attr = 'data-dc-' + type;
        var el = ev.target && ev.target.closest ? ev.target.closest('[' + attr + ']') : null;
        if (!el || !container.contains(el)) { return; }
        var fn = self.handlers[el.getAttribute(attr)];
        if (typeof fn !== 'function') { return; }
        if (type === 'click' && el.tagName === 'A' && (el.getAttribute('href') || '').charAt(0) === '#') { /* in-page link: let the browser scroll too */ }
        fn({ target: ev.target, currentTarget: el, type: type, nativeEvent: ev, preventDefault: function () { ev.preventDefault(); }, stopPropagation: function () { ev.stopPropagation(); } });
      });
    });
    // keyboard: Enter or Space on role=button acts like a click
    container.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' && ev.key !== ' ') { return; }
      var el = ev.target;
      if (!el || !el.getAttribute || !el.hasAttribute('data-dc-click')) { return; }
      var tag = el.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT' || tag === 'TEXTAREA') { return; }
      ev.preventDefault(); el.click();
    });
  }
  App.prototype.schedule = function () {
    if (this.queued) { return; }
    this.queued = true;
    var self = this;
    (window.requestAnimationFrame || setTimeout)(function () { self.queued = false; self.render(); });
  };
  App.prototype.render = function () {
    this.handlers = {};
    this.seq = 0;
    var vals = this.instance.renderVals() || {};
    var frag = document.createDocumentFragment();
    this.walk(this.tpl.content.childNodes, vals, frag);
    var next = this.container.cloneNode(false);
    next.appendChild(frag);
    if (!this.mounted) {
      this.container.innerHTML = '';
      while (next.firstChild) { this.container.appendChild(next.firstChild); }
      this.mounted = true;
      if (typeof this.instance.componentDidMount === 'function') { this.instance.componentDidMount(); }
      return;
    }
    window.morphdom(this.container, next, {
      childrenOnly: true,
      onBeforeElUpdated: function (from, to) {
        if (from.isEqualNode(to)) { return false; }
        var t = from.tagName;
        if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') {
          // keep what the visitor typed; only sync class and style
          ['class', 'style', 'placeholder', 'aria-invalid', 'disabled'].forEach(function (a) {
            if (to.hasAttribute(a)) { from.setAttribute(a, to.getAttribute(a)); } else { from.removeAttribute(a); }
          });
          return false;
        }
        return true;
      }
    });
  };
  App.prototype.walk = function (nodes, scope, out) {
    for (var i = 0; i < nodes.length; i++) { this.node(nodes[i], scope, out); }
  };
  App.prototype.node = function (n, scope, out) {
    if (n.nodeType === 3) {
      out.appendChild(document.createTextNode(n.nodeValue.indexOf('{{') >= 0 ? interp(n.nodeValue, scope) : n.nodeValue));
      return;
    }
    if (n.nodeType !== 1) { return; }
    var tag = n.localName;
    if (tag === 'sc-if') {
      var e = single(n.getAttribute('value') || '');
      if (e !== null && lookup(e, scope)) { this.walk(n.childNodes, scope, out); }
      return;
    }
    if (tag === 'sc-for') {
      var le = single(n.getAttribute('list') || ''), as = n.getAttribute('as') || 'item';
      var list = le !== null ? lookup(le, scope) : null;
      if (list && list.length) {
        for (var j = 0; j < list.length; j++) {
          var s = Object.create(scope); s[as] = list[j]; s[as + 'Index'] = j;
          this.walk(n.childNodes, s, out);
        }
      }
      return;
    }
    var el = n.namespaceURI === 'http://www.w3.org/2000/svg' ? document.createElementNS(n.namespaceURI, n.tagName) : document.createElement(tag);
    for (var a = 0; a < n.attributes.length; a++) {
      var at = n.attributes[a], name = at.name, val = at.value, lname = name.toLowerCase();
      if (lname.indexOf('hint-') === 0) { continue; }
      if (EVENTS[lname]) {
        var he = single(val), fn = he !== null ? lookup(he, scope) : null;
        if (typeof fn === 'function') { var key = 'h' + (this.seq++); this.handlers[key] = fn; el.setAttribute('data-dc-' + EVENTS[lname], key); }
        continue;
      }
      try {
        if (at.namespaceURI) { el.setAttributeNS(at.namespaceURI, name, val.indexOf('{{') >= 0 ? interp(val, scope) : val); }
        else { el.setAttribute(name, val.indexOf('{{') >= 0 ? interp(val, scope) : val); }
      } catch (err) { /* skip invalid attribute */ }
    }
    var kids = tag === 'template' ? n.content.childNodes : n.childNodes;
    this.walk(kids, scope, el);
    out.appendChild(el);
  };

  function loadComponent(scriptText) {
    /* eslint-disable no-new-func */
    return new Function('DCLogic', scriptText + '\n;return typeof Component !== "undefined" ? Component : DCLogic;')(DCLogic);
  }

  window.DCMini = {
    DCLogic: DCLogic,
    mount: function (container, templateHTML, scriptText, props) {
      var Cls = loadComponent(scriptText);
      var app = new App(container, templateHTML, Cls, props);
      app.render();
      return app;
    },
    setProps: function (app, props) {
      app.instance.props = Object.assign({}, app.instance.props, props);
      app.schedule();
    }
  };
})();
