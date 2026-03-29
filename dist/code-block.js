function fn(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ke, lt;
function mn() {
  if (lt) return Ke;
  lt = 1;
  function n(t) {
    return t instanceof Map ? t.clear = t.delete = t.set = function() {
      throw new Error("map is read-only");
    } : t instanceof Set && (t.add = t.clear = t.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(t), Object.getOwnPropertyNames(t).forEach((o) => {
      const c = t[o], _ = typeof c;
      (_ === "object" || _ === "function") && !Object.isFrozen(c) && n(c);
    }), t;
  }
  class e {
    /**
     * @param {CompiledMode} mode
     */
    constructor(o) {
      o.data === void 0 && (o.data = {}), this.data = o.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function a(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function r(t, ...o) {
    const c = /* @__PURE__ */ Object.create(null);
    for (const _ in t)
      c[_] = t[_];
    return o.forEach(function(_) {
      for (const P in _)
        c[P] = _[P];
    }), /** @type {T} */
    c;
  }
  const s = "</span>", l = (t) => !!t.scope, b = (t, { prefix: o }) => {
    if (t.startsWith("language:"))
      return t.replace("language:", "language-");
    if (t.includes(".")) {
      const c = t.split(".");
      return [
        `${o}${c.shift()}`,
        ...c.map((_, P) => `${_}${"_".repeat(P + 1)}`)
      ].join(" ");
    }
    return `${o}${t}`;
  };
  class g {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(o, c) {
      this.buffer = "", this.classPrefix = c.classPrefix, o.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(o) {
      this.buffer += a(o);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(o) {
      if (!l(o)) return;
      const c = b(
        o.scope,
        { prefix: this.classPrefix }
      );
      this.span(c);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(o) {
      l(o) && (this.buffer += s);
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
    span(o) {
      this.buffer += `<span class="${o}">`;
    }
  }
  const f = (t = {}) => {
    const o = { children: [] };
    return Object.assign(o, t), o;
  };
  class v {
    constructor() {
      this.rootNode = f(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(o) {
      this.top.children.push(o);
    }
    /** @param {string} scope */
    openNode(o) {
      const c = f({ scope: o });
      this.add(c), this.stack.push(c);
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
    walk(o) {
      return this.constructor._walk(o, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(o, c) {
      return typeof c == "string" ? o.addText(c) : c.children && (o.openNode(c), c.children.forEach((_) => this._walk(o, _)), o.closeNode(c)), o;
    }
    /**
     * @param {Node} node
     */
    static _collapse(o) {
      typeof o != "string" && o.children && (o.children.every((c) => typeof c == "string") ? o.children = [o.children.join("")] : o.children.forEach((c) => {
        v._collapse(c);
      }));
    }
  }
  class C extends v {
    /**
     * @param {*} options
     */
    constructor(o) {
      super(), this.options = o;
    }
    /**
     * @param {string} text
     */
    addText(o) {
      o !== "" && this.add(o);
    }
    /** @param {string} scope */
    startScope(o) {
      this.openNode(o);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(o, c) {
      const _ = o.root;
      c && (_.scope = `language:${c}`), this.add(_);
    }
    toHTML() {
      return new g(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function k(t) {
    return t ? typeof t == "string" ? t : t.source : null;
  }
  function x(t) {
    return S("(?=", t, ")");
  }
  function N(t) {
    return S("(?:", t, ")*");
  }
  function R(t) {
    return S("(?:", t, ")?");
  }
  function S(...t) {
    return t.map((c) => k(c)).join("");
  }
  function $(t) {
    const o = t[t.length - 1];
    return typeof o == "object" && o.constructor === Object ? (t.splice(t.length - 1, 1), o) : {};
  }
  function D(...t) {
    return "(" + ($(t).capture ? "" : "?:") + t.map((_) => k(_)).join("|") + ")";
  }
  function B(t) {
    return new RegExp(t.toString() + "|").exec("").length - 1;
  }
  function J(t, o) {
    const c = t && t.exec(o);
    return c && c.index === 0;
  }
  const V = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function H(t, { joinWith: o }) {
    let c = 0;
    return t.map((_) => {
      c += 1;
      const P = c;
      let U = k(_), h = "";
      for (; U.length > 0; ) {
        const u = V.exec(U);
        if (!u) {
          h += U;
          break;
        }
        h += U.substring(0, u.index), U = U.substring(u.index + u[0].length), u[0][0] === "\\" && u[1] ? h += "\\" + String(Number(u[1]) + P) : (h += u[0], u[0] === "(" && c++);
      }
      return h;
    }).map((_) => `(${_})`).join(o);
  }
  const z = /\b\B/, ie = "[a-zA-Z]\\w*", F = "[a-zA-Z_]\\w*", ee = "\\b\\d+(\\.\\d+)?", ne = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ae = "\\b(0b[01]+)", K = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Z = (t = {}) => {
    const o = /^#![ ]*\//;
    return t.binary && (t.begin = S(
      o,
      /.*\b/,
      t.binary,
      /\b.*/
    )), r({
      scope: "meta",
      begin: o,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (c, _) => {
        c.index !== 0 && _.ignoreMatch();
      }
    }, t);
  }, W = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, Y = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [W]
  }, re = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [W]
  }, xe = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, T = function(t, o, c = {}) {
    const _ = r(
      {
        scope: "comment",
        begin: t,
        end: o,
        contains: []
      },
      c
    );
    _.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const P = D(
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
    return _.contains.push(
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
        begin: S(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          P,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), _;
  }, te = T("//", "$"), oe = T("/\\*", "\\*/"), ce = T("#", "$"), be = {
    scope: "number",
    begin: ee,
    relevance: 0
  }, fe = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, kt = {
    scope: "number",
    begin: ae,
    relevance: 0
  }, Nt = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      W,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [W]
      }
    ]
  }, Rt = {
    scope: "title",
    begin: ie,
    relevance: 0
  }, Tt = {
    scope: "title",
    begin: F,
    relevance: 0
  }, Ct = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + F,
    relevance: 0
  };
  var ke = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: Y,
    BACKSLASH_ESCAPE: W,
    BINARY_NUMBER_MODE: kt,
    BINARY_NUMBER_RE: ae,
    COMMENT: T,
    C_BLOCK_COMMENT_MODE: oe,
    C_LINE_COMMENT_MODE: te,
    C_NUMBER_MODE: fe,
    C_NUMBER_RE: ne,
    END_SAME_AS_BEGIN: function(t) {
      return Object.assign(
        t,
        {
          /** @type {ModeCallback} */
          "on:begin": (o, c) => {
            c.data._beginMatch = o[1];
          },
          /** @type {ModeCallback} */
          "on:end": (o, c) => {
            c.data._beginMatch !== o[1] && c.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ce,
    IDENT_RE: ie,
    MATCH_NOTHING_RE: z,
    METHOD_GUARD: Ct,
    NUMBER_MODE: be,
    NUMBER_RE: ee,
    PHRASAL_WORDS_MODE: xe,
    QUOTE_STRING_MODE: re,
    REGEXP_MODE: Nt,
    RE_STARTERS_RE: K,
    SHEBANG: Z,
    TITLE_MODE: Rt,
    UNDERSCORE_IDENT_RE: F,
    UNDERSCORE_TITLE_MODE: Tt
  });
  function Mt(t, o) {
    t.input[t.index - 1] === "." && o.ignoreMatch();
  }
  function Ot(t, o) {
    t.className !== void 0 && (t.scope = t.className, delete t.className);
  }
  function It(t, o) {
    o && t.beginKeywords && (t.begin = "\\b(" + t.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", t.__beforeBegin = Mt, t.keywords = t.keywords || t.beginKeywords, delete t.beginKeywords, t.relevance === void 0 && (t.relevance = 0));
  }
  function Lt(t, o) {
    Array.isArray(t.illegal) && (t.illegal = D(...t.illegal));
  }
  function $t(t, o) {
    if (t.match) {
      if (t.begin || t.end) throw new Error("begin & end are not supported with match");
      t.begin = t.match, delete t.match;
    }
  }
  function Bt(t, o) {
    t.relevance === void 0 && (t.relevance = 1);
  }
  const Dt = (t, o) => {
    if (!t.beforeMatch) return;
    if (t.starts) throw new Error("beforeMatch cannot be used with starts");
    const c = Object.assign({}, t);
    Object.keys(t).forEach((_) => {
      delete t[_];
    }), t.keywords = c.keywords, t.begin = S(c.beforeMatch, x(c.begin)), t.starts = {
      relevance: 0,
      contains: [
        Object.assign(c, { endsParent: !0 })
      ]
    }, t.relevance = 0, delete c.beforeMatch;
  }, Pt = [
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
  ], Ut = "keyword";
  function We(t, o, c = Ut) {
    const _ = /* @__PURE__ */ Object.create(null);
    return typeof t == "string" ? P(c, t.split(" ")) : Array.isArray(t) ? P(c, t) : Object.keys(t).forEach(function(U) {
      Object.assign(
        _,
        We(t[U], o, U)
      );
    }), _;
    function P(U, h) {
      o && (h = h.map((u) => u.toLowerCase())), h.forEach(function(u) {
        const E = u.split("|");
        _[E[0]] = [U, Ht(E[0], E[1])];
      });
    }
  }
  function Ht(t, o) {
    return o ? Number(o) : zt(t) ? 0 : 1;
  }
  function zt(t) {
    return Pt.includes(t.toLowerCase());
  }
  const qe = {}, me = (t) => {
    console.error(t);
  }, Ye = (t, ...o) => {
    console.log(`WARN: ${t}`, ...o);
  }, _e = (t, o) => {
    qe[`${t}/${o}`] || (console.log(`Deprecated as of ${t}. ${o}`), qe[`${t}/${o}`] = !0);
  }, Ne = new Error();
  function Xe(t, o, { key: c }) {
    let _ = 0;
    const P = t[c], U = {}, h = {};
    for (let u = 1; u <= o.length; u++)
      h[u + _] = P[u], U[u + _] = !0, _ += B(o[u - 1]);
    t[c] = h, t[c]._emit = U, t[c]._multi = !0;
  }
  function Ft(t) {
    if (Array.isArray(t.begin)) {
      if (t.skip || t.excludeBegin || t.returnBegin)
        throw me("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ne;
      if (typeof t.beginScope != "object" || t.beginScope === null)
        throw me("beginScope must be object"), Ne;
      Xe(t, t.begin, { key: "beginScope" }), t.begin = H(t.begin, { joinWith: "" });
    }
  }
  function Gt(t) {
    if (Array.isArray(t.end)) {
      if (t.skip || t.excludeEnd || t.returnEnd)
        throw me("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ne;
      if (typeof t.endScope != "object" || t.endScope === null)
        throw me("endScope must be object"), Ne;
      Xe(t, t.end, { key: "endScope" }), t.end = H(t.end, { joinWith: "" });
    }
  }
  function jt(t) {
    t.scope && typeof t.scope == "object" && t.scope !== null && (t.beginScope = t.scope, delete t.scope);
  }
  function Kt(t) {
    jt(t), typeof t.beginScope == "string" && (t.beginScope = { _wrap: t.beginScope }), typeof t.endScope == "string" && (t.endScope = { _wrap: t.endScope }), Ft(t), Gt(t);
  }
  function Zt(t) {
    function o(h, u) {
      return new RegExp(
        k(h),
        "m" + (t.case_insensitive ? "i" : "") + (t.unicodeRegex ? "u" : "") + (u ? "g" : "")
      );
    }
    class c {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(u, E) {
        E.position = this.position++, this.matchIndexes[this.matchAt] = E, this.regexes.push([E, u]), this.matchAt += B(u) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const u = this.regexes.map((E) => E[1]);
        this.matcherRe = o(H(u, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(u) {
        this.matcherRe.lastIndex = this.lastIndex;
        const E = this.matcherRe.exec(u);
        if (!E)
          return null;
        const q = E.findIndex((we, Ue) => Ue > 0 && we !== void 0), G = this.matchIndexes[q];
        return E.splice(0, q), Object.assign(E, G);
      }
    }
    class _ {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(u) {
        if (this.multiRegexes[u]) return this.multiRegexes[u];
        const E = new c();
        return this.rules.slice(u).forEach(([q, G]) => E.addRule(q, G)), E.compile(), this.multiRegexes[u] = E, E;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(u, E) {
        this.rules.push([u, E]), E.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(u) {
        const E = this.getMatcher(this.regexIndex);
        E.lastIndex = this.lastIndex;
        let q = E.exec(u);
        if (this.resumingScanAtSamePosition() && !(q && q.index === this.lastIndex)) {
          const G = this.getMatcher(0);
          G.lastIndex = this.lastIndex + 1, q = G.exec(u);
        }
        return q && (this.regexIndex += q.position + 1, this.regexIndex === this.count && this.considerAll()), q;
      }
    }
    function P(h) {
      const u = new _();
      return h.contains.forEach((E) => u.addRule(E.begin, { rule: E, type: "begin" })), h.terminatorEnd && u.addRule(h.terminatorEnd, { type: "end" }), h.illegal && u.addRule(h.illegal, { type: "illegal" }), u;
    }
    function U(h, u) {
      const E = (
        /** @type CompiledMode */
        h
      );
      if (h.isCompiled) return E;
      [
        Ot,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        $t,
        Kt,
        Dt
      ].forEach((G) => G(h, u)), t.compilerExtensions.forEach((G) => G(h, u)), h.__beforeBegin = null, [
        It,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Lt,
        // default to 1 relevance if not specified
        Bt
      ].forEach((G) => G(h, u)), h.isCompiled = !0;
      let q = null;
      return typeof h.keywords == "object" && h.keywords.$pattern && (h.keywords = Object.assign({}, h.keywords), q = h.keywords.$pattern, delete h.keywords.$pattern), q = q || /\w+/, h.keywords && (h.keywords = We(h.keywords, t.case_insensitive)), E.keywordPatternRe = o(q, !0), u && (h.begin || (h.begin = /\B|\b/), E.beginRe = o(E.begin), !h.end && !h.endsWithParent && (h.end = /\B|\b/), h.end && (E.endRe = o(E.end)), E.terminatorEnd = k(E.end) || "", h.endsWithParent && u.terminatorEnd && (E.terminatorEnd += (h.end ? "|" : "") + u.terminatorEnd)), h.illegal && (E.illegalRe = o(
        /** @type {RegExp | string} */
        h.illegal
      )), h.contains || (h.contains = []), h.contains = [].concat(...h.contains.map(function(G) {
        return Wt(G === "self" ? h : G);
      })), h.contains.forEach(function(G) {
        U(
          /** @type Mode */
          G,
          E
        );
      }), h.starts && U(h.starts, u), E.matcher = P(E), E;
    }
    if (t.compilerExtensions || (t.compilerExtensions = []), t.contains && t.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return t.classNameAliases = r(t.classNameAliases || {}), U(
      /** @type Mode */
      t
    );
  }
  function Ve(t) {
    return t ? t.endsWithParent || Ve(t.starts) : !1;
  }
  function Wt(t) {
    return t.variants && !t.cachedVariants && (t.cachedVariants = t.variants.map(function(o) {
      return r(t, { variants: null }, o);
    })), t.cachedVariants ? t.cachedVariants : Ve(t) ? r(t, { starts: t.starts ? r(t.starts) : null }) : Object.isFrozen(t) ? r(t) : t;
  }
  var qt = "11.11.1";
  class Yt extends Error {
    constructor(o, c) {
      super(o), this.name = "HTMLInjectionError", this.html = c;
    }
  }
  const Pe = a, Qe = r, Je = Symbol("nomatch"), Xt = 7, et = function(t) {
    const o = /* @__PURE__ */ Object.create(null), c = /* @__PURE__ */ Object.create(null), _ = [];
    let P = !0;
    const U = "Could not find the language '{}', did you forget to load/include a language module?", h = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let u = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: C
    };
    function E(i) {
      return u.noHighlightRe.test(i);
    }
    function q(i) {
      let m = i.className + " ";
      m += i.parentNode ? i.parentNode.className : "";
      const A = u.languageDetectRe.exec(m);
      if (A) {
        const I = ge(A[1]);
        return I || (Ye(U.replace("{}", A[1])), Ye("Falling back to no-highlight mode for this block.", i)), I ? A[1] : "no-highlight";
      }
      return m.split(/\s+/).find((I) => E(I) || ge(I));
    }
    function G(i, m, A) {
      let I = "", j = "";
      typeof m == "object" ? (I = i, A = m.ignoreIllegals, j = m.language) : (_e("10.7.0", "highlight(lang, code, ...args) has been deprecated."), _e("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), j = i, I = m), A === void 0 && (A = !0);
      const le = {
        code: I,
        language: j
      };
      Te("before:highlight", le);
      const pe = le.result ? le.result : we(le.language, le.code, A);
      return pe.code = le.code, Te("after:highlight", pe), pe;
    }
    function we(i, m, A, I) {
      const j = /* @__PURE__ */ Object.create(null);
      function le(d, p) {
        return d.keywords[p];
      }
      function pe() {
        if (!y.keywords) {
          X.addText(L);
          return;
        }
        let d = 0;
        y.keywordPatternRe.lastIndex = 0;
        let p = y.keywordPatternRe.exec(L), w = "";
        for (; p; ) {
          w += L.substring(d, p.index);
          const M = ue.case_insensitive ? p[0].toLowerCase() : p[0], Q = le(y, M);
          if (Q) {
            const [he, gn] = Q;
            if (X.addText(w), w = "", j[M] = (j[M] || 0) + 1, j[M] <= Xt && (Oe += gn), he.startsWith("_"))
              w += p[0];
            else {
              const pn = ue.classNameAliases[he] || he;
              de(p[0], pn);
            }
          } else
            w += p[0];
          d = y.keywordPatternRe.lastIndex, p = y.keywordPatternRe.exec(L);
        }
        w += L.substring(d), X.addText(w);
      }
      function Ce() {
        if (L === "") return;
        let d = null;
        if (typeof y.subLanguage == "string") {
          if (!o[y.subLanguage]) {
            X.addText(L);
            return;
          }
          d = we(y.subLanguage, L, !0, ct[y.subLanguage]), ct[y.subLanguage] = /** @type {CompiledMode} */
          d._top;
        } else
          d = He(L, y.subLanguage.length ? y.subLanguage : null);
        y.relevance > 0 && (Oe += d.relevance), X.__addSublanguage(d._emitter, d.language);
      }
      function se() {
        y.subLanguage != null ? Ce() : pe(), L = "";
      }
      function de(d, p) {
        d !== "" && (X.startScope(p), X.addText(d), X.endScope());
      }
      function rt(d, p) {
        let w = 1;
        const M = p.length - 1;
        for (; w <= M; ) {
          if (!d._emit[w]) {
            w++;
            continue;
          }
          const Q = ue.classNameAliases[d[w]] || d[w], he = p[w];
          Q ? de(he, Q) : (L = he, pe(), L = ""), w++;
        }
      }
      function ot(d, p) {
        return d.scope && typeof d.scope == "string" && X.openNode(ue.classNameAliases[d.scope] || d.scope), d.beginScope && (d.beginScope._wrap ? (de(L, ue.classNameAliases[d.beginScope._wrap] || d.beginScope._wrap), L = "") : d.beginScope._multi && (rt(d.beginScope, p), L = "")), y = Object.create(d, { parent: { value: y } }), y;
      }
      function st(d, p, w) {
        let M = J(d.endRe, w);
        if (M) {
          if (d["on:end"]) {
            const Q = new e(d);
            d["on:end"](p, Q), Q.isMatchIgnored && (M = !1);
          }
          if (M) {
            for (; d.endsParent && d.parent; )
              d = d.parent;
            return d;
          }
        }
        if (d.endsWithParent)
          return st(d.parent, p, w);
      }
      function ln(d) {
        return y.matcher.regexIndex === 0 ? (L += d[0], 1) : (je = !0, 0);
      }
      function dn(d) {
        const p = d[0], w = d.rule, M = new e(w), Q = [w.__beforeBegin, w["on:begin"]];
        for (const he of Q)
          if (he && (he(d, M), M.isMatchIgnored))
            return ln(p);
        return w.skip ? L += p : (w.excludeBegin && (L += p), se(), !w.returnBegin && !w.excludeBegin && (L = p)), ot(w, d), w.returnBegin ? 0 : p.length;
      }
      function un(d) {
        const p = d[0], w = m.substring(d.index), M = st(y, d, w);
        if (!M)
          return Je;
        const Q = y;
        y.endScope && y.endScope._wrap ? (se(), de(p, y.endScope._wrap)) : y.endScope && y.endScope._multi ? (se(), rt(y.endScope, d)) : Q.skip ? L += p : (Q.returnEnd || Q.excludeEnd || (L += p), se(), Q.excludeEnd && (L = p));
        do
          y.scope && X.closeNode(), !y.skip && !y.subLanguage && (Oe += y.relevance), y = y.parent;
        while (y !== M.parent);
        return M.starts && ot(M.starts, d), Q.returnEnd ? 0 : p.length;
      }
      function bn() {
        const d = [];
        for (let p = y; p !== ue; p = p.parent)
          p.scope && d.unshift(p.scope);
        d.forEach((p) => X.openNode(p));
      }
      let Me = {};
      function it(d, p) {
        const w = p && p[0];
        if (L += d, w == null)
          return se(), 0;
        if (Me.type === "begin" && p.type === "end" && Me.index === p.index && w === "") {
          if (L += m.slice(p.index, p.index + 1), !P) {
            const M = new Error(`0 width match regex (${i})`);
            throw M.languageName = i, M.badRule = Me.rule, M;
          }
          return 1;
        }
        if (Me = p, p.type === "begin")
          return dn(p);
        if (p.type === "illegal" && !A) {
          const M = new Error('Illegal lexeme "' + w + '" for mode "' + (y.scope || "<unnamed>") + '"');
          throw M.mode = y, M;
        } else if (p.type === "end") {
          const M = un(p);
          if (M !== Je)
            return M;
        }
        if (p.type === "illegal" && w === "")
          return L += `
`, 1;
        if (Ge > 1e5 && Ge > p.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return L += w, w.length;
      }
      const ue = ge(i);
      if (!ue)
        throw me(U.replace("{}", i)), new Error('Unknown language: "' + i + '"');
      const hn = Zt(ue);
      let Fe = "", y = I || hn;
      const ct = {}, X = new u.__emitter(u);
      bn();
      let L = "", Oe = 0, ve = 0, Ge = 0, je = !1;
      try {
        if (ue.__emitTokens)
          ue.__emitTokens(m, X);
        else {
          for (y.matcher.considerAll(); ; ) {
            Ge++, je ? je = !1 : y.matcher.considerAll(), y.matcher.lastIndex = ve;
            const d = y.matcher.exec(m);
            if (!d) break;
            const p = m.substring(ve, d.index), w = it(p, d);
            ve = d.index + w;
          }
          it(m.substring(ve));
        }
        return X.finalize(), Fe = X.toHTML(), {
          language: i,
          value: Fe,
          relevance: Oe,
          illegal: !1,
          _emitter: X,
          _top: y
        };
      } catch (d) {
        if (d.message && d.message.includes("Illegal"))
          return {
            language: i,
            value: Pe(m),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: d.message,
              index: ve,
              context: m.slice(ve - 100, ve + 100),
              mode: d.mode,
              resultSoFar: Fe
            },
            _emitter: X
          };
        if (P)
          return {
            language: i,
            value: Pe(m),
            illegal: !1,
            relevance: 0,
            errorRaised: d,
            _emitter: X,
            _top: y
          };
        throw d;
      }
    }
    function Ue(i) {
      const m = {
        value: Pe(i),
        illegal: !1,
        relevance: 0,
        _top: h,
        _emitter: new u.__emitter(u)
      };
      return m._emitter.addText(i), m;
    }
    function He(i, m) {
      m = m || u.languages || Object.keys(o);
      const A = Ue(i), I = m.filter(ge).filter(at).map(
        (se) => we(se, i, !1)
      );
      I.unshift(A);
      const j = I.sort((se, de) => {
        if (se.relevance !== de.relevance) return de.relevance - se.relevance;
        if (se.language && de.language) {
          if (ge(se.language).supersetOf === de.language)
            return 1;
          if (ge(de.language).supersetOf === se.language)
            return -1;
        }
        return 0;
      }), [le, pe] = j, Ce = le;
      return Ce.secondBest = pe, Ce;
    }
    function Vt(i, m, A) {
      const I = m && c[m] || A;
      i.classList.add("hljs"), i.classList.add(`language-${I}`);
    }
    function ze(i) {
      let m = null;
      const A = q(i);
      if (E(A)) return;
      if (Te(
        "before:highlightElement",
        { el: i, language: A }
      ), i.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", i);
        return;
      }
      if (i.children.length > 0 && (u.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(i)), u.throwUnescapedHTML))
        throw new Yt(
          "One of your code blocks includes unescaped HTML.",
          i.innerHTML
        );
      m = i;
      const I = m.textContent, j = A ? G(I, { language: A, ignoreIllegals: !0 }) : He(I);
      i.innerHTML = j.value, i.dataset.highlighted = "yes", Vt(i, A, j.language), i.result = {
        language: j.language,
        // TODO: remove with version 11.0
        re: j.relevance,
        relevance: j.relevance
      }, j.secondBest && (i.secondBest = {
        language: j.secondBest.language,
        relevance: j.secondBest.relevance
      }), Te("after:highlightElement", { el: i, result: j, text: I });
    }
    function Qt(i) {
      u = Qe(u, i);
    }
    const Jt = () => {
      Re(), _e("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function en() {
      Re(), _e("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let tt = !1;
    function Re() {
      function i() {
        Re();
      }
      if (document.readyState === "loading") {
        tt || window.addEventListener("DOMContentLoaded", i, !1), tt = !0;
        return;
      }
      document.querySelectorAll(u.cssSelector).forEach(ze);
    }
    function tn(i, m) {
      let A = null;
      try {
        A = m(t);
      } catch (I) {
        if (me("Language definition for '{}' could not be registered.".replace("{}", i)), P)
          me(I);
        else
          throw I;
        A = h;
      }
      A.name || (A.name = i), o[i] = A, A.rawDefinition = m.bind(null, t), A.aliases && nt(A.aliases, { languageName: i });
    }
    function nn(i) {
      delete o[i];
      for (const m of Object.keys(c))
        c[m] === i && delete c[m];
    }
    function an() {
      return Object.keys(o);
    }
    function ge(i) {
      return i = (i || "").toLowerCase(), o[i] || o[c[i]];
    }
    function nt(i, { languageName: m }) {
      typeof i == "string" && (i = [i]), i.forEach((A) => {
        c[A.toLowerCase()] = m;
      });
    }
    function at(i) {
      const m = ge(i);
      return m && !m.disableAutodetect;
    }
    function rn(i) {
      i["before:highlightBlock"] && !i["before:highlightElement"] && (i["before:highlightElement"] = (m) => {
        i["before:highlightBlock"](
          Object.assign({ block: m.el }, m)
        );
      }), i["after:highlightBlock"] && !i["after:highlightElement"] && (i["after:highlightElement"] = (m) => {
        i["after:highlightBlock"](
          Object.assign({ block: m.el }, m)
        );
      });
    }
    function on(i) {
      rn(i), _.push(i);
    }
    function sn(i) {
      const m = _.indexOf(i);
      m !== -1 && _.splice(m, 1);
    }
    function Te(i, m) {
      const A = i;
      _.forEach(function(I) {
        I[A] && I[A](m);
      });
    }
    function cn(i) {
      return _e("10.7.0", "highlightBlock will be removed entirely in v12.0"), _e("10.7.0", "Please use highlightElement now."), ze(i);
    }
    Object.assign(t, {
      highlight: G,
      highlightAuto: He,
      highlightAll: Re,
      highlightElement: ze,
      // TODO: Remove with v12 API
      highlightBlock: cn,
      configure: Qt,
      initHighlighting: Jt,
      initHighlightingOnLoad: en,
      registerLanguage: tn,
      unregisterLanguage: nn,
      listLanguages: an,
      getLanguage: ge,
      registerAliases: nt,
      autoDetection: at,
      inherit: Qe,
      addPlugin: on,
      removePlugin: sn
    }), t.debugMode = function() {
      P = !1;
    }, t.safeMode = function() {
      P = !0;
    }, t.versionString = qt, t.regex = {
      concat: S,
      lookahead: x,
      either: D,
      optional: R,
      anyNumberOfTimes: N
    };
    for (const i in ke)
      typeof ke[i] == "object" && n(ke[i]);
    return Object.assign(t, ke), t;
  }, ye = et({});
  return ye.newInstance = () => et({}), Ke = ye, ye.HighlightJS = ye, ye.default = ye, Ke;
}
var vn = /* @__PURE__ */ mn();
const O = /* @__PURE__ */ fn(vn), dt = "[A-Za-z$_][0-9A-Za-z$_]*", En = [
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
], _n = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], ut = [
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
], bt = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], ht = [
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
], yn = [
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
], xn = [].concat(
  ht,
  ut,
  bt
);
function gt(n) {
  const e = n.regex, a = (T, { after: te }) => {
    const oe = "</" + T[0].slice(1);
    return T.input.indexOf(oe, te) !== -1;
  }, r = dt, s = {
    begin: "<>",
    end: "</>"
  }, l = /<[A-Za-z0-9\\._:-]+\s*\/>/, b = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (T, te) => {
      const oe = T[0].length + T.index, ce = T.input[oe];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        ce === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        ce === ","
      ) {
        te.ignoreMatch();
        return;
      }
      ce === ">" && (a(T, { after: oe }) || te.ignoreMatch());
      let be;
      const fe = T.input.substring(oe);
      if (be = fe.match(/^\s*=/)) {
        te.ignoreMatch();
        return;
      }
      if ((be = fe.match(/^\s+extends\s+/)) && be.index === 0) {
        te.ignoreMatch();
        return;
      }
    }
  }, g = {
    $pattern: dt,
    keyword: En,
    literal: _n,
    built_in: xn,
    "variable.language": yn
  }, f = "[0-9](_?[0-9])*", v = `\\.(${f})`, C = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", k = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${C})((${v})|\\.)?|(${v}))[eE][+-]?(${f})\\b` },
      { begin: `\\b(${C})\\b((${v})\\b|\\.)?|(${v})\\b` },
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
  }, x = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: g,
    contains: []
    // defined later
  }, N = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        n.BACKSLASH_ESCAPE,
        x
      ],
      subLanguage: "xml"
    }
  }, R = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        n.BACKSLASH_ESCAPE,
        x
      ],
      subLanguage: "css"
    }
  }, S = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        n.BACKSLASH_ESCAPE,
        x
      ],
      subLanguage: "graphql"
    }
  }, $ = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      n.BACKSLASH_ESCAPE,
      x
    ]
  }, B = {
    className: "comment",
    variants: [
      n.COMMENT(
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
                  begin: r + "(?=\\s*(-)|$)",
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
      n.C_BLOCK_COMMENT_MODE,
      n.C_LINE_COMMENT_MODE
    ]
  }, J = [
    n.APOS_STRING_MODE,
    n.QUOTE_STRING_MODE,
    N,
    R,
    S,
    $,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    k
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  x.contains = J.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: g,
    contains: [
      "self"
    ].concat(J)
  });
  const V = [].concat(B, x.contains), H = V.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: g,
      contains: ["self"].concat(V)
    }
  ]), z = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: g,
    contains: H
  }, ie = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          r,
          /\s+/,
          /extends/,
          /\s+/,
          e.concat(r, "(", e.concat(/\./, r), ")*")
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
          r
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, F = {
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
        ...ut,
        ...bt
      ]
    }
  }, ee = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, ne = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          r,
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
    contains: [z],
    illegal: /%/
  }, ae = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function K(T) {
    return e.concat("(?!", T.join("|"), ")");
  }
  const Z = {
    match: e.concat(
      /\b/,
      K([
        ...ht,
        "super",
        "import"
      ].map((T) => `${T}\\s*\\(`)),
      r,
      e.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, W = {
    begin: e.concat(/\./, e.lookahead(
      e.concat(r, /(?![0-9A-Za-z$_(])/)
    )),
    end: r,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, Y = {
    match: [
      /get|set/,
      /\s+/,
      r,
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
      z
    ]
  }, re = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + n.UNDERSCORE_IDENT_RE + ")\\s*=>", xe = {
    match: [
      /const|var|let/,
      /\s+/,
      r,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      e.lookahead(re)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      z
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: g,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: H, CLASS_REFERENCE: F },
    illegal: /#(?![$_A-z])/,
    contains: [
      n.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      ee,
      n.APOS_STRING_MODE,
      n.QUOTE_STRING_MODE,
      N,
      R,
      S,
      $,
      B,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      k,
      F,
      {
        scope: "attr",
        match: r + e.lookahead(":"),
        relevance: 0
      },
      xe,
      {
        // "value" container
        begin: "(" + n.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          B,
          n.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: re,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: n.UNDERSCORE_IDENT_RE,
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
                    keywords: g,
                    contains: H
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
              { begin: s.begin, end: s.end },
              { match: l },
              {
                begin: b.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": b.isTrulyOpeningTag,
                end: b.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: b.begin,
                end: b.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      ne,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + n.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          z,
          n.inherit(n.TITLE_MODE, { begin: r, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      W,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + r,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [z]
      },
      Z,
      ae,
      ie,
      Y,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const wn = (n) => ({
  IMPORTANT: {
    scope: "meta",
    begin: "!important"
  },
  BLOCK_COMMENT: n.C_BLOCK_COMMENT_MODE,
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
      n.APOS_STRING_MODE,
      n.QUOTE_STRING_MODE
    ]
  },
  CSS_NUMBER_MODE: {
    scope: "number",
    begin: n.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
    relevance: 0
  },
  CSS_VARIABLE: {
    className: "attr",
    begin: /--[A-Za-z_][A-Za-z0-9_-]*/
  }
}), Sn = [
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
], An = [
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
], kn = [
  ...Sn,
  ...An
], Nn = [
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
].sort().reverse(), Rn = [
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
].sort().reverse(), Tn = [
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
].sort().reverse(), Cn = [
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
function Mn(n) {
  const e = n.regex, a = wn(n), r = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ }, s = "and or not only", l = /@-?\w[\w]*(-\w+)*/, b = "[a-zA-Z-][a-zA-Z0-9_-]*", g = [
    n.APOS_STRING_MODE,
    n.QUOTE_STRING_MODE
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
      a.BLOCK_COMMENT,
      r,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      a.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\." + b,
        relevance: 0
      },
      a.ATTRIBUTE_SELECTOR_MODE,
      {
        className: "selector-pseudo",
        variants: [
          { begin: ":(" + Rn.join("|") + ")" },
          { begin: ":(:)?(" + Tn.join("|") + ")" }
        ]
      },
      // we may actually need this (12/2020)
      // { // pseudo-selector params
      //   begin: /\(/,
      //   end: /\)/,
      //   contains: [ hljs.CSS_NUMBER_MODE ]
      // },
      a.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + Cn.join("|") + ")\\b"
      },
      // attribute values
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          a.BLOCK_COMMENT,
          a.HEXCOLOR,
          a.IMPORTANT,
          a.CSS_NUMBER_MODE,
          ...g,
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
              ...g,
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
          a.FUNCTION_DISPATCH
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
            begin: l
          },
          {
            begin: /\s/,
            endsWithParent: !0,
            excludeEnd: !0,
            relevance: 0,
            keywords: {
              $pattern: /[a-z-]+/,
              keyword: s,
              attribute: Nn.join(" ")
            },
            contains: [
              {
                begin: /[a-z-]+(?=:)/,
                className: "attribute"
              },
              ...g,
              a.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: "selector-tag",
        begin: "\\b(" + kn.join("|") + ")\\b"
      }
    ]
  };
}
function Ae(n) {
  const e = n.regex, a = e.concat(/[\p{L}_]/u, e.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), r = /[\p{L}0-9._:-]+/u, s = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  }, l = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  }, b = n.inherit(l, {
    begin: /\(/,
    end: /\)/
  }), g = n.inherit(n.APOS_STRING_MODE, { className: "string" }), f = n.inherit(n.QUOTE_STRING_MODE, { className: "string" }), v = {
    endsWithParent: !0,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: "attr",
        begin: r,
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
                contains: [s]
              },
              {
                begin: /'/,
                end: /'/,
                contains: [s]
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
          l,
          f,
          g,
          b,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  l,
                  b,
                  f,
                  g
                ]
              }
            ]
          }
        ]
      },
      n.COMMENT(
        /<!--/,
        /-->/,
        { relevance: 10 }
      ),
      {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      },
      s,
      // xml processing instructions
      {
        className: "meta",
        end: /\?>/,
        variants: [
          {
            begin: /<\?xml/,
            relevance: 10,
            contains: [
              f
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
        contains: [v],
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
        contains: [v],
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
            a,
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
            begin: a,
            relevance: 0,
            starts: v
          }
        ]
      },
      // close tag
      {
        className: "tag",
        begin: e.concat(
          /<\//,
          e.lookahead(e.concat(
            a,
            />/
          ))
        ),
        contains: [
          {
            className: "name",
            begin: a,
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
function On(n) {
  const e = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  }, a = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, r = [
    "true",
    "false",
    "null"
  ], s = {
    scope: "literal",
    beginKeywords: r.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc"],
    keywords: {
      literal: r
    },
    contains: [
      e,
      a,
      n.QUOTE_STRING_MODE,
      s,
      n.C_NUMBER_MODE,
      n.C_LINE_COMMENT_MODE,
      n.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function pt(n) {
  const e = "true false yes no null", a = "[\\w#;/?:@&=+$,.~*'()[\\]]+", r = {
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
  }, s = {
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
  }, l = {
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
  }, b = {
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
      n.BACKSLASH_ESCAPE,
      s
    ]
  }, g = n.inherit(b, { variants: [
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
  ] }), x = {
    className: "number",
    begin: "\\b" + "[0-9]{4}(-[0-9][0-9]){0,2}" + "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?" + "(\\.[0-9]*)?" + "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?" + "\\b"
  }, N = {
    end: ",",
    endsWithParent: !0,
    excludeEnd: !0,
    keywords: e,
    relevance: 0
  }, R = {
    begin: /\{/,
    end: /\}/,
    contains: [N],
    illegal: "\\n",
    relevance: 0
  }, S = {
    begin: "\\[",
    end: "\\]",
    contains: [N],
    illegal: "\\n",
    relevance: 0
  }, $ = [
    r,
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
      begin: "!\\w+!" + a
    },
    // https://yaml.org/spec/1.2/spec.html#id2784064
    {
      // verbatim tags
      className: "type",
      begin: "!<" + a + ">"
    },
    {
      // primary tags
      className: "type",
      begin: "!" + a
    },
    {
      // secondary tags
      className: "type",
      begin: "!!" + a
    },
    {
      // fragment id &ref
      className: "meta",
      begin: "&" + n.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // fragment reference *ref
      className: "meta",
      begin: "\\*" + n.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // array listing
      className: "bullet",
      // TODO: remove |$ hack when we have proper look-ahead support
      begin: "-(?=[ ]|$)",
      relevance: 0
    },
    n.HASH_COMMENT_MODE,
    {
      beginKeywords: e,
      keywords: { literal: e }
    },
    x,
    // numbers are any valid C-style number that
    // sit isolated from other words
    {
      className: "number",
      begin: n.C_NUMBER_RE + "\\b",
      relevance: 0
    },
    R,
    S,
    l,
    b
  ], D = [...$];
  return D.pop(), D.push(g), N.contains = D, {
    name: "YAML",
    case_insensitive: !0,
    aliases: ["yml"],
    contains: $
  };
}
function In(n) {
  const e = n.regex, a = /(?![A-Za-z0-9])(?![$])/, r = e.concat(
    /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,
    a
  ), s = e.concat(
    /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
    a
  ), l = e.concat(
    /[A-Z]+/,
    a
  ), b = {
    scope: "variable",
    match: "\\$+" + r
  }, g = {
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
  }, f = {
    scope: "subst",
    variants: [
      { begin: /\$\w+/ },
      {
        begin: /\{\$/,
        end: /\}/
      }
    ]
  }, v = n.inherit(n.APOS_STRING_MODE, { illegal: null }), C = n.inherit(n.QUOTE_STRING_MODE, {
    illegal: null,
    contains: n.QUOTE_STRING_MODE.contains.concat(f)
  }), k = {
    begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
    end: /[ \t]*(\w+)\b/,
    contains: n.QUOTE_STRING_MODE.contains.concat(f),
    "on:begin": (W, Y) => {
      Y.data._beginMatch = W[1] || W[2];
    },
    "on:end": (W, Y) => {
      Y.data._beginMatch !== W[1] && Y.ignoreMatch();
    }
  }, x = n.END_SAME_AS_BEGIN({
    begin: /<<<[ \t]*'(\w+)'\n/,
    end: /[ \t]*(\w+)\b/
  }), N = `[ 	
]`, R = {
    scope: "string",
    variants: [
      C,
      v,
      k,
      x
    ]
  }, S = {
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
  }, $ = [
    "false",
    "null",
    "true"
  ], D = [
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
  ], B = [
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
  ], V = {
    keyword: D,
    literal: ((W) => {
      const Y = [];
      return W.forEach((re) => {
        Y.push(re), re.toLowerCase() === re ? Y.push(re.toUpperCase()) : Y.push(re.toLowerCase());
      }), Y;
    })($),
    built_in: B
  }, H = (W) => W.map((Y) => Y.replace(/\|\d+$/, "")), z = { variants: [
    {
      match: [
        /new/,
        e.concat(N, "+"),
        // to prevent built ins from being confused as the class constructor call
        e.concat("(?!", H(B).join("\\b|"), "\\b)"),
        s
      ],
      scope: {
        1: "keyword",
        4: "title.class"
      }
    }
  ] }, ie = e.concat(r, "\\b(?!\\()"), F = { variants: [
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
        s,
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
        s,
        e.concat(
          "::",
          e.lookahead(/(?!class\b)/)
        )
      ],
      scope: { 1: "title.class" }
    },
    {
      match: [
        s,
        /::/,
        /class/
      ],
      scope: {
        1: "title.class",
        3: "variable.language"
      }
    }
  ] }, ee = {
    scope: "attr",
    match: e.concat(r, e.lookahead(":"), e.lookahead(/(?!::)/))
  }, ne = {
    relevance: 0,
    begin: /\(/,
    end: /\)/,
    keywords: V,
    contains: [
      ee,
      b,
      F,
      n.C_BLOCK_COMMENT_MODE,
      R,
      S,
      z
    ]
  }, ae = {
    relevance: 0,
    match: [
      /\b/,
      // to prevent keywords from being confused as the function title
      e.concat("(?!fn\\b|function\\b|", H(D).join("\\b|"), "|", H(B).join("\\b|"), "\\b)"),
      r,
      e.concat(N, "*"),
      e.lookahead(/(?=\()/)
    ],
    scope: { 3: "title.function.invoke" },
    contains: [ne]
  };
  ne.contains.push(ae);
  const K = [
    ee,
    F,
    n.C_BLOCK_COMMENT_MODE,
    R,
    S,
    z
  ], Z = {
    begin: e.concat(
      /#\[\s*\\?/,
      e.either(
        s,
        l
      )
    ),
    beginScope: "meta",
    end: /]/,
    endScope: "meta",
    keywords: {
      literal: $,
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
          literal: $,
          keyword: [
            "new",
            "array"
          ]
        },
        contains: [
          "self",
          ...K
        ]
      },
      ...K,
      {
        scope: "meta",
        variants: [
          { match: s },
          { match: l }
        ]
      }
    ]
  };
  return {
    case_insensitive: !1,
    keywords: V,
    contains: [
      Z,
      n.HASH_COMMENT_MODE,
      n.COMMENT("//", "$"),
      n.COMMENT(
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
          end: n.MATCH_NOTHING_RE,
          contains: [
            {
              match: /\?>/,
              scope: "meta",
              endsParent: !0
            }
          ]
        }
      },
      g,
      {
        scope: "variable.language",
        match: /\$this\b/
      },
      b,
      ae,
      F,
      {
        match: [
          /const/,
          /\s/,
          r
        ],
        scope: {
          1: "keyword",
          3: "variable.constant"
        }
      },
      z,
      {
        scope: "function",
        relevance: 0,
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: !0,
        illegal: "[$%\\[]",
        contains: [
          { beginKeywords: "use" },
          n.UNDERSCORE_TITLE_MODE,
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
            keywords: V,
            contains: [
              "self",
              Z,
              b,
              F,
              n.C_BLOCK_COMMENT_MODE,
              R,
              S
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
          n.UNDERSCORE_TITLE_MODE
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
        contains: [n.inherit(n.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
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
          n.UNDERSCORE_TITLE_MODE
        ]
      },
      R,
      S
    ]
  };
}
function Ln(n) {
  const e = n.regex, a = "HTTP/([32]|1\\.[01])", r = /[A-Za-z][A-Za-z0-9-]*/, s = {
    className: "attribute",
    begin: e.concat("^", r, "(?=\\:\\s)"),
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
  }, l = [
    s,
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
        begin: "^(?=" + a + " \\d{3})",
        end: /$/,
        contains: [
          {
            className: "meta",
            begin: a
          },
          {
            className: "number",
            begin: "\\b\\d{3}\\b"
          }
        ],
        starts: {
          end: /\b\B/,
          illegal: /\S/,
          contains: l
        }
      },
      // request
      {
        begin: "(?=^[A-Z]+ (.*?) " + a + "$)",
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
            begin: a
          },
          {
            className: "keyword",
            begin: "[A-Z]+"
          }
        ],
        starts: {
          end: /\b\B/,
          illegal: /\S/,
          contains: l
        }
      },
      // to allow headers to work even without a preamble
      n.inherit(s, { relevance: 0 })
    ]
  };
}
function $e(n) {
  return {
    name: "Plain text",
    aliases: [
      "text",
      "txt"
    ],
    disableAutodetect: !0
  };
}
function $n(n) {
  const e = n.regex;
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
function Be(n) {
  const e = n.regex, a = {}, r = {
    begin: /\$\{/,
    end: /\}/,
    contains: [
      "self",
      {
        begin: /:-/,
        contains: [a]
      }
      // default values
    ]
  };
  Object.assign(a, {
    className: "variable",
    variants: [
      { begin: e.concat(
        /\$[\w\d#@][\w\d_]*/,
        // negative look-ahead tries to avoid matching patterns that are not
        // Perl at all like $ident$, @ident@, etc.
        "(?![\\w\\d])(?![$])"
      ) },
      r
    ]
  });
  const s = {
    className: "subst",
    begin: /\$\(/,
    end: /\)/,
    contains: [n.BACKSLASH_ESCAPE]
  }, l = n.inherit(
    n.COMMENT(),
    {
      match: [
        /(^|\s)/,
        /#.*$/
      ],
      scope: {
        2: "comment"
      }
    }
  ), b = {
    begin: /<<-?\s*(?=\w+)/,
    starts: { contains: [
      n.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: "string"
      })
    ] }
  }, g = {
    className: "string",
    begin: /"/,
    end: /"/,
    contains: [
      n.BACKSLASH_ESCAPE,
      a,
      s
    ]
  };
  s.contains.push(g);
  const f = {
    match: /\\"/
  }, v = {
    className: "string",
    begin: /'/,
    end: /'/
  }, C = {
    match: /\\'/
  }, k = {
    begin: /\$?\(\(/,
    end: /\)\)/,
    contains: [
      {
        begin: /\d+#[0-9a-f]+/,
        className: "number"
      },
      n.NUMBER_MODE,
      a
    ]
  }, x = [
    "fish",
    "bash",
    "zsh",
    "sh",
    "csh",
    "ksh",
    "tcsh",
    "dash",
    "scsh"
  ], N = n.SHEBANG({
    binary: `(${x.join("|")})`,
    relevance: 10
  }), R = {
    className: "function",
    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
    returnBegin: !0,
    contains: [n.inherit(n.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
    relevance: 0
  }, S = [
    "if",
    "then",
    "else",
    "elif",
    "fi",
    "time",
    "for",
    "while",
    "until",
    "in",
    "do",
    "done",
    "case",
    "esac",
    "coproc",
    "function",
    "select"
  ], $ = [
    "true",
    "false"
  ], D = { match: /(\/[a-z._-]+)+/ }, B = [
    "break",
    "cd",
    "continue",
    "eval",
    "exec",
    "exit",
    "export",
    "getopts",
    "hash",
    "pwd",
    "readonly",
    "return",
    "shift",
    "test",
    "times",
    "trap",
    "umask",
    "unset"
  ], J = [
    "alias",
    "bind",
    "builtin",
    "caller",
    "command",
    "declare",
    "echo",
    "enable",
    "help",
    "let",
    "local",
    "logout",
    "mapfile",
    "printf",
    "read",
    "readarray",
    "source",
    "sudo",
    "type",
    "typeset",
    "ulimit",
    "unalias"
  ], V = [
    "autoload",
    "bg",
    "bindkey",
    "bye",
    "cap",
    "chdir",
    "clone",
    "comparguments",
    "compcall",
    "compctl",
    "compdescribe",
    "compfiles",
    "compgroups",
    "compquote",
    "comptags",
    "comptry",
    "compvalues",
    "dirs",
    "disable",
    "disown",
    "echotc",
    "echoti",
    "emulate",
    "fc",
    "fg",
    "float",
    "functions",
    "getcap",
    "getln",
    "history",
    "integer",
    "jobs",
    "kill",
    "limit",
    "log",
    "noglob",
    "popd",
    "print",
    "pushd",
    "pushln",
    "rehash",
    "sched",
    "setcap",
    "setopt",
    "stat",
    "suspend",
    "ttyctl",
    "unfunction",
    "unhash",
    "unlimit",
    "unsetopt",
    "vared",
    "wait",
    "whence",
    "where",
    "which",
    "zcompile",
    "zformat",
    "zftp",
    "zle",
    "zmodload",
    "zparseopts",
    "zprof",
    "zpty",
    "zregexparse",
    "zsocket",
    "zstyle",
    "ztcp"
  ], H = [
    "chcon",
    "chgrp",
    "chown",
    "chmod",
    "cp",
    "dd",
    "df",
    "dir",
    "dircolors",
    "ln",
    "ls",
    "mkdir",
    "mkfifo",
    "mknod",
    "mktemp",
    "mv",
    "realpath",
    "rm",
    "rmdir",
    "shred",
    "sync",
    "touch",
    "truncate",
    "vdir",
    "b2sum",
    "base32",
    "base64",
    "cat",
    "cksum",
    "comm",
    "csplit",
    "cut",
    "expand",
    "fmt",
    "fold",
    "head",
    "join",
    "md5sum",
    "nl",
    "numfmt",
    "od",
    "paste",
    "ptx",
    "pr",
    "sha1sum",
    "sha224sum",
    "sha256sum",
    "sha384sum",
    "sha512sum",
    "shuf",
    "sort",
    "split",
    "sum",
    "tac",
    "tail",
    "tr",
    "tsort",
    "unexpand",
    "uniq",
    "wc",
    "arch",
    "basename",
    "chroot",
    "date",
    "dirname",
    "du",
    "echo",
    "env",
    "expr",
    "factor",
    // "false", // keyword literal already
    "groups",
    "hostid",
    "id",
    "link",
    "logname",
    "nice",
    "nohup",
    "nproc",
    "pathchk",
    "pinky",
    "printenv",
    "printf",
    "pwd",
    "readlink",
    "runcon",
    "seq",
    "sleep",
    "stat",
    "stdbuf",
    "stty",
    "tee",
    "test",
    "timeout",
    // "true", // keyword literal already
    "tty",
    "uname",
    "unlink",
    "uptime",
    "users",
    "who",
    "whoami",
    "yes"
  ];
  return {
    name: "Bash",
    aliases: [
      "sh",
      "zsh"
    ],
    keywords: {
      $pattern: /\b[a-z][a-z0-9._-]+\b/,
      keyword: S,
      literal: $,
      built_in: [
        ...B,
        ...J,
        // Shell modifiers
        "set",
        "shopt",
        ...V,
        ...H
      ]
    },
    contains: [
      N,
      // to catch known shells and boost relevancy
      n.SHEBANG(),
      // to catch unknown shells but still highlight the shebang
      R,
      k,
      l,
      b,
      D,
      g,
      f,
      v,
      C,
      a
    ]
  };
}
function ft(n) {
  const e = n.regex, a = new RegExp("[\\p{XID_Start}_]\\p{XID_Continue}*", "u"), r = [
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "case",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "match",
    "nonlocal|10",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield"
  ], g = {
    $pattern: /[A-Za-z]\w+|__\w+__/,
    keyword: r,
    built_in: [
      "__import__",
      "abs",
      "all",
      "any",
      "ascii",
      "bin",
      "bool",
      "breakpoint",
      "bytearray",
      "bytes",
      "callable",
      "chr",
      "classmethod",
      "compile",
      "complex",
      "delattr",
      "dict",
      "dir",
      "divmod",
      "enumerate",
      "eval",
      "exec",
      "filter",
      "float",
      "format",
      "frozenset",
      "getattr",
      "globals",
      "hasattr",
      "hash",
      "help",
      "hex",
      "id",
      "input",
      "int",
      "isinstance",
      "issubclass",
      "iter",
      "len",
      "list",
      "locals",
      "map",
      "max",
      "memoryview",
      "min",
      "next",
      "object",
      "oct",
      "open",
      "ord",
      "pow",
      "print",
      "property",
      "range",
      "repr",
      "reversed",
      "round",
      "set",
      "setattr",
      "slice",
      "sorted",
      "staticmethod",
      "str",
      "sum",
      "super",
      "tuple",
      "type",
      "vars",
      "zip"
    ],
    literal: [
      "__debug__",
      "Ellipsis",
      "False",
      "None",
      "NotImplemented",
      "True"
    ],
    type: [
      "Any",
      "Callable",
      "Coroutine",
      "Dict",
      "List",
      "Literal",
      "Generic",
      "Optional",
      "Sequence",
      "Set",
      "Tuple",
      "Type",
      "Union"
    ]
  }, f = {
    className: "meta",
    begin: /^(>>>|\.\.\.) /
  }, v = {
    className: "subst",
    begin: /\{/,
    end: /\}/,
    keywords: g,
    illegal: /#/
  }, C = {
    begin: /\{\{/,
    relevance: 0
  }, k = {
    className: "string",
    contains: [n.BACKSLASH_ESCAPE],
    variants: [
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
        end: /'''/,
        contains: [
          n.BACKSLASH_ESCAPE,
          f
        ],
        relevance: 10
      },
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
        end: /"""/,
        contains: [
          n.BACKSLASH_ESCAPE,
          f
        ],
        relevance: 10
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'''/,
        end: /'''/,
        contains: [
          n.BACKSLASH_ESCAPE,
          f,
          C,
          v
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"""/,
        end: /"""/,
        contains: [
          n.BACKSLASH_ESCAPE,
          f,
          C,
          v
        ]
      },
      {
        begin: /([uU]|[rR])'/,
        end: /'/,
        relevance: 10
      },
      {
        begin: /([uU]|[rR])"/,
        end: /"/,
        relevance: 10
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])'/,
        end: /'/
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])"/,
        end: /"/
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'/,
        end: /'/,
        contains: [
          n.BACKSLASH_ESCAPE,
          C,
          v
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"/,
        end: /"/,
        contains: [
          n.BACKSLASH_ESCAPE,
          C,
          v
        ]
      },
      n.APOS_STRING_MODE,
      n.QUOTE_STRING_MODE
    ]
  }, x = "[0-9](_?[0-9])*", N = `(\\b(${x}))?\\.(${x})|\\b(${x})\\.`, R = `\\b|${r.join("|")}`, S = {
    className: "number",
    relevance: 0,
    variants: [
      // exponentfloat, pointfloat
      // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
      // optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      // Note: no leading \b because floats can start with a decimal point
      // and we don't want to mishandle e.g. `fn(.5)`,
      // no trailing \b for pointfloat because it can end with a decimal point
      // and we don't want to mishandle e.g. `0..hex()`; this should be safe
      // because both MUST contain a decimal point and so cannot be confused with
      // the interior part of an identifier
      {
        begin: `(\\b(${x})|(${N}))[eE][+-]?(${x})[jJ]?(?=${R})`
      },
      {
        begin: `(${N})[jJ]?`
      },
      // decinteger, bininteger, octinteger, hexinteger
      // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
      // optionally "long" in Python 2
      // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
      // decinteger is optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${R})`
      },
      {
        begin: `\\b0[bB](_?[01])+[lL]?(?=${R})`
      },
      {
        begin: `\\b0[oO](_?[0-7])+[lL]?(?=${R})`
      },
      {
        begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${R})`
      },
      // imagnumber (digitpart-based)
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b(${x})[jJ](?=${R})`
      }
    ]
  }, $ = {
    className: "comment",
    begin: e.lookahead(/# type:/),
    end: /$/,
    keywords: g,
    contains: [
      {
        // prevent keywords from coloring `type`
        begin: /# type:/
      },
      // comment within a datatype comment includes no keywords
      {
        begin: /#/,
        end: /\b\B/,
        endsWithParent: !0
      }
    ]
  }, D = {
    className: "params",
    variants: [
      // Exclude params in functions without params
      {
        className: "",
        begin: /\(\s*\)/,
        skip: !0
      },
      {
        begin: /\(/,
        end: /\)/,
        excludeBegin: !0,
        excludeEnd: !0,
        keywords: g,
        contains: [
          "self",
          f,
          S,
          k,
          n.HASH_COMMENT_MODE
        ]
      }
    ]
  };
  return v.contains = [
    k,
    S,
    f
  ], {
    name: "Python",
    aliases: [
      "py",
      "gyp",
      "ipython"
    ],
    unicodeRegex: !0,
    keywords: g,
    illegal: /(<\/|\?)|=>/,
    contains: [
      f,
      S,
      {
        // very common convention
        scope: "variable.language",
        match: /\bself\b/
      },
      {
        // eat "if" prior to string so that it won't accidentally be
        // labeled as an f-string
        beginKeywords: "if",
        relevance: 0
      },
      { match: /\bor\b/, scope: "keyword" },
      k,
      $,
      n.HASH_COMMENT_MODE,
      {
        match: [
          /\bdef/,
          /\s+/,
          a
        ],
        scope: {
          1: "keyword",
          3: "title.function"
        },
        contains: [D]
      },
      {
        variants: [
          {
            match: [
              /\bclass/,
              /\s+/,
              a,
              /\s*/,
              /\(\s*/,
              a,
              /\s*\)/
            ]
          },
          {
            match: [
              /\bclass/,
              /\s+/,
              a
            ]
          }
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          6: "title.class.inherited"
        }
      },
      {
        className: "meta",
        begin: /^[\t ]*@/,
        end: /(?=#)|$/,
        contains: [
          S,
          D,
          k
        ]
      }
    ]
  };
}
const Ie = "[A-Za-z$_][0-9A-Za-z$_]*", mt = [
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
], vt = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], Et = [
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
], _t = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], yt = [
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
], xt = [
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
], wt = [].concat(
  yt,
  Et,
  _t
);
function Bn(n) {
  const e = n.regex, a = (T, { after: te }) => {
    const oe = "</" + T[0].slice(1);
    return T.input.indexOf(oe, te) !== -1;
  }, r = Ie, s = {
    begin: "<>",
    end: "</>"
  }, l = /<[A-Za-z0-9\\._:-]+\s*\/>/, b = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (T, te) => {
      const oe = T[0].length + T.index, ce = T.input[oe];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        ce === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        ce === ","
      ) {
        te.ignoreMatch();
        return;
      }
      ce === ">" && (a(T, { after: oe }) || te.ignoreMatch());
      let be;
      const fe = T.input.substring(oe);
      if (be = fe.match(/^\s*=/)) {
        te.ignoreMatch();
        return;
      }
      if ((be = fe.match(/^\s+extends\s+/)) && be.index === 0) {
        te.ignoreMatch();
        return;
      }
    }
  }, g = {
    $pattern: Ie,
    keyword: mt,
    literal: vt,
    built_in: wt,
    "variable.language": xt
  }, f = "[0-9](_?[0-9])*", v = `\\.(${f})`, C = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", k = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${C})((${v})|\\.)?|(${v}))[eE][+-]?(${f})\\b` },
      { begin: `\\b(${C})\\b((${v})\\b|\\.)?|(${v})\\b` },
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
  }, x = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: g,
    contains: []
    // defined later
  }, N = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        n.BACKSLASH_ESCAPE,
        x
      ],
      subLanguage: "xml"
    }
  }, R = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        n.BACKSLASH_ESCAPE,
        x
      ],
      subLanguage: "css"
    }
  }, S = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        n.BACKSLASH_ESCAPE,
        x
      ],
      subLanguage: "graphql"
    }
  }, $ = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      n.BACKSLASH_ESCAPE,
      x
    ]
  }, B = {
    className: "comment",
    variants: [
      n.COMMENT(
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
                  begin: r + "(?=\\s*(-)|$)",
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
      n.C_BLOCK_COMMENT_MODE,
      n.C_LINE_COMMENT_MODE
    ]
  }, J = [
    n.APOS_STRING_MODE,
    n.QUOTE_STRING_MODE,
    N,
    R,
    S,
    $,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    k
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  x.contains = J.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: g,
    contains: [
      "self"
    ].concat(J)
  });
  const V = [].concat(B, x.contains), H = V.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: g,
      contains: ["self"].concat(V)
    }
  ]), z = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: g,
    contains: H
  }, ie = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          r,
          /\s+/,
          /extends/,
          /\s+/,
          e.concat(r, "(", e.concat(/\./, r), ")*")
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
          r
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, F = {
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
        ...Et,
        ..._t
      ]
    }
  }, ee = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, ne = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          r,
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
    contains: [z],
    illegal: /%/
  }, ae = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function K(T) {
    return e.concat("(?!", T.join("|"), ")");
  }
  const Z = {
    match: e.concat(
      /\b/,
      K([
        ...yt,
        "super",
        "import"
      ].map((T) => `${T}\\s*\\(`)),
      r,
      e.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, W = {
    begin: e.concat(/\./, e.lookahead(
      e.concat(r, /(?![0-9A-Za-z$_(])/)
    )),
    end: r,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, Y = {
    match: [
      /get|set/,
      /\s+/,
      r,
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
      z
    ]
  }, re = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + n.UNDERSCORE_IDENT_RE + ")\\s*=>", xe = {
    match: [
      /const|var|let/,
      /\s+/,
      r,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      e.lookahead(re)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      z
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: g,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: H, CLASS_REFERENCE: F },
    illegal: /#(?![$_A-z])/,
    contains: [
      n.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      ee,
      n.APOS_STRING_MODE,
      n.QUOTE_STRING_MODE,
      N,
      R,
      S,
      $,
      B,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      k,
      F,
      {
        scope: "attr",
        match: r + e.lookahead(":"),
        relevance: 0
      },
      xe,
      {
        // "value" container
        begin: "(" + n.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          B,
          n.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: re,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: n.UNDERSCORE_IDENT_RE,
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
                    keywords: g,
                    contains: H
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
              { begin: s.begin, end: s.end },
              { match: l },
              {
                begin: b.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": b.isTrulyOpeningTag,
                end: b.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: b.begin,
                end: b.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      ne,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + n.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          z,
          n.inherit(n.TITLE_MODE, { begin: r, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      W,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + r,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [z]
      },
      Z,
      ae,
      ie,
      Y,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
function St(n) {
  const e = n.regex, a = Bn(n), r = Ie, s = [
    "any",
    "void",
    "number",
    "boolean",
    "string",
    "object",
    "never",
    "symbol",
    "bigint",
    "unknown"
  ], l = {
    begin: [
      /namespace/,
      /\s+/,
      n.IDENT_RE
    ],
    beginScope: {
      1: "keyword",
      3: "title.class"
    }
  }, b = {
    beginKeywords: "interface",
    end: /\{/,
    excludeEnd: !0,
    keywords: {
      keyword: "interface extends",
      built_in: s
    },
    contains: [a.exports.CLASS_REFERENCE]
  }, g = {
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use strict['"]/
  }, f = [
    "type",
    // "namespace",
    "interface",
    "public",
    "private",
    "protected",
    "implements",
    "declare",
    "abstract",
    "readonly",
    "enum",
    "override",
    "satisfies"
  ], v = {
    $pattern: Ie,
    keyword: mt.concat(f),
    literal: vt,
    built_in: wt.concat(s),
    "variable.language": xt
  }, C = {
    className: "meta",
    begin: "@" + r
  }, k = (S, $, D) => {
    const B = S.contains.findIndex((J) => J.label === $);
    if (B === -1)
      throw new Error("can not find mode to replace");
    S.contains.splice(B, 1, D);
  };
  Object.assign(a.keywords, v), a.exports.PARAMS_CONTAINS.push(C);
  const x = a.contains.find((S) => S.scope === "attr"), N = Object.assign(
    {},
    x,
    { match: e.concat(r, e.lookahead(/\s*\?:/)) }
  );
  a.exports.PARAMS_CONTAINS.push([
    a.exports.CLASS_REFERENCE,
    // class reference for highlighting the params types
    x,
    // highlight the params key
    N
    // Added for optional property assignment highlighting
  ]), a.contains = a.contains.concat([
    C,
    l,
    b,
    N
    // Added for optional property assignment highlighting
  ]), k(a, "shebang", n.SHEBANG()), k(a, "use_strict", g);
  const R = a.contains.find((S) => S.label === "func.def");
  return R.relevance = 0, Object.assign(a, {
    name: "TypeScript",
    aliases: [
      "ts",
      "tsx",
      "mts",
      "cts"
    ]
  }), a;
}
O.registerLanguage("javascript", gt);
O.registerLanguage("js", gt);
O.registerLanguage("css", Mn);
O.registerLanguage("html", Ae);
O.registerLanguage("xml", Ae);
O.registerLanguage("xhtml", Ae);
O.registerLanguage("svg", Ae);
O.registerLanguage("markup", Ae);
O.registerLanguage("json", On);
O.registerLanguage("yaml", pt);
O.registerLanguage("yml", pt);
O.registerLanguage("php", In);
O.registerLanguage("http", Ln);
O.registerLanguage("plaintext", $e);
O.registerLanguage("text", $e);
O.registerLanguage("txt", $e);
O.registerLanguage("csv", $e);
O.registerLanguage("diff", $n);
O.registerLanguage("bash", Be);
O.registerLanguage("shell", Be);
O.registerLanguage("sh", Be);
O.registerLanguage("zsh", Be);
O.registerLanguage("python", ft);
O.registerLanguage("py", ft);
O.registerLanguage("typescript", St);
O.registerLanguage("ts", St);
if (typeof document < "u") {
  const n = document.createElement("style");
  n.textContent = "code-block:not(:defined),code-block-group:not(:defined){display:block;opacity:0}", document.head.appendChild(n);
}
const Se = /* @__PURE__ */ new Set();
let Ee = null, Le = null;
function De() {
  const n = document.documentElement, e = document.body;
  if (!n || !e) return null;
  if (n.classList.contains("dark") || e.classList.contains("dark") || n.getAttribute("data-theme") === "dark" || e.getAttribute("data-theme") === "dark") return !0;
  if (n.getAttribute("data-theme") === "light" || e.getAttribute("data-theme") === "light") return !1;
  if (n.getAttribute("data-bs-theme") === "dark" || e.getAttribute("data-bs-theme") === "dark") return !0;
  if (n.getAttribute("data-bs-theme") === "light" || e.getAttribute("data-bs-theme") === "light") return !1;
  if (n.getAttribute("data-mode") === "dark") return !0;
  if (n.getAttribute("data-mode") === "light") return !1;
  const a = getComputedStyle(n).colorScheme;
  return a === "dark" ? !0 : a === "light" ? !1 : null;
}
function Dn() {
  const n = De();
  if (n !== Le) {
    Le = n;
    for (const e of Se)
      e._onPageModeChange(n);
  }
}
function Pn() {
  if (Ee) return;
  Ee = new MutationObserver(Dn);
  const n = {
    attributes: !0,
    attributeFilter: ["class", "data-theme", "data-bs-theme", "data-mode", "style"]
  };
  Ee.observe(document.documentElement, n), document.body && Ee.observe(document.body, n);
}
function Un() {
  Ee && (Ee.disconnect(), Ee = null);
}
function Ze(n) {
  Se.add(n), Se.size === 1 && Pn();
  const e = De();
  Le = e, n._onPageModeChange(e);
}
function At(n) {
  Se.delete(n), Se.size === 0 && (Un(), Le = null);
}
class Hn extends HTMLElement {
  constructor() {
    super(), this.shadowRoot || this.attachShadow({ mode: "open" }), this._codeContent = null, this._showShareMenu = !1, this._handleOutsideClick = this._handleOutsideClick.bind(this), this._observer = null, this._highlighted = !1, this._isLoading = !1, this._loadError = null;
  }
  connectedCallback() {
    var a;
    if ((a = this.shadowRoot) != null && a.children.length && this.hasAttribute("data-ssr")) {
      const r = this.querySelector("textarea");
      r && (this._codeContent = r.value || r.textContent, r.remove()), this._hydrateInteractivity(), Ze(this);
      return;
    }
    const e = this.querySelector("textarea");
    e ? (this._codeContent = e.value || e.textContent, e.remove()) : this._codeContent = this.textContent, this.src ? this._loadFromSrc() : this.hasAttribute("lazy") ? (this.renderPlaceholder(), this._setupLazyObserver()) : this.render(), Ze(this);
  }
  disconnectedCallback() {
    At(this), this._observer && (this._observer.disconnect(), this._observer = null), document.removeEventListener("click", this._handleOutsideClick);
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
  /**
   * Load code content from external URL specified by src attribute
   */
  async _loadFromSrc() {
    const e = this.src;
    if (e) {
      this._isLoading = !0, this._loadError = null, this._renderLoadingState();
      try {
        const a = await fetch(e);
        if (!a.ok)
          throw new Error(`HTTP ${a.status}: ${a.statusText}`);
        const r = await a.text();
        if (this._codeContent = r, !this.hasAttribute("language")) {
          const s = this._detectLanguageFromUrl(e);
          s && this.setAttribute("language", s);
        }
        if (!this.hasAttribute("filename")) {
          const s = e.split("/").pop().split("?")[0];
          s && this.setAttribute("filename", s);
        }
        this._isLoading = !1, this.render(), this.dispatchEvent(new CustomEvent("code-loaded", {
          detail: { url: e, code: r },
          bubbles: !0
        }));
      } catch (a) {
        this._isLoading = !1, this._loadError = a.message, this._renderErrorState(), this.dispatchEvent(new CustomEvent("code-load-error", {
          detail: { url: e, error: a.message },
          bubbles: !0
        }));
      }
    }
  }
  /**
   * Detect language from URL file extension
   */
  _detectLanguageFromUrl(e) {
    const a = {
      js: "javascript",
      mjs: "javascript",
      cjs: "javascript",
      ts: "typescript",
      tsx: "typescript",
      jsx: "javascript",
      py: "python",
      css: "css",
      html: "html",
      htm: "html",
      json: "json",
      yaml: "yaml",
      yml: "yaml",
      xml: "xml",
      svg: "xml",
      sh: "bash",
      bash: "bash",
      zsh: "bash",
      php: "php",
      diff: "diff",
      patch: "diff",
      md: "markdown",
      markdown: "markdown",
      txt: "plaintext"
    }, s = e.split("/").pop().split("?")[0].split("#")[0].split(".").pop().toLowerCase();
    return a[s] || null;
  }
  /**
   * Render loading state while fetching external content
   */
  _renderLoadingState() {
    const e = this.theme === "dark";
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          <span class="label">Loading...</span>
          ${this.src ? `<span class="filename">${this.escapeHtml(this.src.split("/").pop().split("?")[0])}</span>` : ""}
        </div>
      </div>
      <div class="code-container" style="padding: 2rem; text-align: center;">
        <div class="loading-spinner" style="
          display: inline-block;
          width: 24px;
          height: 24px;
          border: 2px solid ${e ? "#30363d" : "#e1e4e8"};
          border-top-color: ${e ? "#58a6ff" : "#0969da"};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        "></div>
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </div>
    `;
  }
  /**
   * Render error state when external content fails to load
   */
  _renderErrorState() {
    const e = this.theme === "dark";
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          <span class="label" style="color: ${e ? "#f85149" : "#cf222e"};">Error</span>
          ${this.src ? `<span class="filename">${this.escapeHtml(this.src.split("/").pop().split("?")[0])}</span>` : ""}
        </div>
        <div class="header-actions">
          <button class="copy-button" onclick="this.getRootNode().host._loadFromSrc()">Retry</button>
        </div>
      </div>
      <div class="code-container" style="padding: 1.5rem; text-align: center;">
        <div style="color: ${e ? "#f85149" : "#cf222e"}; margin-bottom: 0.5rem;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div style="color: ${e ? "#8b949e" : "#57606a"}; font-size: 0.875rem;">
          Failed to load: ${this.escapeHtml(this._loadError || "Unknown error")}
        </div>
        <div style="color: ${e ? "#484f58" : "#6e7781"}; font-size: 0.75rem; margin-top: 0.25rem;">
          ${this.escapeHtml(this.src)}
        </div>
      </div>
    `;
  }
  static get observedAttributes() {
    return [
      "language",
      "label",
      "theme",
      "data-page-theme",
      "show-lines",
      "filename",
      "highlight-lines",
      "collapsed",
      "max-lines",
      "max-height",
      "wrap",
      "copy-text",
      "copied-text",
      "show-share",
      "show-download",
      "no-copy",
      "lazy",
      "focus-mode",
      "src"
    ];
  }
  attributeChangedCallback(e, a, r) {
    if (this.shadowRoot && a !== r) {
      if (e === "src" && r) {
        this._loadFromSrc();
        return;
      }
      e === "theme" && (this.hasAttribute("theme") ? this.removeAttribute("data-page-theme") : this._onPageModeChange(De())), this.render();
    }
  }
  _onPageModeChange(e) {
    if (this.hasAttribute("theme")) {
      this.removeAttribute("data-page-theme");
      return;
    }
    e === !0 ? this.setAttribute("data-page-theme", "dark") : e === !1 ? this.setAttribute("data-page-theme", "light") : this.removeAttribute("data-page-theme");
  }
  get language() {
    return this.getAttribute("language") || "plaintext";
  }
  get label() {
    return this.getAttribute("label") || this.filename || this.language.toUpperCase();
  }
  get theme() {
    return this.getAttribute("theme") || this.getAttribute("data-page-theme") || "light";
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
    const a = /* @__PURE__ */ new Set(), r = e.split(",");
    for (const s of r) {
      const l = s.trim();
      if (l.includes("-")) {
        const [b, g] = l.split("-").map(Number);
        for (let f = b; f <= g; f++)
          a.add(f);
      } else
        a.add(Number(l));
    }
    return a;
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
  get noCopy() {
    return this.hasAttribute("no-copy");
  }
  get lazy() {
    return this.hasAttribute("lazy");
  }
  get focusMode() {
    return this.hasAttribute("focus-mode");
  }
  get src() {
    return this.getAttribute("src") || "";
  }
  async copyCode() {
    const e = (this._codeContent || this.textContent).trim(), a = document.createElement("div");
    a.innerHTML = e;
    const r = a.textContent, s = this.shadowRoot.querySelector(".copy-button"), l = this.copyText, b = this.copiedText;
    try {
      await navigator.clipboard.writeText(r), s.textContent = b, s.classList.add("copied"), s.setAttribute("aria-label", "Code copied to clipboard");
    } catch (g) {
      console.error("Failed to copy code:", g), s.textContent = "Failed", s.classList.add("failed"), s.setAttribute("aria-label", "Failed to copy code");
    }
    setTimeout(() => {
      s.textContent = l, s.classList.remove("copied", "failed"), s.setAttribute("aria-label", "Copy code to clipboard");
    }, 2e3);
  }
  /**
   * Download code as a file
   */
  downloadCode() {
    const e = this.getCode(), a = this.filename || `code.${this._getFileExtension()}`, r = new Blob([e], { type: "text/plain" }), s = URL.createObjectURL(r), l = document.createElement("a");
    l.href = s, l.download = a, document.body.appendChild(l), l.click(), document.body.removeChild(l), URL.revokeObjectURL(s);
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
    const e = this.shadowRoot.querySelector(".share-menu"), a = this.shadowRoot.querySelector(".share-button");
    this._showShareMenu ? (e.style.display = "block", a.classList.add("active"), setTimeout(() => {
      document.addEventListener("click", this._handleOutsideClick);
    }, 0)) : (e.style.display = "none", a.classList.remove("active"), document.removeEventListener("click", this._handleOutsideClick));
  }
  _handleOutsideClick(e) {
    const a = this.shadowRoot.querySelector(".share-menu");
    a && !a.contains(e.target) && this.toggleShareMenu();
  }
  /**
   * Share via Web Share API
   */
  async shareViaWebAPI() {
    if (!navigator.share) return;
    const e = this.getCode(), a = this.filename || this.label;
    try {
      await navigator.share({
        title: a,
        text: e
      }), this.toggleShareMenu();
    } catch (r) {
      r.name !== "AbortError" && console.error("Error sharing:", r);
    }
  }
  /**
   * Open code in CodePen
   */
  openInCodePen() {
    const e = this.getCode(), a = this.language;
    let r = {
      title: this.filename || this.label || "Code Block Demo",
      description: "Code shared from code-block component",
      editors: "111"
    };
    ["html", "markup", "xhtml", "xml", "svg"].includes(a) ? (r.html = e, r.editors = "100") : a === "css" ? (r.css = e, r.editors = "010") : ["javascript", "js"].includes(a) ? (r.js = e, r.editors = "001") : (r.html = `<pre><code>${this.escapeHtml(e)}</code></pre>`, r.editors = "100");
    const s = document.createElement("form");
    s.action = "https://codepen.io/pen/define", s.method = "POST", s.target = "_blank";
    const l = document.createElement("input");
    l.type = "hidden", l.name = "data", l.value = JSON.stringify(r), s.appendChild(l), document.body.appendChild(s), s.submit(), document.body.removeChild(s), this.toggleShareMenu();
  }
  getStyles() {
    const e = this.theme === "dark";
    return `
      :host {
        /* Internal defaults — external --cb-* overrides always win */
        --_cb-bg: ${e ? "var(--color-surface-raised, #0d1117)" : "var(--color-surface-raised, #f6f8fa)"};
        --_cb-code-bg: ${e ? "var(--color-surface, #0d1117)" : "var(--color-surface, #fff)"};
        --_cb-header-bg: ${e ? "var(--color-surface-raised, #161b22)" : "var(--color-surface-raised, #e1e4e8)"};
        --_cb-text-color: ${e ? "var(--color-text, #c9d1d9)" : "var(--color-text, #24292e)"};
        --_cb-border-color: ${e ? "var(--color-border, #30363d)" : "var(--color-border, #e1e4e8)"};
        --_cb-comment: ${e ? "var(--color-text-muted, #8b949e)" : "var(--color-text-muted, #6a737d)"};
        --_cb-button-bg: ${e ? "#21262d" : "#fff"};
        --_cb-button-color: ${e ? "var(--color-text, #c9d1d9)" : "var(--color-text, #24292e)"};
        --_cb-scrollbar-track: ${e ? "#161b22" : "#f6f8fa"};
        --_cb-scrollbar-thumb: ${e ? "#30363d" : "#d1d5da"};

        display: block;
        margin: var(--cb-margin, 1rem 0);
        border-radius: var(--cb-border-radius, 8px);
        overflow: hidden;
        border: 1px solid var(--cb-border-color, var(--_cb-border-color));
        background: var(--cb-bg, var(--_cb-bg));
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
        font-size: var(--cb-font-size, 0.875rem);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--cb-header-padding, 0.5rem 1rem);
        background: var(--cb-header-bg, var(--_cb-header-bg));
        border-bottom: 1px solid var(--cb-border-color, var(--_cb-border-color));
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
        background: var(--cb-button-bg, var(--_cb-button-bg));
        border-width: var(--cb-button-border-width, 1px);
        border-style: var(--cb-button-border-style, solid);
        border-color: var(--cb-button-border, ${e ? "#30363d" : "#d1d5da"});
        border-radius: var(--cb-button-radius, 4px);
        padding: var(--cb-button-padding, 4px 12px);
        font-size: var(--cb-button-font-size, 0.75rem);
        font-weight: 500;
        color: var(--cb-button-color, var(--_cb-button-color));
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--cb-ui-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
        flex-shrink: 0;
      }

      .copy-button:hover {
        background: var(--cb-button-hover-bg, ${e ? "#30363d" : "#f3f4f6"});
        border-color: var(--cb-button-hover-border, ${e ? "#8b949e" : "#959da5"});
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
        border-radius: var(--cb-button-radius, 4px);
      }

      .action-button:hover {
        color: var(--cb-button-color, var(--_cb-button-color));
        background: var(--cb-action-button-hover-bg, ${e ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"});
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
        background: var(--cb-header-bg, var(--_cb-header-bg));
        border: 1px solid var(--cb-border-color, var(--_cb-border-color));
        border-radius: var(--cb-menu-radius, 8px);
        box-shadow: var(--cb-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
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
        color: var(--cb-text-color, var(--_cb-text-color));
        font-size: 0.8125rem;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s ease;
        border-bottom: 1px solid var(--cb-border-color, var(--_cb-border-color));
        font-family: var(--cb-ui-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
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
        background: var(--cb-code-bg, var(--_cb-code-bg));
      }

      .line-numbers {
        padding: var(--cb-code-padding, 1rem) 0;
        text-align: right;
        user-select: none;
        background: var(--cb-line-numbers-bg, ${e ? "#161b22" : "#f6f8fa"});
        border-right: 1px solid var(--cb-border-color, var(--_cb-border-color));
        color: var(--cb-line-numbers-color, ${e ? "#484f58" : "#959da5"});
        line-height: var(--cb-line-height, 1.6);
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
        color: var(--cb-text-color, var(--_cb-text-color));
        background: transparent;
        padding: var(--cb-code-padding, 1rem);
      }

      .code-line {
        display: block;
        line-height: var(--cb-line-height, 1.6);
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

      /* Focus mode - dims non-highlighted lines */
      :host([focus-mode]) .code-line:not(.highlighted) {
        opacity: var(--cb-focus-dim-opacity, 0.4);
        filter: blur(var(--cb-focus-blur, 0.5px));
        transition: opacity 0.2s ease, filter 0.2s ease;
      }

      :host([focus-mode]) .code-line.highlighted {
        opacity: 1;
        filter: none;
      }

      :host([focus-mode]) .line-numbers span:not(.highlighted) {
        opacity: var(--cb-focus-dim-opacity, 0.4);
      }

      /* highlight.js theme - GitHub style with CSS custom properties */
      .hljs-comment,
      .hljs-quote {
        color: var(--cb-comment, var(--_cb-comment));
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
        background: linear-gradient(transparent, var(--cb-code-bg, var(--_cb-code-bg)));
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
        border-top: 1px solid var(--cb-border-color, var(--_cb-border-color));
        color: var(--cb-expand-color, ${e ? "#58a6ff" : "#0366d6"});
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        font-family: var(--cb-ui-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
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
        background: var(--cb-scrollbar-track, var(--_cb-scrollbar-track));
      }

      :host([max-height]) .code-container::-webkit-scrollbar-thumb {
        background: var(--cb-scrollbar-thumb, var(--_cb-scrollbar-thumb));
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

      /* No-copy: prevent text selection */
      :host([no-copy]) code {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }

      :host([no-copy]) .code-line {
        user-select: none;
        -webkit-user-select: none;
      }
    `;
  }
  /**
   * Render a placeholder without syntax highlighting (for lazy loading)
   */
  renderPlaceholder() {
    const e = (this._codeContent || this.textContent).trim(), a = e.split(`
`), s = this.escapeHtml(e).split(`
`).map((f) => `<span class="code-line">${f || " "}</span>`).join(""), l = this.showLines ? `<div class="line-numbers" aria-hidden="true">${a.map((f, v) => `<span>${v + 1}</span>`).join("")}</div>` : "", b = this.filename ? `<span class="label">${this.escapeHtml(this.language.toUpperCase())}</span><span class="filename">${this.escapeHtml(this.filename)}</span>` : `<span class="label">${this.escapeHtml(this.label)}</span>`;
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          ${b}
        </div>
        <div class="header-actions">
          <button class="copy-button" aria-label="${this.copyText}">${this.copyText}</button>
        </div>
      </div>
      <div class="code-wrapper">
        <div class="code-container">
          ${l}
          <pre><code class="hljs">${s}</code></pre>
        </div>
      </div>
    `;
    const g = this.shadowRoot.querySelector(".copy-button");
    g && g.addEventListener("click", () => this.copyCode());
  }
  /**
   * Attach event listeners to pre-rendered SSR shadow DOM without re-rendering.
   */
  _hydrateInteractivity() {
    const e = this.shadowRoot.querySelector(".copy-button");
    e && e.addEventListener("click", () => this.copyCode());
    const a = this.shadowRoot.querySelector(".expand-button");
    a && a.addEventListener("click", () => this.toggleCollapsed());
    const r = this.shadowRoot.querySelector(".share-button");
    r && r.addEventListener("click", (b) => {
      b.stopPropagation(), this.toggleShareMenu();
    });
    const s = this.shadowRoot.querySelector(".share-codepen");
    s && s.addEventListener("click", () => this.openInCodePen());
    const l = this.shadowRoot.querySelector(".download-button");
    l && l.addEventListener("click", () => this.downloadCode());
  }
  render() {
    const e = (this._codeContent || this.textContent).trim(), a = e.split(`
`), r = this.highlightLines, s = this.language === "diff";
    let l;
    try {
      this.language && this.language !== "plaintext" && this.language !== "text" && this.language !== "txt" ? l = O.highlight(e, { language: this.language, ignoreIllegals: !0 }).value : l = this.escapeHtml(e);
    } catch {
      l = this.escapeHtml(e);
    }
    const b = l.split(`
`), g = b.map((F, ee) => {
      const ne = ee + 1, ae = r.has(ne), K = ["code-line"];
      if (ae && K.push("highlighted"), s) {
        const Z = a[ee] || "";
        Z.startsWith("+") && !Z.startsWith("+++") ? K.push("diff-add") : Z.startsWith("-") && !Z.startsWith("---") && K.push("diff-remove");
      }
      return `<span class="${K.join(" ")}">${F || " "}</span>`;
    }).join(""), f = this.showLines ? `<div class="line-numbers" aria-hidden="true">${b.map((F, ee) => {
      const ne = ee + 1, ae = r.has(ne), K = [];
      if (ae && K.push("highlighted"), s) {
        const Z = a[ee] || "";
        Z.startsWith("+") && !Z.startsWith("+++") ? K.push("diff-add") : Z.startsWith("-") && !Z.startsWith("---") && K.push("diff-remove");
      }
      return `<span class="${K.join(" ")}">${ne}</span>`;
    }).join("")}</div>` : "", v = this.filename ? `<span class="label">${this.escapeHtml(this.language.toUpperCase())}</span><span class="filename">${this.escapeHtml(this.filename)}</span>` : `<span class="label">${this.escapeHtml(this.label)}</span>`, C = this.hasAttribute("collapsed") || this.hasAttribute("max-lines"), k = b.length, x = this.maxLines, N = C && k > x, R = this.collapsed, S = R ? `calc(${x} * 1.6em + 2rem)` : "none", $ = this.maxHeight ? `--cb-max-height: ${this.maxHeight};` : "", D = R ? `max-height: ${S};` : "";
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          ${v}
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
          ${this.noCopy ? "" : `<button class="copy-button"
                  aria-label="Copy code to clipboard"
                  title="Copy code">${this.escapeHtml(this.copyText)}</button>`}
        </div>
      </div>
      <div class="code-container" role="region" aria-labelledby="code-label" style="${$}${D}">
        ${f}
        <pre><code class="language-${this.language}" tabindex="0">${g}</code></pre>
      </div>
      ${N ? `
        <button class="expand-button" aria-expanded="${!R}">
          ${R ? `Show all ${k} lines` : "Show less"}
        </button>
      ` : ""}
    `, N ? this.setAttribute("data-expandable", "") : this.removeAttribute("data-expandable");
    const B = this.shadowRoot.querySelector(".copy-button");
    B && B.addEventListener("click", () => this.copyCode());
    const J = this.shadowRoot.querySelector(".expand-button");
    J && J.addEventListener("click", () => this.toggleCollapsed());
    const V = this.shadowRoot.querySelector(".share-button");
    V && V.addEventListener("click", (F) => {
      F.stopPropagation(), this.toggleShareMenu();
    });
    const H = this.shadowRoot.querySelector(".share-native");
    H && H.addEventListener("click", () => this.shareViaWebAPI());
    const z = this.shadowRoot.querySelector(".share-codepen");
    z && z.addEventListener("click", () => this.openInCodePen());
    const ie = this.shadowRoot.querySelector(".download-button");
    ie && ie.addEventListener("click", () => this.downloadCode());
  }
  toggleCollapsed() {
    this.collapsed ? this.removeAttribute("collapsed") : this.setAttribute("collapsed", "");
  }
  escapeHtml(e) {
    const a = document.createElement("div");
    return a.textContent = e, a.innerHTML;
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
    return O.listLanguages();
  }
}
customElements.define("code-block", Hn);
class zn extends HTMLElement {
  constructor() {
    super(), this.shadowRoot || this.attachShadow({ mode: "open" }), this._activeIndex = 0, this._showShareMenu = !1, this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }
  connectedCallback() {
    requestAnimationFrame(() => {
      this.render(), this.setupEventListeners();
    }), Ze(this);
  }
  disconnectedCallback() {
    At(this), document.removeEventListener("click", this._handleOutsideClick);
  }
  static get observedAttributes() {
    return ["theme", "data-page-theme", "show-share", "show-download"];
  }
  attributeChangedCallback(e, a, r) {
    this.shadowRoot && a !== r && (e === "theme" && (this.hasAttribute("theme") ? this.removeAttribute("data-page-theme") : this._onPageModeChange(De())), this.render());
  }
  _onPageModeChange(e) {
    if (this.hasAttribute("theme")) {
      this.removeAttribute("data-page-theme");
      return;
    }
    e === !0 ? this.setAttribute("data-page-theme", "dark") : e === !1 ? this.setAttribute("data-page-theme", "light") : this.removeAttribute("data-page-theme");
  }
  get theme() {
    return this.getAttribute("theme") || this.getAttribute("data-page-theme") || "light";
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
    const a = this.codeBlocks;
    e >= 0 && e < a.length && (this._activeIndex = e, this.updateActiveTab());
  }
  getStyles() {
    const e = this.theme === "dark";
    return `
      :host {
        /* Internal defaults — external --cb-* overrides always win */
        --_cb-bg: ${e ? "var(--color-surface-raised, #0d1117)" : "var(--color-surface-raised, #f6f8fa)"};
        --_cb-code-bg: ${e ? "var(--color-surface, #0d1117)" : "var(--color-surface, #fff)"};
        --_cb-header-bg: ${e ? "var(--color-surface-raised, #161b22)" : "var(--color-surface-raised, #e1e4e8)"};
        --_cb-text-color: ${e ? "var(--color-text, #c9d1d9)" : "var(--color-text, #24292e)"};
        --_cb-border-color: ${e ? "var(--color-border, #30363d)" : "var(--color-border, #e1e4e8)"};
        --_cb-comment: ${e ? "var(--color-text-muted, #8b949e)" : "var(--color-text-muted, #6a737d)"};
        --_cb-button-bg: ${e ? "#21262d" : "#fff"};
        --_cb-button-color: ${e ? "var(--color-text, #c9d1d9)" : "var(--color-text, #24292e)"};
        --_cb-scrollbar-track: ${e ? "#161b22" : "#f6f8fa"};
        --_cb-scrollbar-thumb: ${e ? "#30363d" : "#d1d5da"};

        display: block;
        margin: var(--cb-margin, 1rem 0);
        border-radius: var(--cb-border-radius, 8px);
        overflow: hidden;
        border: 1px solid var(--cb-border-color, var(--_cb-border-color));
        background: var(--cb-bg, var(--_cb-bg));
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
        font-size: var(--cb-font-size, 0.875rem);
      }

      .tabs {
        display: flex;
        background: var(--cb-header-bg, var(--_cb-header-bg));
        border-bottom: 1px solid var(--cb-border-color, var(--_cb-border-color));
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .tabs::-webkit-scrollbar {
        height: 4px;
      }

      .tabs::-webkit-scrollbar-thumb {
        background: var(--cb-scrollbar-thumb, var(--_cb-scrollbar-thumb));
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
        color: var(--cb-text-color, var(--_cb-text-color));
        background: ${e ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"};
      }

      .tab:focus-visible {
        outline: 2px solid var(--cb-focus-color, ${e ? "#58a6ff" : "#0969da"});
        outline-offset: -2px;
      }

      .tab[aria-selected="true"] {
        color: var(--cb-text-color, var(--_cb-text-color));
        border-bottom-color: var(--cb-focus-color, ${e ? "#58a6ff" : "#0969da"});
        background: var(--cb-code-bg, var(--_cb-code-bg));
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
        background: var(--cb-header-bg, var(--_cb-header-bg));
        border-bottom: 1px solid var(--cb-border-color, var(--_cb-border-color));
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
        border-radius: var(--cb-button-radius, 4px);
        color: var(--cb-label-color, ${e ? "#8b949e" : "#57606a"});
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }

      .action-button:hover {
        background: var(--cb-action-button-hover-bg, ${e ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"});
        color: var(--cb-text-color, var(--_cb-text-color));
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
        border: 1px solid var(--cb-border-color, var(--_cb-border-color));
        border-radius: var(--cb-menu-radius, 6px);
        box-shadow: var(--cb-shadow, 0 8px 24px ${e ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"});
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
        color: var(--cb-text-color, var(--_cb-text-color));
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
    e.forEach((l, b) => {
      l.setAttribute("theme", this.theme), b === this._activeIndex ? l.classList.add("active") : l.classList.remove("active");
    });
    const a = e.map((l, b) => {
      const g = l.getAttribute("filename"), f = l.getAttribute("label"), v = l.getAttribute("language") || "plaintext", C = g || f || v.toUpperCase(), k = b === this._activeIndex;
      return `
        <button
          class="tab"
          role="tab"
          aria-selected="${k}"
          aria-controls="panel-${b}"
          tabindex="${k ? "0" : "-1"}"
          data-index="${b}"
        >
          <span class="tab-label">${this.escapeHtml(C)}</span>
          ${g ? `<span class="language-badge">${v}</span>` : ""}
        </button>
      `;
    }).join(""), s = this.showShare || this.showDownload ? `
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
          ${a}
        </div>
        ${s}
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }
  setupEventListeners() {
    const e = this.shadowRoot.querySelector(".tabs");
    if (!e) return;
    e.addEventListener("click", (b) => {
      const g = b.target.closest(".tab");
      if (g) {
        const f = parseInt(g.dataset.index, 10);
        this.activeIndex = f;
      }
    }), e.addEventListener("keydown", (b) => {
      const g = this.shadowRoot.querySelectorAll(".tab"), f = this._activeIndex;
      let v = f;
      switch (b.key) {
        case "ArrowLeft":
          v = f > 0 ? f - 1 : g.length - 1;
          break;
        case "ArrowRight":
          v = f < g.length - 1 ? f + 1 : 0;
          break;
        case "Home":
          v = 0;
          break;
        case "End":
          v = g.length - 1;
          break;
        default:
          return;
      }
      b.preventDefault(), this.activeIndex = v, g[v].focus();
    });
    const a = this.shadowRoot.querySelector(".download-button");
    a && a.addEventListener("click", () => this.downloadCode());
    const r = this.shadowRoot.querySelector(".share-button");
    r && r.addEventListener("click", (b) => {
      b.stopPropagation(), this.toggleShareMenu();
    });
    const s = this.shadowRoot.querySelector(".web-share-button");
    s && s.addEventListener("click", () => {
      this.shareViaWebAPI(), this.toggleShareMenu();
    });
    const l = this.shadowRoot.querySelector(".codepen-button");
    l && l.addEventListener("click", () => {
      this.openInCodePen(), this.toggleShareMenu();
    });
  }
  updateActiveTab() {
    const e = this.shadowRoot.querySelectorAll(".tab"), a = this.codeBlocks;
    e.forEach((r, s) => {
      const l = s === this._activeIndex;
      r.setAttribute("aria-selected", l), r.setAttribute("tabindex", l ? "0" : "-1");
    }), a.forEach((r, s) => {
      s === this._activeIndex ? r.classList.add("active") : r.classList.remove("active");
    }), this.dispatchEvent(
      new CustomEvent("tab-change", {
        detail: { index: this._activeIndex, block: a[this._activeIndex] },
        bubbles: !0
      })
    );
  }
  escapeHtml(e) {
    const a = document.createElement("div");
    return a.textContent = e, a.innerHTML;
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
    const e = this.shadowRoot.querySelector(".share-menu"), a = this.shadowRoot.querySelector(".share-button");
    e && e.classList.toggle("open", this._showShareMenu), a && a.setAttribute("aria-expanded", this._showShareMenu), this._showShareMenu ? document.addEventListener("click", this._handleOutsideClick) : document.removeEventListener("click", this._handleOutsideClick);
  }
  /**
   * Handle clicks outside share menu
   */
  _handleOutsideClick(e) {
    const a = this.shadowRoot.querySelector(".share-container");
    if (a && !e.composedPath().includes(a)) {
      this._showShareMenu = !1;
      const r = this.shadowRoot.querySelector(".share-menu"), s = this.shadowRoot.querySelector(".share-button");
      r && r.classList.remove("open"), s && s.setAttribute("aria-expanded", "false"), document.removeEventListener("click", this._handleOutsideClick);
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
    let a = "", r = "", s = "", l = "Code Block Group";
    e.forEach((C) => {
      const k = C.language, x = C.getCode(), N = C.filename;
      ["html", "markup", "xhtml", "xml", "svg"].includes(k) ? (a && (a += `

`), N && (a += `<!-- ${N} -->
`), a += x) : k === "css" ? (r && (r += `

`), N && (r += `/* ${N} */
`), r += x) : ["javascript", "js"].includes(k) && (s && (s += `

`), N && (s += `// ${N}
`), s += x), (!l || l === "Code Block Group") && (l = N || C.label || "Code Block Group");
    });
    let b = "";
    b += a ? "1" : "0", b += r ? "1" : "0", b += s ? "1" : "0";
    const g = {
      title: l,
      description: "Code shared from code-block-group component",
      html: a,
      css: r,
      js: s,
      editors: b
    }, f = document.createElement("form");
    f.action = "https://codepen.io/pen/define", f.method = "POST", f.target = "_blank";
    const v = document.createElement("input");
    v.type = "hidden", v.name = "data", v.value = JSON.stringify(g), f.appendChild(v), document.body.appendChild(f), f.submit(), document.body.removeChild(f);
  }
  /**
   * Share all blocks' code via Web Share API
   */
  async shareViaWebAPI() {
    if (!navigator.share) return;
    const e = this.codeBlocks;
    if (e.length === 0) return;
    let a = "";
    e.forEach((r) => {
      const s = r.filename || r.label || r.language, l = r.getCode();
      a && (a += `

`), a += `// === ${s} ===
${l}`;
    });
    try {
      await navigator.share({
        title: "Code from code-block-group",
        text: a
      });
    } catch (r) {
      r.name !== "AbortError" && console.error("Share failed:", r);
    }
  }
}
customElements.define("code-block-group", zn);
export {
  Hn as CodeBlock,
  zn as CodeBlockGroup
};
