function Qt(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var Ue, nt;
function Jt() {
  if (nt) return Ue;
  nt = 1;
  function o(t) {
    return t instanceof Map ? t.clear = t.delete = t.set = function() {
      throw new Error("map is read-only");
    } : t instanceof Set && (t.add = t.clear = t.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(t), Object.getOwnPropertyNames(t).forEach((n) => {
      const s = t[n], m = typeof s;
      (m === "object" || m === "function") && !Object.isFrozen(s) && o(s);
    }), t;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(n) {
      n.data === void 0 && (n.data = {}), this.data = n.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function r(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(t, ...n) {
    const s = /* @__PURE__ */ Object.create(null);
    for (const m in t)
      s[m] = t[m];
    return n.forEach(function(m) {
      for (const C in m)
        s[C] = m[C];
    }), /** @type {T} */
    s;
  }
  const c = "</span>", u = (t) => !!t.scope, p = (t, { prefix: n }) => {
    if (t.startsWith("language:"))
      return t.replace("language:", "language-");
    if (t.includes(".")) {
      const s = t.split(".");
      return [
        `${n}${s.shift()}`,
        ...s.map((m, C) => `${m}${"_".repeat(C + 1)}`)
      ].join(" ");
    }
    return `${n}${t}`;
  };
  class E {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(n, s) {
      this.buffer = "", this.classPrefix = s.classPrefix, n.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(n) {
      this.buffer += r(n);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(n) {
      if (!u(n)) return;
      const s = p(
        n.scope,
        { prefix: this.classPrefix }
      );
      this.span(s);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(n) {
      u(n) && (this.buffer += c);
    }
    /**
     * returns the accumulated buffer
    */
    value() {
      return this.buffer;
    }
    // helpers
    /**
     * Builds a span element
     *
     * @param {string} className */
    span(n) {
      this.buffer += `<span class="${n}">`;
    }
  }
  const _ = (t = {}) => {
    const n = { children: [] };
    return Object.assign(n, t), n;
  };
  class y {
    constructor() {
      this.rootNode = _(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(n) {
      this.top.children.push(n);
    }
    /** @param {string} scope */
    openNode(n) {
      const s = _({ scope: n });
      this.add(s), this.stack.push(s);
    }
    closeNode() {
      if (this.stack.length > 1)
        return this.stack.pop();
    }
    closeAllNodes() {
      for (; this.closeNode(); ) ;
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    /**
     * @typedef { import("./html_renderer").Renderer } Renderer
     * @param {Renderer} builder
     */
    walk(n) {
      return this.constructor._walk(n, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(n, s) {
      return typeof s == "string" ? n.addText(s) : s.children && (n.openNode(s), s.children.forEach((m) => this._walk(n, m)), n.closeNode(s)), n;
    }
    /**
     * @param {Node} node
     */
    static _collapse(n) {
      typeof n != "string" && n.children && (n.children.every((s) => typeof s == "string") ? n.children = [n.children.join("")] : n.children.forEach((s) => {
        y._collapse(s);
      }));
    }
  }
  class H extends y {
    /**
     * @param {*} options
     */
    constructor(n) {
      super(), this.options = n;
    }
    /**
     * @param {string} text
     */
    addText(n) {
      n !== "" && this.add(n);
    }
    /** @param {string} scope */
    startScope(n) {
      this.openNode(n);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(n, s) {
      const m = n.root;
      s && (m.scope = `language:${s}`), this.add(m);
    }
    toHTML() {
      return new E(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function N(t) {
    return t ? typeof t == "string" ? t : t.source : null;
  }
  function R(t) {
    return L("(?=", t, ")");
  }
  function M(t) {
    return L("(?:", t, ")*");
  }
  function z(t) {
    return L("(?:", t, ")?");
  }
  function L(...t) {
    return t.map((s) => N(s)).join("");
  }
  function V(t) {
    const n = t[t.length - 1];
    return typeof n == "object" && n.constructor === Object ? (t.splice(t.length - 1, 1), n) : {};
  }
  function X(...t) {
    return "(" + (V(t).capture ? "" : "?:") + t.map((m) => N(m)).join("|") + ")";
  }
  function ee(t) {
    return new RegExp(t.toString() + "|").exec("").length - 1;
  }
  function le(t, n) {
    const s = t && t.exec(n);
    return s && s.index === 0;
  }
  const te = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function W(t, { joinWith: n }) {
    let s = 0;
    return t.map((m) => {
      s += 1;
      const C = s;
      let O = N(m), h = "";
      for (; O.length > 0; ) {
        const d = te.exec(O);
        if (!d) {
          h += O;
          break;
        }
        h += O.substring(0, d.index), O = O.substring(d.index + d[0].length), d[0][0] === "\\" && d[1] ? h += "\\" + String(Number(d[1]) + C) : (h += d[0], d[0] === "(" && s++);
      }
      return h;
    }).map((m) => `(${m})`).join(n);
  }
  const q = /\b\B/, ie = "[a-zA-Z]\\w*", D = "[a-zA-Z_]\\w*", Y = "\\b\\d+(\\.\\d+)?", J = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ne = "\\b(0b[01]+)", j = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", G = (t = {}) => {
    const n = /^#![ ]*\//;
    return t.binary && (t.begin = L(
      n,
      /.*\b/,
      t.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: n,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (s, m) => {
        s.index !== 0 && m.ignoreMatch();
      }
    }, t);
  }, F = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, K = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [F]
  }, oe = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [F]
  }, Re = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, P = function(t, n, s = {}) {
    const m = i(
      {
        scope: "comment",
        begin: t,
        end: n,
        contains: []
      },
      s
    );
    m.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const C = X(
      // list of common 1 and 2 letter words in English
      "I",
      "a",
      "is",
      "so",
      "us",
      "to",
      "at",
      "if",
      "in",
      "it",
      "on",
      // note: this is not an exhaustive list of contractions, just popular ones
      /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
      // contractions - can't we'd they're let's, etc
      /[A-Za-z]+[-][a-z]+/,
      // `no-way`, etc.
      /[A-Za-z][a-z]{2,}/
      // allow capitalized words at beginning of sentences
    );
    return m.contains.push(
      {
        // TODO: how to include ", (, ) without breaking grammars that use these for
        // comment delimiters?
        // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
        // ---
        // this tries to find sequences of 3 english words in a row (without any
        // "programming" type syntax) this gives us a strong signal that we've
        // TRULY found a comment - vs perhaps scanning with the wrong language.
        // It's possible to find something that LOOKS like the start of the
        // comment - but then if there is no readable text - good chance it is a
        // false match and not a comment.
        //
        // for a visual example please see:
        // https://github.com/highlightjs/highlight.js/issues/2827
        begin: L(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          C,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), m;
  }, de = P("//", "$"), ge = P("/\\*", "\\*/"), fe = P("#", "$"), Ee = {
    scope: "number",
    begin: Y,
    relevance: 0
  }, we = {
    scope: "number",
    begin: J,
    relevance: 0
  }, lt = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, dt = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      F,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [F]
      }
    ]
  }, ut = {
    scope: "title",
    begin: ie,
    relevance: 0
  }, ht = {
    scope: "title",
    begin: D,
    relevance: 0
  }, gt = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + D,
    relevance: 0
  };
  var ye = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: K,
    BACKSLASH_ESCAPE: F,
    BINARY_NUMBER_MODE: lt,
    BINARY_NUMBER_RE: ne,
    COMMENT: P,
    C_BLOCK_COMMENT_MODE: ge,
    C_LINE_COMMENT_MODE: de,
    C_NUMBER_MODE: we,
    C_NUMBER_RE: J,
    END_SAME_AS_BEGIN: function(t) {
      return Object.assign(
        t,
        {
          /** @type {ModeCallback} */
          "on:begin": (n, s) => {
            s.data._beginMatch = n[1];
          },
          /** @type {ModeCallback} */
          "on:end": (n, s) => {
            s.data._beginMatch !== n[1] && s.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: fe,
    IDENT_RE: ie,
    MATCH_NOTHING_RE: q,
    METHOD_GUARD: gt,
    NUMBER_MODE: Ee,
    NUMBER_RE: Y,
    PHRASAL_WORDS_MODE: Re,
    QUOTE_STRING_MODE: oe,
    REGEXP_MODE: dt,
    RE_STARTERS_RE: j,
    SHEBANG: G,
    TITLE_MODE: ut,
    UNDERSCORE_IDENT_RE: D,
    UNDERSCORE_TITLE_MODE: ht
  });
  function bt(t, n) {
    t.input[t.index - 1] === "." && n.ignoreMatch();
  }
  function pt(t, n) {
    t.className !== void 0 && (t.scope = t.className, delete t.className);
  }
  function ft(t, n) {
    n && t.beginKeywords && (t.begin = "\\b(" + t.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", t.__beforeBegin = bt, t.keywords = t.keywords || t.beginKeywords, delete t.beginKeywords, t.relevance === void 0 && (t.relevance = 0));
  }
  function mt(t, n) {
    Array.isArray(t.illegal) && (t.illegal = X(...t.illegal));
  }
  function vt(t, n) {
    if (t.match) {
      if (t.begin || t.end) throw new Error("begin & end are not supported with match");
      t.begin = t.match, delete t.match;
    }
  }
  function Et(t, n) {
    t.relevance === void 0 && (t.relevance = 1);
  }
  const _t = (t, n) => {
    if (!t.beforeMatch) return;
    if (t.starts) throw new Error("beforeMatch cannot be used with starts");
    const s = Object.assign({}, t);
    Object.keys(t).forEach((m) => {
      delete t[m];
    }), t.keywords = s.keywords, t.begin = L(s.beforeMatch, R(s.begin)), t.starts = {
      relevance: 0,
      contains: [
        Object.assign(s, { endsParent: !0 })
      ]
    }, t.relevance = 0, delete s.beforeMatch;
  }, xt = [
    "of",
    "and",
    "for",
    "in",
    "not",
    "or",
    "if",
    "then",
    "parent",
    // common variable name
    "list",
    // common variable name
    "value"
    // common variable name
  ], wt = "keyword";
  function He(t, n, s = wt) {
    const m = /* @__PURE__ */ Object.create(null);
    return typeof t == "string" ? C(s, t.split(" ")) : Array.isArray(t) ? C(s, t) : Object.keys(t).forEach(function(O) {
      Object.assign(
        m,
        He(t[O], n, O)
      );
    }), m;
    function C(O, h) {
      n && (h = h.map((d) => d.toLowerCase())), h.forEach(function(d) {
        const f = d.split("|");
        m[f[0]] = [O, yt(f[0], f[1])];
      });
    }
  }
  function yt(t, n) {
    return n ? Number(n) : kt(t) ? 0 : 1;
  }
  function kt(t) {
    return xt.includes(t.toLowerCase());
  }
  const ze = {}, be = (t) => {
    console.error(t);
  }, je = (t, ...n) => {
    console.log(`WARN: ${t}`, ...n);
  }, me = (t, n) => {
    ze[`${t}/${n}`] || (console.log(`Deprecated as of ${t}. ${n}`), ze[`${t}/${n}`] = !0);
  }, ke = new Error();
  function Ge(t, n, { key: s }) {
    let m = 0;
    const C = t[s], O = {}, h = {};
    for (let d = 1; d <= n.length; d++)
      h[d + m] = C[d], O[d + m] = !0, m += ee(n[d - 1]);
    t[s] = h, t[s]._emit = O, t[s]._multi = !0;
  }
  function St(t) {
    if (Array.isArray(t.begin)) {
      if (t.skip || t.excludeBegin || t.returnBegin)
        throw be("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), ke;
      if (typeof t.beginScope != "object" || t.beginScope === null)
        throw be("beginScope must be object"), ke;
      Ge(t, t.begin, { key: "beginScope" }), t.begin = W(t.begin, { joinWith: "" });
    }
  }
  function At(t) {
    if (Array.isArray(t.end)) {
      if (t.skip || t.excludeEnd || t.returnEnd)
        throw be("skip, excludeEnd, returnEnd not compatible with endScope: {}"), ke;
      if (typeof t.endScope != "object" || t.endScope === null)
        throw be("endScope must be object"), ke;
      Ge(t, t.end, { key: "endScope" }), t.end = W(t.end, { joinWith: "" });
    }
  }
  function Mt(t) {
    t.scope && typeof t.scope == "object" && t.scope !== null && (t.beginScope = t.scope, delete t.scope);
  }
  function Nt(t) {
    Mt(t), typeof t.beginScope == "string" && (t.beginScope = { _wrap: t.beginScope }), typeof t.endScope == "string" && (t.endScope = { _wrap: t.endScope }), St(t), At(t);
  }
  function Ct(t) {
    function n(h, d) {
      return new RegExp(
        N(h),
        "m" + (t.case_insensitive ? "i" : "") + (t.unicodeRegex ? "u" : "") + (d ? "g" : "")
      );
    }
    class s {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(d, f) {
        f.position = this.position++, this.matchIndexes[this.matchAt] = f, this.regexes.push([f, d]), this.matchAt += ee(d) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const d = this.regexes.map((f) => f[1]);
        this.matcherRe = n(W(d, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(d) {
        this.matcherRe.lastIndex = this.lastIndex;
        const f = this.matcherRe.exec(d);
        if (!f)
          return null;
        const B = f.findIndex((_e, Ie) => Ie > 0 && _e !== void 0), T = this.matchIndexes[B];
        return f.splice(0, B), Object.assign(f, T);
      }
    }
    class m {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(d) {
        if (this.multiRegexes[d]) return this.multiRegexes[d];
        const f = new s();
        return this.rules.slice(d).forEach(([B, T]) => f.addRule(B, T)), f.compile(), this.multiRegexes[d] = f, f;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(d, f) {
        this.rules.push([d, f]), f.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(d) {
        const f = this.getMatcher(this.regexIndex);
        f.lastIndex = this.lastIndex;
        let B = f.exec(d);
        if (this.resumingScanAtSamePosition() && !(B && B.index === this.lastIndex)) {
          const T = this.getMatcher(0);
          T.lastIndex = this.lastIndex + 1, B = T.exec(d);
        }
        return B && (this.regexIndex += B.position + 1, this.regexIndex === this.count && this.considerAll()), B;
      }
    }
    function C(h) {
      const d = new m();
      return h.contains.forEach((f) => d.addRule(f.begin, { rule: f, type: "begin" })), h.terminatorEnd && d.addRule(h.terminatorEnd, { type: "end" }), h.illegal && d.addRule(h.illegal, { type: "illegal" }), d;
    }
    function O(h, d) {
      const f = (
        /** @type CompiledMode */
        h
      );
      if (h.isCompiled) return f;
      [
        pt,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        vt,
        Nt,
        _t
      ].forEach((T) => T(h, d)), t.compilerExtensions.forEach((T) => T(h, d)), h.__beforeBegin = null, [
        ft,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        mt,
        // default to 1 relevance if not specified
        Et
      ].forEach((T) => T(h, d)), h.isCompiled = !0;
      let B = null;
      return typeof h.keywords == "object" && h.keywords.$pattern && (h.keywords = Object.assign({}, h.keywords), B = h.keywords.$pattern, delete h.keywords.$pattern), B = B || /\w+/, h.keywords && (h.keywords = He(h.keywords, t.case_insensitive)), f.keywordPatternRe = n(B, !0), d && (h.begin || (h.begin = /\B|\b/), f.beginRe = n(f.begin), !h.end && !h.endsWithParent && (h.end = /\B|\b/), h.end && (f.endRe = n(f.end)), f.terminatorEnd = N(f.end) || "", h.endsWithParent && d.terminatorEnd && (f.terminatorEnd += (h.end ? "|" : "") + d.terminatorEnd)), h.illegal && (f.illegalRe = n(
        /** @type {RegExp | string} */
        h.illegal
      )), h.contains || (h.contains = []), h.contains = [].concat(...h.contains.map(function(T) {
        return Ot(T === "self" ? h : T);
      })), h.contains.forEach(function(T) {
        O(
          /** @type Mode */
          T,
          f
        );
      }), h.starts && O(h.starts, d), f.matcher = C(f), f;
    }
    if (t.compilerExtensions || (t.compilerExtensions = []), t.contains && t.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return t.classNameAliases = i(t.classNameAliases || {}), O(
      /** @type Mode */
      t
    );
  }
  function Fe(t) {
    return t ? t.endsWithParent || Fe(t.starts) : !1;
  }
  function Ot(t) {
    return t.variants && !t.cachedVariants && (t.cachedVariants = t.variants.map(function(n) {
      return i(t, { variants: null }, n);
    })), t.cachedVariants ? t.cachedVariants : Fe(t) ? i(t, { starts: t.starts ? i(t.starts) : null }) : Object.isFrozen(t) ? i(t) : t;
  }
  var Rt = "11.11.1";
  class Tt extends Error {
    constructor(n, s) {
      super(n), this.name = "HTMLInjectionError", this.html = s;
    }
  }
  const Te = r, Ze = i, Ke = Symbol("nomatch"), It = 7, We = function(t) {
    const n = /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null), m = [];
    let C = !0;
    const O = "Could not find the language '{}', did you forget to load/include a language module?", h = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let d = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: H
    };
    function f(a) {
      return d.noHighlightRe.test(a);
    }
    function B(a) {
      let b = a.className + " ";
      b += a.parentNode ? a.parentNode.className : "";
      const w = d.languageDetectRe.exec(b);
      if (w) {
        const S = ue(w[1]);
        return S || (je(O.replace("{}", w[1])), je("Falling back to no-highlight mode for this block.", a)), S ? w[1] : "no-highlight";
      }
      return b.split(/\s+/).find((S) => f(S) || ue(S));
    }
    function T(a, b, w) {
      let S = "", $ = "";
      typeof b == "object" ? (S = a, w = b.ignoreIllegals, $ = b.language) : (me("10.7.0", "highlight(lang, code, ...args) has been deprecated."), me("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), $ = a, S = b), w === void 0 && (w = !0);
      const re = {
        code: S,
        language: $
      };
      Ae("before:highlight", re);
      const he = re.result ? re.result : _e(re.language, re.code, w);
      return he.code = re.code, Ae("after:highlight", he), he;
    }
    function _e(a, b, w, S) {
      const $ = /* @__PURE__ */ Object.create(null);
      function re(l, g) {
        return l.keywords[g];
      }
      function he() {
        if (!v.keywords) {
          U.addText(A);
          return;
        }
        let l = 0;
        v.keywordPatternRe.lastIndex = 0;
        let g = v.keywordPatternRe.exec(A), x = "";
        for (; g; ) {
          x += A.substring(l, g.index);
          const k = se.case_insensitive ? g[0].toLowerCase() : g[0], Z = re(v, k);
          if (Z) {
            const [ce, Xt] = Z;
            if (U.addText(x), x = "", $[k] = ($[k] || 0) + 1, $[k] <= It && (Ce += Xt), ce.startsWith("_"))
              x += g[0];
            else {
              const Yt = se.classNameAliases[ce] || ce;
              ae(g[0], Yt);
            }
          } else
            x += g[0];
          l = v.keywordPatternRe.lastIndex, g = v.keywordPatternRe.exec(A);
        }
        x += A.substring(l), U.addText(x);
      }
      function Me() {
        if (A === "") return;
        let l = null;
        if (typeof v.subLanguage == "string") {
          if (!n[v.subLanguage]) {
            U.addText(A);
            return;
          }
          l = _e(v.subLanguage, A, !0, tt[v.subLanguage]), tt[v.subLanguage] = /** @type {CompiledMode} */
          l._top;
        } else
          l = Le(A, v.subLanguage.length ? v.subLanguage : null);
        v.relevance > 0 && (Ce += l.relevance), U.__addSublanguage(l._emitter, l.language);
      }
      function Q() {
        v.subLanguage != null ? Me() : he(), A = "";
      }
      function ae(l, g) {
        l !== "" && (U.startScope(g), U.addText(l), U.endScope());
      }
      function Ye(l, g) {
        let x = 1;
        const k = g.length - 1;
        for (; x <= k; ) {
          if (!l._emit[x]) {
            x++;
            continue;
          }
          const Z = se.classNameAliases[l[x]] || l[x], ce = g[x];
          Z ? ae(ce, Z) : (A = ce, he(), A = ""), x++;
        }
      }
      function Qe(l, g) {
        return l.scope && typeof l.scope == "string" && U.openNode(se.classNameAliases[l.scope] || l.scope), l.beginScope && (l.beginScope._wrap ? (ae(A, se.classNameAliases[l.beginScope._wrap] || l.beginScope._wrap), A = "") : l.beginScope._multi && (Ye(l.beginScope, g), A = "")), v = Object.create(l, { parent: { value: v } }), v;
      }
      function Je(l, g, x) {
        let k = le(l.endRe, x);
        if (k) {
          if (l["on:end"]) {
            const Z = new e(l);
            l["on:end"](g, Z), Z.isMatchIgnored && (k = !1);
          }
          if (k) {
            for (; l.endsParent && l.parent; )
              l = l.parent;
            return l;
          }
        }
        if (l.endsWithParent)
          return Je(l.parent, g, x);
      }
      function Zt(l) {
        return v.matcher.regexIndex === 0 ? (A += l[0], 1) : (Pe = !0, 0);
      }
      function Kt(l) {
        const g = l[0], x = l.rule, k = new e(x), Z = [x.__beforeBegin, x["on:begin"]];
        for (const ce of Z)
          if (ce && (ce(l, k), k.isMatchIgnored))
            return Zt(g);
        return x.skip ? A += g : (x.excludeBegin && (A += g), Q(), !x.returnBegin && !x.excludeBegin && (A = g)), Qe(x, l), x.returnBegin ? 0 : g.length;
      }
      function Wt(l) {
        const g = l[0], x = b.substring(l.index), k = Je(v, l, x);
        if (!k)
          return Ke;
        const Z = v;
        v.endScope && v.endScope._wrap ? (Q(), ae(g, v.endScope._wrap)) : v.endScope && v.endScope._multi ? (Q(), Ye(v.endScope, l)) : Z.skip ? A += g : (Z.returnEnd || Z.excludeEnd || (A += g), Q(), Z.excludeEnd && (A = g));
        do
          v.scope && U.closeNode(), !v.skip && !v.subLanguage && (Ce += v.relevance), v = v.parent;
        while (v !== k.parent);
        return k.starts && Qe(k.starts, l), Z.returnEnd ? 0 : g.length;
      }
      function qt() {
        const l = [];
        for (let g = v; g !== se; g = g.parent)
          g.scope && l.unshift(g.scope);
        l.forEach((g) => U.openNode(g));
      }
      let Ne = {};
      function et(l, g) {
        const x = g && g[0];
        if (A += l, x == null)
          return Q(), 0;
        if (Ne.type === "begin" && g.type === "end" && Ne.index === g.index && x === "") {
          if (A += b.slice(g.index, g.index + 1), !C) {
            const k = new Error(`0 width match regex (${a})`);
            throw k.languageName = a, k.badRule = Ne.rule, k;
          }
          return 1;
        }
        if (Ne = g, g.type === "begin")
          return Kt(g);
        if (g.type === "illegal" && !w) {
          const k = new Error('Illegal lexeme "' + x + '" for mode "' + (v.scope || "<unnamed>") + '"');
          throw k.mode = v, k;
        } else if (g.type === "end") {
          const k = Wt(g);
          if (k !== Ke)
            return k;
        }
        if (g.type === "illegal" && x === "")
          return A += `
`, 1;
        if (Be > 1e5 && Be > g.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return A += x, x.length;
      }
      const se = ue(a);
      if (!se)
        throw be(O.replace("{}", a)), new Error('Unknown language: "' + a + '"');
      const Vt = Ct(se);
      let De = "", v = S || Vt;
      const tt = {}, U = new d.__emitter(d);
      qt();
      let A = "", Ce = 0, pe = 0, Be = 0, Pe = !1;
      try {
        if (se.__emitTokens)
          se.__emitTokens(b, U);
        else {
          for (v.matcher.considerAll(); ; ) {
            Be++, Pe ? Pe = !1 : v.matcher.considerAll(), v.matcher.lastIndex = pe;
            const l = v.matcher.exec(b);
            if (!l) break;
            const g = b.substring(pe, l.index), x = et(g, l);
            pe = l.index + x;
          }
          et(b.substring(pe));
        }
        return U.finalize(), De = U.toHTML(), {
          language: a,
          value: De,
          relevance: Ce,
          illegal: !1,
          _emitter: U,
          _top: v
        };
      } catch (l) {
        if (l.message && l.message.includes("Illegal"))
          return {
            language: a,
            value: Te(b),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: l.message,
              index: pe,
              context: b.slice(pe - 100, pe + 100),
              mode: l.mode,
              resultSoFar: De
            },
            _emitter: U
          };
        if (C)
          return {
            language: a,
            value: Te(b),
            illegal: !1,
            relevance: 0,
            errorRaised: l,
            _emitter: U,
            _top: v
          };
        throw l;
      }
    }
    function Ie(a) {
      const b = {
        value: Te(a),
        illegal: !1,
        relevance: 0,
        _top: h,
        _emitter: new d.__emitter(d)
      };
      return b._emitter.addText(a), b;
    }
    function Le(a, b) {
      b = b || d.languages || Object.keys(n);
      const w = Ie(a), S = b.filter(ue).filter(Xe).map(
        (Q) => _e(Q, a, !1)
      );
      S.unshift(w);
      const $ = S.sort((Q, ae) => {
        if (Q.relevance !== ae.relevance) return ae.relevance - Q.relevance;
        if (Q.language && ae.language) {
          if (ue(Q.language).supersetOf === ae.language)
            return 1;
          if (ue(ae.language).supersetOf === Q.language)
            return -1;
        }
        return 0;
      }), [re, he] = $, Me = re;
      return Me.secondBest = he, Me;
    }
    function Lt(a, b, w) {
      const S = b && s[b] || w;
      a.classList.add("hljs"), a.classList.add(`language-${S}`);
    }
    function $e(a) {
      let b = null;
      const w = B(a);
      if (f(w)) return;
      if (Ae(
        "before:highlightElement",
        { el: a, language: w }
      ), a.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", a);
        return;
      }
      if (a.children.length > 0 && (d.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(a)), d.throwUnescapedHTML))
        throw new Tt(
          "One of your code blocks includes unescaped HTML.",
          a.innerHTML
        );
      b = a;
      const S = b.textContent, $ = w ? T(S, { language: w, ignoreIllegals: !0 }) : Le(S);
      a.innerHTML = $.value, a.dataset.highlighted = "yes", Lt(a, w, $.language), a.result = {
        language: $.language,
        // TODO: remove with version 11.0
        re: $.relevance,
        relevance: $.relevance
      }, $.secondBest && (a.secondBest = {
        language: $.secondBest.language,
        relevance: $.secondBest.relevance
      }), Ae("after:highlightElement", { el: a, result: $, text: S });
    }
    function $t(a) {
      d = Ze(d, a);
    }
    const Dt = () => {
      Se(), me("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Bt() {
      Se(), me("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let qe = !1;
    function Se() {
      function a() {
        Se();
      }
      if (document.readyState === "loading") {
        qe || window.addEventListener("DOMContentLoaded", a, !1), qe = !0;
        return;
      }
      document.querySelectorAll(d.cssSelector).forEach($e);
    }
    function Pt(a, b) {
      let w = null;
      try {
        w = b(t);
      } catch (S) {
        if (be("Language definition for '{}' could not be registered.".replace("{}", a)), C)
          be(S);
        else
          throw S;
        w = h;
      }
      w.name || (w.name = a), n[a] = w, w.rawDefinition = b.bind(null, t), w.aliases && Ve(w.aliases, { languageName: a });
    }
    function Ut(a) {
      delete n[a];
      for (const b of Object.keys(s))
        s[b] === a && delete s[b];
    }
    function Ht() {
      return Object.keys(n);
    }
    function ue(a) {
      return a = (a || "").toLowerCase(), n[a] || n[s[a]];
    }
    function Ve(a, { languageName: b }) {
      typeof a == "string" && (a = [a]), a.forEach((w) => {
        s[w.toLowerCase()] = b;
      });
    }
    function Xe(a) {
      const b = ue(a);
      return b && !b.disableAutodetect;
    }
    function zt(a) {
      a["before:highlightBlock"] && !a["before:highlightElement"] && (a["before:highlightElement"] = (b) => {
        a["before:highlightBlock"](
          Object.assign({ block: b.el }, b)
        );
      }), a["after:highlightBlock"] && !a["after:highlightElement"] && (a["after:highlightElement"] = (b) => {
        a["after:highlightBlock"](
          Object.assign({ block: b.el }, b)
        );
      });
    }
    function jt(a) {
      zt(a), m.push(a);
    }
    function Gt(a) {
      const b = m.indexOf(a);
      b !== -1 && m.splice(b, 1);
    }
    function Ae(a, b) {
      const w = a;
      m.forEach(function(S) {
        S[w] && S[w](b);
      });
    }
    function Ft(a) {
      return me("10.7.0", "highlightBlock will be removed entirely in v12.0"), me("10.7.0", "Please use highlightElement now."), $e(a);
    }
    Object.assign(t, {
      highlight: T,
      highlightAuto: Le,
      highlightAll: Se,
      highlightElement: $e,
      // TODO: Remove with v12 API
      highlightBlock: Ft,
      configure: $t,
      initHighlighting: Dt,
      initHighlightingOnLoad: Bt,
      registerLanguage: Pt,
      unregisterLanguage: Ut,
      listLanguages: Ht,
      getLanguage: ue,
      registerAliases: Ve,
      autoDetection: Xe,
      inherit: Ze,
      addPlugin: jt,
      removePlugin: Gt
    }), t.debugMode = function() {
      C = !1;
    }, t.safeMode = function() {
      C = !0;
    }, t.versionString = Rt, t.regex = {
      concat: L,
      lookahead: R,
      either: X,
      optional: z,
      anyNumberOfTimes: M
    };
    for (const a in ye)
      typeof ye[a] == "object" && o(ye[a]);
    return Object.assign(t, ye), t;
  }, ve = We({});
  return ve.newInstance = () => We({}), Ue = ve, ve.HighlightJS = ve, ve.default = ve, Ue;
}
var en = /* @__PURE__ */ Jt();
const I = /* @__PURE__ */ Qt(en), rt = "[A-Za-z$_][0-9A-Za-z$_]*", tn = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends",
  // It's reached stage 3, which is "recommended for implementation":
  "using"
], nn = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], it = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
], ot = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], at = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
], rn = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "global"
  // Node.js
], on = [].concat(
  at,
  it,
  ot
);
function st(o) {
  const e = o.regex, r = (P, { after: de }) => {
    const ge = "</" + P[0].slice(1);
    return P.input.indexOf(ge, de) !== -1;
  }, i = rt, c = {
    begin: "<>",
    end: "</>"
  }, u = /<[A-Za-z0-9\\._:-]+\s*\/>/, p = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (P, de) => {
      const ge = P[0].length + P.index, fe = P.input[ge];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        fe === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        fe === ","
      ) {
        de.ignoreMatch();
        return;
      }
      fe === ">" && (r(P, { after: ge }) || de.ignoreMatch());
      let Ee;
      const we = P.input.substring(ge);
      if (Ee = we.match(/^\s*=/)) {
        de.ignoreMatch();
        return;
      }
      if ((Ee = we.match(/^\s+extends\s+/)) && Ee.index === 0) {
        de.ignoreMatch();
        return;
      }
    }
  }, E = {
    $pattern: rt,
    keyword: tn,
    literal: nn,
    built_in: on,
    "variable.language": rn
  }, _ = "[0-9](_?[0-9])*", y = `\\.(${_})`, H = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", N = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${H})((${y})|\\.)?|(${y}))[eE][+-]?(${_})\\b` },
      { begin: `\\b(${H})\\b((${y})\\b|\\.)?|(${y})\\b` },
      // DecimalBigIntegerLiteral
      { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  }, R = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: E,
    contains: []
    // defined later
  }, M = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        o.BACKSLASH_ESCAPE,
        R
      ],
      subLanguage: "xml"
    }
  }, z = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        o.BACKSLASH_ESCAPE,
        R
      ],
      subLanguage: "css"
    }
  }, L = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        o.BACKSLASH_ESCAPE,
        R
      ],
      subLanguage: "graphql"
    }
  }, V = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      o.BACKSLASH_ESCAPE,
      R
    ]
  }, ee = {
    className: "comment",
    variants: [
      o.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: !0,
                  excludeBegin: !0,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: i + "(?=\\s*(-)|$)",
                  endsParent: !0,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      ),
      o.C_BLOCK_COMMENT_MODE,
      o.C_LINE_COMMENT_MODE
    ]
  }, le = [
    o.APOS_STRING_MODE,
    o.QUOTE_STRING_MODE,
    M,
    z,
    L,
    V,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    N
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  R.contains = le.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: E,
    contains: [
      "self"
    ].concat(le)
  });
  const te = [].concat(ee, R.contains), W = te.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: E,
      contains: ["self"].concat(te)
    }
  ]), q = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: E,
    contains: W
  }, ie = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          i,
          /\s+/,
          /extends/,
          /\s+/,
          e.concat(i, "(", e.concat(/\./, i), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          i
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, D = {
    relevance: 0,
    match: e.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...it,
        ...ot
      ]
    }
  }, Y = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, J = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          i,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [q],
    illegal: /%/
  }, ne = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function j(P) {
    return e.concat("(?!", P.join("|"), ")");
  }
  const G = {
    match: e.concat(
      /\b/,
      j([
        ...at,
        "super",
        "import"
      ].map((P) => `${P}\\s*\\(`)),
      i,
      e.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, F = {
    begin: e.concat(/\./, e.lookahead(
      e.concat(i, /(?![0-9A-Za-z$_(])/)
    )),
    end: i,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, K = {
    match: [
      /get|set/,
      /\s+/,
      i,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      q
    ]
  }, oe = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + o.UNDERSCORE_IDENT_RE + ")\\s*=>", Re = {
    match: [
      /const|var|let/,
      /\s+/,
      i,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      e.lookahead(oe)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      q
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: E,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: W, CLASS_REFERENCE: D },
    illegal: /#(?![$_A-z])/,
    contains: [
      o.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      Y,
      o.APOS_STRING_MODE,
      o.QUOTE_STRING_MODE,
      M,
      z,
      L,
      V,
      ee,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      N,
      D,
      {
        scope: "attr",
        match: i + e.lookahead(":"),
        relevance: 0
      },
      Re,
      {
        // "value" container
        begin: "(" + o.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          ee,
          o.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: oe,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: o.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: !0
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: E,
                    contains: W
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: c.begin, end: c.end },
              { match: u },
              {
                begin: p.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": p.isTrulyOpeningTag,
                end: p.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: p.begin,
                end: p.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      J,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + o.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          q,
          o.inherit(o.TITLE_MODE, { begin: i, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      F,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + i,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [q]
      },
      G,
      ne,
      ie,
      K,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const an = (o) => ({
  IMPORTANT: {
    scope: "meta",
    begin: "!important"
  },
  BLOCK_COMMENT: o.C_BLOCK_COMMENT_MODE,
  HEXCOLOR: {
    scope: "number",
    begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
  },
  FUNCTION_DISPATCH: {
    className: "built_in",
    begin: /[\w-]+(?=\()/
  },
  ATTRIBUTE_SELECTOR_MODE: {
    scope: "selector-attr",
    begin: /\[/,
    end: /\]/,
    illegal: "$",
    contains: [
      o.APOS_STRING_MODE,
      o.QUOTE_STRING_MODE
    ]
  },
  CSS_NUMBER_MODE: {
    scope: "number",
    begin: o.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
    relevance: 0
  },
  CSS_VARIABLE: {
    className: "attr",
    begin: /--[A-Za-z_][A-Za-z0-9_-]*/
  }
}), sn = [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "blockquote",
  "body",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "mark",
  "menu",
  "nav",
  "object",
  "ol",
  "optgroup",
  "option",
  "p",
  "picture",
  "q",
  "quote",
  "samp",
  "section",
  "select",
  "source",
  "span",
  "strong",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "ul",
  "var",
  "video"
], cn = [
  "defs",
  "g",
  "marker",
  "mask",
  "pattern",
  "svg",
  "switch",
  "symbol",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feFlood",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMorphology",
  "feOffset",
  "feSpecularLighting",
  "feTile",
  "feTurbulence",
  "linearGradient",
  "radialGradient",
  "stop",
  "circle",
  "ellipse",
  "image",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "text",
  "use",
  "textPath",
  "tspan",
  "foreignObject",
  "clipPath"
], ln = [
  ...sn,
  ...cn
], dn = [
  "any-hover",
  "any-pointer",
  "aspect-ratio",
  "color",
  "color-gamut",
  "color-index",
  "device-aspect-ratio",
  "device-height",
  "device-width",
  "display-mode",
  "forced-colors",
  "grid",
  "height",
  "hover",
  "inverted-colors",
  "monochrome",
  "orientation",
  "overflow-block",
  "overflow-inline",
  "pointer",
  "prefers-color-scheme",
  "prefers-contrast",
  "prefers-reduced-motion",
  "prefers-reduced-transparency",
  "resolution",
  "scan",
  "scripting",
  "update",
  "width",
  // TODO: find a better solution?
  "min-width",
  "max-width",
  "min-height",
  "max-height"
].sort().reverse(), un = [
  "active",
  "any-link",
  "blank",
  "checked",
  "current",
  "default",
  "defined",
  "dir",
  // dir()
  "disabled",
  "drop",
  "empty",
  "enabled",
  "first",
  "first-child",
  "first-of-type",
  "fullscreen",
  "future",
  "focus",
  "focus-visible",
  "focus-within",
  "has",
  // has()
  "host",
  // host or host()
  "host-context",
  // host-context()
  "hover",
  "indeterminate",
  "in-range",
  "invalid",
  "is",
  // is()
  "lang",
  // lang()
  "last-child",
  "last-of-type",
  "left",
  "link",
  "local-link",
  "not",
  // not()
  "nth-child",
  // nth-child()
  "nth-col",
  // nth-col()
  "nth-last-child",
  // nth-last-child()
  "nth-last-col",
  // nth-last-col()
  "nth-last-of-type",
  //nth-last-of-type()
  "nth-of-type",
  //nth-of-type()
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "past",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "target",
  "target-within",
  "user-invalid",
  "valid",
  "visited",
  "where"
  // where()
].sort().reverse(), hn = [
  "after",
  "backdrop",
  "before",
  "cue",
  "cue-region",
  "first-letter",
  "first-line",
  "grammar-error",
  "marker",
  "part",
  "placeholder",
  "selection",
  "slotted",
  "spelling-error"
].sort().reverse(), gn = [
  "accent-color",
  "align-content",
  "align-items",
  "align-self",
  "alignment-baseline",
  "all",
  "anchor-name",
  "animation",
  "animation-composition",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-range",
  "animation-range-end",
  "animation-range-start",
  "animation-timeline",
  "animation-timing-function",
  "appearance",
  "aspect-ratio",
  "backdrop-filter",
  "backface-visibility",
  "background",
  "background-attachment",
  "background-blend-mode",
  "background-clip",
  "background-color",
  "background-image",
  "background-origin",
  "background-position",
  "background-position-x",
  "background-position-y",
  "background-repeat",
  "background-size",
  "baseline-shift",
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-style",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-style",
  "border-block-start-width",
  "border-block-style",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-style",
  "border-bottom-width",
  "border-collapse",
  "border-color",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-image",
  "border-image-outset",
  "border-image-repeat",
  "border-image-slice",
  "border-image-source",
  "border-image-width",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-style",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-style",
  "border-inline-start-width",
  "border-inline-style",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-spacing",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-style",
  "border-top-width",
  "border-width",
  "bottom",
  "box-align",
  "box-decoration-break",
  "box-direction",
  "box-flex",
  "box-flex-group",
  "box-lines",
  "box-ordinal-group",
  "box-orient",
  "box-pack",
  "box-shadow",
  "box-sizing",
  "break-after",
  "break-before",
  "break-inside",
  "caption-side",
  "caret-color",
  "clear",
  "clip",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "color-scheme",
  "column-count",
  "column-fill",
  "column-gap",
  "column-rule",
  "column-rule-color",
  "column-rule-style",
  "column-rule-width",
  "column-span",
  "column-width",
  "columns",
  "contain",
  "contain-intrinsic-block-size",
  "contain-intrinsic-height",
  "contain-intrinsic-inline-size",
  "contain-intrinsic-size",
  "contain-intrinsic-width",
  "container",
  "container-name",
  "container-type",
  "content",
  "content-visibility",
  "counter-increment",
  "counter-reset",
  "counter-set",
  "cue",
  "cue-after",
  "cue-before",
  "cursor",
  "cx",
  "cy",
  "direction",
  "display",
  "dominant-baseline",
  "empty-cells",
  "enable-background",
  "field-sizing",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "float",
  "flood-color",
  "flood-opacity",
  "flow",
  "font",
  "font-display",
  "font-family",
  "font-feature-settings",
  "font-kerning",
  "font-language-override",
  "font-optical-sizing",
  "font-palette",
  "font-size",
  "font-size-adjust",
  "font-smooth",
  "font-smoothing",
  "font-stretch",
  "font-style",
  "font-synthesis",
  "font-synthesis-position",
  "font-synthesis-small-caps",
  "font-synthesis-style",
  "font-synthesis-weight",
  "font-variant",
  "font-variant-alternates",
  "font-variant-caps",
  "font-variant-east-asian",
  "font-variant-emoji",
  "font-variant-ligatures",
  "font-variant-numeric",
  "font-variant-position",
  "font-variation-settings",
  "font-weight",
  "forced-color-adjust",
  "gap",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "grid",
  "grid-area",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-gap",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "hanging-punctuation",
  "height",
  "hyphenate-character",
  "hyphenate-limit-chars",
  "hyphens",
  "icon",
  "image-orientation",
  "image-rendering",
  "image-resolution",
  "ime-mode",
  "initial-letter",
  "initial-letter-align",
  "inline-size",
  "inset",
  "inset-area",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "isolation",
  "justify-content",
  "justify-items",
  "justify-self",
  "kerning",
  "left",
  "letter-spacing",
  "lighting-color",
  "line-break",
  "line-height",
  "line-height-step",
  "list-style",
  "list-style-image",
  "list-style-position",
  "list-style-type",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin-trim",
  "marker",
  "marker-end",
  "marker-mid",
  "marker-start",
  "marks",
  "mask",
  "mask-border",
  "mask-border-mode",
  "mask-border-outset",
  "mask-border-repeat",
  "mask-border-slice",
  "mask-border-source",
  "mask-border-width",
  "mask-clip",
  "mask-composite",
  "mask-image",
  "mask-mode",
  "mask-origin",
  "mask-position",
  "mask-repeat",
  "mask-size",
  "mask-type",
  "masonry-auto-flow",
  "math-depth",
  "math-shift",
  "math-style",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "mix-blend-mode",
  "nav-down",
  "nav-index",
  "nav-left",
  "nav-right",
  "nav-up",
  "none",
  "normal",
  "object-fit",
  "object-position",
  "offset",
  "offset-anchor",
  "offset-distance",
  "offset-path",
  "offset-position",
  "offset-rotate",
  "opacity",
  "order",
  "orphans",
  "outline",
  "outline-color",
  "outline-offset",
  "outline-style",
  "outline-width",
  "overflow",
  "overflow-anchor",
  "overflow-block",
  "overflow-clip-margin",
  "overflow-inline",
  "overflow-wrap",
  "overflow-x",
  "overflow-y",
  "overlay",
  "overscroll-behavior",
  "overscroll-behavior-block",
  "overscroll-behavior-inline",
  "overscroll-behavior-x",
  "overscroll-behavior-y",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "page",
  "page-break-after",
  "page-break-before",
  "page-break-inside",
  "paint-order",
  "pause",
  "pause-after",
  "pause-before",
  "perspective",
  "perspective-origin",
  "place-content",
  "place-items",
  "place-self",
  "pointer-events",
  "position",
  "position-anchor",
  "position-visibility",
  "print-color-adjust",
  "quotes",
  "r",
  "resize",
  "rest",
  "rest-after",
  "rest-before",
  "right",
  "rotate",
  "row-gap",
  "ruby-align",
  "ruby-position",
  "scale",
  "scroll-behavior",
  "scroll-margin",
  "scroll-margin-block",
  "scroll-margin-block-end",
  "scroll-margin-block-start",
  "scroll-margin-bottom",
  "scroll-margin-inline",
  "scroll-margin-inline-end",
  "scroll-margin-inline-start",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-margin-top",
  "scroll-padding",
  "scroll-padding-block",
  "scroll-padding-block-end",
  "scroll-padding-block-start",
  "scroll-padding-bottom",
  "scroll-padding-inline",
  "scroll-padding-inline-end",
  "scroll-padding-inline-start",
  "scroll-padding-left",
  "scroll-padding-right",
  "scroll-padding-top",
  "scroll-snap-align",
  "scroll-snap-stop",
  "scroll-snap-type",
  "scroll-timeline",
  "scroll-timeline-axis",
  "scroll-timeline-name",
  "scrollbar-color",
  "scrollbar-gutter",
  "scrollbar-width",
  "shape-image-threshold",
  "shape-margin",
  "shape-outside",
  "shape-rendering",
  "speak",
  "speak-as",
  "src",
  // @font-face
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "table-layout",
  "text-align",
  "text-align-all",
  "text-align-last",
  "text-anchor",
  "text-combine-upright",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-skip",
  "text-decoration-skip-ink",
  "text-decoration-style",
  "text-decoration-thickness",
  "text-emphasis",
  "text-emphasis-color",
  "text-emphasis-position",
  "text-emphasis-style",
  "text-indent",
  "text-justify",
  "text-orientation",
  "text-overflow",
  "text-rendering",
  "text-shadow",
  "text-size-adjust",
  "text-transform",
  "text-underline-offset",
  "text-underline-position",
  "text-wrap",
  "text-wrap-mode",
  "text-wrap-style",
  "timeline-scope",
  "top",
  "touch-action",
  "transform",
  "transform-box",
  "transform-origin",
  "transform-style",
  "transition",
  "transition-behavior",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "translate",
  "unicode-bidi",
  "user-modify",
  "user-select",
  "vector-effect",
  "vertical-align",
  "view-timeline",
  "view-timeline-axis",
  "view-timeline-inset",
  "view-timeline-name",
  "view-transition-name",
  "visibility",
  "voice-balance",
  "voice-duration",
  "voice-family",
  "voice-pitch",
  "voice-range",
  "voice-rate",
  "voice-stress",
  "voice-volume",
  "white-space",
  "white-space-collapse",
  "widows",
  "width",
  "will-change",
  "word-break",
  "word-spacing",
  "word-wrap",
  "writing-mode",
  "x",
  "y",
  "z-index",
  "zoom"
].sort().reverse();
function bn(o) {
  const e = o.regex, r = an(o), i = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ }, c = "and or not only", u = /@-?\w[\w]*(-\w+)*/, p = "[a-zA-Z-][a-zA-Z0-9_-]*", E = [
    o.APOS_STRING_MODE,
    o.QUOTE_STRING_MODE
  ];
  return {
    name: "CSS",
    case_insensitive: !0,
    illegal: /[=|'\$]/,
    keywords: { keyframePosition: "from to" },
    classNameAliases: {
      // for visual continuity with `tag {}` and because we
      // don't have a great class for this?
      keyframePosition: "selector-tag"
    },
    contains: [
      r.BLOCK_COMMENT,
      i,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      r.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\." + p,
        relevance: 0
      },
      r.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-pseudo",
        variants: [
          { begin: ":(" + un.join("|") + ")" },
          { begin: ":(:)?(" + hn.join("|") + ")" }
        ]
      },
      // we may actually need this (12/2020)
      // { // pseudo-selector params
      //   begin: /\(/,
      //   end: /\)/,
      //   contains: [ hljs.CSS_NUMBER_MODE ]
      // },
      r.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + gn.join("|") + ")\\b"
      },
      // attribute values
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          r.BLOCK_COMMENT,
          r.HEXCOLOR,
          r.IMPORTANT,
          r.CSS_NUMBER_MODE,
          ...E,
          // needed to highlight these as strings and to avoid issues with
          // illegal characters that might be inside urls that would tigger the
          // languages illegal stack
          {
            begin: /(url|data-uri)\(/,
            end: /\)/,
            relevance: 0,
            // from keywords
            keywords: { built_in: "url data-uri" },
            contains: [
              ...E,
              {
                className: "string",
                // any character other than `)` as in `url()` will be the start
                // of a string, which ends with `)` (from the parent mode)
                begin: /[^)]/,
                endsWithParent: !0,
                excludeEnd: !0
              }
            ]
          },
          r.FUNCTION_DISPATCH
        ]
      },
      {
        begin: e.lookahead(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        // break on Less variables @var: ...
        contains: [
          {
            className: "keyword",
            begin: u
          },
          {
            begin: /\s/,
            endsWithParent: !0,
            excludeEnd: !0,
            relevance: 0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: c,
              attribute: dn.join(" ")
            },
            contains: [
              {
                begin: /[a-z-]+(?=:)/,
                className: "attribute"
              },
              ...E,
              r.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: "selector-tag",
        begin: "\\b(" + ln.join("|") + ")\\b"
      }
    ]
  };
}
function xe(o) {
  const e = o.regex, r = e.concat(/[\p{L}_]/u, e.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), i = /[\p{L}0-9._:-]+/u, c = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  }, u = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  }, p = o.inherit(u, {
    begin: /\(/,
    end: /\)/
  }), E = o.inherit(o.APOS_STRING_MODE, { className: "string" }), _ = o.inherit(o.QUOTE_STRING_MODE, { className: "string" }), y = {
    endsWithParent: !0,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: "attr",
        begin: i,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: "string",
            endsParent: !0,
            variants: [
              {
                begin: /"/,
                end: /"/,
                contains: [c]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [c]
              },
              { begin: /[^\s"'=<>`]+/ }
            ]
          }
        ]
      }
    ]
  };
  return {
    name: "HTML, XML",
    aliases: [
      "html",
      "xhtml",
      "rss",
      "atom",
      "xjb",
      "xsd",
      "xsl",
      "plist",
      "wsf",
      "svg"
    ],
    case_insensitive: !0,
    unicodeRegex: !0,
    contains: [
      {
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          u,
          _,
          E,
          p,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  u,
                  p,
                  _,
                  E
                ]
              }
            ]
          }
        ]
      },
      o.COMMENT(
        /<!--/,
        /-->/,
        { relevance: 10 }
      ),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      c,
      // xml processing instructions
      {
        className: "meta",
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              _
            ]
          },
          {
            begin: /<\?[a-z][a-z0-9]+/
          }
        ]
      },
      {
        className: "tag",
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending bracket.
        */
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [y],
        starts: {
          end: /<\/style>/,
          returnEnd: !0,
          subLanguage: [
            "css",
            "xml"
          ]
        }
      },
      {
        className: "tag",
        // See the comment in the <style tag about the lookahead pattern
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [y],
        starts: {
          end: /<\/script>/,
          returnEnd: !0,
          subLanguage: [
            "javascript",
            "handlebars",
            "xml"
          ]
        }
      },
      // we need this for now for jSX
      {
        className: "tag",
        begin: /<>|<\/>/
      },
      // open tag
      {
        className: "tag",
        begin: e.concat(
          /</,
          e.lookahead(e.concat(
            r,
            // <tag/>
            // <tag>
            // <tag ...
            e.either(/\/>/, />/, /\s/)
          ))
        ),
        end: /\/?>/,
        contains: [
          {
            className: "name",
            begin: r,
            relevance: 0,
            starts: y
          }
        ]
      },
      // close tag
      {
        className: "tag",
        begin: e.concat(
          /<\//,
          e.lookahead(e.concat(
            r,
            />/
          ))
        ),
        contains: [
          {
            className: "name",
            begin: r,
            relevance: 0
          },
          {
            begin: />/,
            relevance: 0,
            endsParent: !0
          }
        ]
      }
    ]
  };
}
function pn(o) {
  const e = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  }, r = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, i = [
    "true",
    "false",
    "null"
  ], c = {
    scope: "literal",
    beginKeywords: i.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: i
    },
    contains: [
      e,
      r,
      o.QUOTE_STRING_MODE,
      c,
      o.C_NUMBER_MODE,
      o.C_LINE_COMMENT_MODE,
      o.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function ct(o) {
  const e = "true false yes no null", r = "[\\w#;/?:@&=+$,.~*'()[\\]]+", i = {
    className: "attr",
    variants: [
      // added brackets support and special char support
      { begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
      {
        // double quoted keys - with brackets and special char support
        begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/
      },
      {
        // single quoted keys - with brackets and special char support
        begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/
      }
    ]
  }, c = {
    className: "template-variable",
    variants: [
      {
        // jinja templates Ansible
        begin: /\{\{/,
        end: /\}\}/
      },
      {
        // Ruby i18n
        begin: /%\{/,
        end: /\}/
      }
    ]
  }, u = {
    className: "string",
    relevance: 0,
    begin: /'/,
    end: /'/,
    contains: [
      {
        match: /''/,
        scope: "char.escape",
        relevance: 0
      }
    ]
  }, p = {
    className: "string",
    relevance: 0,
    variants: [
      {
        begin: /"/,
        end: /"/
      },
      { begin: /\S+/ }
    ],
    contains: [
      o.BACKSLASH_ESCAPE,
      c
    ]
  }, E = o.inherit(p, { variants: [
    {
      begin: /'/,
      end: /'/,
      contains: [
        {
          begin: /''/,
          relevance: 0
        }
      ]
    },
    {
      begin: /"/,
      end: /"/
    },
    { begin: /[^\s,{}[\]]+/ }
  ] }), R = {
    className: "number",
    begin: "\\b" + "[0-9]{4}(-[0-9][0-9]){0,2}" + "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?" + "(\\.[0-9]*)?" + "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?" + "\\b"
  }, M = {
    end: ",",
    endsWithParent: !0,
    excludeEnd: !0,
    keywords: e,
    relevance: 0
  }, z = {
    begin: /\{/,
    end: /\}/,
    contains: [M],
    illegal: "\\n",
    relevance: 0
  }, L = {
    begin: "\\[",
    end: "\\]",
    contains: [M],
    illegal: "\\n",
    relevance: 0
  }, V = [
    i,
    {
      className: "meta",
      begin: "^---\\s*$",
      relevance: 10
    },
    {
      // multi line string
      // Blocks start with a | or > followed by a newline
      //
      // Indentation of subsequent lines must be the same to
      // be considered part of the block
      className: "string",
      begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
    },
    {
      // Ruby/Rails erb
      begin: "<%[%=-]?",
      end: "[%-]?%>",
      subLanguage: "ruby",
      excludeBegin: !0,
      excludeEnd: !0,
      relevance: 0
    },
    {
      // named tags
      className: "type",
      begin: "!\\w+!" + r
    },
    // https://yaml.org/spec/1.2/spec.html#id2784064
    {
      // verbatim tags
      className: "type",
      begin: "!<" + r + ">"
    },
    {
      // primary tags
      className: "type",
      begin: "!" + r
    },
    {
      // secondary tags
      className: "type",
      begin: "!!" + r
    },
    {
      // fragment id &ref
      className: "meta",
      begin: "&" + o.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // fragment reference *ref
      className: "meta",
      begin: "\\*" + o.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // array listing
      className: "bullet",
      // TODO: remove |$ hack when we have proper look-ahead support
      begin: "-(?=[ ]|$)",
      relevance: 0
    },
    o.HASH_COMMENT_MODE,
    {
      beginKeywords: e,
      keywords: { literal: e }
    },
    R,
    // numbers are any valid C-style number that
    // sit isolated from other words
    {
      className: "number",
      begin: o.C_NUMBER_RE + "\\b",
      relevance: 0
    },
    z,
    L,
    u,
    p
  ], X = [...V];
  return X.pop(), X.push(E), M.contains = X, {
    name: "YAML",
    case_insensitive: !0,
    aliases: ["yml"],
    contains: V
  };
}
function fn(o) {
  const e = o.regex, r = /(?![A-Za-z0-9])(?![$])/, i = e.concat(
    /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,
    r
  ), c = e.concat(
    /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
    r
  ), u = e.concat(
    /[A-Z]+/,
    r
  ), p = {
    scope: "variable",
    match: "\\$+" + i
  }, E = {
    scope: "meta",
    variants: [
      { begin: /<\?php/, relevance: 10 },
      // boost for obvious PHP
      { begin: /<\?=/ },
      // less relevant per PSR-1 which says not to use short-tags
      { begin: /<\?/, relevance: 0.1 },
      { begin: /\?>/ }
      // end php tag
    ]
  }, _ = {
    scope: "subst",
    variants: [
      { begin: /\$\w+/ },
      {
        begin: /\{\$/,
        end: /\}/
      }
    ]
  }, y = o.inherit(o.APOS_STRING_MODE, { illegal: null }), H = o.inherit(o.QUOTE_STRING_MODE, {
    illegal: null,
    contains: o.QUOTE_STRING_MODE.contains.concat(_)
  }), N = {
    begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
    end: /[ \t]*(\w+)\b/,
    contains: o.QUOTE_STRING_MODE.contains.concat(_),
    "on:begin": (F, K) => {
      K.data._beginMatch = F[1] || F[2];
    },
    "on:end": (F, K) => {
      K.data._beginMatch !== F[1] && K.ignoreMatch();
    }
  }, R = o.END_SAME_AS_BEGIN({
    begin: /<<<[ \t]*'(\w+)'\n/,
    end: /[ \t]*(\w+)\b/
  }), M = `[ 	
]`, z = {
    scope: "string",
    variants: [
      H,
      y,
      N,
      R
    ]
  }, L = {
    scope: "number",
    variants: [
      { begin: "\\b0[bB][01]+(?:_[01]+)*\\b" },
      // Binary w/ underscore support
      { begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b" },
      // Octals w/ underscore support
      { begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b" },
      // Hex w/ underscore support
      // Decimals w/ underscore support, with optional fragments and scientific exponent (e) suffix.
      { begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?" }
    ],
    relevance: 0
  }, V = [
    "false",
    "null",
    "true"
  ], X = [
    // Magic constants:
    // <https://www.php.net/manual/en/language.constants.predefined.php>
    "__CLASS__",
    "__DIR__",
    "__FILE__",
    "__FUNCTION__",
    "__COMPILER_HALT_OFFSET__",
    "__LINE__",
    "__METHOD__",
    "__NAMESPACE__",
    "__TRAIT__",
    // Function that look like language construct or language construct that look like function:
    // List of keywords that may not require parenthesis
    "die",
    "echo",
    "exit",
    "include",
    "include_once",
    "print",
    "require",
    "require_once",
    // These are not language construct (function) but operate on the currently-executing function and can access the current symbol table
    // 'compact extract func_get_arg func_get_args func_num_args get_called_class get_parent_class ' +
    // Other keywords:
    // <https://www.php.net/manual/en/reserved.php>
    // <https://www.php.net/manual/en/language.types.type-juggling.php>
    "array",
    "abstract",
    "and",
    "as",
    "binary",
    "bool",
    "boolean",
    "break",
    "callable",
    "case",
    "catch",
    "class",
    "clone",
    "const",
    "continue",
    "declare",
    "default",
    "do",
    "double",
    "else",
    "elseif",
    "empty",
    "enddeclare",
    "endfor",
    "endforeach",
    "endif",
    "endswitch",
    "endwhile",
    "enum",
    "eval",
    "extends",
    "final",
    "finally",
    "float",
    "for",
    "foreach",
    "from",
    "global",
    "goto",
    "if",
    "implements",
    "instanceof",
    "insteadof",
    "int",
    "integer",
    "interface",
    "isset",
    "iterable",
    "list",
    "match|0",
    "mixed",
    "new",
    "never",
    "object",
    "or",
    "private",
    "protected",
    "public",
    "readonly",
    "real",
    "return",
    "string",
    "switch",
    "throw",
    "trait",
    "try",
    "unset",
    "use",
    "var",
    "void",
    "while",
    "xor",
    "yield"
  ], ee = [
    // Standard PHP library:
    // <https://www.php.net/manual/en/book.spl.php>
    "Error|0",
    "AppendIterator",
    "ArgumentCountError",
    "ArithmeticError",
    "ArrayIterator",
    "ArrayObject",
    "AssertionError",
    "BadFunctionCallException",
    "BadMethodCallException",
    "CachingIterator",
    "CallbackFilterIterator",
    "CompileError",
    "Countable",
    "DirectoryIterator",
    "DivisionByZeroError",
    "DomainException",
    "EmptyIterator",
    "ErrorException",
    "Exception",
    "FilesystemIterator",
    "FilterIterator",
    "GlobIterator",
    "InfiniteIterator",
    "InvalidArgumentException",
    "IteratorIterator",
    "LengthException",
    "LimitIterator",
    "LogicException",
    "MultipleIterator",
    "NoRewindIterator",
    "OutOfBoundsException",
    "OutOfRangeException",
    "OuterIterator",
    "OverflowException",
    "ParentIterator",
    "ParseError",
    "RangeException",
    "RecursiveArrayIterator",
    "RecursiveCachingIterator",
    "RecursiveCallbackFilterIterator",
    "RecursiveDirectoryIterator",
    "RecursiveFilterIterator",
    "RecursiveIterator",
    "RecursiveIteratorIterator",
    "RecursiveRegexIterator",
    "RecursiveTreeIterator",
    "RegexIterator",
    "RuntimeException",
    "SeekableIterator",
    "SplDoublyLinkedList",
    "SplFileInfo",
    "SplFileObject",
    "SplFixedArray",
    "SplHeap",
    "SplMaxHeap",
    "SplMinHeap",
    "SplObjectStorage",
    "SplObserver",
    "SplPriorityQueue",
    "SplQueue",
    "SplStack",
    "SplSubject",
    "SplTempFileObject",
    "TypeError",
    "UnderflowException",
    "UnexpectedValueException",
    "UnhandledMatchError",
    // Reserved interfaces:
    // <https://www.php.net/manual/en/reserved.interfaces.php>
    "ArrayAccess",
    "BackedEnum",
    "Closure",
    "Fiber",
    "Generator",
    "Iterator",
    "IteratorAggregate",
    "Serializable",
    "Stringable",
    "Throwable",
    "Traversable",
    "UnitEnum",
    "WeakReference",
    "WeakMap",
    // Reserved classes:
    // <https://www.php.net/manual/en/reserved.classes.php>
    "Directory",
    "__PHP_Incomplete_Class",
    "parent",
    "php_user_filter",
    "self",
    "static",
    "stdClass"
  ], te = {
    keyword: X,
    literal: ((F) => {
      const K = [];
      return F.forEach((oe) => {
        K.push(oe), oe.toLowerCase() === oe ? K.push(oe.toUpperCase()) : K.push(oe.toLowerCase());
      }), K;
    })(V),
    built_in: ee
  }, W = (F) => F.map((K) => K.replace(/\|\d+$/, "")), q = { variants: [
    {
      match: [
        /new/,
        e.concat(M, "+"),
        // to prevent built ins from being confused as the class constructor call
        e.concat("(?!", W(ee).join("\\b|"), "\\b)"),
        c
      ],
      scope: {
        1: "keyword",
        4: "title.class"
      }
    }
  ] }, ie = e.concat(i, "\\b(?!\\()"), D = { variants: [
    {
      match: [
        e.concat(
          /::/,
          e.lookahead(/(?!class\b)/)
        ),
        ie
      ],
      scope: { 2: "variable.constant" }
    },
    {
      match: [
        /::/,
        /class/
      ],
      scope: { 2: "variable.language" }
    },
    {
      match: [
        c,
        e.concat(
          /::/,
          e.lookahead(/(?!class\b)/)
        ),
        ie
      ],
      scope: {
        1: "title.class",
        3: "variable.constant"
      }
    },
    {
      match: [
        c,
        e.concat(
          "::",
          e.lookahead(/(?!class\b)/)
        )
      ],
      scope: { 1: "title.class" }
    },
    {
      match: [
        c,
        /::/,
        /class/
      ],
      scope: {
        1: "title.class",
        3: "variable.language"
      }
    }
  ] }, Y = {
    scope: "attr",
    match: e.concat(i, e.lookahead(":"), e.lookahead(/(?!::)/))
  }, J = {
    relevance: 0,
    begin: /\(/,
    end: /\)/,
    keywords: te,
    contains: [
      Y,
      p,
      D,
      o.C_BLOCK_COMMENT_MODE,
      z,
      L,
      q
    ]
  }, ne = {
    relevance: 0,
    match: [
      /\b/,
      // to prevent keywords from being confused as the function title
      e.concat("(?!fn\\b|function\\b|", W(X).join("\\b|"), "|", W(ee).join("\\b|"), "\\b)"),
      i,
      e.concat(M, "*"),
      e.lookahead(/(?=\()/)
    ],
    scope: { 3: "title.function.invoke" },
    contains: [J]
  };
  J.contains.push(ne);
  const j = [
    Y,
    D,
    o.C_BLOCK_COMMENT_MODE,
    z,
    L,
    q
  ], G = {
    begin: e.concat(
      /#\[\s*\\?/,
      e.either(
        c,
        u
      )
    ),
    beginScope: "meta",
    end: /]/,
    endScope: "meta",
    keywords: {
      literal: V,
      keyword: [
        "new",
        "array"
      ]
    },
    contains: [
      {
        begin: /\[/,
        end: /]/,
        keywords: {
          literal: V,
          keyword: [
            "new",
            "array"
          ]
        },
        contains: [
          "self",
          ...j
        ]
      },
      ...j,
      {
        scope: "meta",
        variants: [
          { match: c },
          { match: u }
        ]
      }
    ]
  };
  return {
    case_insensitive: !1,
    keywords: te,
    contains: [
      G,
      o.HASH_COMMENT_MODE,
      o.COMMENT("//", "$"),
      o.COMMENT(
        "/\\*",
        "\\*/",
        { contains: [
          {
            scope: "doctag",
            match: "@[A-Za-z]+"
          }
        ] }
      ),
      {
        match: /__halt_compiler\(\);/,
        keywords: "__halt_compiler",
        starts: {
          scope: "comment",
          end: o.MATCH_NOTHING_RE,
          contains: [
            {
              match: /\?>/,
              scope: "meta",
              endsParent: !0
            }
          ]
        }
      },
      E,
      {
        scope: "variable.language",
        match: /\$this\b/
      },
      p,
      ne,
      D,
      {
        match: [
          /const/,
          /\s/,
          i
        ],
        scope: {
          1: "keyword",
          3: "variable.constant"
        }
      },
      q,
      {
        scope: "function",
        relevance: 0,
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: !0,
        illegal: "[$%\\[]",
        contains: [
          { beginKeywords: "use" },
          o.UNDERSCORE_TITLE_MODE,
          {
            begin: "=>",
            // No markup, just a relevance booster
            endsParent: !0
          },
          {
            scope: "params",
            begin: "\\(",
            end: "\\)",
            excludeBegin: !0,
            excludeEnd: !0,
            keywords: te,
            contains: [
              "self",
              G,
              p,
              D,
              o.C_BLOCK_COMMENT_MODE,
              z,
              L
            ]
          }
        ]
      },
      {
        scope: "class",
        variants: [
          {
            beginKeywords: "enum",
            illegal: /[($"]/
          },
          {
            beginKeywords: "class interface trait",
            illegal: /[:($"]/
          }
        ],
        relevance: 0,
        end: /\{/,
        excludeEnd: !0,
        contains: [
          { beginKeywords: "extends implements" },
          o.UNDERSCORE_TITLE_MODE
        ]
      },
      // both use and namespace still use "old style" rules (vs multi-match)
      // because the namespace name can include `\` and we still want each
      // element to be treated as its own *individual* title
      {
        beginKeywords: "namespace",
        relevance: 0,
        end: ";",
        illegal: /[.']/,
        contains: [o.inherit(o.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
      },
      {
        beginKeywords: "use",
        relevance: 0,
        end: ";",
        contains: [
          // TODO: title.function vs title.class
          {
            match: /\b(as|const|function)\b/,
            scope: "keyword"
          },
          // TODO: could be title.class or title.function
          o.UNDERSCORE_TITLE_MODE
        ]
      },
      z,
      L
    ]
  };
}
function mn(o) {
  const e = o.regex, r = "HTTP/([32]|1\\.[01])", i = /[A-Za-z][A-Za-z0-9-]*/, c = {
    className: "attribute",
    begin: e.concat("^", i, "(?=\\:\\s)"),
    starts: { contains: [
      {
        className: "punctuation",
        begin: /: /,
        relevance: 0,
        starts: {
          end: "$",
          relevance: 0
        }
      }
    ] }
  }, u = [
    c,
    {
      begin: "\\n\\n",
      starts: {
        subLanguage: [],
        endsWithParent: !0
      }
    }
  ];
  return {
    name: "HTTP",
    aliases: ["https"],
    illegal: /\S/,
    contains: [
      // response
      {
        begin: "^(?=" + r + " \\d{3})",
        end: /$/,
        contains: [
          {
            className: "meta",
            begin: r
          },
          {
            className: "number",
            begin: "\\b\\d{3}\\b"
          }
        ],
        starts: {
          end: /\b\B/,
          illegal: /\S/,
          contains: u
        }
      },
      // request
      {
        begin: "(?=^[A-Z]+ (.*?) " + r + "$)",
        end: /$/,
        contains: [
          {
            className: "string",
            begin: " ",
            end: " ",
            excludeBegin: !0,
            excludeEnd: !0
          },
          {
            className: "meta",
            begin: r
          },
          {
            className: "keyword",
            begin: "[A-Z]+"
          }
        ],
        starts: {
          end: /\b\B/,
          illegal: /\S/,
          contains: u
        }
      },
      // to allow headers to work even without a preamble
      o.inherit(c, { relevance: 0 })
    ]
  };
}
function Oe(o) {
  return {
    name: "Plain text",
    aliases: [
      "text",
      "txt"
    ],
    disableAutodetect: !0
  };
}
function vn(o) {
  const e = o.regex;
  return {
    name: "Diff",
    aliases: ["patch"],
    contains: [
      {
        className: "meta",
        relevance: 10,
        match: e.either(
          /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
          /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
          /^--- +\d+,\d+ +----$/
        )
      },
      {
        className: "comment",
        variants: [
          {
            begin: e.either(
              /Index: /,
              /^index/,
              /={3,}/,
              /^-{3}/,
              /^\*{3} /,
              /^\+{3}/,
              /^diff --git/
            ),
            end: /$/
          },
          { match: /^\*{15}$/ }
        ]
      },
      {
        className: "addition",
        begin: /^\+/,
        end: /$/
      },
      {
        className: "deletion",
        begin: /^-/,
        end: /$/
      },
      {
        className: "addition",
        begin: /^!/,
        end: /$/
      }
    ]
  };
}
I.registerLanguage("javascript", st);
I.registerLanguage("js", st);
I.registerLanguage("css", bn);
I.registerLanguage("html", xe);
I.registerLanguage("xml", xe);
I.registerLanguage("xhtml", xe);
I.registerLanguage("svg", xe);
I.registerLanguage("markup", xe);
I.registerLanguage("json", pn);
I.registerLanguage("yaml", ct);
I.registerLanguage("yml", ct);
I.registerLanguage("php", fn);
I.registerLanguage("http", mn);
I.registerLanguage("plaintext", Oe);
I.registerLanguage("text", Oe);
I.registerLanguage("txt", Oe);
I.registerLanguage("csv", Oe);
I.registerLanguage("diff", vn);
class En extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._codeContent = null, this._showShareMenu = !1, this._handleOutsideClick = this._handleOutsideClick.bind(this), this._observer = null, this._highlighted = !1;
  }
  connectedCallback() {
    this._codeContent = this.textContent, this.hasAttribute("lazy") ? (this.renderPlaceholder(), this._setupLazyObserver()) : this.render();
  }
  disconnectedCallback() {
    this._observer && (this._observer.disconnect(), this._observer = null), document.removeEventListener("click", this._handleOutsideClick);
  }
  /**
   * Set up IntersectionObserver for lazy highlighting
   */
  _setupLazyObserver() {
    this._observer || (this._observer = new IntersectionObserver(
      (e) => {
        e[0].isIntersecting && !this._highlighted && (this._highlighted = !0, this.render(), this._observer.disconnect(), this._observer = null);
      },
      { rootMargin: "100px" }
      // Start loading slightly before visible
    ), this._observer.observe(this));
  }
  static get observedAttributes() {
    return ["language", "label", "theme", "show-lines", "filename", "highlight-lines", "collapsed", "max-lines", "max-height", "wrap", "copy-text", "copied-text", "show-share", "show-download", "lazy"];
  }
  attributeChangedCallback(e, r, i) {
    this.shadowRoot && r !== i && this.render();
  }
  get language() {
    return this.getAttribute("language") || "plaintext";
  }
  get label() {
    return this.getAttribute("label") || this.filename || this.language.toUpperCase();
  }
  get theme() {
    return this.getAttribute("theme") || "light";
  }
  get showLines() {
    return this.hasAttribute("show-lines");
  }
  get filename() {
    return this.getAttribute("filename") || "";
  }
  get highlightLines() {
    const e = this.getAttribute("highlight-lines");
    if (!e) return /* @__PURE__ */ new Set();
    const r = /* @__PURE__ */ new Set(), i = e.split(",");
    for (const c of i) {
      const u = c.trim();
      if (u.includes("-")) {
        const [p, E] = u.split("-").map(Number);
        for (let _ = p; _ <= E; _++)
          r.add(_);
      } else
        r.add(Number(u));
    }
    return r;
  }
  get collapsed() {
    return this.hasAttribute("collapsed");
  }
  get maxLines() {
    const e = this.getAttribute("max-lines");
    return e ? parseInt(e, 10) : 10;
  }
  get maxHeight() {
    return this.getAttribute("max-height") || "";
  }
  get wrap() {
    return this.hasAttribute("wrap");
  }
  get copyText() {
    return this.getAttribute("copy-text") || "Copy";
  }
  get copiedText() {
    return this.getAttribute("copied-text") || "Copied!";
  }
  get showShare() {
    return this.hasAttribute("show-share");
  }
  get showDownload() {
    return this.hasAttribute("show-download");
  }
  get lazy() {
    return this.hasAttribute("lazy");
  }
  async copyCode() {
    const e = (this._codeContent || this.textContent).trim(), r = document.createElement("div");
    r.innerHTML = e;
    const i = r.textContent, c = this.shadowRoot.querySelector(".copy-button"), u = this.copyText, p = this.copiedText;
    try {
      await navigator.clipboard.writeText(i), c.textContent = p, c.classList.add("copied"), c.setAttribute("aria-label", "Code copied to clipboard");
    } catch (E) {
      console.error("Failed to copy code:", E), c.textContent = "Failed", c.classList.add("failed"), c.setAttribute("aria-label", "Failed to copy code");
    }
    setTimeout(() => {
      c.textContent = u, c.classList.remove("copied", "failed"), c.setAttribute("aria-label", "Copy code to clipboard");
    }, 2e3);
  }
  /**
   * Download code as a file
   */
  downloadCode() {
    const e = this.getCode(), r = this.filename || `code.${this._getFileExtension()}`, i = new Blob([e], { type: "text/plain" }), c = URL.createObjectURL(i), u = document.createElement("a");
    u.href = c, u.download = r, document.body.appendChild(u), u.click(), document.body.removeChild(u), URL.revokeObjectURL(c);
  }
  /**
   * Get file extension based on language
   */
  _getFileExtension() {
    return {
      javascript: "js",
      js: "js",
      typescript: "ts",
      ts: "ts",
      html: "html",
      markup: "html",
      css: "css",
      json: "json",
      yaml: "yml",
      yml: "yml",
      php: "php",
      xml: "xml",
      xhtml: "xhtml",
      svg: "svg",
      http: "http",
      diff: "diff",
      csv: "csv",
      plaintext: "txt",
      text: "txt",
      txt: "txt"
    }[this.language] || "txt";
  }
  /**
   * Toggle share menu visibility
   */
  toggleShareMenu() {
    this._showShareMenu = !this._showShareMenu;
    const e = this.shadowRoot.querySelector(".share-menu"), r = this.shadowRoot.querySelector(".share-button");
    this._showShareMenu ? (e.style.display = "block", r.classList.add("active"), setTimeout(() => {
      document.addEventListener("click", this._handleOutsideClick);
    }, 0)) : (e.style.display = "none", r.classList.remove("active"), document.removeEventListener("click", this._handleOutsideClick));
  }
  _handleOutsideClick(e) {
    const r = this.shadowRoot.querySelector(".share-menu");
    r && !r.contains(e.target) && this.toggleShareMenu();
  }
  /**
   * Share via Web Share API
   */
  async shareViaWebAPI() {
    if (!navigator.share) return;
    const e = this.getCode(), r = this.filename || this.label;
    try {
      await navigator.share({
        title: r,
        text: e
      }), this.toggleShareMenu();
    } catch (i) {
      i.name !== "AbortError" && console.error("Error sharing:", i);
    }
  }
  /**
   * Open code in CodePen
   */
  openInCodePen() {
    const e = this.getCode(), r = this.language;
    let i = {
      title: this.filename || this.label || "Code Block Demo",
      description: "Code shared from code-block component",
      editors: "111"
    };
    ["html", "markup", "xhtml", "xml", "svg"].includes(r) ? (i.html = e, i.editors = "100") : r === "css" ? (i.css = e, i.editors = "010") : ["javascript", "js"].includes(r) ? (i.js = e, i.editors = "001") : (i.html = `<pre><code>${this.escapeHtml(e)}</code></pre>`, i.editors = "100");
    const c = document.createElement("form");
    c.action = "https://codepen.io/pen/define", c.method = "POST", c.target = "_blank";
    const u = document.createElement("input");
    u.type = "hidden", u.name = "data", u.value = JSON.stringify(i), c.appendChild(u), document.body.appendChild(c), c.submit(), document.body.removeChild(c), this.toggleShareMenu();
  }
  getStyles() {
    const e = this.theme === "dark";
    return `
      :host {
        display: block;
        margin: var(--cb-margin, 1rem 0);
        border-radius: var(--cb-border-radius, 8px);
        overflow: hidden;
        border: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
        background: var(--cb-bg, ${e ? "#0d1117" : "#f6f8fa"});
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
        font-size: var(--cb-font-size, 0.875rem);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background: var(--cb-header-bg, ${e ? "#161b22" : "#e1e4e8"});
        border-bottom: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#d1d5da"});
        gap: 1rem;
      }

      .label-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
        flex: 1;
      }

      .label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--cb-label-color, ${e ? "#8b949e" : "#586069"});
        text-transform: uppercase;
        letter-spacing: 0.5px;
        flex-shrink: 0;
      }

      .filename {
        font-size: 0.8rem;
        color: var(--cb-filename-color, ${e ? "#c9d1d9" : "#24292e"});
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
      }

      .copy-button {
        background: var(--cb-button-bg, ${e ? "#21262d" : "#fff"});
        border: 1px solid var(--cb-button-border, ${e ? "#30363d" : "#d1d5da"});
        border-radius: 4px;
        padding: 4px 12px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--cb-button-color, ${e ? "#c9d1d9" : "#24292e"});
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        flex-shrink: 0;
      }

      .copy-button:hover {
        background: var(--cb-button-hover-bg, ${e ? "#30363d" : "#f3f4f6"});
        border-color: ${e ? "#8b949e" : "#959da5"};
      }

      .copy-button:focus {
        outline: 2px solid var(--cb-focus-color, ${e ? "#58a6ff" : "#0366d6"});
        outline-offset: 2px;
      }

      .copy-button:active {
        transform: scale(0.98);
      }

      .copy-button.copied {
        background: var(--cb-success-color, #238636);
        color: white;
        border-color: var(--cb-success-color, #238636);
      }

      .copy-button.failed {
        background: var(--cb-error-color, #da3633);
        color: white;
        border-color: var(--cb-error-color, #da3633);
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .action-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--cb-label-color, ${e ? "#8b949e" : "#57606a"});
        transition: all 0.15s ease;
        border-radius: 4px;
      }

      .action-button:hover {
        color: var(--cb-button-color, ${e ? "#c9d1d9" : "#24292e"});
        background: ${e ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};
      }

      .action-button:active {
        transform: scale(0.95);
      }

      .action-button.active {
        color: var(--cb-focus-color, ${e ? "#58a6ff" : "#0969da"});
        background: ${e ? "rgba(56, 139, 253, 0.15)" : "rgba(9, 105, 218, 0.1)"};
      }

      .action-button svg {
        width: 16px;
        height: 16px;
      }

      .share-container {
        position: relative;
        display: inline-block;
      }

      .share-menu {
        display: none;
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        background: var(--cb-header-bg, ${e ? "#161b22" : "#f6f8fa"});
        border: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        z-index: 1000;
        overflow: hidden;
      }

      .share-menu-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: none;
        border: none;
        color: var(--cb-text-color, ${e ? "#c9d1d9" : "#24292e"});
        font-size: 0.8125rem;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s ease;
        border-bottom: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .share-menu-item:last-child {
        border-bottom: none;
      }

      .share-menu-item:hover {
        background: ${e ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"};
      }

      .share-menu-item:active {
        background: ${e ? "rgba(56, 139, 253, 0.15)" : "rgba(9, 105, 218, 0.1)"};
      }

      .share-menu-item svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .code-container {
        display: flex;
        overflow-x: auto;
        background: var(--cb-code-bg, ${e ? "#0d1117" : "#fff"});
      }

      .line-numbers {
        padding: 1rem 0;
        text-align: right;
        user-select: none;
        background: var(--cb-line-numbers-bg, ${e ? "#161b22" : "#f6f8fa"});
        border-right: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
        color: var(--cb-line-numbers-color, ${e ? "#484f58" : "#959da5"});
        line-height: 1.6;
        flex-shrink: 0;
      }

      .line-numbers span {
        display: block;
        padding: 0 0.75rem;
        min-width: 2.5rem;
      }

      .line-numbers span.highlighted {
        background: var(--cb-highlight-gutter, ${e ? "rgba(136, 192, 208, 0.15)" : "rgba(255, 235, 59, 0.3)"});
        color: var(--cb-line-numbers-highlight-color, ${e ? "#c9d1d9" : "#24292e"});
      }

      pre {
        margin: 0;
        padding: 0;
        flex: 1;
        overflow-x: auto;
      }

      code {
        display: block;
        font-family: inherit;
        color: var(--cb-text-color, ${e ? "#c9d1d9" : "#24292e"});
        background: transparent;
        padding: 1rem;
      }

      .code-line {
        display: block;
        line-height: 1.6;
        padding: 0 0.5rem;
        margin: 0 -0.5rem;
        white-space: pre;
      }

      .code-line.highlighted {
        background: var(--cb-highlight-bg, ${e ? "rgba(136, 192, 208, 0.15)" : "rgba(255, 235, 59, 0.3)"});
        border-left: 3px solid var(--cb-highlight-border, ${e ? "#58a6ff" : "#f9a825"});
        margin-left: calc(-0.5rem - 3px);
        padding-left: calc(0.5rem + 3px);
      }

      /* highlight.js theme - GitHub style with CSS custom properties */
      .hljs-comment,
      .hljs-quote {
        color: var(--cb-comment, ${e ? "#8b949e" : "#6a737d"});
        font-style: italic;
      }

      .hljs-keyword,
      .hljs-selector-tag,
      .hljs-addition {
        color: var(--cb-keyword, ${e ? "#ff7b72" : "#d73a49"});
      }

      .hljs-number,
      .hljs-literal,
      .hljs-doctag,
      .hljs-regexp {
        color: var(--cb-number, ${e ? "#79c0ff" : "#005cc5"});
      }

      .hljs-string,
      .hljs-meta .hljs-meta-string {
        color: var(--cb-string, ${e ? "#a5d6ff" : "#22863a"});
      }

      .hljs-title,
      .hljs-section,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class {
        color: var(--cb-function, ${e ? "#d2a8ff" : "#6f42c1"});
      }

      .hljs-attribute,
      .hljs-attr,
      .hljs-variable,
      .hljs-template-variable,
      .hljs-class .hljs-title,
      .hljs-type {
        color: var(--cb-attribute, ${e ? "#79c0ff" : "#005cc5"});
      }

      .hljs-symbol,
      .hljs-bullet,
      .hljs-subst,
      .hljs-meta,
      .hljs-meta .hljs-keyword,
      .hljs-selector-attr,
      .hljs-selector-pseudo,
      .hljs-link {
        color: var(--cb-meta, ${e ? "#ffa657" : "#e36209"});
      }

      .hljs-built_in,
      .hljs-deletion {
        color: var(--cb-builtin, ${e ? "#ffa198" : "#d73a49"});
      }

      .hljs-tag {
        color: var(--cb-tag, ${e ? "#7ee787" : "#22863a"});
      }

      .hljs-tag .hljs-name {
        color: var(--cb-tag, ${e ? "#7ee787" : "#22863a"});
      }

      .hljs-tag .hljs-attr {
        color: var(--cb-attribute, ${e ? "#79c0ff" : "#005cc5"});
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: bold;
      }

      /* Diff support - added/removed lines */
      .code-line.diff-add {
        background: var(--cb-diff-add-bg, ${e ? "rgba(46, 160, 67, 0.2)" : "rgba(46, 160, 67, 0.15)"});
        border-left: 3px solid var(--cb-diff-add-border, ${e ? "#3fb950" : "#22863a"});
        margin-left: calc(-0.5rem - 3px);
        padding-left: calc(0.5rem + 3px);
      }

      .code-line.diff-remove {
        background: var(--cb-diff-remove-bg, ${e ? "rgba(248, 81, 73, 0.2)" : "rgba(248, 81, 73, 0.15)"});
        border-left: 3px solid var(--cb-diff-remove-border, ${e ? "#f85149" : "#cb2431"});
        margin-left: calc(-0.5rem - 3px);
        padding-left: calc(0.5rem + 3px);
      }

      .line-numbers span.diff-add {
        background: var(--cb-diff-add-gutter, ${e ? "rgba(46, 160, 67, 0.15)" : "rgba(46, 160, 67, 0.1)"});
        color: var(--cb-diff-add-color, ${e ? "#3fb950" : "#22863a"});
      }

      .line-numbers span.diff-remove {
        background: var(--cb-diff-remove-gutter, ${e ? "rgba(248, 81, 73, 0.15)" : "rgba(248, 81, 73, 0.1)"});
        color: var(--cb-diff-remove-color, ${e ? "#f85149" : "#cb2431"});
      }

      .hljs-addition {
        color: var(--cb-diff-add-text, ${e ? "#3fb950" : "#22863a"});
        background: transparent;
      }

      .hljs-deletion {
        color: var(--cb-diff-remove-text, ${e ? "#f85149" : "#cb2431"});
        background: transparent;
      }

      /* Collapsible code blocks */
      :host([collapsed]) .code-container {
        position: relative;
      }

      :host([collapsed]) .code-container::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(transparent, var(--cb-code-bg, ${e ? "#0d1117" : "#fff"}));
        pointer-events: none;
      }

      :host([collapsed]) pre {
        overflow: hidden;
      }

      :host([collapsed]) code {
        display: block;
        overflow: hidden;
      }

      .expand-button {
        display: none;
        width: 100%;
        padding: 0.5rem 1rem;
        background: var(--cb-expand-bg, ${e ? "#161b22" : "#f6f8fa"});
        border: none;
        border-top: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
        color: var(--cb-expand-color, ${e ? "#58a6ff" : "#0366d6"});
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        transition: background 0.2s;
      }

      .expand-button:hover {
        background: var(--cb-expand-hover-bg, ${e ? "#21262d" : "#e1e4e8"});
      }

      .expand-button:focus {
        outline: 2px solid var(--cb-focus-color, ${e ? "#58a6ff" : "#0366d6"});
        outline-offset: -2px;
      }

      :host([collapsed]) .expand-button,
      :host([data-expandable]) .expand-button {
        display: block;
      }

      /* Max height with scroll */
      :host([max-height]) .code-container {
        max-height: var(--cb-max-height);
        overflow-y: auto;
      }

      :host([max-height]) .code-container::-webkit-scrollbar {
        width: 8px;
      }

      :host([max-height]) .code-container::-webkit-scrollbar-track {
        background: var(--cb-scrollbar-track, ${e ? "#161b22" : "#f6f8fa"});
      }

      :host([max-height]) .code-container::-webkit-scrollbar-thumb {
        background: var(--cb-scrollbar-thumb, ${e ? "#30363d" : "#d1d5da"});
        border-radius: 4px;
      }

      :host([max-height]) .code-container::-webkit-scrollbar-thumb:hover {
        background: var(--cb-scrollbar-thumb-hover, ${e ? "#484f58" : "#959da5"});
      }

      /* Word wrap option */
      :host([wrap]) code {
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: break-word;
      }

      :host([wrap]) .code-line {
        white-space: pre-wrap;
        word-break: break-word;
      }
    `;
  }
  /**
   * Render a placeholder without syntax highlighting (for lazy loading)
   */
  renderPlaceholder() {
    const e = (this._codeContent || this.textContent).trim(), r = e.split(`
`), c = this.escapeHtml(e).split(`
`).map((_) => `<span class="code-line">${_ || " "}</span>`).join(""), u = this.showLines ? `<div class="line-numbers" aria-hidden="true">${r.map((_, y) => `<span>${y + 1}</span>`).join("")}</div>` : "", p = this.filename ? `<span class="label">${this.escapeHtml(this.language.toUpperCase())}</span><span class="filename">${this.escapeHtml(this.filename)}</span>` : `<span class="label">${this.escapeHtml(this.label)}</span>`;
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          ${p}
        </div>
        <div class="header-actions">
          <button class="copy-button" aria-label="${this.copyText}">${this.copyText}</button>
        </div>
      </div>
      <div class="code-wrapper">
        <div class="code-container">
          ${u}
          <pre><code class="hljs">${c}</code></pre>
        </div>
      </div>
    `;
    const E = this.shadowRoot.querySelector(".copy-button");
    E && E.addEventListener("click", () => this.copyCode());
  }
  render() {
    const e = (this._codeContent || this.textContent).trim(), r = e.split(`
`), i = this.highlightLines, c = this.language === "diff";
    let u;
    try {
      this.language && this.language !== "plaintext" && this.language !== "text" && this.language !== "txt" ? u = I.highlight(e, { language: this.language, ignoreIllegals: !0 }).value : u = this.escapeHtml(e);
    } catch {
      u = this.escapeHtml(e);
    }
    const p = u.split(`
`), E = p.map((D, Y) => {
      const J = Y + 1, ne = i.has(J), j = ["code-line"];
      if (ne && j.push("highlighted"), c) {
        const G = r[Y] || "";
        G.startsWith("+") && !G.startsWith("+++") ? j.push("diff-add") : G.startsWith("-") && !G.startsWith("---") && j.push("diff-remove");
      }
      return `<span class="${j.join(" ")}">${D || " "}</span>`;
    }).join(""), _ = this.showLines ? `<div class="line-numbers" aria-hidden="true">${p.map((D, Y) => {
      const J = Y + 1, ne = i.has(J), j = [];
      if (ne && j.push("highlighted"), c) {
        const G = r[Y] || "";
        G.startsWith("+") && !G.startsWith("+++") ? j.push("diff-add") : G.startsWith("-") && !G.startsWith("---") && j.push("diff-remove");
      }
      return `<span class="${j.join(" ")}">${J}</span>`;
    }).join("")}</div>` : "", y = this.filename ? `<span class="label">${this.escapeHtml(this.language.toUpperCase())}</span><span class="filename">${this.escapeHtml(this.filename)}</span>` : `<span class="label">${this.escapeHtml(this.label)}</span>`, H = this.hasAttribute("collapsed") || this.hasAttribute("max-lines"), N = p.length, R = this.maxLines, M = H && N > R, z = this.collapsed, L = z ? `calc(${R} * 1.6em + 2rem)` : "none", V = this.maxHeight ? `--cb-max-height: ${this.maxHeight};` : "", X = z ? `max-height: ${L};` : "";
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          ${y}
        </div>
        <div class="header-actions">
          ${this.showShare ? `
            <div class="share-container">
              <button class="action-button share-button" title="Share code">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 12V3M8 3L5 6M8 3l3 3"/>
                  <path d="M3 9v4a1 1 0 001 1h8a1 1 0 001-1V9"/>
                </svg>
              </button>
              <div class="share-menu">
                ${typeof navigator < "u" && navigator.share ? `
                  <button class="share-menu-item share-native">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="4" r="2"/>
                      <circle cx="4" cy="8" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <path d="M6 9l4 2M6 7l4-2"/>
                    </svg>
                    Share...
                  </button>
                ` : ""}
                <button class="share-menu-item share-codepen">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0L0 5v6l8 5 8-5V5L8 0zM7 10.5L2 7.5v-2l5 3v2zm1-3l-5-3L8 2l5 2.5-5 3zm1 3v-2l5-3v2l-5 3z"/>
                  </svg>
                  Open in CodePen
                </button>
              </div>
            </div>
          ` : ""}
          ${this.showDownload ? `
            <button class="action-button download-button" title="Download code">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 1v10M8 11l-3-3M8 11l3-3"/>
                <path d="M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2"/>
              </svg>
            </button>
          ` : ""}
          <button class="copy-button"
                  aria-label="Copy code to clipboard"
                  title="Copy code">${this.escapeHtml(this.copyText)}</button>
        </div>
      </div>
      <div class="code-container" role="region" aria-labelledby="code-label" style="${V}${X}">
        ${_}
        <pre><code class="language-${this.language}" tabindex="0">${E}</code></pre>
      </div>
      ${M ? `
        <button class="expand-button" aria-expanded="${!z}">
          ${z ? `Show all ${N} lines` : "Show less"}
        </button>
      ` : ""}
    `, M ? this.setAttribute("data-expandable", "") : this.removeAttribute("data-expandable"), this.shadowRoot.querySelector(".copy-button").addEventListener("click", () => this.copyCode());
    const le = this.shadowRoot.querySelector(".expand-button");
    le && le.addEventListener("click", () => this.toggleCollapsed());
    const te = this.shadowRoot.querySelector(".share-button");
    te && te.addEventListener("click", (D) => {
      D.stopPropagation(), this.toggleShareMenu();
    });
    const W = this.shadowRoot.querySelector(".share-native");
    W && W.addEventListener("click", () => this.shareViaWebAPI());
    const q = this.shadowRoot.querySelector(".share-codepen");
    q && q.addEventListener("click", () => this.openInCodePen());
    const ie = this.shadowRoot.querySelector(".download-button");
    ie && ie.addEventListener("click", () => this.downloadCode());
  }
  toggleCollapsed() {
    this.collapsed ? this.removeAttribute("collapsed") : this.setAttribute("collapsed", "");
  }
  escapeHtml(e) {
    const r = document.createElement("div");
    return r.textContent = e, r.innerHTML;
  }
  /**
   * Update the code content programmatically
   */
  setCode(e) {
    this._codeContent = e, this.render();
  }
  /**
   * Get the current code content
   */
  getCode() {
    return (this._codeContent || this.textContent).trim();
  }
  /**
   * Get list of supported languages
   */
  static getSupportedLanguages() {
    return I.listLanguages();
  }
}
customElements.define("code-block", En);
class _n extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this._activeIndex = 0, this._showShareMenu = !1, this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }
  connectedCallback() {
    requestAnimationFrame(() => {
      this.render(), this.setupEventListeners();
    });
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._handleOutsideClick);
  }
  static get observedAttributes() {
    return ["theme", "show-share", "show-download"];
  }
  attributeChangedCallback(e, r, i) {
    this.shadowRoot && r !== i && this.render();
  }
  get theme() {
    return this.getAttribute("theme") || "light";
  }
  get showShare() {
    return this.hasAttribute("show-share");
  }
  get showDownload() {
    return this.hasAttribute("show-download");
  }
  get codeBlocks() {
    return Array.from(this.querySelectorAll("code-block"));
  }
  get activeIndex() {
    return this._activeIndex;
  }
  set activeIndex(e) {
    const r = this.codeBlocks;
    e >= 0 && e < r.length && (this._activeIndex = e, this.updateActiveTab());
  }
  getStyles() {
    const e = this.theme === "dark";
    return `
      :host {
        display: block;
        margin: var(--cb-margin, 1rem 0);
        border-radius: var(--cb-border-radius, 8px);
        overflow: hidden;
        border: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
        background: var(--cb-bg, ${e ? "#0d1117" : "#f6f8fa"});
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
        font-size: var(--cb-font-size, 0.875rem);
      }

      .tabs {
        display: flex;
        background: var(--cb-header-bg, ${e ? "#161b22" : "#f6f8fa"});
        border-bottom: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .tabs::-webkit-scrollbar {
        height: 4px;
      }

      .tabs::-webkit-scrollbar-thumb {
        background: var(--cb-scrollbar-thumb, ${e ? "#30363d" : "#d1d5da"});
        border-radius: 2px;
      }

      .tab {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--cb-label-color, ${e ? "#8b949e" : "#57606a"});
        font-family: inherit;
        font-size: 0.8125rem;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: color 0.15s, border-color 0.15s, background 0.15s;
      }

      .tab:hover {
        color: var(--cb-text-color, ${e ? "#c9d1d9" : "#24292e"});
        background: ${e ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"};
      }

      .tab:focus-visible {
        outline: 2px solid var(--cb-focus-color, ${e ? "#58a6ff" : "#0969da"});
        outline-offset: -2px;
      }

      .tab[aria-selected="true"] {
        color: var(--cb-text-color, ${e ? "#c9d1d9" : "#24292e"});
        border-bottom-color: var(--cb-focus-color, ${e ? "#58a6ff" : "#0969da"});
        background: var(--cb-code-bg, ${e ? "#0d1117" : "#fff"});
      }

      .language-badge {
        display: inline-block;
        padding: 0.125rem 0.375rem;
        background: ${e ? "rgba(110, 118, 129, 0.4)" : "rgba(175, 184, 193, 0.4)"};
        border-radius: 4px;
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }

      .content {
        position: relative;
      }

      ::slotted(code-block) {
        display: none !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
      }

      ::slotted(code-block.active) {
        display: block !important;
      }

      /* Header with tabs and actions */
      .header {
        display: flex;
        align-items: stretch;
        background: var(--cb-header-bg, ${e ? "#161b22" : "#f6f8fa"});
        border-bottom: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
      }

      .tabs {
        border-bottom: none;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-left: auto;
        padding: 0 0.5rem;
      }

      .action-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 4px;
        color: var(--cb-label-color, ${e ? "#8b949e" : "#57606a"});
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }

      .action-button:hover {
        background: ${e ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"};
        color: var(--cb-text-color, ${e ? "#c9d1d9" : "#24292e"});
      }

      .action-button:focus-visible {
        outline: 2px solid var(--cb-focus-color, ${e ? "#58a6ff" : "#0969da"});
        outline-offset: 1px;
      }

      .action-button svg {
        width: 16px;
        height: 16px;
      }

      .share-container {
        position: relative;
      }

      .share-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        min-width: 140px;
        padding: 0.25rem 0;
        background: var(--cb-bg, ${e ? "#21262d" : "#fff"});
        border: 1px solid var(--cb-border-color, ${e ? "#30363d" : "#e1e4e8"});
        border-radius: 6px;
        box-shadow: 0 8px 24px ${e ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"};
        z-index: 100;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-4px);
        transition: opacity 0.15s, visibility 0.15s, transform 0.15s;
      }

      .share-menu.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .share-menu-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: transparent;
        border: none;
        color: var(--cb-text-color, ${e ? "#c9d1d9" : "#24292e"});
        font-family: inherit;
        font-size: 0.8125rem;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s;
      }

      .share-menu-item:hover {
        background: ${e ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
      }

      .share-menu-item svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
    `;
  }
  render() {
    const e = this.codeBlocks;
    if (e.length === 0) return;
    e.forEach((u, p) => {
      u.setAttribute("theme", this.theme), p === this._activeIndex ? u.classList.add("active") : u.classList.remove("active");
    });
    const r = e.map((u, p) => {
      const E = u.getAttribute("filename"), _ = u.getAttribute("label"), y = u.getAttribute("language") || "plaintext", H = E || _ || y.toUpperCase(), N = p === this._activeIndex;
      return `
        <button
          class="tab"
          role="tab"
          aria-selected="${N}"
          aria-controls="panel-${p}"
          tabindex="${N ? "0" : "-1"}"
          data-index="${p}"
        >
          <span class="tab-label">${this.escapeHtml(H)}</span>
          ${E ? `<span class="language-badge">${y}</span>` : ""}
        </button>
      `;
    }).join(""), c = this.showShare || this.showDownload ? `
      <div class="header-actions">
        ${this.showDownload ? `
          <button class="action-button download-button" aria-label="Download code" title="Download">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"/>
              <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"/>
            </svg>
          </button>
        ` : ""}
        ${this.showShare ? `
          <div class="share-container">
            <button class="action-button share-button" aria-label="Share code" title="Share" aria-haspopup="true" aria-expanded="${this._showShareMenu}">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15 3a3 3 0 0 1-5.175 2.066l-3.92 2.179a3.005 3.005 0 0 1 0 1.51l3.92 2.179a3 3 0 1 1-.73 1.31l-3.92-2.178a3 3 0 1 1 0-4.133l3.92-2.178A3 3 0 1 1 15 3Zm-1.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Zm-9-5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
              </svg>
            </button>
            <div class="share-menu ${this._showShareMenu ? "open" : ""}" role="menu">
              ${typeof navigator < "u" && navigator.share ? `
                <button class="share-menu-item web-share-button" role="menuitem">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15 3a3 3 0 0 1-5.175 2.066l-3.92 2.179a3.005 3.005 0 0 1 0 1.51l3.92 2.179a3 3 0 1 1-.73 1.31l-3.92-2.178a3 3 0 1 1 0-4.133l3.92-2.178A3 3 0 1 1 15 3Zm-1.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Zm-9-5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
                  </svg>
                  Share...
                </button>
              ` : ""}
              <button class="share-menu-item codepen-button" role="menuitem">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L0 5.333v5.334L8 16l8-5.333V5.333L8 0zm5.714 9.703L8 13.297l-5.714-3.594V6.297L8 2.703l5.714 3.594v3.406z"/>
                  <path d="M8 4.703L4.286 7.5 8 10.297 11.714 7.5 8 4.703z"/>
                </svg>
                Open in CodePen
              </button>
            </div>
          </div>
        ` : ""}
      </div>
    ` : "";
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="tabs" role="tablist" aria-label="Code files">
          ${r}
        </div>
        ${c}
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }
  setupEventListeners() {
    const e = this.shadowRoot.querySelector(".tabs");
    if (!e) return;
    e.addEventListener("click", (p) => {
      const E = p.target.closest(".tab");
      if (E) {
        const _ = parseInt(E.dataset.index, 10);
        this.activeIndex = _;
      }
    }), e.addEventListener("keydown", (p) => {
      const E = this.shadowRoot.querySelectorAll(".tab"), _ = this._activeIndex;
      let y = _;
      switch (p.key) {
        case "ArrowLeft":
          y = _ > 0 ? _ - 1 : E.length - 1;
          break;
        case "ArrowRight":
          y = _ < E.length - 1 ? _ + 1 : 0;
          break;
        case "Home":
          y = 0;
          break;
        case "End":
          y = E.length - 1;
          break;
        default:
          return;
      }
      p.preventDefault(), this.activeIndex = y, E[y].focus();
    });
    const r = this.shadowRoot.querySelector(".download-button");
    r && r.addEventListener("click", () => this.downloadCode());
    const i = this.shadowRoot.querySelector(".share-button");
    i && i.addEventListener("click", (p) => {
      p.stopPropagation(), this.toggleShareMenu();
    });
    const c = this.shadowRoot.querySelector(".web-share-button");
    c && c.addEventListener("click", () => {
      this.shareViaWebAPI(), this.toggleShareMenu();
    });
    const u = this.shadowRoot.querySelector(".codepen-button");
    u && u.addEventListener("click", () => {
      this.openInCodePen(), this.toggleShareMenu();
    });
  }
  updateActiveTab() {
    const e = this.shadowRoot.querySelectorAll(".tab"), r = this.codeBlocks;
    e.forEach((i, c) => {
      const u = c === this._activeIndex;
      i.setAttribute("aria-selected", u), i.setAttribute("tabindex", u ? "0" : "-1");
    }), r.forEach((i, c) => {
      c === this._activeIndex ? i.classList.add("active") : i.classList.remove("active");
    }), this.dispatchEvent(new CustomEvent("tab-change", {
      detail: { index: this._activeIndex, block: r[this._activeIndex] },
      bubbles: !0
    }));
  }
  escapeHtml(e) {
    const r = document.createElement("div");
    return r.textContent = e, r.innerHTML;
  }
  /**
   * Programmatically select a tab by index
   */
  selectTab(e) {
    this.activeIndex = e;
  }
  /**
   * Get the currently active code block
   */
  getActiveBlock() {
    return this.codeBlocks[this._activeIndex];
  }
  /**
   * Toggle share menu visibility
   */
  toggleShareMenu() {
    this._showShareMenu = !this._showShareMenu;
    const e = this.shadowRoot.querySelector(".share-menu"), r = this.shadowRoot.querySelector(".share-button");
    e && e.classList.toggle("open", this._showShareMenu), r && r.setAttribute("aria-expanded", this._showShareMenu), this._showShareMenu ? document.addEventListener("click", this._handleOutsideClick) : document.removeEventListener("click", this._handleOutsideClick);
  }
  /**
   * Handle clicks outside share menu
   */
  _handleOutsideClick(e) {
    const r = this.shadowRoot.querySelector(".share-container");
    if (r && !e.composedPath().includes(r)) {
      this._showShareMenu = !1;
      const i = this.shadowRoot.querySelector(".share-menu"), c = this.shadowRoot.querySelector(".share-button");
      i && i.classList.remove("open"), c && c.setAttribute("aria-expanded", "false"), document.removeEventListener("click", this._handleOutsideClick);
    }
  }
  /**
   * Download code from the active block
   */
  downloadCode() {
    const e = this.getActiveBlock();
    e && typeof e.downloadCode == "function" && e.downloadCode();
  }
  /**
   * Open all blocks' code in CodePen (aggregates HTML, CSS, JS)
   */
  openInCodePen() {
    const e = this.codeBlocks;
    if (e.length === 0) return;
    let r = "", i = "", c = "", u = "Code Block Group";
    e.forEach((H) => {
      const N = H.language, R = H.getCode(), M = H.filename;
      ["html", "markup", "xhtml", "xml", "svg"].includes(N) ? (r && (r += `

`), M && (r += `<!-- ${M} -->
`), r += R) : N === "css" ? (i && (i += `

`), M && (i += `/* ${M} */
`), i += R) : ["javascript", "js"].includes(N) && (c && (c += `

`), M && (c += `// ${M}
`), c += R), (!u || u === "Code Block Group") && (u = M || H.label || "Code Block Group");
    });
    let p = "";
    p += r ? "1" : "0", p += i ? "1" : "0", p += c ? "1" : "0";
    const E = {
      title: u,
      description: "Code shared from code-block-group component",
      html: r,
      css: i,
      js: c,
      editors: p
    }, _ = document.createElement("form");
    _.action = "https://codepen.io/pen/define", _.method = "POST", _.target = "_blank";
    const y = document.createElement("input");
    y.type = "hidden", y.name = "data", y.value = JSON.stringify(E), _.appendChild(y), document.body.appendChild(_), _.submit(), document.body.removeChild(_);
  }
  /**
   * Share all blocks' code via Web Share API
   */
  async shareViaWebAPI() {
    if (!navigator.share) return;
    const e = this.codeBlocks;
    if (e.length === 0) return;
    let r = "";
    e.forEach((i) => {
      const c = i.filename || i.label || i.language, u = i.getCode();
      r && (r += `

`), r += `// === ${c} ===
${u}`;
    });
    try {
      await navigator.share({
        title: "Code from code-block-group",
        text: r
      });
    } catch (i) {
      i.name !== "AbortError" && console.error("Share failed:", i);
    }
  }
}
customElements.define("code-block-group", _n);
export {
  En as CodeBlock,
  _n as CodeBlockGroup
};
