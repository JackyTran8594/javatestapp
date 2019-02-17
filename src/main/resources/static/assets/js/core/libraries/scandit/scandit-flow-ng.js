var Scandit =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var angular = __webpack_require__(1);
	var ScanditNg_provider_1 = __webpack_require__(2);
	var boot = function ($timeout, $rootScope, $scandit) {
	    $timeout(function () {
	        $rootScope.$apply(function () {
	            $scandit.init();
	        });
	    });
	};
	boot.$inject = ['$timeout', '$rootScope', '$scandit'];
	var ScanditNg;
	(function (ScanditNg) {
	    angular.module('scandit.flow', [])
	        .provider('$scandit', ScanditNg_provider_1.ScanditService)
	        .run(boot);
	})(ScanditNg || (ScanditNg = {}));
	__export(__webpack_require__(59));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Client_1 = __webpack_require__(3);
	var PatchedClient = (function (_super) {
	    __extends(PatchedClient, _super);
	    function PatchedClient() {
	        _super.apply(this, arguments);
	        this.initialized = false;
	    }
	    PatchedClient.prototype.init = function () {
	        var _this = this;
	        return this.initPromise || (this.initPromise = new Promise(function (resolve, reject) {
	            _super.prototype.init.call(_this).then(function (authStatus) {
	                if (!authStatus)
	                    _super.prototype.emit.call(_this, 'auth.reject');
	                _this.initialized = true;
	                resolve(authStatus);
	            }, function () {
	                _super.prototype.emit.call(_this, 'auth.reject');
	            });
	        }));
	    };
	    PatchedClient.prototype.ready = function (callback) {
	        if (!(callback instanceof Function))
	            throw new ReferenceError("Callback parameter must be a function.");
	        if (!this.initPromise)
	            this.init();
	        return this.initPromise.then(callback);
	    };
	    return PatchedClient;
	}(Client_1.default));
	exports.PatchedClient = PatchedClient;
	var ScanditService = (function () {
	    function ScanditService() {
	        this.$get.$inject = ['$rootScope'];
	    }
	    ScanditService.prototype.configure = function (config) {
	        this.client = new PatchedClient(config);
	    };
	    ScanditService.prototype.$get = function ($rootScope) {
	        if (!this.client)
	            throw new ReferenceError("Scandit provider is not configured.");
	        this.client.$rootScope = $rootScope;
	        return this.client;
	    };
	    return ScanditService;
	}());
	exports.ScanditService = ScanditService;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Config_1 = __webpack_require__(4);
	var ClientAuthenticator_1 = __webpack_require__(6);
	var UserImplicitAuthenticator_1 = __webpack_require__(38);
	var UserCredentialsAuthenticator_1 = __webpack_require__(40);
	var StaticApiKeyAuthenticator_1 = __webpack_require__(41);
	var DbApiClient_1 = __webpack_require__(42);
	var CookieStorage_1 = __webpack_require__(53);
	var LocalStorage_1 = __webpack_require__(55);
	var SessionStorage_1 = __webpack_require__(58);
	var events_1 = __webpack_require__(8);
	/**
	 * @namespace Scandit.Client
	 */
	var Client = (function (_super) {
	    __extends(Client, _super);
	    function Client(config) {
	        var _this = this;
	        _super.call(this);
	        var storage;
	        switch (config.storage == undefined || config.storage == null ? Config_1.StorageMethod.LOCAL_STORAGE : config.storage) {
	            case Config_1.StorageMethod.COOKIE_STORAGE:
	                storage = new CookieStorage_1.CookieStorage(config.storageKey);
	                break;
	            case Config_1.StorageMethod.LOCAL_STORAGE:
	                storage = new LocalStorage_1.LocalStorage(config.storageKey);
	                break;
	            case Config_1.StorageMethod.SESSION_STORAGE:
	                storage = new SessionStorage_1.SessionStorage(config.storageKey);
	                break;
	            case Config_1.StorageMethod.NO_STORAGE:
	                storage = null;
	                break;
	            default:
	                throw new ReferenceError("Invalid config provided - unknown storage");
	        }
	        switch (config.method) {
	            case Config_1.AuthMethod.STATIC_KEY:
	                this.authenticator = new StaticApiKeyAuthenticator_1.StaticApiKeyAuthenticator(config, storage);
	                break;
	            case Config_1.AuthMethod.CLIENT:
	                this.authenticator = new ClientAuthenticator_1.ClientAuthenticator(config, storage);
	                break;
	            case Config_1.AuthMethod.USER_IMPLICIT:
	                this.authenticator = new UserImplicitAuthenticator_1.UserImplicitAuthenticator(config, storage);
	                break;
	            case Config_1.AuthMethod.USER_CREDENTIALS:
	                this.authenticator = new UserCredentialsAuthenticator_1.UserCredentialsAuthenticator(config, storage);
	                break;
	            default:
	                throw new ReferenceError("Invalid config provided - unknown method");
	        }
	        this.authenticator.on('auth.login', function (ctx) { _this.emit('auth.login', ctx); });
	        this.authenticator.on('auth.logout', function (ctx) { _this.emit('auth.logout', ctx); });
	        this.authenticator.on('auth.expire', function (ctx) { _this.emit('auth.expire', ctx); });
	        this.authenticator.on('auth.update', function (ctx) { _this.emit('auth.update', ctx); });
	        this.Db = new DbApiClient_1.DbApiClient();
	        this.apiClients = [
	            this.Db,
	        ];
	        this.httpClient = this.authenticator.getHttpClient();
	    }
	    /**
	     * Initializes the client
	     *
	     * @returns {Promise<boolean>}
	     */
	    Client.prototype.init = function () {
	        var _this = this;
	        var isAuthenticated = false;
	        return this.authenticator.init()
	            .then(function (authStatus) {
	            isAuthenticated = authStatus;
	            if (!isAuthenticated)
	                return;
	            return Promise.all(_this.apiClients.map(function (c) { return c.init(_this.httpClient); }));
	        })
	            .then(function () {
	            _this.emit('init', isAuthenticated);
	            return isAuthenticated;
	        });
	    };
	    Client.prototype.authenticate = function () {
	        var _this = this;
	        var credentials = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            credentials[_i - 0] = arguments[_i];
	        }
	        if (!this.authenticator)
	            throw new ReferenceError("Provider is not configured.");
	        return this.authenticator.authenticate.apply(this.authenticator, credentials)
	            .then(function () {
	            return _this.init();
	        });
	    };
	    return Client;
	}(events_1.EventEmitter));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Client;
	//# sourceMappingURL=Client.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	exports.AuthDefaults = {
	    AUTHENTICATION_HEADER: "Authorization",
	    BASE_URL: (function () {
	        var baseUrl;
	        if (process) {
	            baseUrl = process.env['BASE_URL'];
	        }
	        else if (window) {
	            baseUrl = window['BASE_URL'];
	        }
	        return baseUrl ? baseUrl : 'https://scandium.scandit.com';
	    })(),
	    AUTHORIZATION_PATH: '/api/v1/auth/oauth2/authorize',
	    TOKEN_PATH: '/api/v1/auth/oauth2/token',
	};
	(function (AuthMethod) {
	    AuthMethod[AuthMethod["CLIENT"] = 0] = "CLIENT";
	    AuthMethod[AuthMethod["USER_IMPLICIT"] = 1] = "USER_IMPLICIT";
	    AuthMethod[AuthMethod["USER_CREDENTIALS"] = 2] = "USER_CREDENTIALS";
	    AuthMethod[AuthMethod["STATIC_KEY"] = 3] = "STATIC_KEY";
	})(exports.AuthMethod || (exports.AuthMethod = {}));
	var AuthMethod = exports.AuthMethod;
	(function (StorageMethod) {
	    StorageMethod[StorageMethod["COOKIE_STORAGE"] = 0] = "COOKIE_STORAGE";
	    StorageMethod[StorageMethod["LOCAL_STORAGE"] = 1] = "LOCAL_STORAGE";
	    StorageMethod[StorageMethod["SESSION_STORAGE"] = 2] = "SESSION_STORAGE";
	    StorageMethod[StorageMethod["NO_STORAGE"] = 3] = "NO_STORAGE";
	})(exports.StorageMethod || (exports.StorageMethod = {}));
	var StorageMethod = exports.StorageMethod;
	//# sourceMappingURL=Config.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Authenticator_1 = __webpack_require__(7);
	var OAuthHttpClient_1 = __webpack_require__(10);
	var Config_1 = __webpack_require__(4);
	var ClientToken_1 = __webpack_require__(36);
	var ClientAuthenticator = (function (_super) {
	    __extends(ClientAuthenticator, _super);
	    function ClientAuthenticator(config, storage) {
	        _super.call(this, config, storage);
	        this.httpClient = new OAuthHttpClient_1.OAuthHttpClient(this);
	    }
	    ClientAuthenticator.prototype.init = function () {
	        var _this = this;
	        //TODO: try to refresh
	        return this.loadToken(ClientToken_1.ClientToken)
	            .then(function (token) {
	            if (token)
	                _this.httpClient.setAccessToken(token);
	            return token ? true : false;
	        });
	    };
	    ClientAuthenticator.prototype.authenticate = function () {
	        var _this = this;
	        var credentials = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            credentials[_i - 0] = arguments[_i];
	        }
	        return new Promise(function (resolve, reject) {
	            var authenticationUrl = Config_1.AuthDefaults.BASE_URL + Config_1.AuthDefaults.TOKEN_PATH;
	            var payload = {
	                body: "grant_type=client_credentials&client_id=" + _this.config.clientId + "&client_secret=" + _this.config.clientSecret,
	                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	            };
	            _this.httpClient.setAccessToken(null);
	            _this.httpClient.post(authenticationUrl, payload).then(function (response) {
	                if (response.status == 200) {
	                    var tokenResponse = JSON.parse(response.body);
	                    var token_1 = new ClientToken_1.ClientToken(tokenResponse['access_token'], tokenResponse['expires_in'], tokenResponse['token_type'], new Date(tokenResponse['created_at'] * 1000), tokenResponse['refresh_token']);
	                    _this.httpClient.setAccessToken(token_1);
	                    _this.storeToken(token_1)
	                        .then(function () {
	                        _this.emit('auth.login', token_1);
	                        resolve();
	                    })
	                        .catch(function (err) { reject(err); });
	                }
	                else {
	                    reject(new Error('Authentication failed'));
	                }
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    ClientAuthenticator.prototype.getHttpClient = function () {
	        return this.httpClient;
	    };
	    return ClientAuthenticator;
	}(Authenticator_1.Authenticator));
	exports.ClientAuthenticator = ClientAuthenticator;
	//# sourceMappingURL=ClientAuthenticator.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var events_1 = __webpack_require__(8);
	var timers_1 = __webpack_require__(9);
	var Authenticator = (function (_super) {
	    __extends(Authenticator, _super);
	    function Authenticator(config, storage) {
	        _super.call(this);
	        this.config = config;
	        this.storage = storage;
	    }
	    /**
	     * Tries to load the token from storage and checks the expiration
	     *
	     * @param cls Expected type of the token
	     * @returns {Promise<Token>}
	     */
	    Authenticator.prototype.loadToken = function (cls) {
	        var _this = this;
	        var loadedToken;
	        return this.storage.getToken()
	            .then(function (token) {
	            loadedToken = token;
	            if (!token || token.constructor != cls)
	                return false;
	            return _this.validateToken(token);
	        })
	            .then(function (isValid) {
	            if (isValid) {
	                _this.watchToken(loadedToken);
	                return loadedToken;
	            }
	            return false;
	        });
	    };
	    /**
	     * Saves token in the storage
	     *
	     * @param {Token} token
	     * @returns {Promise<void>}
	     */
	    Authenticator.prototype.storeToken = function (token) {
	        this.emit('auth.update', token);
	        this.watchToken(token);
	        return this.storage.setToken(token);
	    };
	    /**
	     * Removes saves token
	     *
	     * @returns {Promise<void>}
	     */
	    Authenticator.prototype.logout = function () {
	        //TODO: revoke token
	        this.emit('auth.logout');
	        this.unwatchToken();
	        return this.storage.clear();
	    };
	    Authenticator.prototype.validateToken = function (token) {
	        return Promise.resolve(!token.isExpired());
	    };
	    Authenticator.prototype.watchToken = function (token) {
	        var _this = this;
	        this.unwatchToken();
	        if (!token || !token.expiresAt)
	            return;
	        var diff = (token.expiresAt.getTime() - new Date().getTime());
	        this.tokenWatchTimeout = timers_1.setTimeout(function () {
	            _this.emit('auth.expire', token);
	        }, diff < 0 ? 0 : diff);
	    };
	    Authenticator.prototype.unwatchToken = function () {
	        if (this.tokenWatchTimeout) {
	            clearTimeout(this.tokenWatchTimeout);
	            this.tokenWatchTimeout = null;
	        }
	    };
	    return Authenticator;
	}(events_1.EventEmitter));
	exports.Authenticator = Authenticator;
	//# sourceMappingURL=Authenticator.js.map

/***/ },
/* 8 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(5).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).setImmediate, __webpack_require__(9).clearImmediate))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var HttpClient_1 = __webpack_require__(11);
	var RefreshableAuthenticator_1 = __webpack_require__(35);
	var OAuthHttpClient = (function (_super) {
	    __extends(OAuthHttpClient, _super);
	    function OAuthHttpClient(authenticator) {
	        _super.call(this);
	        this.authenticator = authenticator;
	    }
	    OAuthHttpClient.prototype.request = function (method, url, options) {
	        var _this = this;
	        return _super.prototype.request.call(this, method, url, options)
	            .catch(function (response) {
	            if (response.status == 401 && _this.token && _this.token.isExpired() && _this.token.isRefreshable() && _this.authenticator instanceof RefreshableAuthenticator_1.RefreshableAuthenticator) {
	                var token_1 = _this.token;
	                _this.token = null;
	                return _this.authenticator.refreshToken(token_1)
	                    .then(function () {
	                    _this.token = token_1;
	                    // retry after successful refresh
	                    return _super.prototype.request.call(_this, method, url, options);
	                });
	            }
	            return response;
	        });
	    };
	    OAuthHttpClient.prototype.setAccessToken = function (token) {
	        this.token = token;
	    };
	    OAuthHttpClient.prototype.getAuthenticationHeader = function () {
	        return this.token ? this.token.tokenType + " " + this.token.token : null;
	    };
	    OAuthHttpClient.prototype.hasAuthenticationInfo = function () {
	        return !!this.token;
	    };
	    return OAuthHttpClient;
	}(HttpClient_1.HttpClient));
	exports.OAuthHttpClient = OAuthHttpClient;
	//# sourceMappingURL=OAuthHttpClient.js.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var axios = __webpack_require__(12);
	var Config_1 = __webpack_require__(4);
	var BaseHttpClient_1 = __webpack_require__(34);
	var HttpClient = (function (_super) {
	    __extends(HttpClient, _super);
	    function HttpClient() {
	        _super.apply(this, arguments);
	    }
	    HttpClient.prototype.request = function (method, url, options) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            options = options ? options : {};
	            var requestOptions = {
	                method: method,
	                url: url,
	                responseType: 'text',
	                transformResponse: function (d) { return typeof d == 'string' ? d : "" + d; }
	            };
	            if (_this.hasAuthenticationInfo()) {
	                options.headers = options.headers || {};
	                options.headers[Config_1.AuthDefaults.AUTHENTICATION_HEADER] = _this.getAuthenticationHeader();
	            }
	            if (options.body)
	                requestOptions.data = typeof options.body == 'string' ? options.body : JSON.stringify(options.body);
	            if (options.query)
	                requestOptions.params = options.query;
	            if (options.headers)
	                requestOptions.headers = options.headers;
	            if (options.files)
	                throw new Error('Not implemented');
	            if (options.formData)
	                throw new Error('Not implemented');
	            if (options.timeout)
	                requestOptions.timeout = options.timeout;
	            if (options.connectionTimeout)
	                throw new Error('Not implemented');
	            axios(requestOptions)
	                .then(function (response) {
	                var finalResponse = {
	                    status: response.status,
	                    body: response.data,
	                    headers: response.headers
	                };
	                if (response.status < 300) {
	                    resolve(finalResponse);
	                }
	                else {
	                    reject(finalResponse);
	                }
	            })
	                .catch(function (error) {
	                reject(error);
	            });
	        });
	    };
	    return HttpClient;
	}(BaseHttpClient_1.BaseHttpClient));
	exports.HttpClient = HttpClient;
	//# sourceMappingURL=HttpClient.js.map

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	var bind = __webpack_require__(15);
	var Axios = __webpack_require__(16);
	
	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);
	
	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);
	
	  // Copy context to instance
	  utils.extend(instance, context);
	
	  return instance;
	}
	
	// Create the default instance to be exported
	var axios = createInstance();
	
	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;
	
	// Factory for creating new instances
	axios.create = function create(defaultConfig) {
	  return createInstance(defaultConfig);
	};
	
	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(33);
	
	module.exports = axios;
	
	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(15);
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}
	
	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}
	
	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}
	
	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}
	
	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  typeof document.createElement -> undefined
	 */
	function isStandardBrowserEnv() {
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined' &&
	    typeof document.createElement === 'function'
	  );
	}
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaults = __webpack_require__(17);
	var utils = __webpack_require__(14);
	var InterceptorManager = __webpack_require__(19);
	var dispatchRequest = __webpack_require__(20);
	var isAbsoluteURL = __webpack_require__(31);
	var combineURLs = __webpack_require__(32);
	
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 */
	function Axios(defaultConfig) {
	  this.defaults = utils.merge(defaults, defaultConfig);
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}
	
	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }
	
	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	
	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }
	
	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);
	
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }
	
	  return promise;
	};
	
	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});
	
	module.exports = Axios;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	var normalizeHeaderName = __webpack_require__(18);
	
	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}
	
	module.exports = {
	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	
	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    },
	    patch: utils.merge(DEFAULT_CONTENT_TYPE),
	    post: utils.merge(DEFAULT_CONTENT_TYPE),
	    put: utils.merge(DEFAULT_CONTENT_TYPE)
	  },
	
	  timeout: 0,
	
	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  maxContentLength: -1,
	
	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};
	
	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(14);
	var transformData = __webpack_require__(21);
	
	/**
	 * Dispatch a request to the server using whichever adapter
	 * is supported by the current environment.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  // Ensure headers exist
	  config.headers = config.headers || {};
	
	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );
	
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  var adapter;
	
	  if (typeof config.adapter === 'function') {
	    // For custom adapter support
	    adapter = config.adapter;
	  } else if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(22);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(22);
	  }
	
	  return Promise.resolve(config)
	    // Wrap synchronous adapter errors and pass configuration
	    .then(adapter)
	    .then(function onFulfilled(response) {
	      // Transform response data
	      response.data = transformData(
	        response.data,
	        response.headers,
	        config.transformResponse
	      );
	
	      return response;
	    }, function onRejected(error) {
	      // Transform response data
	      if (error && error.response) {
	        error.response.data = transformData(
	          error.response.data,
	          error.response.headers,
	          config.transformResponse
	        );
	      }
	
	      return Promise.reject(error);
	    });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(14);
	var settle = __webpack_require__(23);
	var buildURL = __webpack_require__(26);
	var parseHeaders = __webpack_require__(27);
	var isURLSameOrigin = __webpack_require__(28);
	var createError = __webpack_require__(24);
	var btoa = (typeof window !== 'undefined' && window.btoa) || __webpack_require__(29);
	
	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	
	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }
	
	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;
	
	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (process.env.NODE_ENV !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }
	
	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }
	
	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
	
	    // Set the request timeout in MS
	    request.timeout = config.timeout;
	
	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }
	
	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      if (request.status === 0) {
	        return;
	      }
	
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };
	
	      settle(resolve, reject, response);
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(30);
	
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;
	
	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }
	
	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }
	
	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }
	
	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        if (request.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }
	
	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }
	
	
	    if (requestData === undefined) {
	      requestData = null;
	    }
	
	    // Send the request
	    request.send(requestData);
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var createError = __webpack_require__(24);
	
	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response
	    ));
	  }
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var enhanceError = __webpack_require__(25);
	
	/**
	 * Create an Error with the specified message, config, error code, and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, response);
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.response = response;
	  return error;
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}
	
	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	
	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];
	
	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }
	
	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }
	
	      if (!utils.isArray(val)) {
	        val = [val];
	      }
	
	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });
	
	    serializedParams = parts.join('&');
	  }
	
	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }
	
	  return url;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;
	
	  if (!headers) { return parsed; }
	
	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));
	
	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });
	
	  return parsed;
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;
	
	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;
	
	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }
	
	      urlParsingNode.setAttribute('href', href);
	
	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }
	
	    originURL = resolveURL(window.location.href);
	
	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
	
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';
	
	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}
	
	module.exports = btoa;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));
	
	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }
	
	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }
	
	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }
	
	        if (secure === true) {
	          cookie.push('secure');
	        }
	
	        document.cookie = cookie.join('; ');
	      },
	
	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },
	
	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :
	
	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";
	var BaseHttpClient = (function () {
	    function BaseHttpClient() {
	    }
	    BaseHttpClient.prototype.get = function (url, options) {
	        return this.request('GET', url, options);
	    };
	    BaseHttpClient.prototype.options = function (url, options) {
	        return this.request('GET', url, options);
	    };
	    BaseHttpClient.prototype.post = function (url, options) {
	        return this.request('POST', url, options);
	    };
	    BaseHttpClient.prototype.put = function (url, options) {
	        return this.request('PUT', url, options);
	    };
	    BaseHttpClient.prototype.setAuthenticationHeader = function (authHeader) {
	        this.authHeader = authHeader;
	    };
	    BaseHttpClient.prototype.getAuthenticationHeader = function () {
	        return this.authHeader;
	    };
	    BaseHttpClient.prototype.hasAuthenticationInfo = function () {
	        return !!this.authHeader;
	    };
	    return BaseHttpClient;
	}());
	exports.BaseHttpClient = BaseHttpClient;
	//# sourceMappingURL=BaseHttpClient.js.map

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Authenticator_1 = __webpack_require__(7);
	var Config_1 = __webpack_require__(4);
	var RefreshableAuthenticator = (function (_super) {
	    __extends(RefreshableAuthenticator, _super);
	    function RefreshableAuthenticator() {
	        _super.apply(this, arguments);
	    }
	    RefreshableAuthenticator.prototype.validateToken = function (token) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (!token.isExpired()) {
	                resolve(true);
	            }
	            else if (token.isExpired() && token.isRefreshable()) {
	                return _this.refreshToken(token)
	                    .then(function () {
	                    resolve(true);
	                })
	                    .catch(function (err) {
	                    console.error(err.stack);
	                    reject(false);
	                });
	            }
	        });
	    };
	    RefreshableAuthenticator.prototype.refreshToken = function (token) {
	        var _this = this;
	        var requestUrl = Config_1.AuthDefaults.BASE_URL + Config_1.AuthDefaults.TOKEN_PATH;
	        var payload = {
	            body: "grant_type=refresh_token&client_id=" + this.config.clientId + "&client_secret=" + this.config.clientSecret + "&refresh_token=" + encodeURIComponent(token.refreshToken),
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	        };
	        return this.httpClient.post(requestUrl, payload).then(function (response) {
	            if (response.status == 200) {
	                var tokenResponse = JSON.parse(response.body);
	                token.update(tokenResponse['access_token'], tokenResponse['expires_in'], tokenResponse['token_type'], new Date(tokenResponse['created_at'] * 1000), tokenResponse['refresh_token']);
	                return _this.storeToken(token);
	            }
	            throw new Error('Authentication failed');
	        });
	    };
	    return RefreshableAuthenticator;
	}(Authenticator_1.Authenticator));
	exports.RefreshableAuthenticator = RefreshableAuthenticator;
	//# sourceMappingURL=RefreshableAuthenticator.js.map

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Token_1 = __webpack_require__(37);
	var ClientToken = (function (_super) {
	    __extends(ClientToken, _super);
	    function ClientToken() {
	        _super.apply(this, arguments);
	    }
	    return ClientToken;
	}(Token_1.Token));
	exports.ClientToken = ClientToken;
	//# sourceMappingURL=ClientToken.js.map

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";
	var Token = (function () {
	    function Token(token, expires, tokenType, createdAt, refreshToken) {
	        this.update(token, expires, tokenType, createdAt, refreshToken);
	    }
	    Token.prototype.update = function (token, expires, tokenType, createdAt, refreshToken) {
	        this.token = token;
	        this.createdAt = createdAt ? createdAt : new Date();
	        this.expires = expires;
	        this.expiresAt = new Date(this.createdAt.getTime() + (expires * 1000));
	        this.tokenType = tokenType;
	        this.refreshToken = refreshToken;
	    };
	    Token.prototype.isExpired = function () {
	        return this.expiresAt != null && this.expiresAt < new Date();
	    };
	    Token.prototype.isRefreshable = function () {
	        return !!this.refreshToken;
	    };
	    return Token;
	}());
	exports.Token = Token;
	//# sourceMappingURL=Token.js.map

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Authenticator_1 = __webpack_require__(7);
	var OAuthHttpClient_1 = __webpack_require__(10);
	var Config_1 = __webpack_require__(4);
	var UserToken_1 = __webpack_require__(39);
	var CallbackHashParser = (function () {
	    function CallbackHashParser(s) {
	        var _this = this;
	        this.response = {};
	        if (s[0] == "#")
	            s = s.slice(1);
	        s.split("&").map(function (pair) {
	            var param = pair.split("=");
	            _this.response[param[0]] = param[1];
	        });
	    }
	    CallbackHashParser.prototype.getToken = function () {
	        return new UserToken_1.UserToken(this.response['access_token'], this.response['expires_in'], this.response['token_type'], this.response['refresh_token']);
	    };
	    return CallbackHashParser;
	}());
	var UserImplicitAuthenticator = (function (_super) {
	    __extends(UserImplicitAuthenticator, _super);
	    function UserImplicitAuthenticator(config, storage) {
	        _super.call(this, config, storage);
	        this.httpClient = new OAuthHttpClient_1.OAuthHttpClient(this);
	    }
	    UserImplicitAuthenticator.prototype.init = function () {
	        var _this = this;
	        if (window.opener && window.location.hash) {
	            try {
	                window.onload(null);
	                window['response_callback'](window.location.hash);
	                window.close();
	            }
	            catch (err) {
	                console.error(err);
	            }
	            return new Promise(function () { });
	        }
	        //TODO: try to refresh
	        return this.loadToken(UserToken_1.UserToken)
	            .then(function (token) {
	            if (token)
	                _this.httpClient.setAccessToken(token);
	            return token ? true : false;
	        });
	    };
	    UserImplicitAuthenticator.prototype.authenticate = function () {
	        var _this = this;
	        var credentials = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            credentials[_i - 0] = arguments[_i];
	        }
	        return new Promise(function (resolve, reject) {
	            var authorizationUrl = Config_1.AuthDefaults.BASE_URL + Config_1.AuthDefaults.AUTHORIZATION_PATH + "?" +
	                ("response_type=token&client_id=" + _this.config.clientId + "&redirect_uri=" + encodeURIComponent(_this.config.redirectUri));
	            var callback = function (hash) {
	                var responseParser = new CallbackHashParser(hash);
	                var token = responseParser.getToken();
	                _this.httpClient.setAccessToken(token);
	                _this.storeToken(token)
	                    .then(function () {
	                    _this.emit('auth.login', token);
	                    resolve();
	                })
	                    .catch(function (err) { reject(err); });
	            };
	            var popup = _this.config.popup ? window.open(authorizationUrl, "_blank", "width=500,height=500,location=0") : window.open(authorizationUrl);
	            popup.onload = function () {
	                popup.response_callback = callback;
	            };
	            popup.onbeforeunload = function () {
	                reject();
	            };
	        });
	    };
	    UserImplicitAuthenticator.prototype.getHttpClient = function () {
	        return this.httpClient;
	    };
	    return UserImplicitAuthenticator;
	}(Authenticator_1.Authenticator));
	exports.UserImplicitAuthenticator = UserImplicitAuthenticator;
	//# sourceMappingURL=UserImplicitAuthenticator.js.map

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Token_1 = __webpack_require__(37);
	var UserToken = (function (_super) {
	    __extends(UserToken, _super);
	    function UserToken() {
	        _super.apply(this, arguments);
	    }
	    return UserToken;
	}(Token_1.Token));
	exports.UserToken = UserToken;
	//# sourceMappingURL=UserToken.js.map

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var OAuthHttpClient_1 = __webpack_require__(10);
	var Config_1 = __webpack_require__(4);
	var UserToken_1 = __webpack_require__(39);
	var RefreshableAuthenticator_1 = __webpack_require__(35);
	var UserCredentialsAuthenticator = (function (_super) {
	    __extends(UserCredentialsAuthenticator, _super);
	    function UserCredentialsAuthenticator(config, storage) {
	        _super.call(this, config, storage);
	        this.httpClient = new OAuthHttpClient_1.OAuthHttpClient(this);
	    }
	    UserCredentialsAuthenticator.prototype.init = function () {
	        var _this = this;
	        //TODO: try to refresh
	        return this.loadToken(UserToken_1.UserToken)
	            .then(function (token) {
	            if (token)
	                _this.httpClient.setAccessToken(token);
	            return token ? true : false;
	        });
	    };
	    UserCredentialsAuthenticator.prototype.authenticate = function () {
	        var _this = this;
	        var credentials = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            credentials[_i - 0] = arguments[_i];
	        }
	        return new Promise(function (resolve, reject) {
	            var username = credentials[0], password = credentials[1];
	            if (username && password) {
	                var requestUrl = Config_1.AuthDefaults.BASE_URL + Config_1.AuthDefaults.TOKEN_PATH;
	                var payload = {
	                    body: "grant_type=password&client_id=" + _this.config.clientId + "&client_secret=" + _this.config.clientSecret + "&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password),
	                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	                };
	                _this.httpClient.setAccessToken(null);
	                _this.httpClient.post(requestUrl, payload).then(function (response) {
	                    if (response.status == 200) {
	                        var tokenResponse = JSON.parse(response.body);
	                        var token_1 = new UserToken_1.UserToken(tokenResponse['access_token'], tokenResponse['expires_in'], tokenResponse['token_type'], new Date(tokenResponse['created_at'] * 1000), tokenResponse['refresh_token']);
	                        _this.httpClient.setAccessToken(token_1);
	                        _this.storeToken(token_1)
	                            .then(function () {
	                            _this.emit('auth.login', token_1);
	                            resolve();
	                        })
	                            .catch(function (err) { reject(err); });
	                    }
	                    else {
	                        reject(new Error('Authentication failed'));
	                    }
	                }, function (err) {
	                    reject(err);
	                });
	            }
	            else {
	                reject(null);
	            }
	        });
	    };
	    UserCredentialsAuthenticator.prototype.getHttpClient = function () {
	        return this.httpClient;
	    };
	    return UserCredentialsAuthenticator;
	}(RefreshableAuthenticator_1.RefreshableAuthenticator));
	exports.UserCredentialsAuthenticator = UserCredentialsAuthenticator;
	//# sourceMappingURL=UserCredentialsAuthenticator.js.map

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Authenticator_1 = __webpack_require__(7);
	var HttpClient_1 = __webpack_require__(11);
	var StaticApiKeyAuthenticator = (function (_super) {
	    __extends(StaticApiKeyAuthenticator, _super);
	    function StaticApiKeyAuthenticator(config, storage) {
	        _super.call(this, config, storage);
	        this.httpClient = new HttpClient_1.HttpClient();
	    }
	    StaticApiKeyAuthenticator.prototype.init = function () {
	        this.httpClient.setAuthenticationHeader(this.config.key);
	        return Promise.resolve(true);
	    };
	    StaticApiKeyAuthenticator.prototype.authenticate = function () {
	        return Promise.resolve(null);
	    };
	    StaticApiKeyAuthenticator.prototype.getHttpClient = function () {
	        return this.httpClient;
	    };
	    return StaticApiKeyAuthenticator;
	}(Authenticator_1.Authenticator));
	exports.StaticApiKeyAuthenticator = StaticApiKeyAuthenticator;
	//# sourceMappingURL=StaticApiKeyAuthenticator.js.map

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var BaseModel_1 = __webpack_require__(43);
	var Api_1 = __webpack_require__(44);
	var DbApiClient = (function () {
	    function DbApiClient() {
	    }
	    DbApiClient.prototype.init = function (httpClient) {
	        var _this = this;
	        this.api = new Api_1.Api(httpClient);
	        return this.api.fetchSchema()
	            .then(function (schema) {
	            _this.generateModels(schema);
	        });
	    };
	    DbApiClient.prototype.getAvailableModels = function () {
	        var models = [];
	        for (var p in this) {
	            if (this.hasOwnProperty(p) && this[p].hasOwnProperty('_schema')) {
	                models.push(p);
	            }
	        }
	        return models;
	    };
	    DbApiClient.prototype.generateModels = function (schema) {
	        var _this = this;
	        schema.classes.forEach(function (cls) {
	            _this[cls.name] = BaseModel_1.makeModel(cls, _this.api);
	        });
	    };
	    return DbApiClient;
	}());
	exports.DbApiClient = DbApiClient;
	//# sourceMappingURL=DbApiClient.js.map

/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";
	var BaseModel = (function () {
	    function BaseModel(data) {
	        this._data = data || {};
	        this.updateFields(this._data);
	    }
	    BaseModel.get = function (id) {
	        var _this = this;
	        return this._api.getObject(this.getType(), id)
	            .then(function (obj) {
	            return new _this._model(obj);
	        });
	    };
	    BaseModel.all = function (limit) {
	        var _this = this;
	        var promise = this._api.allObjects(this.getType(), { limit: limit });
	        return promise.then(function (objects) {
	            return objects.map(function (o) { return new _this._model(o); });
	        });
	    };
	    BaseModel.find = function (query, options) {
	        var _this = this;
	        return this._api.getObjects(this.getType(), query, options)
	            .then(function (queryResult) {
	            return queryResult.objects.map(function (o) { return new _this._model(o); });
	        });
	    };
	    BaseModel.count = function (query) {
	        return this._api.countObjects(this.getType(), query);
	    };
	    BaseModel.prototype.save = function () {
	        var _this = this;
	        var api = this.constructor['_api'];
	        var data = {};
	        this.constructor['_schema'].fields.forEach(function (field) {
	            data[field.name] = _this.convertValue(_this[field.name], field.type);
	        });
	        if (this['_id']) {
	            // update
	            return api.updateObject(this.constructor['getType'](), this['_id'], data)
	                .then(function () {
	                return _this;
	            });
	        }
	        else {
	            // create
	            return api.createObject(this.constructor['getType'](), data)
	                .then(function (newId) {
	                _this['_id'] = newId;
	                return _this;
	            });
	        }
	    };
	    //noinspection ReservedWordAsName
	    BaseModel.prototype.delete = function () {
	        var api = this.constructor['_api'];
	        if (!this['_id'])
	            return Promise.reject(new Error('Object must have an id'));
	        return api.deleteObject(this.constructor['getType'](), this['_id']);
	    };
	    // TODO: figure out the best way for web
	    // setAttachment() {
	    //
	    // }
	    BaseModel.getName = function () {
	        return this._name;
	    };
	    BaseModel.getType = function () {
	        return this._name.toLowerCase();
	    };
	    BaseModel.getFields = function () {
	        return this._schema.fields.map(function (f) { return f.name; });
	    };
	    BaseModel.prototype.updateFields = function (data) {
	        var _this = this;
	        if (!data || !this.constructor['_schema'])
	            return;
	        if (data['_id'])
	            this['_id'] = data['_id'];
	        this.constructor['_schema'].fields.forEach(function (f) {
	            _this[f.name] = _this.convertValue(data[f.name], f.type);
	        });
	    };
	    BaseModel.prototype.convertValue = function (value, type) {
	        var _this = this;
	        if (value == null || value == undefined)
	            return null;
	        switch (type) {
	            case 'string':
	                return "" + value;
	            case 'integer':
	                return parseInt(value);
	            case 'float':
	                return parseFloat(value);
	            case 'boolean':
	                return !!value;
	            default:
	                if (type.indexOf('array[') == 0)
	                    return (Array.isArray(value) ? value : [value]).map(function (v) {
	                        return _this.convertValue(v, type.substring(6, type.length - 1));
	                    });
	                return null;
	        }
	    };
	    return BaseModel;
	}());
	exports.BaseModel = BaseModel;
	function makeModel(cls, api) {
	    var newModel = eval("(function " + cls.name + "(data){BaseModel.call(this, data)})");
	    // let newModel = function(data){BaseModel.call(this, data)};
	    for (var p in BaseModel)
	        if (BaseModel.hasOwnProperty(p))
	            newModel[p] = BaseModel[p];
	    newModel.prototype = Object.create(BaseModel.prototype);
	    newModel.prototype.constructor = newModel;
	    newModel.prototype.name = cls.name;
	    newModel.prototype.constructor._name = cls.name;
	    newModel.prototype.constructor._schema = cls;
	    newModel.prototype.constructor._api = api;
	    newModel.prototype.constructor._model = newModel;
	    return newModel;
	}
	exports.makeModel = makeModel;
	//# sourceMappingURL=BaseModel.js.map

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Schema_1 = __webpack_require__(45);
	var Config_1 = __webpack_require__(4);
	var cerialize_1 = __webpack_require__(48);
	var Http_1 = __webpack_require__(52);
	var API_BASE_PATH = "/api/v1/storage";
	var Api = (function () {
	    function Api(httpClient) {
	        this.httpClient = httpClient;
	    }
	    Api.prototype.fetchSchema = function () {
	        return this.httpClient.get("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/_schema")
	            .then(function (response) {
	            if (response.status != 200) {
	                throw new Error('Cannot fetch database schema');
	            }
	            return cerialize_1.Deserialize(JSON.parse(response.body), Schema_1.Schema);
	        });
	    };
	    Api.prototype.getObject = function (type, id) {
	        return this.httpClient.get("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/" + id)
	            .then(function (response) {
	            switch (response.status) {
	                case 200:
	                    return JSON.parse(response.body);
	                case 404:
	                    throw new Error('Object not found');
	                default:
	                    throw new Error("Unexpected API response (" + response.status + ")");
	            }
	        });
	    };
	    Api.prototype.getObjects = function (type, query, options) {
	        return this.httpClient.get("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/?" + Api.getObjectsRequestQuerystring(query, options))
	            .then(function (response) {
	            switch (response.status) {
	                case 200:
	                    return JSON.parse(response.body);
	                default:
	                    throw new Error("Unexpected API response (" + response.status + ")");
	            }
	        });
	    };
	    Api.prototype.allObjects = function (type, options) {
	        var _this = this;
	        var requestOptions = { page: 1 };
	        var limit = options && options.limit ? options.limit : null;
	        if (limit && limit < 1000)
	            requestOptions.limit = limit;
	        return this.getObjects(type, requestOptions)
	            .then(function (queryResult) {
	            var pageSize = queryResult.objects.length;
	            var objs = queryResult.objects;
	            if (queryResult.metadata.pages > 1 && (!limit || pageSize < limit)) {
	                var pages = queryResult.metadata.pages - 1;
	                if (limit)
	                    pages = Math.min((Math.ceil(limit / pageSize) - 1), pages);
	                return Promise.all(Array.apply(null, Array(pages)).map(function (_, page) {
	                    var pageRequestOptions = { page: requestOptions.page + page + 1 };
	                    if (limit)
	                        pageRequestOptions.limit = pageSize;
	                    if (requestOptions.limit)
	                        pageRequestOptions.limit = requestOptions.limit;
	                    return _this.getObjects(type, pageRequestOptions);
	                }))
	                    .then(function (results) {
	                    return objs.concat.apply(objs, results.map(function (r) { return r.objects; }));
	                });
	            }
	            else {
	                return objs;
	            }
	        })
	            .then(function (objects) {
	            if (limit && objects.length > limit) {
	                return objects.slice(0, limit);
	            }
	            return objects;
	        });
	    };
	    Api.prototype.countObjects = function (type, query) {
	        return this.getObjects(type, query, { limit: 1 })
	            .then(function (queryResult) {
	            return queryResult.metadata.total;
	        });
	    };
	    Api.prototype.createObject = function (type, data) {
	        var options = {};
	        options.body = data;
	        return this.httpClient.post("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/", options)
	            .then(function (response) {
	            switch (response.status) {
	                case 201:
	                    var location_1 = response.headers['Location'].split('/');
	                    return location_1[location_1.length - 1];
	                default:
	                    throw new Error("Unexpected API response (" + response.status + ")");
	            }
	        });
	    };
	    Api.prototype.updateObject = function (type, id, data) {
	        var options = {};
	        options.body = data;
	        return this.httpClient.post("" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/" + id, options)
	            .then(function (response) {
	            switch (response.status) {
	                case 200:
	                    return;
	                case 404:
	                    throw new Error('Object not found');
	                default:
	                    throw new Error("Unexpected API response (" + response.status + ")");
	            }
	        });
	    };
	    Api.prototype.deleteObject = function (type, id) {
	        return this.httpClient.request('DELETE', "" + Config_1.AuthDefaults.BASE_URL + API_BASE_PATH + "/data/" + type + "/" + id)
	            .then(function (response) {
	            switch (response.status) {
	                case 200:
	                    return;
	                case 404:
	                    throw new Error('Object not found');
	                default:
	                    throw new Error("Unexpected API response (" + response.status + ")");
	            }
	        });
	    };
	    Api.getObjectsRequestQuerystring = function (query, options) {
	        var requestQuery = options || {};
	        if (query)
	            requestQuery.query = query;
	        return Http_1.urlencode(requestQuery);
	    };
	    return Api;
	}());
	exports.Api = Api;
	//# sourceMappingURL=Api.js.map

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Cls_1 = __webpack_require__(46);
	var cerialize_1 = __webpack_require__(48);
	var Schema = (function () {
	    function Schema() {
	    }
	    __decorate([
	        cerialize_1.deserializeAs(Cls_1.Cls)
	    ], Schema.prototype, "classes", void 0);
	    return Schema;
	}());
	exports.Schema = Schema;
	//# sourceMappingURL=Schema.js.map

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Field_1 = __webpack_require__(47);
	var Index_1 = __webpack_require__(50);
	var Config_1 = __webpack_require__(51);
	var cerialize_1 = __webpack_require__(48);
	var Cls = (function () {
	    function Cls() {
	    }
	    __decorate([
	        cerialize_1.deserialize
	    ], Cls.prototype, "name", void 0);
	    __decorate([
	        cerialize_1.deserializeAs(Field_1.Field)
	    ], Cls.prototype, "fields", void 0);
	    __decorate([
	        cerialize_1.deserializeAs(Index_1.Index)
	    ], Cls.prototype, "indices", void 0);
	    __decorate([
	        cerialize_1.deserializeAs(Config_1.Config)
	    ], Cls.prototype, "config", void 0);
	    return Cls;
	}());
	exports.Cls = Cls;
	//# sourceMappingURL=Cls.js.map

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var cerialize_1 = __webpack_require__(48);
	var Field = (function () {
	    function Field() {
	    }
	    __decorate([
	        cerialize_1.deserialize
	    ], Field.prototype, "name", void 0);
	    __decorate([
	        cerialize_1.deserialize
	    ], Field.prototype, "type", void 0);
	    return Field;
	}());
	exports.Field = Field;
	//# sourceMappingURL=Field.js.map

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(49);

/***/ },
/* 49 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	var win = null;
	try {
	    win = window;
	}
	catch (e) {
	    win = global;
	}
	//some other modules might want access to the serialization meta data, expose it here
	var TypeMap = win.__CerializeTypeMap = new Map();
	exports.__TypeMap = TypeMap;
	//convert strings like my_camel_string to myCamelString
	function CamelCase(str) {
	    var STRING_CAMELIZE_REGEXP = (/(\-|_|\.|\s)+(.)?/g);
	    return str.replace(STRING_CAMELIZE_REGEXP, function (match, separator, chr) {
	        return chr ? chr.toUpperCase() : '';
	    }).replace(/^([A-Z])/, function (match, separator, chr) {
	        return match.toLowerCase();
	    });
	}
	exports.CamelCase = CamelCase;
	//convert strings like MyCamelString to my_camel_string
	function SnakeCase(str) {
	    var STRING_DECAMELIZE_REGEXP = (/([a-z\d])([A-Z])/g);
	    return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
	}
	exports.SnakeCase = SnakeCase;
	//convert strings like myCamelCase to my_camel_case
	function UnderscoreCase(str) {
	    var STRING_UNDERSCORE_REGEXP_1 = (/([a-z\d])([A-Z]+)/g);
	    var STRING_UNDERSCORE_REGEXP_2 = (/\-|\s+/g);
	    return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
	}
	exports.UnderscoreCase = UnderscoreCase;
	//convert strings like my_camelCase to my-camel-case
	function DashCase(str) {
	    var STRING_DASHERIZE_REGEXP = (/([a-z\d])([A-Z])/g);
	    str = str.replace(/_/g, '-');
	    return str.replace(STRING_DASHERIZE_REGEXP, '$1-$2').toLowerCase();
	}
	exports.DashCase = DashCase;
	//gets meta data for a key name, creating a new meta data instance
	//if the input array doesn't already define one for the given keyName
	function getMetaData(array, keyName) {
	    for (var i = 0; i < array.length; i++) {
	        if (array[i].keyName === keyName) {
	            return array[i];
	        }
	    }
	    array.push(new MetaData(keyName));
	    return array[array.length - 1];
	}
	//helper for grabbing the type and keyname from a multi-type input variable
	function getTypeAndKeyName(keyNameOrType, keyName) {
	    var type = null;
	    var key = null;
	    if (typeof keyNameOrType === "string") {
	        key = keyNameOrType;
	    }
	    else if (keyNameOrType && typeof keyNameOrType === "function" || typeof keyNameOrType === "object") {
	        type = keyNameOrType;
	        key = keyName;
	    }
	    return { key: key, type: type };
	}
	//todo instance.constructor.prototype.__proto__ === parent class, maybe use this?
	//because types are stored in a JS Map keyed by constructor, serialization is not inherited by default
	//keeping this seperate by default also allows sub classes to serialize differently than their parent
	function inheritSerialization(parentType) {
	    return function (childType) {
	        var parentMetaData = TypeMap.get(parentType) || [];
	        var childMetaData = TypeMap.get(childType) || [];
	        for (var i = 0; i < parentMetaData.length; i++) {
	            var keyName = parentMetaData[i].keyName;
	            if (!MetaData.hasKeyName(childMetaData, keyName)) {
	                childMetaData.push(MetaData.clone(parentMetaData[i]));
	            }
	        }
	        TypeMap.set(childType, childMetaData);
	    };
	}
	exports.inheritSerialization = inheritSerialization;
	//an untyped serialization property annotation, gets existing meta data for the target or creates
	//a new one and assigns the serialization key for that type in the meta data
	function serialize(target, keyName) {
	    if (!target || !keyName)
	        return;
	    var metaDataList = TypeMap.get(target.constructor) || [];
	    var metadata = getMetaData(metaDataList, keyName);
	    metadata.serializedKey = keyName;
	    TypeMap.set(target.constructor, metaDataList);
	}
	exports.serialize = serialize;
	//an untyped deserialization property annotation, gets existing meta data for the target or creates
	//a new one and assigns the deserialization key for that type in the meta data
	function deserialize(target, keyName) {
	    if (!target || !keyName)
	        return;
	    var metaDataList = TypeMap.get(target.constructor) || [];
	    var metadata = getMetaData(metaDataList, keyName);
	    metadata.deserializedKey = keyName;
	    TypeMap.set(target.constructor, metaDataList);
	}
	exports.deserialize = deserialize;
	//this combines @serialize and @deserialize as defined above
	function autoserialize(target, keyName) {
	    if (!target || !keyName)
	        return;
	    var metaDataList = TypeMap.get(target.constructor) || [];
	    var metadata = getMetaData(metaDataList, keyName);
	    metadata.serializedKey = keyName;
	    metadata.deserializedKey = keyName;
	    TypeMap.set(target.constructor, metaDataList);
	}
	exports.autoserialize = autoserialize;
	//We dont actually need the type to serialize but I like the consistency with deserializeAs which definitely does
	//serializes a type using 1.) a custom key name, 2.) a custom type, or 3.) both custom key and type
	function serializeAs(keyNameOrType, keyName) {
	    if (!keyNameOrType)
	        return;
	    var _a = getTypeAndKeyName(keyNameOrType, keyName), key = _a.key, type = _a.type;
	    return function (target, actualKeyName) {
	        if (!target || !actualKeyName)
	            return;
	        var metaDataList = TypeMap.get(target.constructor) || [];
	        var metadata = getMetaData(metaDataList, actualKeyName);
	        metadata.serializedKey = (key) ? key : actualKeyName;
	        metadata.serializedType = type;
	        //this allows the type to be a stand alone function instead of a class
	        if (type !== Date && type !== RegExp && !TypeMap.get(type) && typeof type === "function") {
	            metadata.serializedType = {
	                Serialize: type
	            };
	        }
	        TypeMap.set(target.constructor, metaDataList);
	    };
	}
	exports.serializeAs = serializeAs;
	//Supports serializing of dictionary-like map objects, ie: { x: {}, y: {} }
	function serializeIndexable(type, keyName) {
	    if (!type)
	        return;
	    return function (target, actualKeyName) {
	        if (!target || !actualKeyName)
	            return;
	        var metaDataList = TypeMap.get(target.constructor) || [];
	        var metadata = getMetaData(metaDataList, actualKeyName);
	        metadata.serializedKey = (keyName) ? keyName : actualKeyName;
	        metadata.serializedType = type;
	        metadata.indexable = true;
	        //this allows the type to be a stand alone function instead of a class
	        if (type !== Date && type !== RegExp && !TypeMap.get(type) && typeof type === "function") {
	            metadata.serializedType = {
	                Serialize: type
	            };
	        }
	        TypeMap.set(target.constructor, metaDataList);
	    };
	}
	exports.serializeIndexable = serializeIndexable;
	//deserializes a type using 1.) a custom key name, 2.) a custom type, or 3.) both custom key and type
	function deserializeAs(keyNameOrType, keyName) {
	    if (!keyNameOrType)
	        return;
	    var _a = getTypeAndKeyName(keyNameOrType, keyName), key = _a.key, type = _a.type;
	    return function (target, actualKeyName) {
	        if (!target || !actualKeyName)
	            return;
	        var metaDataList = TypeMap.get(target.constructor) || [];
	        var metadata = getMetaData(metaDataList, actualKeyName);
	        metadata.deserializedKey = (key) ? key : actualKeyName;
	        metadata.deserializedType = type;
	        //this allows the type to be a stand alone function instead of a class
	        if (!TypeMap.get(type) && type !== Date && type !== RegExp && typeof type === "function") {
	            metadata.deserializedType = {
	                Deserialize: type
	            };
	        }
	        TypeMap.set(target.constructor, metaDataList);
	    };
	}
	exports.deserializeAs = deserializeAs;
	//Supports deserializing of dictionary-like map objects, ie: { x: {}, y: {} }
	function deserializeIndexable(type, keyName) {
	    if (!type)
	        return;
	    var key = keyName;
	    return function (target, actualKeyName) {
	        if (!target || !actualKeyName)
	            return;
	        var metaDataList = TypeMap.get(target.constructor) || [];
	        var metadata = getMetaData(metaDataList, actualKeyName);
	        metadata.deserializedKey = (key) ? key : actualKeyName;
	        metadata.deserializedType = type;
	        metadata.indexable = true;
	        if (!TypeMap.get(type) && type !== Date && type !== RegExp && typeof type === "function") {
	            metadata.deserializedType = {
	                Deserialize: type
	            };
	        }
	        TypeMap.set(target.constructor, metaDataList);
	    };
	}
	exports.deserializeIndexable = deserializeIndexable;
	//serializes and deserializes a type using 1.) a custom key name, 2.) a custom type, or 3.) both custom key and type
	function autoserializeAs(keyNameOrType, keyName) {
	    if (!keyNameOrType)
	        return;
	    var _a = getTypeAndKeyName(keyNameOrType, keyName), key = _a.key, type = _a.type;
	    return function (target, actualKeyName) {
	        if (!target || !actualKeyName)
	            return;
	        var metaDataList = TypeMap.get(target.constructor) || [];
	        var metadata = getMetaData(metaDataList, actualKeyName);
	        var serialKey = (key) ? key : actualKeyName;
	        metadata.deserializedKey = serialKey;
	        metadata.deserializedType = type;
	        metadata.serializedKey = serialKey;
	        metadata.serializedType = type;
	        if (!TypeMap.get(type) && type !== Date && type !== RegExp && typeof type === "function") {
	            metadata.deserializedType = {
	                Deserialize: type
	            };
	        }
	        TypeMap.set(target.constructor, metaDataList);
	    };
	}
	exports.autoserializeAs = autoserializeAs;
	//Supports serializing/deserializing of dictionary-like map objects, ie: { x: {}, y: {} }
	function autoserializeIndexable(type, keyName) {
	    if (!type)
	        return;
	    var key = keyName;
	    return function (target, actualKeyName) {
	        if (!target || !actualKeyName)
	            return;
	        var metaDataList = TypeMap.get(target.constructor) || [];
	        var metadata = getMetaData(metaDataList, actualKeyName);
	        var serialKey = (key) ? key : actualKeyName;
	        metadata.deserializedKey = serialKey;
	        metadata.deserializedType = type;
	        metadata.serializedKey = serialKey;
	        metadata.serializedType = type;
	        metadata.indexable = true;
	        if (!TypeMap.get(type) && type !== Date && type !== RegExp && typeof type === "function") {
	            metadata.deserializedType = {
	                Deserialize: type
	            };
	        }
	        TypeMap.set(target.constructor, metaDataList);
	    };
	}
	exports.autoserializeIndexable = autoserializeIndexable;
	//helper class to contain serialization meta data for a property, each property
	//in a type tagged with a serialization annotation will contain an array of these
	//objects each describing one property
	var MetaData = (function () {
	    function MetaData(keyName) {
	        this.keyName = keyName;
	        this.serializedKey = null;
	        this.deserializedKey = null;
	        this.deserializedType = null;
	        this.serializedType = null;
	        this.indexable = false;
	    }
	    //checks for a key name in a meta data array
	    MetaData.hasKeyName = function (metadataArray, key) {
	        for (var i = 0; i < metadataArray.length; i++) {
	            if (metadataArray[i].keyName === key)
	                return true;
	        }
	        return false;
	    };
	    //clone a meta data instance, used for inheriting serialization properties
	    MetaData.clone = function (data) {
	        var metadata = new MetaData(data.keyName);
	        metadata.deserializedKey = data.deserializedKey;
	        metadata.serializedKey = data.serializedKey;
	        metadata.serializedType = data.serializedType;
	        metadata.deserializedType = data.deserializedType;
	        metadata.indexable = data.indexable;
	        return metadata;
	    };
	    return MetaData;
	}());
	//merges two primitive objects recursively, overwriting or defining properties on
	//`instance` as they defined in `json`. Works on objects, arrays and primitives
	function mergePrimitiveObjects(instance, json) {
	    if (!json)
	        return instance; //if we dont have a json value, just use what the instance defines already
	    if (!instance)
	        return json; //if we dont have an instance value, just use the json
	    //for each key in the input json we need to do a merge into the instance object
	    Object.keys(json).forEach(function (key) {
	        var transformedKey = key;
	        if (typeof deserializeKeyTransform === "function") {
	            transformedKey = deserializeKeyTransform(key);
	        }
	        var jsonValue = json[key];
	        var instanceValue = instance[key];
	        if (Array.isArray(jsonValue)) {
	            //in the array case we reuse the items that exist already where possible
	            //so reset the instance array length (or make it an array if it isnt)
	            //then call mergePrimitiveObjects recursively
	            instanceValue = Array.isArray(instanceValue) ? instanceValue : [];
	            instanceValue.length = jsonValue.length;
	            for (var i = 0; i < instanceValue.length; i++) {
	                instanceValue[i] = mergePrimitiveObjects(instanceValue[i], jsonValue[i]);
	            }
	        }
	        else if (jsonValue && typeof jsonValue === "object") {
	            if (!instanceValue || typeof instanceValue !== "object") {
	                instanceValue = {};
	            }
	            instanceValue = mergePrimitiveObjects(instanceValue, jsonValue);
	        }
	        else {
	            //primitive case, just use straight assignment
	            instanceValue = jsonValue;
	        }
	        instance[transformedKey] = instanceValue;
	    });
	    return instance;
	}
	//takes an array defined in json and deserializes it into an array that ist stuffed with instances of `type`.
	//any instances already defined in `arrayInstance` will be re-used where possible to maintain referential integrity.
	function deserializeArrayInto(source, type, arrayInstance) {
	    if (!Array.isArray(arrayInstance)) {
	        arrayInstance = new Array(source.length);
	    }
	    //extend or truncate the target array to match the source array
	    arrayInstance.length = source.length;
	    for (var i = 0; i < source.length; i++) {
	        arrayInstance[i] = DeserializeInto(source[i], type, arrayInstance[i] || new type());
	    }
	    return arrayInstance;
	}
	//takes an object defined in json and deserializes it into a `type` instance or populates / overwrites
	//properties on `instance` if it is provided.
	function deserializeObjectInto(json, type, instance) {
	    var metadataArray = TypeMap.get(type);
	    //if we dont have an instance we need to create a new `type`
	    if (instance === null || instance === void 0) {
	        if (type) {
	            instance = new type();
	        }
	    }
	    //if we dont have any meta data and we dont have a type to inflate, just merge the objects
	    if (instance && !type && !metadataArray) {
	        return mergePrimitiveObjects(instance, json);
	    }
	    //if we dont have meta data just bail out and keep what we have
	    if (!metadataArray) {
	        invokeDeserializeHook(instance, json, type);
	        return instance;
	    }
	    //for each property in meta data, try to hydrate that property with its corresponding json value
	    for (var i = 0; i < metadataArray.length; i++) {
	        var metadata = metadataArray[i];
	        //these are not the droids we're looking for (to deserialize), moving along
	        if (!metadata.deserializedKey)
	            continue;
	        var serializedKey = metadata.deserializedKey;
	        if (metadata.deserializedKey === metadata.keyName) {
	            if (typeof deserializeKeyTransform === "function") {
	                serializedKey = deserializeKeyTransform(metadata.keyName);
	            }
	        }
	        var source = json[serializedKey];
	        if (source === void 0)
	            continue;
	        var keyName = metadata.keyName;
	        //if there is a custom deserialize function, use that
	        if (metadata.deserializedType && typeof metadata.deserializedType.Deserialize === "function") {
	            instance[keyName] = metadata.deserializedType.Deserialize(source);
	        }
	        else if (Array.isArray(source)) {
	            if (metadata.deserializedType) {
	                instance[keyName] = deserializeArrayInto(source, metadata.deserializedType, instance[keyName]);
	            }
	            else {
	                instance[keyName] = deserializeArray(source, null);
	            }
	        }
	        else if (typeof source === "string" && metadata.deserializedType === Date) {
	            var deserializedDate = new Date(source);
	            if (instance[keyName] instanceof Date) {
	                instance[keyName].setTime(deserializedDate.getTime());
	            }
	            else {
	                instance[keyName] = deserializedDate;
	            }
	        }
	        else if (typeof source === "string" && type === RegExp) {
	            instance[keyName] = new RegExp(source);
	        }
	        else if (source && typeof source === "object") {
	            if (metadata.indexable) {
	                instance[keyName] = deserializeIndexableObjectInto(source, metadata.deserializedType, instance[keyName]);
	            }
	            else {
	                instance[keyName] = deserializeObjectInto(source, metadata.deserializedType, instance[keyName]);
	            }
	        }
	        else {
	            instance[keyName] = source;
	        }
	    }
	    //invoke our after deserialized callback if provided
	    invokeDeserializeHook(instance, json, type);
	    return instance;
	}
	//deserializes a bit of json into a `type`
	function Deserialize(json, type) {
	    if (Array.isArray(json)) {
	        return deserializeArray(json, type);
	    }
	    else if (json && typeof json === "object") {
	        return deserializeObject(json, type);
	    }
	    else if (typeof json === "string" && type === Date) {
	        return new Date(json);
	    }
	    else if (typeof json === "string" && type === RegExp) {
	        return new RegExp(json);
	    }
	    else {
	        return json;
	    }
	}
	exports.Deserialize = Deserialize;
	//takes some json, a type, and a target object and deserializes the json into that object
	function DeserializeInto(source, type, target) {
	    if (Array.isArray(source)) {
	        return deserializeArrayInto(source, type, target || []);
	    }
	    else if (source && typeof source === "object") {
	        return deserializeObjectInto(source, type, target || new type());
	    }
	    else {
	        return target || (type && new type()) || null;
	    }
	}
	exports.DeserializeInto = DeserializeInto;
	//deserializes an array of json into an array of `type`
	function deserializeArray(source, type) {
	    var retn = new Array(source.length);
	    for (var i = 0; i < source.length; i++) {
	        retn[i] = Deserialize(source[i], type);
	    }
	    return retn;
	}
	function invokeDeserializeHook(instance, json, type) {
	    if (type && typeof (type).OnDeserialized === "function") {
	        type.OnDeserialized(instance, json);
	    }
	}
	function invokeSerializeHook(instance, json) {
	    if (typeof (instance.constructor).OnSerialized === "function") {
	        (instance.constructor).OnSerialized(instance, json);
	    }
	}
	//deserialize a bit of json into an instance of `type`
	function deserializeObject(json, type) {
	    var metadataArray = TypeMap.get(type);
	    //if we dont have meta data, just decode the json and use that
	    if (!metadataArray) {
	        var inst = null;
	        if (!type) {
	            inst = JSON.parse(JSON.stringify(json));
	        }
	        else {
	            inst = new type(); //todo this probably wrong
	            invokeDeserializeHook(inst, json, type);
	        }
	        return inst;
	    }
	    var instance = new type();
	    //for each tagged property on the source type, try to deserialize it
	    for (var i = 0; i < metadataArray.length; i++) {
	        var metadata = metadataArray[i];
	        if (!metadata.deserializedKey)
	            continue;
	        var serializedKey = metadata.deserializedKey;
	        if (metadata.deserializedKey === metadata.keyName) {
	            if (typeof deserializeKeyTransform === "function") {
	                serializedKey = deserializeKeyTransform(metadata.keyName);
	            }
	        }
	        var source = json[serializedKey];
	        var keyName = metadata.keyName;
	        if (source === void 0)
	            continue;
	        //if there is a custom deserialize function, use that
	        if (metadata.deserializedType && typeof metadata.deserializedType.Deserialize === "function") {
	            instance[keyName] = metadata.deserializedType.Deserialize(source);
	        }
	        else if (Array.isArray(source)) {
	            instance[keyName] = deserializeArray(source, metadata.deserializedType || null);
	        }
	        else if (typeof source === "string" && metadata.deserializedType === Date) {
	            instance[keyName] = new Date(source);
	        }
	        else if (typeof source === "string" && metadata.deserializedType === RegExp) {
	            instance[keyName] = new RegExp(json);
	        }
	        else if (source && typeof source === "object") {
	            if (metadata.indexable) {
	                instance[keyName] = deserializeIndexableObject(source, metadata.deserializedType);
	            }
	            else {
	                instance[keyName] = deserializeObject(source, metadata.deserializedType);
	            }
	        }
	        else {
	            instance[keyName] = source;
	        }
	    }
	    invokeDeserializeHook(instance, json, type);
	    return instance;
	}
	function deserializeIndexableObject(source, type) {
	    var retn = {};
	    //todo apply key transformation here?
	    Object.keys(source).forEach(function (key) {
	        retn[key] = deserializeObject(source[key], type);
	    });
	    return retn;
	}
	function deserializeIndexableObjectInto(source, type, instance) {
	    //todo apply key transformation here?
	    Object.keys(source).forEach(function (key) {
	        instance[key] = deserializeObjectInto(source[key], type, instance[key]);
	    });
	    return instance;
	}
	//take an array and spit out json
	function serializeArray(source, type) {
	    var serializedArray = new Array(source.length);
	    for (var j = 0; j < source.length; j++) {
	        serializedArray[j] = Serialize(source[j], type);
	    }
	    return serializedArray;
	}
	//take an instance of something and try to spit out json for it based on property annotaitons
	function serializeTypedObject(instance, type) {
	    var json = {};
	    var metadataArray;
	    if (type) {
	        metadataArray = TypeMap.get(type);
	    }
	    else {
	        metadataArray = TypeMap.get(instance.constructor);
	    }
	    for (var i = 0; i < metadataArray.length; i++) {
	        var metadata = metadataArray[i];
	        if (!metadata.serializedKey)
	            continue;
	        var serializedKey = metadata.serializedKey;
	        if (metadata.serializedKey === metadata.keyName) {
	            if (typeof serializeKeyTransform === "function") {
	                serializedKey = serializeKeyTransform(metadata.keyName);
	            }
	        }
	        var source = instance[metadata.keyName];
	        if (source === void 0)
	            continue;
	        if (Array.isArray(source)) {
	            json[serializedKey] = serializeArray(source);
	        }
	        else if (metadata.serializedType && typeof metadata.serializedType.Serialize === "function") {
	            //todo -- serializeIndexableObject probably isn't needed because of how serialize works
	            json[serializedKey] = metadata.serializedType.Serialize(source);
	        }
	        else {
	            var value = Serialize(source);
	            if (value !== void 0) {
	                json[serializedKey] = value;
	            }
	        }
	    }
	    invokeSerializeHook(instance, json);
	    return json;
	}
	//take an instance of something and spit out some json
	function Serialize(instance, type) {
	    if (instance === null || instance === void 0)
	        return null;
	    if (Array.isArray(instance)) {
	        return serializeArray(instance, type);
	    }
	    if (type && TypeMap.has(type)) {
	        return serializeTypedObject(instance, type);
	    }
	    if (instance.constructor && TypeMap.has(instance.constructor)) {
	        return serializeTypedObject(instance);
	    }
	    if (instance instanceof Date) {
	        return instance.toISOString();
	    }
	    if (instance instanceof RegExp) {
	        return instance.toString();
	    }
	    if (instance && typeof instance === 'object' || typeof instance === 'function') {
	        var keys = Object.keys(instance);
	        var json = {};
	        for (var i = 0; i < keys.length; i++) {
	            //todo this probably needs a key transform
	            json[keys[i]] = Serialize(instance[keys[i]]);
	        }
	        invokeSerializeHook(instance, json);
	        return json;
	    }
	    return instance;
	}
	exports.Serialize = Serialize;
	function GenericDeserialize(json, type) {
	    return Deserialize(json, type);
	}
	exports.GenericDeserialize = GenericDeserialize;
	function GenericDeserializeInto(json, type, instance) {
	    return DeserializeInto(json, type, instance);
	}
	exports.GenericDeserializeInto = GenericDeserializeInto;
	//these are used for transforming keys from one format to another
	var serializeKeyTransform = null;
	var deserializeKeyTransform = null;
	//setter for deserializing key transform
	function DeserializeKeysFrom(transform) {
	    deserializeKeyTransform = transform;
	}
	exports.DeserializeKeysFrom = DeserializeKeysFrom;
	//setter for serializing key transform
	function SerializeKeysTo(transform) {
	    serializeKeyTransform = transform;
	}
	exports.SerializeKeysTo = SerializeKeysTo;
	//this is kinda dumb but typescript doesnt treat enums as a type, but sometimes you still
	//want them to be serialized / deserialized, this does the trick but must be called after
	//the enum is defined.
	function SerializableEnumeration(e) {
	    e.Serialize = function (x) {
	        return e[x];
	    };
	    e.Deserialize = function (x) {
	        return e[x];
	    };
	}
	exports.SerializableEnumeration = SerializableEnumeration;
	//expose the type map
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var cerialize_1 = __webpack_require__(48);
	var Index = (function () {
	    function Index() {
	    }
	    __decorate([
	        cerialize_1.deserialize
	    ], Index.prototype, "name", void 0);
	    __decorate([
	        cerialize_1.deserialize
	    ], Index.prototype, "fields", void 0);
	    return Index;
	}());
	exports.Index = Index;
	//# sourceMappingURL=Index.js.map

/***/ },
/* 51 */
/***/ function(module, exports) {

	"use strict";
	var Config = (function () {
	    function Config() {
	    }
	    return Config;
	}());
	exports.Config = Config;
	//# sourceMappingURL=Config.js.map

/***/ },
/* 52 */
/***/ function(module, exports) {

	"use strict";
	function urlencode(obj) {
	    var str = [];
	    for (var p in obj) {
	        if (obj.hasOwnProperty(p)) {
	            str.push(typeof obj[p] == "object" ? urlencode(obj[p]) : encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        }
	    }
	    return str.join("&");
	}
	exports.urlencode = urlencode;
	//# sourceMappingURL=Http.js.map

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var TokenStorage_1 = __webpack_require__(54);
	var DEFAULT_COOKIE_NAME = "scandit_flow";
	var CookieStorage = (function (_super) {
	    __extends(CookieStorage, _super);
	    function CookieStorage(key) {
	        if (typeof document == 'undefined' || typeof document.cookie == 'undefined')
	            throw new ReferenceError("Cookies are not supported.");
	        _super.call(this);
	        this.key = key || DEFAULT_COOKIE_NAME;
	    }
	    CookieStorage.prototype.getToken = function () {
	        var _this = this;
	        var cookie = document.cookie
	            .split(';')
	            .map(function (x) { return x.split('='); })
	            .find(function (x) { return x[0] == _this.key; });
	        if (!cookie || cookie[1] == '')
	            return Promise.resolve(null);
	        return Promise.resolve(TokenStorage_1.TokenStorage.deserializeToken(cookie[1]));
	    };
	    CookieStorage.prototype.setToken = function (token) {
	        document.cookie = this.key + "=" + TokenStorage_1.TokenStorage.serializeToken(token) + "; SameSite=Strict";
	        return Promise.resolve(null);
	    };
	    CookieStorage.prototype.clear = function () {
	        document.cookie = this.key + "=;";
	        return Promise.resolve(null);
	    };
	    return CookieStorage;
	}(TokenStorage_1.TokenStorage));
	exports.CookieStorage = CookieStorage;
	//# sourceMappingURL=CookieStorage.js.map

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var UserToken_1 = __webpack_require__(39);
	var ClientToken_1 = __webpack_require__(36);
	var TokenStorage = (function () {
	    function TokenStorage() {
	    }
	    TokenStorage.serializeToken = function (token) {
	        var tokenJson = Object.assign({}, token);
	        delete tokenJson.expiresAt;
	        tokenJson.createdAt = token.createdAt.getTime();
	        tokenJson._cls = token.constructor.name;
	        return encodeURIComponent(JSON.stringify(tokenJson));
	    };
	    TokenStorage.deserializeToken = function (value) {
	        var token = JSON.parse(decodeURIComponent(value));
	        token.createdAt = new Date(token['createdAt']);
	        switch (token._cls) {
	            case 'UserToken':
	                return new UserToken_1.UserToken(token.token, token.expires, token.tokenType, token.createdAt, token.refreshToken);
	            case 'ClientToken':
	                return new ClientToken_1.ClientToken(token.token, token.expires, token.tokenType, token.createdAt, token.refreshToken);
	            default:
	                throw new Error('Invalid token');
	        }
	    };
	    return TokenStorage;
	}());
	exports.TokenStorage = TokenStorage;
	//# sourceMappingURL=TokenStorage.js.map

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var BrowserStorage_1 = __webpack_require__(56);
	var storage;
	if (typeof localStorage !== 'undefined') {
	    storage = localStorage;
	}
	else if (typeof process !== 'undefined') {
	    var NodeLocalStorage = __webpack_require__(57).LocalStorage;
	    storage = new NodeLocalStorage();
	}
	var LocalStorage = (function (_super) {
	    __extends(LocalStorage, _super);
	    function LocalStorage(key) {
	        if (typeof storage == 'undefined')
	            throw new ReferenceError("Local storage is not supported.");
	        _super.call(this, storage, key);
	    }
	    return LocalStorage;
	}(BrowserStorage_1.BrowserStorage));
	exports.LocalStorage = LocalStorage;
	//# sourceMappingURL=LocalStorage.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var TokenStorage_1 = __webpack_require__(54);
	var DEFAULT_STORAGE_KEY = "scandit_flow";
	var BrowserStorage = (function (_super) {
	    __extends(BrowserStorage, _super);
	    function BrowserStorage(storage, key) {
	        _super.call(this);
	        this.key = key || DEFAULT_STORAGE_KEY;
	        this.storage = storage;
	    }
	    BrowserStorage.prototype.getToken = function () {
	        var token = this.storage.getItem(this.key);
	        if (!token)
	            return Promise.resolve(null);
	        return Promise.resolve(TokenStorage_1.TokenStorage.deserializeToken(token));
	    };
	    BrowserStorage.prototype.setToken = function (token) {
	        this.storage.setItem(this.key, TokenStorage_1.TokenStorage.serializeToken(token));
	        return Promise.resolve(null);
	    };
	    BrowserStorage.prototype.clear = function () {
	        this.storage.removeItem(this.key);
	        return Promise.resolve(null);
	    };
	    return BrowserStorage;
	}(TokenStorage_1.TokenStorage));
	exports.BrowserStorage = BrowserStorage;
	//# sourceMappingURL=BrowserStorage.js.map

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = undefined;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var BrowserStorage_1 = __webpack_require__(56);
	var storage;
	if (typeof sessionStorage !== 'undefined') {
	    storage = sessionStorage;
	}
	else if (typeof process !== 'undefined') {
	    var NodeSessionStorage = __webpack_require__(57).SessionStorage;
	    storage = new NodeSessionStorage();
	}
	var SessionStorage = (function (_super) {
	    __extends(SessionStorage, _super);
	    function SessionStorage(key) {
	        if (typeof storage == 'undefined')
	            throw new ReferenceError("Local storage is not supported.");
	        _super.call(this, storage, key);
	    }
	    return SessionStorage;
	}(BrowserStorage_1.BrowserStorage));
	exports.SessionStorage = SessionStorage;
	//# sourceMappingURL=SessionStorage.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Client_1 = __webpack_require__(3);
	exports.Client = Client_1.default;
	var Auth = __webpack_require__(60);
	exports.Auth = Auth;
	/**
	 * Main API namespace
	 *
	 * @namespace Scandit
	 */
	//# sourceMappingURL=Scandit.js.map

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Config_1 = __webpack_require__(4);
	exports.Method = Config_1.AuthMethod;
	exports.Storage = Config_1.StorageMethod;
	/**
	 * @namespace Scandit.Auth
	 */
	//# sourceMappingURL=Auth.js.map

/***/ }
/******/ ]);
//# sourceMappingURL=scandit-flow-ng.js.map