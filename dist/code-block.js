function fn(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Ke, lt;
function mn() {
  if (lt) return Ke;
  lt = 1;
  function a(t) {
    return t instanceof Map ? t.clear = t.delete = t.set = function() {
      throw new Error("map is read-only");
    } : t instanceof Set && (t.add = t.clear = t.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(t), Object.getOwnPropertyNames(t).forEach((o) => {
      const l = t[o], _ = typeof l;
      (_ === "object" || _ === "function") && !Object.isFrozen(l) && a(l);
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
  function n(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function r(t, ...o) {
    const l = /* @__PURE__ */ Object.create(null);
    for (const _ in t)
      l[_] = t[_];
    return o.forEach(function(_) {
      for (const H in _)
        l[H] = _[H];
    }), /** @type {T} */
    l;
  }
  const s = "</span>", c = (t) => !!t.scope, h = (t, { prefix: o }) => {
    if (t.startsWith("language:"))
      return t.replace("language:", "language-");
    if (t.includes(".")) {
      const l = t.split(".");
      return [
        `${o}${l.shift()}`,
        ...l.map((_, H) => `${_}${"_".repeat(H + 1)}`)
      ].join(" ");
    }
    return `${o}${t}`;
  };
  class p {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(o, l) {
      this.buffer = "", this.classPrefix = l.classPrefix, o.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(o) {
      this.buffer += n(o);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(o) {
      if (!c(o)) return;
      const l = h(
        o.scope,
        { prefix: this.classPrefix }
      );
      this.span(l);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(o) {
      c(o) && (this.buffer += s);
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
  const b = (t = {}) => {
    const o = { children: [] };
    return Object.assign(o, t), o;
  };
  class v {
    constructor() {
      this.rootNode = b(), this.stack = [this.rootNode];
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
      const l = b({ scope: o });
      this.add(l), this.stack.push(l);
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
    static _walk(o, l) {
      return typeof l == "string" ? o.addText(l) : l.children && (o.openNode(l), l.children.forEach((_) => this._walk(o, _)), o.closeNode(l)), o;
    }
    /**
     * @param {Node} node
     */
    static _collapse(o) {
      typeof o != "string" && o.children && (o.children.every((l) => typeof l == "string") ? o.children = [o.children.join("")] : o.children.forEach((l) => {
        v._collapse(l);
      }));
    }
  }
  class A extends v {
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
    __addSublanguage(o, l) {
      const _ = o.root;
      l && (_.scope = `language:${l}`), this.add(_);
    }
    toHTML() {
      return new p(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function k(t) {
    return t ? typeof t == "string" ? t : t.source : null;
  }
  function S(t) {
    return N("(?=", t, ")");
  }
  function T(t) {
    return N("(?:", t, ")*");
  }
  function O(t) {
    return N("(?:", t, ")?");
  }
  function N(...t) {
    return t.map((l) => k(l)).join("");
  }
  function B(t) {
    const o = t[t.length - 1];
    return typeof o == "object" && o.constructor === Object ? (t.splice(t.length - 1, 1), o) : {};
  }
  function D(...t) {
    return "(" + (B(t).capture ? "" : "?:") + t.map((_) => k(_)).join("|") + ")";
  }
  function P(t) {
    return new RegExp(t.toString() + "|").exec("").length - 1;
  }
  function W(t, o) {
    const l = t && t.exec(o);
    return l && l.index === 0;
  }
  const Q = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function G(t, { joinWith: o }) {
    let l = 0;
    return t.map((_) => {
      l += 1;
      const H = l;
      let z = k(_), g = "";
      for (; z.length > 0; ) {
        const u = Q.exec(z);
        if (!u) {
          g += z;
          break;
        }
        g += z.substring(0, u.index), z = z.substring(u.index + u[0].length), u[0][0] === "\\" && u[1] ? g += "\\" + String(Number(u[1]) + H) : (g += u[0], u[0] === "(" && l++);
      }
      return g;
    }).map((_) => `(${_})`).join(o);
  }
  const j = /\b\B/, re = "[a-zA-Z]\\w*", q = "[a-zA-Z_]\\w*", oe = "\\b\\d+(\\.\\d+)?", se = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", ie = "\\b(0b[01]+)", ce = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", te = (t = {}) => {
    const o = /^#![ ]*\//;
    return t.binary && (t.begin = N(
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
      "on:begin": (l, _) => {
        l.index !== 0 && _.ignoreMatch();
      }
    }, t);
  }, $ = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, U = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [$]
  }, Y = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [$]
  }, J = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, x = function(t, o, l = {}) {
    const _ = r(
      {
        scope: "comment",
        begin: t,
        end: o,
        contains: []
      },
      l
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
    const H = D(
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
        begin: N(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          H,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), _;
  }, ee = x("//", "$"), ne = x("/\\*", "\\*/"), le = x("#", "$"), he = {
    scope: "number",
    begin: oe,
    relevance: 0
  }, me = {
    scope: "number",
    begin: se,
    relevance: 0
  }, kt = {
    scope: "number",
    begin: ie,
    relevance: 0
  }, Nt = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      $,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [$]
      }
    ]
  }, Rt = {
    scope: "title",
    begin: re,
    relevance: 0
  }, Tt = {
    scope: "title",
    begin: q,
    relevance: 0
  }, Ct = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + q,
    relevance: 0
  };
  var ke = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: U,
    BACKSLASH_ESCAPE: $,
    BINARY_NUMBER_MODE: kt,
    BINARY_NUMBER_RE: ie,
    COMMENT: x,
    C_BLOCK_COMMENT_MODE: ne,
    C_LINE_COMMENT_MODE: ee,
    C_NUMBER_MODE: me,
    C_NUMBER_RE: se,
    END_SAME_AS_BEGIN: function(t) {
      return Object.assign(
        t,
        {
          /** @type {ModeCallback} */
          "on:begin": (o, l) => {
            l.data._beginMatch = o[1];
          },
          /** @type {ModeCallback} */
          "on:end": (o, l) => {
            l.data._beginMatch !== o[1] && l.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: le,
    IDENT_RE: re,
    MATCH_NOTHING_RE: j,
    METHOD_GUARD: Ct,
    NUMBER_MODE: he,
    NUMBER_RE: oe,
    PHRASAL_WORDS_MODE: J,
    QUOTE_STRING_MODE: Y,
    REGEXP_MODE: Nt,
    RE_STARTERS_RE: ce,
    SHEBANG: te,
    TITLE_MODE: Rt,
    UNDERSCORE_IDENT_RE: q,
    UNDERSCORE_TITLE_MODE: Tt
  });
  function Mt(t, o) {
    t.input[t.index - 1] === "." && o.ignoreMatch();
  }
  function Ot(t, o) {
    t.className !== void 0 && (t.scope = t.className, delete t.className);
  }
  function Lt(t, o) {
    o && t.beginKeywords && (t.begin = "\\b(" + t.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", t.__beforeBegin = Mt, t.keywords = t.keywords || t.beginKeywords, delete t.beginKeywords, t.relevance === void 0 && (t.relevance = 0));
  }
  function It(t, o) {
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
    const l = Object.assign({}, t);
    Object.keys(t).forEach((_) => {
      delete t[_];
    }), t.keywords = l.keywords, t.begin = N(l.beforeMatch, S(l.begin)), t.starts = {
      relevance: 0,
      contains: [
        Object.assign(l, { endsParent: !0 })
      ]
    }, t.relevance = 0, delete l.beforeMatch;
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
  function We(t, o, l = Ut) {
    const _ = /* @__PURE__ */ Object.create(null);
    return typeof t == "string" ? H(l, t.split(" ")) : Array.isArray(t) ? H(l, t) : Object.keys(t).forEach(function(z) {
      Object.assign(
        _,
        We(t[z], o, z)
      );
    }), _;
    function H(z, g) {
      o && (g = g.map((u) => u.toLowerCase())), g.forEach(function(u) {
        const E = u.split("|");
        _[E[0]] = [z, Ht(E[0], E[1])];
      });
    }
  }
  function Ht(t, o) {
    return o ? Number(o) : zt(t) ? 0 : 1;
  }
  function zt(t) {
    return Pt.includes(t.toLowerCase());
  }
  const qe = {}, ve = (t) => {
    console.error(t);
  }, Ye = (t, ...o) => {
    console.log(`WARN: ${t}`, ...o);
  }, ye = (t, o) => {
    qe[`${t}/${o}`] || (console.log(`Deprecated as of ${t}. ${o}`), qe[`${t}/${o}`] = !0);
  }, Ne = new Error();
  function Xe(t, o, { key: l }) {
    let _ = 0;
    const H = t[l], z = {}, g = {};
    for (let u = 1; u <= o.length; u++)
      g[u + _] = H[u], z[u + _] = !0, _ += P(o[u - 1]);
    t[l] = g, t[l]._emit = z, t[l]._multi = !0;
  }
  function Ft(t) {
    if (Array.isArray(t.begin)) {
      if (t.skip || t.excludeBegin || t.returnBegin)
        throw ve("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ne;
      if (typeof t.beginScope != "object" || t.beginScope === null)
        throw ve("beginScope must be object"), Ne;
      Xe(t, t.begin, { key: "beginScope" }), t.begin = G(t.begin, { joinWith: "" });
    }
  }
  function Gt(t) {
    if (Array.isArray(t.end)) {
      if (t.skip || t.excludeEnd || t.returnEnd)
        throw ve("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ne;
      if (typeof t.endScope != "object" || t.endScope === null)
        throw ve("endScope must be object"), Ne;
      Xe(t, t.end, { key: "endScope" }), t.end = G(t.end, { joinWith: "" });
    }
  }
  function jt(t) {
    t.scope && typeof t.scope == "object" && t.scope !== null && (t.beginScope = t.scope, delete t.scope);
  }
  function Kt(t) {
    jt(t), typeof t.beginScope == "string" && (t.beginScope = { _wrap: t.beginScope }), typeof t.endScope == "string" && (t.endScope = { _wrap: t.endScope }), Ft(t), Gt(t);
  }
  function Zt(t) {
    function o(g, u) {
      return new RegExp(
        k(g),
        "m" + (t.case_insensitive ? "i" : "") + (t.unicodeRegex ? "u" : "") + (u ? "g" : "")
      );
    }
    class l {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(u, E) {
        E.position = this.position++, this.matchIndexes[this.matchAt] = E, this.regexes.push([E, u]), this.matchAt += P(u) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const u = this.regexes.map((E) => E[1]);
        this.matcherRe = o(G(u, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(u) {
        this.matcherRe.lastIndex = this.lastIndex;
        const E = this.matcherRe.exec(u);
        if (!E)
          return null;
        const Z = E.findIndex((we, Ue) => Ue > 0 && we !== void 0), F = this.matchIndexes[Z];
        return E.splice(0, Z), Object.assign(E, F);
      }
    }
    class _ {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(u) {
        if (this.multiRegexes[u]) return this.multiRegexes[u];
        const E = new l();
        return this.rules.slice(u).forEach(([Z, F]) => E.addRule(Z, F)), E.compile(), this.multiRegexes[u] = E, E;
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
        let Z = E.exec(u);
        if (this.resumingScanAtSamePosition() && !(Z && Z.index === this.lastIndex)) {
          const F = this.getMatcher(0);
          F.lastIndex = this.lastIndex + 1, Z = F.exec(u);
        }
        return Z && (this.regexIndex += Z.position + 1, this.regexIndex === this.count && this.considerAll()), Z;
      }
    }
    function H(g) {
      const u = new _();
      return g.contains.forEach((E) => u.addRule(E.begin, { rule: E, type: "begin" })), g.terminatorEnd && u.addRule(g.terminatorEnd, { type: "end" }), g.illegal && u.addRule(g.illegal, { type: "illegal" }), u;
    }
    function z(g, u) {
      const E = (
        /** @type CompiledMode */
        g
      );
      if (g.isCompiled) return E;
      [
        Ot,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        $t,
        Kt,
        Dt
      ].forEach((F) => F(g, u)), t.compilerExtensions.forEach((F) => F(g, u)), g.__beforeBegin = null, [
        Lt,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        It,
        // default to 1 relevance if not specified
        Bt
      ].forEach((F) => F(g, u)), g.isCompiled = !0;
      let Z = null;
      return typeof g.keywords == "object" && g.keywords.$pattern && (g.keywords = Object.assign({}, g.keywords), Z = g.keywords.$pattern, delete g.keywords.$pattern), Z = Z || /\w+/, g.keywords && (g.keywords = We(g.keywords, t.case_insensitive)), E.keywordPatternRe = o(Z, !0), u && (g.begin || (g.begin = /\B|\b/), E.beginRe = o(E.begin), !g.end && !g.endsWithParent && (g.end = /\B|\b/), g.end && (E.endRe = o(E.end)), E.terminatorEnd = k(E.end) || "", g.endsWithParent && u.terminatorEnd && (E.terminatorEnd += (g.end ? "|" : "") + u.terminatorEnd)), g.illegal && (E.illegalRe = o(
        /** @type {RegExp | string} */
        g.illegal
      )), g.contains || (g.contains = []), g.contains = [].concat(...g.contains.map(function(F) {
        return Wt(F === "self" ? g : F);
      })), g.contains.forEach(function(F) {
        z(
          /** @type Mode */
          F,
          E
        );
      }), g.starts && z(g.starts, u), E.matcher = H(E), E;
    }
    if (t.compilerExtensions || (t.compilerExtensions = []), t.contains && t.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return t.classNameAliases = r(t.classNameAliases || {}), z(
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
    constructor(o, l) {
      super(o), this.name = "HTMLInjectionError", this.html = l;
    }
  }
  const Pe = n, Qe = r, Je = Symbol("nomatch"), Xt = 7, et = function(t) {
    const o = /* @__PURE__ */ Object.create(null), l = /* @__PURE__ */ Object.create(null), _ = [];
    let H = !0;
    const z = "Could not find the language '{}', did you forget to load/include a language module?", g = { disableAutodetect: !0, name: "Plain text", contains: [] };
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
      __emitter: A
    };
    function E(i) {
      return u.noHighlightRe.test(i);
    }
    function Z(i) {
      let m = i.className + " ";
      m += i.parentNode ? i.parentNode.className : "";
      const R = u.languageDetectRe.exec(m);
      if (R) {
        const L = pe(R[1]);
        return L || (Ye(z.replace("{}", R[1])), Ye("Falling back to no-highlight mode for this block.", i)), L ? R[1] : "no-highlight";
      }
      return m.split(/\s+/).find((L) => E(L) || pe(L));
    }
    function F(i, m, R) {
      let L = "", K = "";
      typeof m == "object" ? (L = i, R = m.ignoreIllegals, K = m.language) : (ye("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ye("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), K = i, L = m), R === void 0 && (R = !0);
      const de = {
        code: L,
        language: K
      };
      Te("before:highlight", de);
      const fe = de.result ? de.result : we(de.language, de.code, R);
      return fe.code = de.code, Te("after:highlight", fe), fe;
    }
    function we(i, m, R, L) {
      const K = /* @__PURE__ */ Object.create(null);
      function de(d, f) {
        return d.keywords[f];
      }
      function fe() {
        if (!y.keywords) {
          X.addText(I);
          return;
        }
        let d = 0;
        y.keywordPatternRe.lastIndex = 0;
        let f = y.keywordPatternRe.exec(I), w = "";
        for (; f; ) {
          w += I.substring(d, f.index);
          const C = be.case_insensitive ? f[0].toLowerCase() : f[0], V = de(y, C);
          if (V) {
            const [ge, gn] = V;
            if (X.addText(w), w = "", K[C] = (K[C] || 0) + 1, K[C] <= Xt && (Oe += gn), ge.startsWith("_"))
              w += f[0];
            else {
              const pn = be.classNameAliases[ge] || ge;
              ue(f[0], pn);
            }
          } else
            w += f[0];
          d = y.keywordPatternRe.lastIndex, f = y.keywordPatternRe.exec(I);
        }
        w += I.substring(d), X.addText(w);
      }
      function Ce() {
        if (I === "") return;
        let d = null;
        if (typeof y.subLanguage == "string") {
          if (!o[y.subLanguage]) {
            X.addText(I);
            return;
          }
          d = we(y.subLanguage, I, !0, ct[y.subLanguage]), ct[y.subLanguage] = /** @type {CompiledMode} */
          d._top;
        } else
          d = He(I, y.subLanguage.length ? y.subLanguage : null);
        y.relevance > 0 && (Oe += d.relevance), X.__addSublanguage(d._emitter, d.language);
      }
      function ae() {
        y.subLanguage != null ? Ce() : fe(), I = "";
      }
      function ue(d, f) {
        d !== "" && (X.startScope(f), X.addText(d), X.endScope());
      }
      function rt(d, f) {
        let w = 1;
        const C = f.length - 1;
        for (; w <= C; ) {
          if (!d._emit[w]) {
            w++;
            continue;
          }
          const V = be.classNameAliases[d[w]] || d[w], ge = f[w];
          V ? ue(ge, V) : (I = ge, fe(), I = ""), w++;
        }
      }
      function ot(d, f) {
        return d.scope && typeof d.scope == "string" && X.openNode(be.classNameAliases[d.scope] || d.scope), d.beginScope && (d.beginScope._wrap ? (ue(I, be.classNameAliases[d.beginScope._wrap] || d.beginScope._wrap), I = "") : d.beginScope._multi && (rt(d.beginScope, f), I = "")), y = Object.create(d, { parent: { value: y } }), y;
      }
      function st(d, f, w) {
        let C = W(d.endRe, w);
        if (C) {
          if (d["on:end"]) {
            const V = new e(d);
            d["on:end"](f, V), V.isMatchIgnored && (C = !1);
          }
          if (C) {
            for (; d.endsParent && d.parent; )
              d = d.parent;
            return d;
          }
        }
        if (d.endsWithParent)
          return st(d.parent, f, w);
      }
      function ln(d) {
        return y.matcher.regexIndex === 0 ? (I += d[0], 1) : (je = !0, 0);
      }
      function dn(d) {
        const f = d[0], w = d.rule, C = new e(w), V = [w.__beforeBegin, w["on:begin"]];
        for (const ge of V)
          if (ge && (ge(d, C), C.isMatchIgnored))
            return ln(f);
        return w.skip ? I += f : (w.excludeBegin && (I += f), ae(), !w.returnBegin && !w.excludeBegin && (I = f)), ot(w, d), w.returnBegin ? 0 : f.length;
      }
      function un(d) {
        const f = d[0], w = m.substring(d.index), C = st(y, d, w);
        if (!C)
          return Je;
        const V = y;
        y.endScope && y.endScope._wrap ? (ae(), ue(f, y.endScope._wrap)) : y.endScope && y.endScope._multi ? (ae(), rt(y.endScope, d)) : V.skip ? I += f : (V.returnEnd || V.excludeEnd || (I += f), ae(), V.excludeEnd && (I = f));
        do
          y.scope && X.closeNode(), !y.skip && !y.subLanguage && (Oe += y.relevance), y = y.parent;
        while (y !== C.parent);
        return C.starts && ot(C.starts, d), V.returnEnd ? 0 : f.length;
      }
      function bn() {
        const d = [];
        for (let f = y; f !== be; f = f.parent)
          f.scope && d.unshift(f.scope);
        d.forEach((f) => X.openNode(f));
      }
      let Me = {};
      function it(d, f) {
        const w = f && f[0];
        if (I += d, w == null)
          return ae(), 0;
        if (Me.type === "begin" && f.type === "end" && Me.index === f.index && w === "") {
          if (I += m.slice(f.index, f.index + 1), !H) {
            const C = new Error(`0 width match regex (${i})`);
            throw C.languageName = i, C.badRule = Me.rule, C;
          }
          return 1;
        }
        if (Me = f, f.type === "begin")
          return dn(f);
        if (f.type === "illegal" && !R) {
          const C = new Error('Illegal lexeme "' + w + '" for mode "' + (y.scope || "<unnamed>") + '"');
          throw C.mode = y, C;
        } else if (f.type === "end") {
          const C = un(f);
          if (C !== Je)
            return C;
        }
        if (f.type === "illegal" && w === "")
          return I += `
`, 1;
        if (Ge > 1e5 && Ge > f.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return I += w, w.length;
      }
      const be = pe(i);
      if (!be)
        throw ve(z.replace("{}", i)), new Error('Unknown language: "' + i + '"');
      const hn = Zt(be);
      let Fe = "", y = L || hn;
      const ct = {}, X = new u.__emitter(u);
      bn();
      let I = "", Oe = 0, Ee = 0, Ge = 0, je = !1;
      try {
        if (be.__emitTokens)
          be.__emitTokens(m, X);
        else {
          for (y.matcher.considerAll(); ; ) {
            Ge++, je ? je = !1 : y.matcher.considerAll(), y.matcher.lastIndex = Ee;
            const d = y.matcher.exec(m);
            if (!d) break;
            const f = m.substring(Ee, d.index), w = it(f, d);
            Ee = d.index + w;
          }
          it(m.substring(Ee));
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
              index: Ee,
              context: m.slice(Ee - 100, Ee + 100),
              mode: d.mode,
              resultSoFar: Fe
            },
            _emitter: X
          };
        if (H)
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
        _top: g,
        _emitter: new u.__emitter(u)
      };
      return m._emitter.addText(i), m;
    }
    function He(i, m) {
      m = m || u.languages || Object.keys(o);
      const R = Ue(i), L = m.filter(pe).filter(at).map(
        (ae) => we(ae, i, !1)
      );
      L.unshift(R);
      const K = L.sort((ae, ue) => {
        if (ae.relevance !== ue.relevance) return ue.relevance - ae.relevance;
        if (ae.language && ue.language) {
          if (pe(ae.language).supersetOf === ue.language)
            return 1;
          if (pe(ue.language).supersetOf === ae.language)
            return -1;
        }
        return 0;
      }), [de, fe] = K, Ce = de;
      return Ce.secondBest = fe, Ce;
    }
    function Vt(i, m, R) {
      const L = m && l[m] || R;
      i.classList.add("hljs"), i.classList.add(`language-${L}`);
    }
    function ze(i) {
      let m = null;
      const R = Z(i);
      if (E(R)) return;
      if (Te(
        "before:highlightElement",
        { el: i, language: R }
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
      const L = m.textContent, K = R ? F(L, { language: R, ignoreIllegals: !0 }) : He(L);
      i.innerHTML = K.value, i.dataset.highlighted = "yes", Vt(i, R, K.language), i.result = {
        language: K.language,
        // TODO: remove with version 11.0
        re: K.relevance,
        relevance: K.relevance
      }, K.secondBest && (i.secondBest = {
        language: K.secondBest.language,
        relevance: K.secondBest.relevance
      }), Te("after:highlightElement", { el: i, result: K, text: L });
    }
    function Qt(i) {
      u = Qe(u, i);
    }
    const Jt = () => {
      Re(), ye("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function en() {
      Re(), ye("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
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
      let R = null;
      try {
        R = m(t);
      } catch (L) {
        if (ve("Language definition for '{}' could not be registered.".replace("{}", i)), H)
          ve(L);
        else
          throw L;
        R = g;
      }
      R.name || (R.name = i), o[i] = R, R.rawDefinition = m.bind(null, t), R.aliases && nt(R.aliases, { languageName: i });
    }
    function nn(i) {
      delete o[i];
      for (const m of Object.keys(l))
        l[m] === i && delete l[m];
    }
    function an() {
      return Object.keys(o);
    }
    function pe(i) {
      return i = (i || "").toLowerCase(), o[i] || o[l[i]];
    }
    function nt(i, { languageName: m }) {
      typeof i == "string" && (i = [i]), i.forEach((R) => {
        l[R.toLowerCase()] = m;
      });
    }
    function at(i) {
      const m = pe(i);
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
      const R = i;
      _.forEach(function(L) {
        L[R] && L[R](m);
      });
    }
    function cn(i) {
      return ye("10.7.0", "highlightBlock will be removed entirely in v12.0"), ye("10.7.0", "Please use highlightElement now."), ze(i);
    }
    Object.assign(t, {
      highlight: F,
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
      getLanguage: pe,
      registerAliases: nt,
      autoDetection: at,
      inherit: Qe,
      addPlugin: on,
      removePlugin: sn
    }), t.debugMode = function() {
      H = !1;
    }, t.safeMode = function() {
      H = !0;
    }, t.versionString = qt, t.regex = {
      concat: N,
      lookahead: S,
      either: D,
      optional: O,
      anyNumberOfTimes: T
    };
    for (const i in ke)
      typeof ke[i] == "object" && a(ke[i]);
    return Object.assign(t, ke), t;
  }, xe = et({});
  return xe.newInstance = () => et({}), Ke = xe, xe.HighlightJS = xe, xe.default = xe, Ke;
}
var vn = /* @__PURE__ */ mn();
const M = /* @__PURE__ */ fn(vn), dt = "[A-Za-z$_][0-9A-Za-z$_]*", En = [
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
function gt(a) {
  const e = a.regex, n = (x, { after: ee }) => {
    const ne = "</" + x[0].slice(1);
    return x.input.indexOf(ne, ee) !== -1;
  }, r = dt, s = {
    begin: "<>",
    end: "</>"
  }, c = /<[A-Za-z0-9\\._:-]+\s*\/>/, h = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (x, ee) => {
      const ne = x[0].length + x.index, le = x.input[ne];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        le === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        le === ","
      ) {
        ee.ignoreMatch();
        return;
      }
      le === ">" && (n(x, { after: ne }) || ee.ignoreMatch());
      let he;
      const me = x.input.substring(ne);
      if (he = me.match(/^\s*=/)) {
        ee.ignoreMatch();
        return;
      }
      if ((he = me.match(/^\s+extends\s+/)) && he.index === 0) {
        ee.ignoreMatch();
        return;
      }
    }
  }, p = {
    $pattern: dt,
    keyword: En,
    literal: _n,
    built_in: xn,
    "variable.language": yn
  }, b = "[0-9](_?[0-9])*", v = `\\.(${b})`, A = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", k = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${A})((${v})|\\.)?|(${v}))[eE][+-]?(${b})\\b` },
      { begin: `\\b(${A})\\b((${v})\\b|\\.)?|(${v})\\b` },
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
  }, S = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: p,
    contains: []
    // defined later
  }, T = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        a.BACKSLASH_ESCAPE,
        S
      ],
      subLanguage: "xml"
    }
  }, O = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        a.BACKSLASH_ESCAPE,
        S
      ],
      subLanguage: "css"
    }
  }, N = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        a.BACKSLASH_ESCAPE,
        S
      ],
      subLanguage: "graphql"
    }
  }, B = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      a.BACKSLASH_ESCAPE,
      S
    ]
  }, P = {
    className: "comment",
    variants: [
      a.COMMENT(
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
      a.C_BLOCK_COMMENT_MODE,
      a.C_LINE_COMMENT_MODE
    ]
  }, W = [
    a.APOS_STRING_MODE,
    a.QUOTE_STRING_MODE,
    T,
    O,
    N,
    B,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    k
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  S.contains = W.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: p,
    contains: [
      "self"
    ].concat(W)
  });
  const Q = [].concat(P, S.contains), G = Q.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: p,
      contains: ["self"].concat(Q)
    }
  ]), j = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: p,
    contains: G
  }, re = {
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
  }, q = {
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
  }, oe = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, se = {
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
    contains: [j],
    illegal: /%/
  }, ie = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function ce(x) {
    return e.concat("(?!", x.join("|"), ")");
  }
  const te = {
    match: e.concat(
      /\b/,
      ce([
        ...ht,
        "super",
        "import"
      ].map((x) => `${x}\\s*\\(`)),
      r,
      e.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, $ = {
    begin: e.concat(/\./, e.lookahead(
      e.concat(r, /(?![0-9A-Za-z$_(])/)
    )),
    end: r,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, U = {
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
      j
    ]
  }, Y = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + a.UNDERSCORE_IDENT_RE + ")\\s*=>", J = {
    match: [
      /const|var|let/,
      /\s+/,
      r,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      e.lookahead(Y)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      j
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: p,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: G, CLASS_REFERENCE: q },
    illegal: /#(?![$_A-z])/,
    contains: [
      a.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      oe,
      a.APOS_STRING_MODE,
      a.QUOTE_STRING_MODE,
      T,
      O,
      N,
      B,
      P,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      k,
      q,
      {
        scope: "attr",
        match: r + e.lookahead(":"),
        relevance: 0
      },
      J,
      {
        // "value" container
        begin: "(" + a.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          P,
          a.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: Y,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: a.UNDERSCORE_IDENT_RE,
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
                    keywords: p,
                    contains: G
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
              { match: c },
              {
                begin: h.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": h.isTrulyOpeningTag,
                end: h.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: h.begin,
                end: h.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      se,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + a.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          j,
          a.inherit(a.TITLE_MODE, { begin: r, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      $,
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
        contains: [j]
      },
      te,
      ie,
      re,
      U,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const wn = (a) => ({
  IMPORTANT: {
    scope: "meta",
    begin: "!important"
  },
  BLOCK_COMMENT: a.C_BLOCK_COMMENT_MODE,
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
      a.APOS_STRING_MODE,
      a.QUOTE_STRING_MODE
    ]
  },
  CSS_NUMBER_MODE: {
    scope: "number",
    begin: a.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
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
function Mn(a) {
  const e = a.regex, n = wn(a), r = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ }, s = "and or not only", c = /@-?\w[\w]*(-\w+)*/, h = "[a-zA-Z-][a-zA-Z0-9_-]*", p = [
    a.APOS_STRING_MODE,
    a.QUOTE_STRING_MODE
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
      n.BLOCK_COMMENT,
      r,
      // to recognize keyframe 40% etc which are outside the scope of our
      // attribute value mode
      n.CSS_NUMBER_MODE,
      {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: "selector-class",
        begin: "\\." + h,
        relevance: 0
      },
      n.ATTRIBUTE_SELECTOR_MODE,
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
      n.CSS_VARIABLE,
      {
        className: "attribute",
        begin: "\\b(" + Cn.join("|") + ")\\b"
      },
      // attribute values
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          n.BLOCK_COMMENT,
          n.HEXCOLOR,
          n.IMPORTANT,
          n.CSS_NUMBER_MODE,
          ...p,
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
              ...p,
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
          n.FUNCTION_DISPATCH
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
            begin: c
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
              ...p,
              n.CSS_NUMBER_MODE
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
function Ae(a) {
  const e = a.regex, n = e.concat(/[\p{L}_]/u, e.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), r = /[\p{L}0-9._:-]+/u, s = {
    className: "symbol",
    begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
  }, c = {
    begin: /\s/,
    contains: [
      {
        className: "keyword",
        begin: /#?[a-z_][a-z1-9_-]+/,
        illegal: /\n/
      }
    ]
  }, h = a.inherit(c, {
    begin: /\(/,
    end: /\)/
  }), p = a.inherit(a.APOS_STRING_MODE, { className: "string" }), b = a.inherit(a.QUOTE_STRING_MODE, { className: "string" }), v = {
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
          c,
          b,
          p,
          h,
          {
            begin: /\[/,
            end: /\]/,
            contains: [
              {
                className: "meta",
                begin: /<![a-z]/,
                end: />/,
                contains: [
                  c,
                  h,
                  b,
                  p
                ]
              }
            ]
          }
        ]
      },
      a.COMMENT(
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
              b
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
            n,
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
            begin: n,
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
            n,
            />/
          ))
        ),
        contains: [
          {
            className: "name",
            begin: n,
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
function On(a) {
  const e = {
    className: "attr",
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  }, n = {
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
      n,
      a.QUOTE_STRING_MODE,
      s,
      a.C_NUMBER_MODE,
      a.C_LINE_COMMENT_MODE,
      a.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function pt(a) {
  const e = "true false yes no null", n = "[\\w#;/?:@&=+$,.~*'()[\\]]+", r = {
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
  }, c = {
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
  }, h = {
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
      a.BACKSLASH_ESCAPE,
      s
    ]
  }, p = a.inherit(h, { variants: [
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
  ] }), S = {
    className: "number",
    begin: "\\b" + "[0-9]{4}(-[0-9][0-9]){0,2}" + "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?" + "(\\.[0-9]*)?" + "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?" + "\\b"
  }, T = {
    end: ",",
    endsWithParent: !0,
    excludeEnd: !0,
    keywords: e,
    relevance: 0
  }, O = {
    begin: /\{/,
    end: /\}/,
    contains: [T],
    illegal: "\\n",
    relevance: 0
  }, N = {
    begin: "\\[",
    end: "\\]",
    contains: [T],
    illegal: "\\n",
    relevance: 0
  }, B = [
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
      begin: "!\\w+!" + n
    },
    // https://yaml.org/spec/1.2/spec.html#id2784064
    {
      // verbatim tags
      className: "type",
      begin: "!<" + n + ">"
    },
    {
      // primary tags
      className: "type",
      begin: "!" + n
    },
    {
      // secondary tags
      className: "type",
      begin: "!!" + n
    },
    {
      // fragment id &ref
      className: "meta",
      begin: "&" + a.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // fragment reference *ref
      className: "meta",
      begin: "\\*" + a.UNDERSCORE_IDENT_RE + "$"
    },
    {
      // array listing
      className: "bullet",
      // TODO: remove |$ hack when we have proper look-ahead support
      begin: "-(?=[ ]|$)",
      relevance: 0
    },
    a.HASH_COMMENT_MODE,
    {
      beginKeywords: e,
      keywords: { literal: e }
    },
    S,
    // numbers are any valid C-style number that
    // sit isolated from other words
    {
      className: "number",
      begin: a.C_NUMBER_RE + "\\b",
      relevance: 0
    },
    O,
    N,
    c,
    h
  ], D = [...B];
  return D.pop(), D.push(p), T.contains = D, {
    name: "YAML",
    case_insensitive: !0,
    aliases: ["yml"],
    contains: B
  };
}
function Ln(a) {
  const e = a.regex, n = /(?![A-Za-z0-9])(?![$])/, r = e.concat(
    /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,
    n
  ), s = e.concat(
    /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
    n
  ), c = e.concat(
    /[A-Z]+/,
    n
  ), h = {
    scope: "variable",
    match: "\\$+" + r
  }, p = {
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
  }, b = {
    scope: "subst",
    variants: [
      { begin: /\$\w+/ },
      {
        begin: /\{\$/,
        end: /\}/
      }
    ]
  }, v = a.inherit(a.APOS_STRING_MODE, { illegal: null }), A = a.inherit(a.QUOTE_STRING_MODE, {
    illegal: null,
    contains: a.QUOTE_STRING_MODE.contains.concat(b)
  }), k = {
    begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
    end: /[ \t]*(\w+)\b/,
    contains: a.QUOTE_STRING_MODE.contains.concat(b),
    "on:begin": ($, U) => {
      U.data._beginMatch = $[1] || $[2];
    },
    "on:end": ($, U) => {
      U.data._beginMatch !== $[1] && U.ignoreMatch();
    }
  }, S = a.END_SAME_AS_BEGIN({
    begin: /<<<[ \t]*'(\w+)'\n/,
    end: /[ \t]*(\w+)\b/
  }), T = `[ 	
]`, O = {
    scope: "string",
    variants: [
      A,
      v,
      k,
      S
    ]
  }, N = {
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
  }, B = [
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
  ], P = [
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
  ], Q = {
    keyword: D,
    literal: (($) => {
      const U = [];
      return $.forEach((Y) => {
        U.push(Y), Y.toLowerCase() === Y ? U.push(Y.toUpperCase()) : U.push(Y.toLowerCase());
      }), U;
    })(B),
    built_in: P
  }, G = ($) => $.map((U) => U.replace(/\|\d+$/, "")), j = { variants: [
    {
      match: [
        /new/,
        e.concat(T, "+"),
        // to prevent built ins from being confused as the class constructor call
        e.concat("(?!", G(P).join("\\b|"), "\\b)"),
        s
      ],
      scope: {
        1: "keyword",
        4: "title.class"
      }
    }
  ] }, re = e.concat(r, "\\b(?!\\()"), q = { variants: [
    {
      match: [
        e.concat(
          /::/,
          e.lookahead(/(?!class\b)/)
        ),
        re
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
        re
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
  ] }, oe = {
    scope: "attr",
    match: e.concat(r, e.lookahead(":"), e.lookahead(/(?!::)/))
  }, se = {
    relevance: 0,
    begin: /\(/,
    end: /\)/,
    keywords: Q,
    contains: [
      oe,
      h,
      q,
      a.C_BLOCK_COMMENT_MODE,
      O,
      N,
      j
    ]
  }, ie = {
    relevance: 0,
    match: [
      /\b/,
      // to prevent keywords from being confused as the function title
      e.concat("(?!fn\\b|function\\b|", G(D).join("\\b|"), "|", G(P).join("\\b|"), "\\b)"),
      r,
      e.concat(T, "*"),
      e.lookahead(/(?=\()/)
    ],
    scope: { 3: "title.function.invoke" },
    contains: [se]
  };
  se.contains.push(ie);
  const ce = [
    oe,
    q,
    a.C_BLOCK_COMMENT_MODE,
    O,
    N,
    j
  ], te = {
    begin: e.concat(
      /#\[\s*\\?/,
      e.either(
        s,
        c
      )
    ),
    beginScope: "meta",
    end: /]/,
    endScope: "meta",
    keywords: {
      literal: B,
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
          literal: B,
          keyword: [
            "new",
            "array"
          ]
        },
        contains: [
          "self",
          ...ce
        ]
      },
      ...ce,
      {
        scope: "meta",
        variants: [
          { match: s },
          { match: c }
        ]
      }
    ]
  };
  return {
    case_insensitive: !1,
    keywords: Q,
    contains: [
      te,
      a.HASH_COMMENT_MODE,
      a.COMMENT("//", "$"),
      a.COMMENT(
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
          end: a.MATCH_NOTHING_RE,
          contains: [
            {
              match: /\?>/,
              scope: "meta",
              endsParent: !0
            }
          ]
        }
      },
      p,
      {
        scope: "variable.language",
        match: /\$this\b/
      },
      h,
      ie,
      q,
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
      j,
      {
        scope: "function",
        relevance: 0,
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: !0,
        illegal: "[$%\\[]",
        contains: [
          { beginKeywords: "use" },
          a.UNDERSCORE_TITLE_MODE,
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
            keywords: Q,
            contains: [
              "self",
              te,
              h,
              q,
              a.C_BLOCK_COMMENT_MODE,
              O,
              N
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
          a.UNDERSCORE_TITLE_MODE
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
        contains: [a.inherit(a.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
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
          a.UNDERSCORE_TITLE_MODE
        ]
      },
      O,
      N
    ]
  };
}
function In(a) {
  const e = a.regex, n = "HTTP/([32]|1\\.[01])", r = /[A-Za-z][A-Za-z0-9-]*/, s = {
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
  }, c = [
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
        begin: "^(?=" + n + " \\d{3})",
        end: /$/,
        contains: [
          {
            className: "meta",
            begin: n
          },
          {
            className: "number",
            begin: "\\b\\d{3}\\b"
          }
        ],
        starts: {
          end: /\b\B/,
          illegal: /\S/,
          contains: c
        }
      },
      // request
      {
        begin: "(?=^[A-Z]+ (.*?) " + n + "$)",
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
            begin: n
          },
          {
            className: "keyword",
            begin: "[A-Z]+"
          }
        ],
        starts: {
          end: /\b\B/,
          illegal: /\S/,
          contains: c
        }
      },
      // to allow headers to work even without a preamble
      a.inherit(s, { relevance: 0 })
    ]
  };
}
function $e(a) {
  return {
    name: "Plain text",
    aliases: [
      "text",
      "txt"
    ],
    disableAutodetect: !0
  };
}
function $n(a) {
  const e = a.regex;
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
function Be(a) {
  const e = a.regex, n = {}, r = {
    begin: /\$\{/,
    end: /\}/,
    contains: [
      "self",
      {
        begin: /:-/,
        contains: [n]
      }
      // default values
    ]
  };
  Object.assign(n, {
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
    contains: [a.BACKSLASH_ESCAPE]
  }, c = a.inherit(
    a.COMMENT(),
    {
      match: [
        /(^|\s)/,
        /#.*$/
      ],
      scope: {
        2: "comment"
      }
    }
  ), h = {
    begin: /<<-?\s*(?=\w+)/,
    starts: { contains: [
      a.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: "string"
      })
    ] }
  }, p = {
    className: "string",
    begin: /"/,
    end: /"/,
    contains: [
      a.BACKSLASH_ESCAPE,
      n,
      s
    ]
  };
  s.contains.push(p);
  const b = {
    match: /\\"/
  }, v = {
    className: "string",
    begin: /'/,
    end: /'/
  }, A = {
    match: /\\'/
  }, k = {
    begin: /\$?\(\(/,
    end: /\)\)/,
    contains: [
      {
        begin: /\d+#[0-9a-f]+/,
        className: "number"
      },
      a.NUMBER_MODE,
      n
    ]
  }, S = [
    "fish",
    "bash",
    "zsh",
    "sh",
    "csh",
    "ksh",
    "tcsh",
    "dash",
    "scsh"
  ], T = a.SHEBANG({
    binary: `(${S.join("|")})`,
    relevance: 10
  }), O = {
    className: "function",
    begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
    returnBegin: !0,
    contains: [a.inherit(a.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
    relevance: 0
  }, N = [
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
  ], B = [
    "true",
    "false"
  ], D = { match: /(\/[a-z._-]+)+/ }, P = [
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
  ], W = [
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
  ], Q = [
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
  ], G = [
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
      keyword: N,
      literal: B,
      built_in: [
        ...P,
        ...W,
        // Shell modifiers
        "set",
        "shopt",
        ...Q,
        ...G
      ]
    },
    contains: [
      T,
      // to catch known shells and boost relevancy
      a.SHEBANG(),
      // to catch unknown shells but still highlight the shebang
      O,
      k,
      c,
      h,
      D,
      p,
      b,
      v,
      A,
      n
    ]
  };
}
function ft(a) {
  const e = a.regex, n = new RegExp("[\\p{XID_Start}_]\\p{XID_Continue}*", "u"), r = [
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
  ], p = {
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
  }, b = {
    className: "meta",
    begin: /^(>>>|\.\.\.) /
  }, v = {
    className: "subst",
    begin: /\{/,
    end: /\}/,
    keywords: p,
    illegal: /#/
  }, A = {
    begin: /\{\{/,
    relevance: 0
  }, k = {
    className: "string",
    contains: [a.BACKSLASH_ESCAPE],
    variants: [
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
        end: /'''/,
        contains: [
          a.BACKSLASH_ESCAPE,
          b
        ],
        relevance: 10
      },
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
        end: /"""/,
        contains: [
          a.BACKSLASH_ESCAPE,
          b
        ],
        relevance: 10
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'''/,
        end: /'''/,
        contains: [
          a.BACKSLASH_ESCAPE,
          b,
          A,
          v
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"""/,
        end: /"""/,
        contains: [
          a.BACKSLASH_ESCAPE,
          b,
          A,
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
          a.BACKSLASH_ESCAPE,
          A,
          v
        ]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"/,
        end: /"/,
        contains: [
          a.BACKSLASH_ESCAPE,
          A,
          v
        ]
      },
      a.APOS_STRING_MODE,
      a.QUOTE_STRING_MODE
    ]
  }, S = "[0-9](_?[0-9])*", T = `(\\b(${S}))?\\.(${S})|\\b(${S})\\.`, O = `\\b|${r.join("|")}`, N = {
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
        begin: `(\\b(${S})|(${T}))[eE][+-]?(${S})[jJ]?(?=${O})`
      },
      {
        begin: `(${T})[jJ]?`
      },
      // decinteger, bininteger, octinteger, hexinteger
      // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
      // optionally "long" in Python 2
      // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
      // decinteger is optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${O})`
      },
      {
        begin: `\\b0[bB](_?[01])+[lL]?(?=${O})`
      },
      {
        begin: `\\b0[oO](_?[0-7])+[lL]?(?=${O})`
      },
      {
        begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${O})`
      },
      // imagnumber (digitpart-based)
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      {
        begin: `\\b(${S})[jJ](?=${O})`
      }
    ]
  }, B = {
    className: "comment",
    begin: e.lookahead(/# type:/),
    end: /$/,
    keywords: p,
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
        keywords: p,
        contains: [
          "self",
          b,
          N,
          k,
          a.HASH_COMMENT_MODE
        ]
      }
    ]
  };
  return v.contains = [
    k,
    N,
    b
  ], {
    name: "Python",
    aliases: [
      "py",
      "gyp",
      "ipython"
    ],
    unicodeRegex: !0,
    keywords: p,
    illegal: /(<\/|\?)|=>/,
    contains: [
      b,
      N,
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
      B,
      a.HASH_COMMENT_MODE,
      {
        match: [
          /\bdef/,
          /\s+/,
          n
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
              n,
              /\s*/,
              /\(\s*/,
              n,
              /\s*\)/
            ]
          },
          {
            match: [
              /\bclass/,
              /\s+/,
              n
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
          N,
          D,
          k
        ]
      }
    ]
  };
}
const Le = "[A-Za-z$_][0-9A-Za-z$_]*", mt = [
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
function Bn(a) {
  const e = a.regex, n = (x, { after: ee }) => {
    const ne = "</" + x[0].slice(1);
    return x.input.indexOf(ne, ee) !== -1;
  }, r = Le, s = {
    begin: "<>",
    end: "</>"
  }, c = /<[A-Za-z0-9\\._:-]+\s*\/>/, h = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (x, ee) => {
      const ne = x[0].length + x.index, le = x.input[ne];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        le === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        le === ","
      ) {
        ee.ignoreMatch();
        return;
      }
      le === ">" && (n(x, { after: ne }) || ee.ignoreMatch());
      let he;
      const me = x.input.substring(ne);
      if (he = me.match(/^\s*=/)) {
        ee.ignoreMatch();
        return;
      }
      if ((he = me.match(/^\s+extends\s+/)) && he.index === 0) {
        ee.ignoreMatch();
        return;
      }
    }
  }, p = {
    $pattern: Le,
    keyword: mt,
    literal: vt,
    built_in: wt,
    "variable.language": xt
  }, b = "[0-9](_?[0-9])*", v = `\\.(${b})`, A = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", k = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${A})((${v})|\\.)?|(${v}))[eE][+-]?(${b})\\b` },
      { begin: `\\b(${A})\\b((${v})\\b|\\.)?|(${v})\\b` },
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
  }, S = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: p,
    contains: []
    // defined later
  }, T = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        a.BACKSLASH_ESCAPE,
        S
      ],
      subLanguage: "xml"
    }
  }, O = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        a.BACKSLASH_ESCAPE,
        S
      ],
      subLanguage: "css"
    }
  }, N = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        a.BACKSLASH_ESCAPE,
        S
      ],
      subLanguage: "graphql"
    }
  }, B = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      a.BACKSLASH_ESCAPE,
      S
    ]
  }, P = {
    className: "comment",
    variants: [
      a.COMMENT(
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
      a.C_BLOCK_COMMENT_MODE,
      a.C_LINE_COMMENT_MODE
    ]
  }, W = [
    a.APOS_STRING_MODE,
    a.QUOTE_STRING_MODE,
    T,
    O,
    N,
    B,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    k
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  S.contains = W.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: p,
    contains: [
      "self"
    ].concat(W)
  });
  const Q = [].concat(P, S.contains), G = Q.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: p,
      contains: ["self"].concat(Q)
    }
  ]), j = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: p,
    contains: G
  }, re = {
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
  }, q = {
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
  }, oe = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, se = {
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
    contains: [j],
    illegal: /%/
  }, ie = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function ce(x) {
    return e.concat("(?!", x.join("|"), ")");
  }
  const te = {
    match: e.concat(
      /\b/,
      ce([
        ...yt,
        "super",
        "import"
      ].map((x) => `${x}\\s*\\(`)),
      r,
      e.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, $ = {
    begin: e.concat(/\./, e.lookahead(
      e.concat(r, /(?![0-9A-Za-z$_(])/)
    )),
    end: r,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, U = {
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
      j
    ]
  }, Y = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + a.UNDERSCORE_IDENT_RE + ")\\s*=>", J = {
    match: [
      /const|var|let/,
      /\s+/,
      r,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      e.lookahead(Y)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      j
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: p,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: G, CLASS_REFERENCE: q },
    illegal: /#(?![$_A-z])/,
    contains: [
      a.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      oe,
      a.APOS_STRING_MODE,
      a.QUOTE_STRING_MODE,
      T,
      O,
      N,
      B,
      P,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      k,
      q,
      {
        scope: "attr",
        match: r + e.lookahead(":"),
        relevance: 0
      },
      J,
      {
        // "value" container
        begin: "(" + a.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          P,
          a.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: Y,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: a.UNDERSCORE_IDENT_RE,
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
                    keywords: p,
                    contains: G
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
              { match: c },
              {
                begin: h.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": h.isTrulyOpeningTag,
                end: h.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: h.begin,
                end: h.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      se,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + a.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          j,
          a.inherit(a.TITLE_MODE, { begin: r, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      $,
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
        contains: [j]
      },
      te,
      ie,
      re,
      U,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
function St(a) {
  const e = a.regex, n = Bn(a), r = Le, s = [
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
  ], c = {
    begin: [
      /namespace/,
      /\s+/,
      a.IDENT_RE
    ],
    beginScope: {
      1: "keyword",
      3: "title.class"
    }
  }, h = {
    beginKeywords: "interface",
    end: /\{/,
    excludeEnd: !0,
    keywords: {
      keyword: "interface extends",
      built_in: s
    },
    contains: [n.exports.CLASS_REFERENCE]
  }, p = {
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use strict['"]/
  }, b = [
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
    $pattern: Le,
    keyword: mt.concat(b),
    literal: vt,
    built_in: wt.concat(s),
    "variable.language": xt
  }, A = {
    className: "meta",
    begin: "@" + r
  }, k = (N, B, D) => {
    const P = N.contains.findIndex((W) => W.label === B);
    if (P === -1)
      throw new Error("can not find mode to replace");
    N.contains.splice(P, 1, D);
  };
  Object.assign(n.keywords, v), n.exports.PARAMS_CONTAINS.push(A);
  const S = n.contains.find((N) => N.scope === "attr"), T = Object.assign(
    {},
    S,
    { match: e.concat(r, e.lookahead(/\s*\?:/)) }
  );
  n.exports.PARAMS_CONTAINS.push([
    n.exports.CLASS_REFERENCE,
    // class reference for highlighting the params types
    S,
    // highlight the params key
    T
    // Added for optional property assignment highlighting
  ]), n.contains = n.contains.concat([
    A,
    c,
    h,
    T
    // Added for optional property assignment highlighting
  ]), k(n, "shebang", a.SHEBANG()), k(n, "use_strict", p);
  const O = n.contains.find((N) => N.label === "func.def");
  return O.relevance = 0, Object.assign(n, {
    name: "TypeScript",
    aliases: [
      "ts",
      "tsx",
      "mts",
      "cts"
    ]
  }), n;
}
M.registerLanguage("javascript", gt);
M.registerLanguage("js", gt);
M.registerLanguage("css", Mn);
M.registerLanguage("html", Ae);
M.registerLanguage("xml", Ae);
M.registerLanguage("xhtml", Ae);
M.registerLanguage("svg", Ae);
M.registerLanguage("markup", Ae);
M.registerLanguage("json", On);
M.registerLanguage("yaml", pt);
M.registerLanguage("yml", pt);
M.registerLanguage("php", Ln);
M.registerLanguage("http", In);
M.registerLanguage("plaintext", $e);
M.registerLanguage("text", $e);
M.registerLanguage("txt", $e);
M.registerLanguage("csv", $e);
M.registerLanguage("diff", $n);
M.registerLanguage("bash", Be);
M.registerLanguage("shell", Be);
M.registerLanguage("sh", Be);
M.registerLanguage("zsh", Be);
M.registerLanguage("python", ft);
M.registerLanguage("py", ft);
M.registerLanguage("typescript", St);
M.registerLanguage("ts", St);
function Dn(a) {
  const e = /(<\/?span[^>]*>)|([^<]+)/g, n = [""], r = [];
  let s;
  for (; (s = e.exec(a)) !== null; ) {
    const c = s[1], h = s[2];
    if (c)
      c.startsWith("</") ? r.pop() : r.push(c), n[n.length - 1] += c;
    else {
      const p = h.split(`
`);
      for (let b = 0; b < p.length; b++)
        b > 0 && (n[n.length - 1] += "</span>".repeat(r.length), n.push(r.join(""))), n[n.length - 1] += p[b];
    }
  }
  return n;
}
if (typeof document < "u") {
  const a = document.createElement("style");
  a.textContent = "code-block:not(:defined),code-block-group:not(:defined){display:block;opacity:0}", document.head.appendChild(a);
}
const Se = /* @__PURE__ */ new Set();
let _e = null, Ie = null;
function De() {
  const a = document.documentElement, e = document.body;
  if (!a || !e) return null;
  if (a.classList.contains("dark") || e.classList.contains("dark") || a.getAttribute("data-theme") === "dark" || e.getAttribute("data-theme") === "dark") return !0;
  if (a.getAttribute("data-theme") === "light" || e.getAttribute("data-theme") === "light") return !1;
  if (a.getAttribute("data-bs-theme") === "dark" || e.getAttribute("data-bs-theme") === "dark") return !0;
  if (a.getAttribute("data-bs-theme") === "light" || e.getAttribute("data-bs-theme") === "light") return !1;
  if (a.getAttribute("data-mode") === "dark") return !0;
  if (a.getAttribute("data-mode") === "light") return !1;
  const n = getComputedStyle(a).colorScheme;
  return n === "dark" ? !0 : n === "light" ? !1 : null;
}
function Pn() {
  const a = De();
  if (a !== Ie) {
    Ie = a;
    for (const e of Se)
      e._onPageModeChange(a);
  }
}
function Un() {
  if (_e) return;
  _e = new MutationObserver(Pn);
  const a = {
    attributes: !0,
    attributeFilter: ["class", "data-theme", "data-bs-theme", "data-mode", "style"]
  };
  _e.observe(document.documentElement, a), document.body && _e.observe(document.body, a);
}
function Hn() {
  _e && (_e.disconnect(), _e = null);
}
function Ze(a) {
  Se.add(a), Se.size === 1 && Un();
  const e = De();
  Ie = e, a._onPageModeChange(e);
}
function At(a) {
  Se.delete(a), Se.size === 0 && (Hn(), Ie = null);
}
class zn extends HTMLElement {
  constructor() {
    super(), this.shadowRoot || this.attachShadow({ mode: "open" }), this._codeContent = null, this._showShareMenu = !1, this._handleOutsideClick = this._handleOutsideClick.bind(this), this._observer = null, this._highlighted = !1, this._isLoading = !1, this._loadError = null;
  }
  connectedCallback() {
    var n;
    if ((n = this.shadowRoot) != null && n.children.length && this.hasAttribute("data-ssr")) {
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
        const n = await fetch(e);
        if (!n.ok)
          throw new Error(`HTTP ${n.status}: ${n.statusText}`);
        const r = await n.text();
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
      } catch (n) {
        this._isLoading = !1, this._loadError = n.message, this._renderErrorState(), this.dispatchEvent(new CustomEvent("code-load-error", {
          detail: { url: e, error: n.message },
          bubbles: !0
        }));
      }
    }
  }
  /**
   * Detect language from URL file extension
   */
  _detectLanguageFromUrl(e) {
    const n = {
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
    return n[s] || null;
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
      "start-line",
      "end-line",
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
  attributeChangedCallback(e, n, r) {
    if (this.shadowRoot && n !== r) {
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
  get startLine() {
    const e = this.getAttribute("start-line");
    if (e === null) return 1;
    const n = parseInt(e, 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }
  get endLine() {
    const e = this.getAttribute("end-line");
    if (e === null) return null;
    const n = parseInt(e, 10);
    return Number.isFinite(n) && n >= 1 ? n : null;
  }
  get filename() {
    return this.getAttribute("filename") || "";
  }
  get highlightLines() {
    const e = this.getAttribute("highlight-lines");
    if (!e) return /* @__PURE__ */ new Set();
    const n = /* @__PURE__ */ new Set(), r = e.split(",");
    for (const s of r) {
      const c = s.trim();
      if (c.includes("-")) {
        const [h, p] = c.split("-").map(Number);
        for (let b = h; b <= p; b++)
          n.add(b);
      } else
        n.add(Number(c));
    }
    return n;
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
    const e = this.getCode(), n = this.shadowRoot.querySelector(".copy-button"), r = this.copyText, s = this.copiedText;
    try {
      await navigator.clipboard.writeText(e), n.textContent = s, n.classList.add("copied"), n.setAttribute("aria-label", "Code copied to clipboard");
    } catch (c) {
      console.error("Failed to copy code:", c), n.textContent = "Failed", n.classList.add("failed"), n.setAttribute("aria-label", "Failed to copy code");
    }
    setTimeout(() => {
      n.textContent = r, n.classList.remove("copied", "failed"), n.setAttribute("aria-label", "Copy code to clipboard");
    }, 2e3);
  }
  /**
   * Download code as a file
   */
  downloadCode() {
    const e = this.getCode(), n = this.filename || `code.${this._getFileExtension()}`, r = new Blob([e], { type: "text/plain" }), s = URL.createObjectURL(r), c = document.createElement("a");
    c.href = s, c.download = n, document.body.appendChild(c), c.click(), document.body.removeChild(c), URL.revokeObjectURL(s);
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
    const e = this.shadowRoot.querySelector(".share-menu"), n = this.shadowRoot.querySelector(".share-button");
    this._showShareMenu ? (e.style.display = "block", n.classList.add("active"), setTimeout(() => {
      document.addEventListener("click", this._handleOutsideClick);
    }, 0)) : (e.style.display = "none", n.classList.remove("active"), document.removeEventListener("click", this._handleOutsideClick));
  }
  _handleOutsideClick(e) {
    const n = this.shadowRoot.querySelector(".share-menu");
    n && !n.contains(e.target) && this.toggleShareMenu();
  }
  /**
   * Share via Web Share API
   */
  async shareViaWebAPI() {
    if (!navigator.share) return;
    const e = this.getCode(), n = this.filename || this.label;
    try {
      await navigator.share({
        title: n,
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
    const e = this.getCode(), n = this.language;
    let r = {
      title: this.filename || this.label || "Code Block Demo",
      description: "Code shared from code-block component",
      editors: "111"
    };
    ["html", "markup", "xhtml", "xml", "svg"].includes(n) ? (r.html = e, r.editors = "100") : n === "css" ? (r.css = e, r.editors = "010") : ["javascript", "js"].includes(n) ? (r.js = e, r.editors = "001") : (r.html = `<pre><code>${this.escapeHtml(e)}</code></pre>`, r.editors = "100");
    const s = document.createElement("form");
    s.action = "https://codepen.io/pen/define", s.method = "POST", s.target = "_blank";
    const c = document.createElement("input");
    c.type = "hidden", c.name = "data", c.value = JSON.stringify(r), s.appendChild(c), document.body.appendChild(s), s.submit(), document.body.removeChild(s), this.toggleShareMenu();
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
        border-radius: var(--cb-button-radius, 4px);
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
    const n = (this._codeContent || this.textContent).trim().split(`
`), r = this.startLine, s = this._sliceLines(n), h = s.map((A) => this.escapeHtml(A)).map((A) => `<span class="code-line">${A || " "}</span>`).join(""), p = this.showLines ? `<div class="line-numbers" aria-hidden="true">${s.map((A, k) => `<span>${r + k}</span>`).join("")}</div>` : "", b = this.filename ? `<span class="label">${this.escapeHtml(this.language.toUpperCase())}</span><span class="filename">${this.escapeHtml(this.filename)}</span>` : `<span class="label">${this.escapeHtml(this.label)}</span>`;
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
          ${p}
          <pre><code class="hljs">${h}</code></pre>
        </div>
      </div>
    `;
    const v = this.shadowRoot.querySelector(".copy-button");
    v && v.addEventListener("click", () => this.copyCode());
  }
  /**
   * Attach event listeners to pre-rendered SSR shadow DOM without re-rendering.
   */
  _hydrateInteractivity() {
    const e = this.shadowRoot.querySelector(".copy-button");
    e && e.addEventListener("click", () => this.copyCode());
    const n = this.shadowRoot.querySelector(".expand-button");
    n && n.addEventListener("click", () => this.toggleCollapsed());
    const r = this.shadowRoot.querySelector(".share-button");
    r && r.addEventListener("click", (h) => {
      h.stopPropagation(), this.toggleShareMenu();
    });
    const s = this.shadowRoot.querySelector(".share-codepen");
    s && s.addEventListener("click", () => this.openInCodePen());
    const c = this.shadowRoot.querySelector(".download-button");
    c && c.addEventListener("click", () => this.downloadCode());
  }
  render() {
    const e = (this._codeContent || this.textContent).trim(), n = e.split(`
`), r = this.highlightLines, s = this.language === "diff", c = this.startLine, h = this.endLine, p = h && h >= c ? Math.min(n.length, h - c + 1) : n.length;
    let b;
    try {
      this.language && this.language !== "plaintext" && this.language !== "text" && this.language !== "txt" ? b = M.highlight(e, { language: this.language, ignoreIllegals: !0 }).value : b = this.escapeHtml(e);
    } catch {
      b = this.escapeHtml(e);
    }
    const A = Dn(b).slice(0, p), k = n.slice(0, p), S = A.map((te, $) => {
      const U = c + $, Y = r.has(U), J = ["code-line"];
      if (Y && J.push("highlighted"), s) {
        const x = k[$] || "";
        x.startsWith("+") && !x.startsWith("+++") ? J.push("diff-add") : x.startsWith("-") && !x.startsWith("---") && J.push("diff-remove");
      }
      return `<span class="${J.join(" ")}">${te || " "}</span>`;
    }).join(""), T = this.showLines ? `<div class="line-numbers" aria-hidden="true">${A.map((te, $) => {
      const U = c + $, Y = r.has(U), J = [];
      if (Y && J.push("highlighted"), s) {
        const x = k[$] || "";
        x.startsWith("+") && !x.startsWith("+++") ? J.push("diff-add") : x.startsWith("-") && !x.startsWith("---") && J.push("diff-remove");
      }
      return `<span class="${J.join(" ")}">${U}</span>`;
    }).join("")}</div>` : "", O = this.filename ? `<span class="label">${this.escapeHtml(this.language.toUpperCase())}</span><span class="filename">${this.escapeHtml(this.filename)}</span>` : `<span class="label">${this.escapeHtml(this.label)}</span>`, N = this.hasAttribute("collapsed") || this.hasAttribute("max-lines"), B = A.length, D = this.maxLines, P = N && B > D, W = this.collapsed, Q = W ? `calc(${D} * 1.6em + 2rem)` : "none", G = this.maxHeight ? `--cb-max-height: ${this.maxHeight};` : "", j = W ? `max-height: ${Q};` : "";
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          ${O}
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
      <div class="code-container" role="region" aria-labelledby="code-label" style="${G}${j}">
        ${T}
        <pre><code class="language-${this.language}" tabindex="0">${S}</code></pre>
      </div>
      ${P ? `
        <button class="expand-button" aria-expanded="${!W}">
          ${W ? `Show all ${B} lines` : "Show less"}
        </button>
      ` : ""}
    `, P ? this.setAttribute("data-expandable", "") : this.removeAttribute("data-expandable");
    const re = this.shadowRoot.querySelector(".copy-button");
    re && re.addEventListener("click", () => this.copyCode());
    const q = this.shadowRoot.querySelector(".expand-button");
    q && q.addEventListener("click", () => this.toggleCollapsed());
    const oe = this.shadowRoot.querySelector(".share-button");
    oe && oe.addEventListener("click", (te) => {
      te.stopPropagation(), this.toggleShareMenu();
    });
    const se = this.shadowRoot.querySelector(".share-native");
    se && se.addEventListener("click", () => this.shareViaWebAPI());
    const ie = this.shadowRoot.querySelector(".share-codepen");
    ie && ie.addEventListener("click", () => this.openInCodePen());
    const ce = this.shadowRoot.querySelector(".download-button");
    ce && ce.addEventListener("click", () => this.downloadCode());
  }
  toggleCollapsed() {
    this.collapsed ? this.removeAttribute("collapsed") : this.setAttribute("collapsed", "");
  }
  escapeHtml(e) {
    const n = document.createElement("div");
    return n.textContent = e, n.innerHTML;
  }
  _sliceLines(e) {
    const n = this.startLine, r = this.endLine, s = r && r >= n ? Math.min(e.length, r - n + 1) : e.length;
    return e.slice(0, s);
  }
  /**
   * Update the code content programmatically
   */
  setCode(e) {
    this._codeContent = e, this.render();
  }
  /**
   * Get the visible code content (respects start-line/end-line slicing).
   */
  getCode() {
    const e = (this._codeContent || this.textContent).trim();
    return !this.hasAttribute("start-line") && !this.hasAttribute("end-line") ? e : this._sliceLines(e.split(`
`)).join(`
`);
  }
  /**
   * Get list of supported languages
   */
  static getSupportedLanguages() {
    return M.listLanguages();
  }
}
customElements.define("code-block", zn);
class Fn extends HTMLElement {
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
  attributeChangedCallback(e, n, r) {
    this.shadowRoot && n !== r && (e === "theme" && (this.hasAttribute("theme") ? this.removeAttribute("data-page-theme") : this._onPageModeChange(De())), this.render());
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
    const n = this.codeBlocks;
    e >= 0 && e < n.length && (this._activeIndex = e, this.updateActiveTab());
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
        border-radius: var(--cb-button-radius, 4px);
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
        border-radius: var(--cb-button-radius, 4px);
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
    e.forEach((c, h) => {
      c.setAttribute("theme", this.theme), h === this._activeIndex ? c.classList.add("active") : c.classList.remove("active");
    });
    const n = e.map((c, h) => {
      const p = c.getAttribute("filename"), b = c.getAttribute("label"), v = c.getAttribute("language") || "plaintext", A = p || b || v.toUpperCase(), k = h === this._activeIndex;
      return `
        <button
          class="tab"
          role="tab"
          aria-selected="${k}"
          aria-controls="panel-${h}"
          tabindex="${k ? "0" : "-1"}"
          data-index="${h}"
        >
          <span class="tab-label">${this.escapeHtml(A)}</span>
          ${p ? `<span class="language-badge">${v}</span>` : ""}
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
          ${n}
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
    e.addEventListener("click", (h) => {
      const p = h.target.closest(".tab");
      if (p) {
        const b = parseInt(p.dataset.index, 10);
        this.activeIndex = b;
      }
    }), e.addEventListener("keydown", (h) => {
      const p = this.shadowRoot.querySelectorAll(".tab"), b = this._activeIndex;
      let v = b;
      switch (h.key) {
        case "ArrowLeft":
          v = b > 0 ? b - 1 : p.length - 1;
          break;
        case "ArrowRight":
          v = b < p.length - 1 ? b + 1 : 0;
          break;
        case "Home":
          v = 0;
          break;
        case "End":
          v = p.length - 1;
          break;
        default:
          return;
      }
      h.preventDefault(), this.activeIndex = v, p[v].focus();
    });
    const n = this.shadowRoot.querySelector(".download-button");
    n && n.addEventListener("click", () => this.downloadCode());
    const r = this.shadowRoot.querySelector(".share-button");
    r && r.addEventListener("click", (h) => {
      h.stopPropagation(), this.toggleShareMenu();
    });
    const s = this.shadowRoot.querySelector(".web-share-button");
    s && s.addEventListener("click", () => {
      this.shareViaWebAPI(), this.toggleShareMenu();
    });
    const c = this.shadowRoot.querySelector(".codepen-button");
    c && c.addEventListener("click", () => {
      this.openInCodePen(), this.toggleShareMenu();
    });
  }
  updateActiveTab() {
    const e = this.shadowRoot.querySelectorAll(".tab"), n = this.codeBlocks;
    e.forEach((r, s) => {
      const c = s === this._activeIndex;
      r.setAttribute("aria-selected", c), r.setAttribute("tabindex", c ? "0" : "-1");
    }), n.forEach((r, s) => {
      s === this._activeIndex ? r.classList.add("active") : r.classList.remove("active");
    }), this.dispatchEvent(
      new CustomEvent("tab-change", {
        detail: { index: this._activeIndex, block: n[this._activeIndex] },
        bubbles: !0
      })
    );
  }
  escapeHtml(e) {
    const n = document.createElement("div");
    return n.textContent = e, n.innerHTML;
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
    const e = this.shadowRoot.querySelector(".share-menu"), n = this.shadowRoot.querySelector(".share-button");
    e && e.classList.toggle("open", this._showShareMenu), n && n.setAttribute("aria-expanded", this._showShareMenu), this._showShareMenu ? document.addEventListener("click", this._handleOutsideClick) : document.removeEventListener("click", this._handleOutsideClick);
  }
  /**
   * Handle clicks outside share menu
   */
  _handleOutsideClick(e) {
    const n = this.shadowRoot.querySelector(".share-container");
    if (n && !e.composedPath().includes(n)) {
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
    let n = "", r = "", s = "", c = "Code Block Group";
    e.forEach((A) => {
      const k = A.language, S = A.getCode(), T = A.filename;
      ["html", "markup", "xhtml", "xml", "svg"].includes(k) ? (n && (n += `

`), T && (n += `<!-- ${T} -->
`), n += S) : k === "css" ? (r && (r += `

`), T && (r += `/* ${T} */
`), r += S) : ["javascript", "js"].includes(k) && (s && (s += `

`), T && (s += `// ${T}
`), s += S), (!c || c === "Code Block Group") && (c = T || A.label || "Code Block Group");
    });
    let h = "";
    h += n ? "1" : "0", h += r ? "1" : "0", h += s ? "1" : "0";
    const p = {
      title: c,
      description: "Code shared from code-block-group component",
      html: n,
      css: r,
      js: s,
      editors: h
    }, b = document.createElement("form");
    b.action = "https://codepen.io/pen/define", b.method = "POST", b.target = "_blank";
    const v = document.createElement("input");
    v.type = "hidden", v.name = "data", v.value = JSON.stringify(p), b.appendChild(v), document.body.appendChild(b), b.submit(), document.body.removeChild(b);
  }
  /**
   * Share all blocks' code via Web Share API
   */
  async shareViaWebAPI() {
    if (!navigator.share) return;
    const e = this.codeBlocks;
    if (e.length === 0) return;
    let n = "";
    e.forEach((r) => {
      const s = r.filename || r.label || r.language, c = r.getCode();
      n && (n += `

`), n += `// === ${s} ===
${c}`;
    });
    try {
      await navigator.share({
        title: "Code from code-block-group",
        text: n
      });
    } catch (r) {
      r.name !== "AbortError" && console.error("Share failed:", r);
    }
  }
}
customElements.define("code-block-group", Fn);
export {
  zn as CodeBlock,
  Fn as CodeBlockGroup
};
