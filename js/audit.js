/* ==========================================================================
   NaijaGo — in-page WCAG contrast audit. Press A, or load with ?audit.
   Composites translucent backgrounds up the ancestor chain before measuring,
   so a label on rgba(255,255,255,.14) over ink is scored against the blend,
   not against pure white.
   ========================================================================== */
(function (NG) {
  'use strict';

  function rgba(str) {
    var m = String(str).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(',').map(function (x) { return parseFloat(x); });
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function lumOf(c) {
    var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  function ratio(a, b) { var hi = Math.max(a, b), lo = Math.min(a, b); return (hi + 0.05) / (lo + 0.05); }

  function bgOf(el) {
    var stack = [], n = el;
    while (n && n !== document.documentElement) {
      var cs = getComputedStyle(n);
      // Text sitting over photography cannot be scored by this formula. Those
      // containers carry data-over-image and are verified against the scrim
      // specification in DESIGN-SYSTEM.md instead.
      if (n.hasAttribute && n.hasAttribute('data-over-image')) return 'img';
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return 'img';
      var o = rgba(cs.backgroundColor);
      if (o && o.a > 0) { stack.push(o); if (o.a >= 1) break; }
      n = n.parentElement;
    }
    if (!stack.length) return lumOf({ r: 255, g: 255, b: 255 });
    var base = stack[stack.length - 1].a >= 1 ? stack.pop() : { r: 255, g: 255, b: 255, a: 1 };
    for (var i = stack.length - 1; i >= 0; i--) {
      var t = stack[i];
      base = {
        r: t.r * t.a + base.r * (1 - t.a),
        g: t.g * t.a + base.g * (1 - t.a),
        b: t.b * t.a + base.b * (1 - t.a), a: 1
      };
    }
    return lumOf(base);
  }

  NG.audit = function (verbose) {
    var fails = [], nodes = document.querySelectorAll('body *');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var txt = '';
      for (var j = 0; j < el.childNodes.length; j++) {
        if (el.childNodes[j].nodeType === 3) txt += el.childNodes[j].nodeValue;
      }
      txt = txt.trim();
      if (!txt) continue;
      var cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.15) continue;
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;

      var bg = bgOf(el);
      if (bg === 'img') continue;                       // over photography: judged by eye, not by formula
      var fc = rgba(cs.color); if (!fc) continue;
      var cr = ratio(lumOf(fc), bg);
      var size = parseFloat(cs.fontSize);
      var bold = parseInt(cs.fontWeight, 10) >= 700;
      var large = size >= 24 || (size >= 18.66 && bold);
      var need = large ? 3 : 4.5;
      if (cr + 0.005 < need) {
        fails.push({
          text: txt.slice(0, 46), ratio: Math.round(cr * 100) / 100, need: need,
          color: cs.color, size: size, cls: el.className || el.tagName.toLowerCase()
        });
      }
    }
    if (verbose !== false) {
      if (fails.length) { console.warn('[audit] ' + fails.length + ' contrast failures'); console.table(fails); }
      else console.log('%c[audit] 0 contrast failures', 'color:#12604C;font-weight:700');
    }
    return fails;
  };

  NG.auditOn = /[?&]audit/.test(location.search);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'a' && !/input|textarea|select/i.test(document.activeElement.tagName)) NG.audit();
  });
  if (NG.auditOn) setTimeout(function () { NG.audit(); }, 300);
})(window.NG = window.NG || {});
