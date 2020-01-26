module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./extension/connection/index.ts":
/*!***************************************!*\
  !*** ./extension/connection/index.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/commands */ "./extension/connection/src/commands/index.ts"));
;


/***/ }),

/***/ "./extension/connection/src/commands/index.ts":
/*!****************************************************!*\
  !*** ./extension/connection/src/commands/index.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/connection-create */ "./extension/connection/src/commands/src/connection-create.ts"));
__export(__webpack_require__(/*! ./src/connection-settings */ "./extension/connection/src/commands/src/connection-settings.ts"));


/***/ }),

/***/ "./extension/connection/src/commands/src/connection-create.ts":
/*!********************************************************************!*\
  !*** ./extension/connection/src/commands/src/connection-create.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const utils_1 = __webpack_require__(/*! ../../utils */ "./extension/connection/src/utils/index.ts");
/**
 * add new workspace folder by given connection settings
 */
function ConnectionCreateCommand() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const connectionService = utils_1.ConnectionService.getInstance();
        const availableConnections = connectionService.getAll();
        if (availableConnections.length === 0) {
            return;
        }
        const items = availableConnections.map((connection) => ({
            label: `${connection.host}:${connection.port}/${connection.path}`,
            connection
        }));
        const selection = yield vscode.window.showQuickPick(items, { placeHolder: "Select Connection" });
        if (selection) {
            const name = `${selection.connection.host}:${selection.connection.port}`;
            const uri = vscode.Uri.parse(`qix://${name}`);
            const newWorkspaceFolder = { uri, name };
            if (!vscode.workspace.getWorkspaceFolder(uri)) {
                vscode.workspace.updateWorkspaceFolders(((_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.length) || 0, 0, newWorkspaceFolder);
                /** after we have added a folder we need to be aware of it since we have to create a qlik connection */
            }
            else {
                vscode.window.showInformationMessage(`Workspacefolder ${uri.toString()} allready exists.`);
            }
        }
    });
}
exports.ConnectionCreateCommand = ConnectionCreateCommand;


/***/ }),

/***/ "./extension/connection/src/commands/src/connection-settings.ts":
/*!**********************************************************************!*\
  !*** ./extension/connection/src/commands/src/connection-settings.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = __webpack_require__(/*! ../../settings */ "./extension/connection/src/settings/index.ts");
function ConnectionSettingsCommands() {
    const view = new settings_1.ConnectionWebview();
    view.render();
}
exports.ConnectionSettingsCommands = ConnectionSettingsCommands;


/***/ }),

/***/ "./extension/connection/src/settings/index.ts":
/*!****************************************************!*\
  !*** ./extension/connection/src/settings/index.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/connection.view */ "./extension/connection/src/settings/src/connection.view.ts"));


/***/ }),

/***/ "./extension/connection/src/settings/src/connection.view.ts":
/*!******************************************************************!*\
  !*** ./extension/connection/src/settings/src/connection.view.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const utils_1 = __webpack_require__(/*! ../../utils */ "./extension/connection/src/utils/index.ts");
var ViewCommand;
(function (ViewCommand) {
    ViewCommand["ADD"] = "add";
    ViewCommand["DELETE"] = "delete";
})(ViewCommand = exports.ViewCommand || (exports.ViewCommand = {}));
class ConnectionWebview {
    constructor() {
        this.isDisposed = false;
        this.connectionService = utils_1.ConnectionService.getInstance();
    }
    render() {
        if (!this.view || this.isDisposed) {
            this.view = vscode.window.createWebviewPanel("VSQlik.Connection.Create", "VSQlik Connection Create", vscode.ViewColumn.One, { enableScripts: true });
            const template = path.resolve(__dirname, './connection.html');
            this.view.webview.html = fs.readFileSync(template, { encoding: "utf8" });
            this.view.webview.onDidReceiveMessage((message) => this.handleMessage(message));
            this.view.onDidDispose(() => this.isDisposed = true);
            this.view.onDidChangeViewState((event) => {
                if (event.webviewPanel.visible) {
                    this.updateConnections();
                }
            });
        }
        this.updateConnections();
        return this.view;
    }
    close() {
        this.view.dispose();
    }
    send(message) {
        this.view.webview.postMessage(message);
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (message.command) {
                case ViewCommand.ADD:
                    this.addNewConnection(message.data);
                    break;
                case ViewCommand.DELETE:
                    break;
            }
        });
    }
    addNewConnection(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateConnections();
        });
    }
    deleteConnection(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateConnections();
        });
    }
    updateConnections() {
        const connections = this.connectionService.getAll();
        this.view.webview.postMessage({ command: 'update', connections });
    }
}
exports.ConnectionWebview = ConnectionWebview;

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./extension/connection/src/utils/index.ts":
/*!*************************************************!*\
  !*** ./extension/connection/src/utils/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/connection.service */ "./extension/connection/src/utils/src/connection.service.ts"));


/***/ }),

/***/ "./extension/connection/src/utils/src/connection.service.ts":
/*!******************************************************************!*\
  !*** ./extension/connection/src/utils/src/connection.service.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const utils_1 = __webpack_require__(/*! ../../../../utils */ "./extension/utils/index.ts");
class ConnectionService {
    constructor() {
        this.configuration = vscode_1.workspace.getConfiguration();
        vscode_1.workspace.onDidChangeConfiguration(this.onConfigurationChanged, this);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ConnectionService();
        }
        return this.instance;
    }
    add(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = this.getAll();
            const newSettings = [...settings, connection];
            return this.configuration.update(utils_1.SessionCache.get(utils_1.ConnectionSettings), newSettings, vscode_1.ConfigurationTarget.Global);
        });
    }
    delete(connection) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    update(connection, old) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAll() {
        console.log(utils_1.SessionCache.get(utils_1.ConnectionSettings));
        return this.configuration.get(utils_1.SessionCache.get(utils_1.ConnectionSettings));
    }
    /**
     * create new connection which can stored into storage
     */
    createConnection(uri) {
    }
    onConfigurationChanged(event) {
        if (event.affectsConfiguration(utils_1.SessionCache.get(utils_1.ConnectionSettings))) {
            this.configuration = vscode_1.workspace.getConfiguration();
        }
    }
}
exports.ConnectionService = ConnectionService;


/***/ }),

/***/ "./extension/enigma/index.ts":
/*!***********************************!*\
  !*** ./extension/enigma/index.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/utils */ "./extension/enigma/src/utils/index.ts"));


/***/ }),

/***/ "./extension/enigma/src/utils/index.ts":
/*!*********************************************!*\
  !*** ./extension/enigma/src/utils/index.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/enigma-session */ "./extension/enigma/src/utils/src/enigma-session.ts"));


/***/ }),

/***/ "./extension/enigma/src/utils/src/enigma-session.ts":
/*!**********************************************************!*\
  !*** ./extension/enigma/src/utils/src/enigma-session.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enigma_js_1 = __webpack_require__(/*! enigma.js */ "./node_modules/enigma.js/enigma.js");
const sense_utilities_1 = __webpack_require__(/*! enigma.js/sense-utilities */ "./node_modules/enigma.js/sense-utilities.js");
const _12_20_0_json_1 = __importDefault(__webpack_require__(/*! enigma.js/schemas/12.20.0.json */ "./node_modules/enigma.js/schemas/12.20.0.json"));
const ws_1 = __importDefault(__webpack_require__(/*! ws */ "./node_modules/ws/index.js"));
/**
 * Services to create, cache and handle enigma session
 *
 * ich müsste die gesammte klasse weg speichern
 * aber das ist auch nicht so übel sprach der dübel
 */
class EnigmaSession {
    /**
     * Creates an instance of EnigmaSession.
     */
    constructor(host, port, secure = true) {
        this.host = host;
        this.port = port;
        this.secure = secure;
        /**
         * max sessions we could open by default this is 5
         * set to value lte 0 for max sessions
         */
        this.maxSessionCount = 5;
        this.activeStack = new Array();
        this.connectionQueue = new Map();
        this.sessionCache = new Map();
    }
    set maxSessions(max) {
        this.maxSessionCount = max;
    }
    get maxSessions() {
        return this.maxSessionCount;
    }
    open(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = appId || EnigmaSession.GLOBAL_SESSION_KEY;
            let session;
            /** create new session */
            if (!this.isCached(id)) {
                session = yield this.createSessionObject(id);
            }
            else {
                session = yield this.activateSession(id);
            }
            return "global" in session ? session : session;
        });
    }
    close(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = appId || EnigmaSession.GLOBAL_SESSION_KEY;
            if (this.isCached(key)) {
                yield this.loadFromCache(key).session.close();
            }
        });
    }
    isApp(appid) {
        return __awaiter(this, void 0, void 0, function* () {
            const global = yield this.open();
            try {
                const doc = yield global.openDoc(appid);
                doc.session.close();
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    /**
     * activate session if not allready in active stack
     */
    activateSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = this.loadFromCache(id);
            if (connection && !this.isActive(id)) {
                yield this.suspendOldestSession();
                yield connection.session.resume();
                this.activeStack.push(id);
            }
            return connection;
        });
    }
    /**
     * create new session object, buffer current connections into map
     * so if same connection wants to open twice take existing Promise
     * and return this one.
     *
     * @todo refactor this one
     */
    createSessionObject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connectionQueue.has(id)) {
                this.connectionQueue.set(id, new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    yield this.suspendOldestSession();
                    const url = this.buildUri(id);
                    let sessionObj;
                    const session = enigma_js_1.create({ schema: _12_20_0_json_1.default, url, createSocket: (url) => new ws_1.default(url) });
                    sessionObj = yield session.open();
                    sessionObj.on("closed", () => this.removeSessionFromCache(id));
                    if (id !== EnigmaSession.GLOBAL_SESSION_KEY) {
                        try {
                            sessionObj = yield sessionObj.openDoc(id);
                        }
                        catch (error) {
                            yield sessionObj.session.close();
                            reject();
                            return;
                        }
                    }
                    this.sessionCache.set(id, sessionObj);
                    this.activeStack.push(id);
                    this.connectionQueue.delete(id);
                    resolve(sessionObj);
                })));
            }
            return this.connectionQueue.get(id);
        });
    }
    removeSessionFromCache(id) {
        this.isCached(id) ? this.sessionCache.delete(id) : void 0;
        this.isActive(id) ? this.activeStack.splice(this.activeStack.indexOf(id), 1) : void 0;
    }
    /**
     * returns true if session is allready active
     */
    isActive(id) {
        return this.activeStack.indexOf(id) > -1;
    }
    /**
     * returns true if session is allready cached
     */
    isCached(id) {
        return this.sessionCache.has(id);
    }
    /**
     * load session object from cache
     */
    loadFromCache(id = EnigmaSession.GLOBAL_SESSION_KEY) {
        let session = this.sessionCache.get(id);
        if (session) {
            return session;
        }
        throw "Session not found";
    }
    /**
     * suspend oldest session
     */
    suspendOldestSession() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.maxSessions <= 0 || this.activeStack.length < this.maxSessions) {
                return;
            }
            const oldestSessionId = this.activeStack.shift();
            const connection = this.loadFromCache(oldestSessionId);
            if (connection) {
                yield connection.session.suspend();
            }
        });
    }
    /**
     * generate new url for websocket call to enigma
     */
    buildUri(id = EnigmaSession.GLOBAL_SESSION_KEY) {
        return sense_utilities_1.buildUrl({
            appId: id,
            host: this.host,
            identity: Math.random().toString(32).substr(2),
            port: this.port,
            secure: this.secure,
        });
    }
}
exports.EnigmaSession = EnigmaSession;
EnigmaSession.GLOBAL_SESSION_KEY = "engineData";


/***/ }),

/***/ "./extension/main.ts":
/*!***************************!*\
  !*** ./extension/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! ./enigma */ "./extension/enigma/index.ts");
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const connection_1 = __webpack_require__(/*! ./connection */ "./extension/connection/index.ts");
const utils_1 = __webpack_require__(/*! @qixfs/utils */ "./extension/qixfs/src/utils/index.ts");
const utils_2 = __webpack_require__(/*! @extension/utils */ "./extension/utils/index.ts");
const _qixfs_entry_1 = __webpack_require__(/*! @qixfs-entry */ "./extension/qixfs-entry/index.ts");
/**
 * @todo check for guard since this could be [SOMETHING]/scripts and this is wrong
 * since SOMETHING not is an app
 */
exports.routes = [{
        path: "",
        ctrl: _qixfs_entry_1.DocumentsDirectory,
    }, {
        path: ":app",
        ctrl: _qixfs_entry_1.AppDirectory,
    }, {
        path: ":app/scripts",
        ctrl: _qixfs_entry_1.AppScriptDirectory,
    }, {
        path: ":app/scripts/main.qvs",
        ctrl: _qixfs_entry_1.QlikScriptFile
    }];
/**
 * bootstrap extension
 */
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        utils_1.WorkspaceFolderManager.addFolder(vscode.workspace.workspaceFolders || []);
        utils_1.QixRouter.addRoutes(exports.routes);
        utils_2.SessionCache.add(utils_2.ExtensionContext, context);
        utils_2.SessionCache.add(utils_2.ConnectionSettings, `VSQlik.Connection`);
        /** register connection commands */
        vscode.commands.registerCommand("VSQlik.Connection.Create" /* CREATE */, connection_1.ConnectionCreateCommand);
        vscode.commands.registerCommand("VSQlik.Connection.Settings" /* SETTINGS */, connection_1.ConnectionSettingsCommands);
        /** register fs */
        const qixFs = new utils_1.QixFSProvider();
        context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
    });
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;


/***/ }),

/***/ "./extension/qixfs-entry/index.ts":
/*!****************************************!*\
  !*** ./extension/qixfs-entry/index.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/directory/app */ "./extension/qixfs-entry/src/directory/app.ts"));
__export(__webpack_require__(/*! ./src/directory/app-script */ "./extension/qixfs-entry/src/directory/app-script.ts"));
__export(__webpack_require__(/*! ./src/directory/documents */ "./extension/qixfs-entry/src/directory/documents.ts"));
__export(__webpack_require__(/*! ./src/file/qlik-script */ "./extension/qixfs-entry/src/file/qlik-script.ts"));
__export(__webpack_require__(/*! ./src/entry */ "./extension/qixfs-entry/src/entry.ts"));


/***/ }),

/***/ "./extension/qixfs-entry/src/directory/app-script.ts":
/*!***********************************************************!*\
  !*** ./extension/qixfs-entry/src/directory/app-script.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const entry_1 = __webpack_require__(/*! ../entry */ "./extension/qixfs-entry/src/entry.ts");
class AppScriptDirectory extends entry_1.QixFsDirectory {
    readDirectory(uri, params) {
        throw new Error("Method not implemented.");
    }
    createDirectory(uri, name, params) {
        throw new Error("Method not implemented.");
    }
    stat(uri, params) {
        throw new Error("Method not implemented.");
    }
    delete(uri, params, options) {
        throw new Error("Method not implemented.");
    }
    rename(uri, oldUri, newUri, options) {
        throw new Error("Method not implemented.");
    }
}
exports.AppScriptDirectory = AppScriptDirectory;


/***/ }),

/***/ "./extension/qixfs-entry/src/directory/app.ts":
/*!****************************************************!*\
  !*** ./extension/qixfs-entry/src/directory/app.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const entry_1 = __webpack_require__(/*! ../entry */ "./extension/qixfs-entry/src/entry.ts");
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
class AppDirectory extends entry_1.QixFsDirectory {
    readDirectory(uri, params) {
        throw new Error("Method not implemented.");
    }
    createDirectory(uri, name, params) {
        throw new Error("Method not implemented.");
    }
    stat(uri, params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = params) === null || _a === void 0 ? void 0 : _a.app) && (yield this.getConnection(uri).isApp(params.app))) {
                return {
                    ctime: Date.now(),
                    mtime: Date.now(),
                    size: 10,
                    type: vscode.FileType.Directory
                };
            }
            throw vscode.FileSystemError.FileNotFound();
        });
    }
    delete(uri, params, options) {
        throw new Error("Method not implemented.");
    }
    rename(uri, oldUri, newUri, options) {
        throw new Error("Method not implemented.");
    }
}
exports.AppDirectory = AppDirectory;


/***/ }),

/***/ "./extension/qixfs-entry/src/directory/documents.ts":
/*!**********************************************************!*\
  !*** ./extension/qixfs-entry/src/directory/documents.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const entry_1 = __webpack_require__(/*! ../entry */ "./extension/qixfs-entry/src/entry.ts");
class DocumentsDirectory extends entry_1.QixFsDirectory {
    /**
     * read all qlik documents (apps) from enigma session
     */
    readDirectory(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this.getConnection(uri).open();
                const docList = yield session.getDocList();
                return docList.map((doc) => [doc.qTitle, vscode.FileType.Directory]);
            }
            catch (error) {
                return [];
            }
        });
    }
    /**
     * create new app
     */
    createDirectory(uri, name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.getConnection(uri).open();
            yield session.createApp(name);
        });
    }
    delete(connection, params, options) {
        throw new Error("Method not implemented.");
    }
    stat(connection) {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 10,
            type: vscode.FileType.Directory
        };
    }
    rename(connection, oldUri, newUri, options) {
        throw new Error("Method not implemented.");
    }
}
exports.DocumentsDirectory = DocumentsDirectory;


/***/ }),

/***/ "./extension/qixfs-entry/src/entry.ts":
/*!********************************************!*\
  !*** ./extension/qixfs-entry/src/entry.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const utils_1 = __webpack_require__(/*! @qixfs/utils */ "./extension/qixfs/src/utils/index.ts");
/**
 * der würde nun mehrfach existieren
 * aber quasi als singleton
 *
 * er sucht sich immer die passende connection raus und leitet diese
 * an die eigentliche methode weiter
 */
class QixFsEntry {
    getConnection(uri) {
        const workspaceFolder = utils_1.WorkspaceFolderManager.resolveWorkspaceFolder(uri);
        if (workspaceFolder) {
            return workspaceFolder.connection;
        }
        throw new Error("not found");
    }
}
exports.QixFsEntry = QixFsEntry;
/**
 * QixFs File Entry
 */
class QixFsFile extends QixFsEntry {
    constructor() {
        super(...arguments);
        this.type = vscode.FileType.File;
    }
}
exports.QixFsFile = QixFsFile;
/**
 * QixFs Directory Entry
 */
class QixFsDirectory extends QixFsEntry {
    constructor() {
        super(...arguments);
        this.type = vscode.FileType.Directory;
    }
}
exports.QixFsDirectory = QixFsDirectory;


/***/ }),

/***/ "./extension/qixfs-entry/src/file/qlik-script.ts":
/*!*******************************************************!*\
  !*** ./extension/qixfs-entry/src/file/qlik-script.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const entry_1 = __webpack_require__(/*! ../entry */ "./extension/qixfs-entry/src/entry.ts");
class QlikScriptFile extends entry_1.QixFsFile {
    readFile(uri, params) {
        throw new Error("Method not implemented.");
    }
    writeFile(uri, content, params) {
        throw new Error("Method not implemented.");
    }
    stat(uri, params) {
        throw new Error("Method not implemented.");
    }
    delete(uri, params, options) {
        throw new Error("Method not implemented.");
    }
    rename(connection, oldUri, newUri, options) {
        throw new Error("Method not implemented.");
    }
}
exports.QlikScriptFile = QlikScriptFile;


/***/ }),

/***/ "./extension/qixfs/src/model/index.ts":
/*!********************************************!*\
  !*** ./extension/qixfs/src/model/index.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/workspace-folder */ "./extension/qixfs/src/model/src/workspace-folder.ts"));


/***/ }),

/***/ "./extension/qixfs/src/model/src/workspace-folder.ts":
/*!***********************************************************!*\
  !*** ./extension/qixfs/src/model/src/workspace-folder.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const enigma_1 = __webpack_require__(/*! @extension/enigma */ "./extension/enigma/index.ts");
/**
 * davon reicht eine die dann geshared wird
 * müssen ja auch die route dahin kennen und hier wirds komplizierter
 */
/**
 * davon gibt es viele
 */
class QixWorkspaceFolder {
    constructor(connection) {
        /** file system entry points */
        this.entryMap = new Map();
        this._connection = new enigma_1.EnigmaSession(connection.host, connection.port, connection.secure);
    }
    get connection() {
        return this._connection;
    }
    destroy() {
    }
}
exports.QixWorkspaceFolder = QixWorkspaceFolder;


/***/ }),

/***/ "./extension/qixfs/src/utils/index.ts":
/*!********************************************!*\
  !*** ./extension/qixfs/src/utils/index.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/qix-fs.provider */ "./extension/qixfs/src/utils/src/qix-fs.provider.ts"));
__export(__webpack_require__(/*! ./src/workspace-folder-manager */ "./extension/qixfs/src/utils/src/workspace-folder-manager.ts"));
__export(__webpack_require__(/*! ./src/router */ "./extension/qixfs/src/utils/src/router.ts"));


/***/ }),

/***/ "./extension/qixfs/src/utils/src/qix-fs.provider.ts":
/*!**********************************************************!*\
  !*** ./extension/qixfs/src/utils/src/qix-fs.provider.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const router_1 = __webpack_require__(/*! ./router */ "./extension/qixfs/src/utils/src/router.ts");
const path_1 = __webpack_require__(/*! path */ "path");
// der brauch ne Map -> URI -> Connection
/** should use enum for this ? */
var QixFsCommands;
(function (QixFsCommands) {
    QixFsCommands.DELETE_FILE_COMMAND = `vscodeQlik.qixfs.deleteFileCommand`;
})(QixFsCommands = exports.QixFsCommands || (exports.QixFsCommands = {}));
/**
 * Qix File System
 *
 * soll das immer mit enigma arbeiten ?
 */
class QixFSProvider {
    /**
     * construct new Qix file system
     */
    constructor() {
        this.emitter = new vscode.EventEmitter();
        this.onDidChangeFile = this.emitter.event;
    }
    watch(_resource) {
        return new vscode.Disposable(() => { });
    }
    /**
     * return file or directory stats
     */
    stat(uri) {
        var _a;
        /** find entry */
        const route = router_1.QixRouter.find(uri);
        if ((_a = route) === null || _a === void 0 ? void 0 : _a.entry) {
            /** get current enigma session ? */
            return route.entry.stat(uri, route.params);
        }
        throw vscode.FileSystemError.FileNotFound();
    }
    /**
     */
    readDirectory(uri) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const route = router_1.QixRouter.find(uri);
            if (((_a = route) === null || _a === void 0 ? void 0 : _a.entry.type) === vscode.FileType.Directory) {
                return route.entry.readDirectory(uri, route.params);
            }
            throw vscode.FileSystemError.FileNotFound();
        });
    }
    /**
     */
    createDirectory(uri, silent = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const parentUri = uri.with({ path: path_1.posix.dirname(uri.path) });
            const name = path_1.posix.basename(uri.path);
            const route = router_1.QixRouter.find(parentUri);
            if (((_a = route) === null || _a === void 0 ? void 0 : _a.entry.type) === vscode.FileType.Directory) {
                return yield route.entry.createDirectory(uri, name, route.params);
            }
            throw vscode.FileSystemError.FileNotADirectory();
        });
    }
    readFile(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            throw vscode.FileSystemError.FileNotFound();
        });
    }
    writeFile(uri, content, options) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    delete(uri) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    rename(oldUri, newUri, options) {
    }
}
exports.QixFSProvider = QixFSProvider;


/***/ }),

/***/ "./extension/qixfs/src/utils/src/router.ts":
/*!*************************************************!*\
  !*** ./extension/qixfs/src/utils/src/router.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
;
;
/**
 * factory to create a concrete adapter
 * like a qlik script file adapter or documents directory adapter
 *
 * works as flyweight, routes allways return allways same instance from a adapter
 */
class QixRouter {
    /**
     * find endpoint by given uri
     */
    static find(uri) {
        if (uri.scheme !== "qix") {
            return;
        }
        const routes = this.routes.values();
        let route;
        let matches = null;
        /** loop all routes until all routes are used or we have a matched route */
        while ((route = routes.next().value) && !(matches = uri.path.match(route.matcher)))
            ;
        if (route) {
            /** merge param name and value together into one object */
            const params = route.params.reduce((params, routeParam, index) => { var _a; return (params[routeParam] = ((_a = matches) === null || _a === void 0 ? void 0 : _a[index + 1]) || "", params); }, {});
            return {
                entry: route.control.getControl(),
                params
            };
        }
    }
    /**
     * add new route
     */
    static addRoutes(routes) {
        routes.forEach((route) => this.registerRoute(route));
    }
    /**
     * register route to router
     *
     * @todo check correct behavior route allready registered (maybe show warning)
     */
    static registerRoute(route) {
        if (!this.controls.has(route.ctrl)) {
            this.controls.set(route.ctrl, this.createControllerFactory(route.ctrl));
        }
        const parsed = this.parseRoute(route.path);
        const control = this.controls.get(route.ctrl);
        /** save route */
        this.routes.set(route.path, Object.assign(Object.assign({}, parsed), { control }));
    }
    /**
     * parse route data
     */
    static parseRoute(route) {
        let params = route.match(/:([^\/]+)/g) || [];
        let matcher = new RegExp('^/' + route.replace(/:([^\/]+)/g, "([^/]+)") + '$');
        return {
            matcher,
            params: params.map((segment) => segment.substr(1)),
            route: route
        };
    }
    /**
     * controller factory for lazy initialization,
     * also ensures one adapter exists only 1 time.
     */
    static createControllerFactory(ctrl) {
        let instance;
        return {
            getControl: () => {
                if (!instance) {
                    instance = new ctrl();
                }
                return instance;
            }
        };
    }
}
exports.QixRouter = QixRouter;
QixRouter.routes = new Map();
QixRouter.controls = new WeakMap();


/***/ }),

/***/ "./extension/qixfs/src/utils/src/workspace-folder-manager.ts":
/*!*******************************************************************!*\
  !*** ./extension/qixfs/src/utils/src/workspace-folder-manager.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __webpack_require__(/*! @qixfs/model */ "./extension/qixfs/src/model/index.ts");
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
/**
 * holds all active workspace folders
 * which represented qlik servers
 */
class WorkspaceFolderManager {
    constructor() {
        throw new Error("could not create new instance use getInstance instead");
    }
    static addFolder(folders) {
        folders
            .filter((folder) => folder.uri.scheme === 'qix')
            .forEach((_) => this.addWorkspaceFolder(_));
    }
    static removeFolder(folders) {
        folders
            .filter((folder) => folder.uri.scheme === 'qix')
            .forEach(folder => this.closeWorkspaceFolder(folder));
    }
    /**
     * find our workspace folder by uri, default we could have multiple
     * workspace folders and each have an own enigma connection but qixfs provider
     * dosent know this.
     *
     * so we need to find correct workspace folder and get the correct enigma session context.
     */
    static resolveWorkspaceFolder(uri) {
        const wsFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (wsFolder && wsFolder.uri.scheme === 'qix') {
            return this.workspaceFolders.get(wsFolder);
        }
        throw new Error("Workspace Folder not found");
    }
    static find(uri) {
        return void 0;
    }
    /**
     * register new qix workspace folder
     *
     * @param folder
     */
    static addWorkspaceFolder(folder) {
        const configuration = vscode.workspace.getConfiguration();
        const connections = configuration.get(`VSQlik.Connection`);
        const config = connections.find(config => folder.name === `${config.host}:${config.port}`);
        const qixWSFolder = new model_1.QixWorkspaceFolder(config);
        this.workspaceFolders.set(folder, qixWSFolder);
    }
    /**
     * closes a qix workspace folder
     */
    static closeWorkspaceFolder(folder) {
        var _a;
        const qixWorkspaceFolder = this.workspaceFolders.get(folder);
        (_a = qixWorkspaceFolder) === null || _a === void 0 ? void 0 : _a.destroy();
        this.workspaceFolders.delete(folder);
    }
    /**
     * handle event if workspace folders has been changed (added or removed)
     */
    static workspaceFolderChanged(event) {
        if (event.added.length) {
            this.addFolder(event.added);
        }
        if (event.removed.length) {
            this.removeFolder(event.removed);
        }
    }
}
exports.WorkspaceFolderManager = WorkspaceFolderManager;
WorkspaceFolderManager.workspaceFolders = new WeakMap();


/***/ }),

/***/ "./extension/utils/index.ts":
/*!**********************************!*\
  !*** ./extension/utils/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./src/session-cache */ "./extension/utils/src/session-cache.ts"));


/***/ }),

/***/ "./extension/utils/src/session-cache.ts":
/*!**********************************************!*\
  !*** ./extension/utils/src/session-cache.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class SessionToken {
    constructor(description = '') {
        this.description = description;
    }
}
exports.SessionToken = SessionToken;
exports.ExtensionContext = new SessionToken("VSCode Extension Context");
exports.ConnectionSettings = new SessionToken("VSCode Connection Settings");
exports.WorkspaceFolders = new SessionToken("VSCode Connection Settings");
class SessionCache {
    static add(token, value) {
        SessionCache.values.set(token, value);
    }
    static get(token) {
        return SessionCache.values.get(token);
    }
}
exports.SessionCache = SessionCache;
SessionCache.values = new WeakMap();


/***/ }),

/***/ "./node_modules/enigma.js/enigma.js":
/*!******************************************!*\
  !*** ./node_modules/enigma.js/enigma.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * enigma.js v2.6.3
 * Copyright (c) 2019 QlikTech International AB
 * This library is licensed under MIT - See the LICENSE file for full details
 */

(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  /**
   * Utility functions
   */

  var util = {};

  util.isObject = function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  };

  util.isNumber = function isNumber(arg) {
    return typeof arg === 'number';
  };

  util.isUndefined = function isUndefined(arg) {
    return arg === void 0;
  };

  util.isFunction = function isFunction(arg){
    return typeof arg === 'function';
  };


  /**
   * EventEmitter class
   */

  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  var nodeEventEmitter = EventEmitter;

  // Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function() {
    this._events = this._events || {};
    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function(n) {
    if (!util.isNumber(n) || n < 0 || isNaN(n))
      throw TypeError('n must be a positive number');
    this._maxListeners = n;
    return this;
  };

  EventEmitter.prototype.emit = function(type) {
    var er, handler, len, args, i, listeners;

    if (!this._events)
      this._events = {};

    // If there is no 'error' event listener then throw.
    if (type === 'error' && !this._events.error) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw Error('Uncaught, unspecified "error" event.');
      }
    }

    handler = this._events[type];

    if (util.isUndefined(handler))
      return false;

    if (util.isFunction(handler)) {
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
          len = arguments.length;
          args = new Array(len - 1);
          for (i = 1; i < len; i++)
            args[i - 1] = arguments[i];
          handler.apply(this, args);
      }
    } else if (util.isObject(handler)) {
      len = arguments.length;
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];

      listeners = handler.slice();
      len = listeners.length;
      for (i = 0; i < len; i++)
        listeners[i].apply(this, args);
    }

    return true;
  };

  EventEmitter.prototype.addListener = function(type, listener) {
    var m;

    if (!util.isFunction(listener))
      throw TypeError('listener must be a function');

    if (!this._events)
      this._events = {};

    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (this._events.newListener)
      this.emit('newListener', type,
                util.isFunction(listener.listener) ?
                listener.listener : listener);

    if (!this._events[type])
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    else if (util.isObject(this._events[type]))
      // If we've already got an array, just append.
      this._events[type].push(listener);
    else
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];

    // Check for listener leak
    if (util.isObject(this._events[type]) && !this._events[type].warned) {
      var m;
      if (!util.isUndefined(this._maxListeners)) {
        m = this._maxListeners;
      } else {
        m = EventEmitter.defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;

        if (util.isFunction(console.error)) {
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
        }
        if (util.isFunction(console.trace))
          console.trace();
      }
    }

    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function(type, listener) {
    if (!util.isFunction(listener))
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

    if (!util.isFunction(listener))
      throw TypeError('listener must be a function');

    if (!this._events || !this._events[type])
      return this;

    list = this._events[type];
    length = list.length;
    position = -1;

    if (list === listener ||
        (util.isFunction(list.listener) && list.listener === listener)) {
      delete this._events[type];
      if (this._events.removeListener)
        this.emit('removeListener', type, listener);

    } else if (util.isObject(list)) {
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

    if (util.isFunction(listeners)) {
      this.removeListener(type, listeners);
    } else if (Array.isArray(listeners)) {
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
    else if (util.isFunction(this._events[type]))
      ret = [this._events[type]];
    else
      ret = this._events[type].slice();
    return ret;
  };

  EventEmitter.listenerCount = function(emitter, type) {
    var ret;
    if (!emitter._events || !emitter._events[type])
      ret = 0;
    else if (util.isFunction(emitter._events[type]))
      ret = 1;
    else
      ret = emitter._events[type].length;
    return ret;
  };

  /**
  * @module EventEmitter
  * @private
  */

  var Events = {
    /**
    * Function used to add event handling to objects passed in.
    * @param {Object} obj Object instance that will get event handling.
    */
    mixin: function mixin(obj) {
      Object.keys(nodeEventEmitter.prototype).forEach(function (key) {
        obj[key] = nodeEventEmitter.prototype[key];
      });
      nodeEventEmitter.init(obj);
    }
  };

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

  function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

  function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  /**
   * Error containing a custom error code.
   * @extends Error
   * @property {number} code The error code as defined by `errorCodes`
   * @property {boolean} enigmaError=true
   */
  var EnigmaError =
  /*#__PURE__*/
  function (_Error) {
    _inherits(EnigmaError, _Error);

    function EnigmaError(name, code) {
      var _this;

      _classCallCheck(this, EnigmaError);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(EnigmaError).call(this, name));
      _this.code = code;
      _this.enigmaError = true;
      return _this;
    }

    return EnigmaError;
  }(_wrapNativeSuper(Error));
  /**
   * Create an enigmaError
   * @param {Number} code A proper error code from `errorCodes`
   * @param {String} name A message/name of the enigmaError.
   * @returns {EnigmaError}
   */


  function createEnigmaError(code, name) {
    return new EnigmaError(name, code);
  }

  /**
   * @enum
   */
  var errorCodes = {
    /**
     * You're trying to send data on a socket that's not created
     * @type {number}
     */
    NOT_CONNECTED: -1,

    /**
     * The object you're trying to fetch does not exist
     * @type {number}
     */
    OBJECT_NOT_FOUND: -2,

    /**
     * Unexpected RPC response, expected array of patches
     * @type {number}
     */
    EXPECTED_ARRAY_OF_PATCHES: -3,

    /**
     * Patchee is not an object we can patch
     * @type {number}
     */
    PATCH_HAS_NO_PARENT: -4,

    /**
     * This entry is already defined with another key
     * @type {number}
     */
    ENTRY_ALREADY_DEFINED: -5,

    /**
     * You need to supply a configuration
     * @type {number}
     */
    NO_CONFIG_SUPPLIED: -6,

    /**
     * There's no promise object available (polyfill required?)
     * @type {number}
     */
    PROMISE_REQUIRED: -7,

    /**
     * The schema struct type you requested does not exist
     * @type {number}
     */
    SCHEMA_STRUCT_TYPE_NOT_FOUND: -8,

    /**
     * Can't override this function
     * @type {number}
     */
    SCHEMA_MIXIN_CANT_OVERRIDE_FUNCTION: -9,

    /**
     * Extend is not allowed for this mixin
     * @type {number}
     */
    SCHEMA_MIXIN_EXTEND_NOT_ALLOWED: -10,

    /**
     * Session suspended - no interaction allowed
     * @type {number}
     */
    SESSION_SUSPENDED: -11,

    /**
     * onlyIfAttached supplied, but you got SESSION_CREATED
     * @type {number}
     */
    SESSION_NOT_ATTACHED: -12
  };

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
  var RPC_CLOSE_NORMAL = 1000;
  var RPC_CLOSE_MANUAL_SUSPEND = 4000;
  var cacheId = 0;
  /**
   * The QIX Engine session object
   */

  var Session =
  /*#__PURE__*/
  function () {
    /**
     * Handle all JSON-RPC notification event, 'notification:*. Or handle a specific JSON-RPC
     * notification event, 'notification:OnConnected'. These events depend on the product you use QIX
     * Engine from.
     * @event Session#notification
     * @type {Object}
     */

    /**
    * Handle websocket messages. Generally used in debugging purposes. traffic:* will handle all
    * websocket messages, traffic:sent will handle outgoing messages and traffic:received will handle
    * incoming messages.
    * @event Session#traffic
    * @type {Object}
    */
    function Session(options) {
      _classCallCheck$1(this, Session);

      var session = this;
      Object.assign(session, options);
      this.Promise = this.config.Promise;
      this.definition = this.config.definition;
      Events.mixin(session);
      cacheId += 1;
      session.id = cacheId;
      session.rpc.on('socket-error', session.onRpcError.bind(session));
      session.rpc.on('closed', session.onRpcClosed.bind(session));
      session.rpc.on('message', session.onRpcMessage.bind(session));
      session.rpc.on('notification', session.onRpcNotification.bind(session));
      session.rpc.on('traffic', session.onRpcTraffic.bind(session));
      session.on('closed', function () {
        return session.onSessionClosed();
      });
    }
    /**
    * Event handler for re-triggering error events from RPC.
    * @private
    * @emits socket-error
    * @param {Error} err Webocket error event.
    */


    _createClass(Session, [{
      key: "onRpcError",
      value: function onRpcError(err) {
        if (this.suspendResume.isSuspended) {
          return;
        }

        this.emit('socket-error', err);
      }
      /**
      * Event handler for the RPC close event.
      * @private
      * @emits Session#suspended
      * @emits Session#closed
      * @param {Event} evt WebSocket close event.
      */

    }, {
      key: "onRpcClosed",
      value: function onRpcClosed(evt) {
        var _this = this;

        /**
         * Handle suspended state. This event is triggered in two cases (listed below). It is useful
         * in scenarios where you for example want to block interaction in your application until you
         * are resumed again. If config.suspendOnClose is true and there was a network disconnect
         * (socked closed) or if you ran session.suspend().
         * @event Session#suspended
         * @type {Object}
         * @param {Object} evt Event object.
         * @param {String} evt.initiator String indication what triggered the suspended state. Possible
         * values network, manual.
         */
        if (this.suspendResume.isSuspended) {
          return;
        }

        if (evt.code === RPC_CLOSE_NORMAL || evt.code === RPC_CLOSE_MANUAL_SUSPEND) {
          return;
        }

        if (this.config.suspendOnClose) {
          var code = evt.code,
              reason = evt.reason;
          this.suspendResume.suspend().then(function () {
            return _this.emit('suspended', {
              initiator: 'network',
              code: code,
              reason: reason
            });
          });
        } else {
          this.emit('closed', evt);
        }
      }
      /**
      * Event handler for the RPC message event.
      * @private
      * @param {Object} response JSONRPC response.
      */

    }, {
      key: "onRpcMessage",
      value: function onRpcMessage(response) {
        var _this2 = this;

        if (this.suspendResume.isSuspended) {
          return;
        }

        if (response.change) {
          response.change.forEach(function (handle) {
            return _this2.emitHandleChanged(handle);
          });
        }

        if (response.close) {
          response.close.forEach(function (handle) {
            return _this2.emitHandleClosed(handle);
          });
        }
      }
      /**
      * Event handler for the RPC notification event.
      * @private
      * @emits Session#notification
      * @param {Object} response The JSONRPC notification.
      */

    }, {
      key: "onRpcNotification",
      value: function onRpcNotification(response) {
        this.emit('notification:*', response.method, response.params);
        this.emit("notification:".concat(response.method), response.params);
      }
      /**
      * Event handler for the RPC traffic event.
      * @private
      * @emits Session#traffic
      * @param {String} dir The traffic direction, sent or received.
      * @param {Object} data JSONRPC request/response/WebSocket message.
      * @param {Number} handle The associated handle.
      */

    }, {
      key: "onRpcTraffic",
      value: function onRpcTraffic(dir, data, handle) {
        this.emit('traffic:*', dir, data);
        this.emit("traffic:".concat(dir), data);
        var api = this.apis.getApi(handle);

        if (api) {
          api.emit('traffic:*', dir, data);
          api.emit("traffic:".concat(dir), data);
        }
      }
      /**
      * Event handler for cleaning up API instances when a session has been closed.
      * @private
      * @emits API#closed
      */

    }, {
      key: "onSessionClosed",
      value: function onSessionClosed() {
        this.apis.getApis().forEach(function (entry) {
          entry.api.emit('closed');
          entry.api.removeAllListeners();
        });
        this.apis.clear();
      }
      /**
       * Function used to get an API for a backend object.
       * @private
       * @param {Object} args Arguments used to create object API.
       * @param {Number} args.handle Handle of the backend object.
       * @param {String} args.id ID of the backend object.
       * @param {String} args.type QIX type of the backend object. Can for example
       *                           be "Doc" or "GenericVariable".
       * @param {String} args.genericType Custom type of the backend object, if defined in qInfo.
       * @returns {*} Returns the generated and possibly augmented API.
       */

    }, {
      key: "getObjectApi",
      value: function getObjectApi(args) {
        var handle = args.handle,
            id = args.id,
            type = args.type,
            genericType = args.genericType;
        var api = this.apis.getApi(handle);

        if (api) {
          return api;
        }

        var factory = this.definition.generate(type);
        api = factory(this, handle, id, genericType);
        this.apis.add(handle, api);
        return api;
      }
      /**
      * Establishes the websocket against the configured URL and returns the Global instance.
      * @emits Session#opened
      * @returns {Promise<Object>} Eventually resolved if the connection was successful.
      */

    }, {
      key: "open",
      value: function open() {
        var _this3 = this;

        /**
         * Handle opened state. This event is triggered whenever the websocket is connected and ready for
         * communication.
         * @event Session#opened
         * @type {Object}
         */
        if (!this.globalPromise) {
          var args = {
            handle: -1,
            id: 'Global',
            type: 'Global',
            genericType: 'Global'
          };
          this.globalPromise = this.rpc.open().then(function () {
            return _this3.getObjectApi(args);
          }).then(function (global) {
            _this3.emit('opened');

            return global;
          });
        }

        return this.globalPromise;
      }
      /**
      * Function used to send data on the RPC socket.
      * @param {Object} request The request to be sent. (data and some meta info)
      * @returns {Object} Returns a promise instance.
      */

    }, {
      key: "send",
      value: function send(request) {
        var _this4 = this;

        if (this.suspendResume.isSuspended) {
          return this.Promise.reject(createEnigmaError(errorCodes.SESSION_SUSPENDED, 'Session suspended'));
        }

        request.id = this.rpc.createRequestId();
        var promise = this.intercept.executeRequests(this, this.Promise.resolve(request)).then(function (augmentedRequest) {
          var data = _objectSpread({}, _this4.config.protocol, {}, augmentedRequest); // the outKey value is used by multiple-out interceptor, at some point
          // we need to refactor that implementation and figure out how to transport
          // this value without hijacking the JSONRPC request object:


          delete data.outKey;

          var response = _this4.rpc.send(data);

          augmentedRequest.retry = function () {
            return _this4.send(request);
          };

          return _this4.intercept.executeResponses(_this4, response, augmentedRequest);
        });
        Session.addToPromiseChain(promise, 'requestId', request.id);
        return promise;
      }
      /**
      * Suspends the enigma.js session by closing the websocket and rejecting all method calls
      * until is has been resumed again.
      * @emits Session#suspended
      * @param {Number} [code=4000] - The reason code for suspending the connection.
      * @param {String} [reason=""] - The human readable string describing
      * why the connection is suspended.
      * @returns {Promise<Object>} Eventually resolved when the websocket has been closed.
      */

    }, {
      key: "suspend",
      value: function suspend() {
        var _this5 = this;

        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4000;
        var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        return this.suspendResume.suspend(code, reason).then(function () {
          return _this5.emit('suspended', {
            initiator: 'manual',
            code: code,
            reason: reason
          });
        });
      }
      /**
      * Resumes a previously suspended enigma.js session by re-creating the websocket and,
      * if possible, re-open the document as well as refreshing the internal cashes. If successful,
      * changed events will be triggered on all generated APIs, and on the ones it was unable to
      * restore, the closed event will be triggered.
      * @emits Session#resumed
      * @param {Boolean} onlyIfAttached If true, resume only if the session was re-attached properly.
      * @returns {Promise<Object>} Eventually resolved when the websocket (and potentially the
      * previously opened document, and generated APIs) has been restored, rejected when it fails any
      * of those steps, or when onlyIfAttached is true and a new session was created.
      */

    }, {
      key: "resume",
      value: function resume(onlyIfAttached) {
        var _this6 = this;

        /**
         * Handle resumed state. This event is triggered when the session was properly resumed. It is
         * useful in scenarios where you for example can close blocking modal dialogs and allow the user
         * to interact with your application again.
         * @event Session#resumed
         * @type {Object}
         */
        return this.suspendResume.resume(onlyIfAttached).then(function (value) {
          _this6.emit('resumed');

          return value;
        });
      }
      /**
      * Closes the websocket and cleans up internal caches, also triggers the closed event
      * on all generated APIs. Note that you have to manually invoke this when you want to
      * close a session and config.suspendOnClose is true.
      * @emits Session#closed
      * @param {Number} [code=1000] - The reason code for closing the connection.
      * @param {String} [reason=""] - The human readable string describing why the connection is closed.
      * @returns {Promise<Object>} Eventually resolved when the websocket has been closed.
      */

    }, {
      key: "close",
      value: function close() {
        var _this7 = this;

        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
        var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        /**
         * Handle closed state. This event is triggered when the underlying websocket is closed and
         * config.suspendOnClose is false.
         * @event Session#closed
         * @type {Object}
         */
        this.globalPromise = undefined;
        return this.rpc.close(code, reason).then(function (evt) {
          return _this7.emit('closed', evt);
        });
      }
      /**
      * Given a handle, this function will emit the 'changed' event on the
      * corresponding API instance.
      * @private
      * @param {Number} handle The handle of the API instance.
      * @emits API#changed
      */

    }, {
      key: "emitHandleChanged",
      value: function emitHandleChanged(handle) {
        var api = this.apis.getApi(handle);

        if (api) {
          api.emit('changed');
        }
      }
      /**
      * Given a handle, this function will emit the 'closed' event on the
      * corresponding API instance.
      * @private
      * @param {Number} handle The handle of the API instance.
      * @emits API#closed
      */

    }, {
      key: "emitHandleClosed",
      value: function emitHandleClosed(handle) {
        var api = this.apis.getApi(handle);

        if (api) {
          api.emit('closed');
          api.removeAllListeners();
        }
      }
      /**
      * Function used to add info on the promise chain.
      * @private
      * @param {Promise<Object>} promise The promise to add info on.
      * @param {String} name The property to add info on.
      * @param {Any} value The info to add.
      */

    }], [{
      key: "addToPromiseChain",
      value: function addToPromiseChain(promise, name, value) {
        promise[name] = value;
        var then = promise.then;

        promise.then = function patchedThen() {
          for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
          }

          var chain = then.apply(this, params);
          Session.addToPromiseChain(chain, name, value);
          return chain;
        };
      }
    }]);

    return Session;
  }();

  function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }
  /**
  * Key-value cache
  * @private
  */

  var KeyValueCache =
  /*#__PURE__*/
  function () {
    function KeyValueCache() {
      _classCallCheck$2(this, KeyValueCache);

      this.entries = {};
    }
    /**
    * Adds an entry.
    * @private
    * @function KeyValueCache#add
    * @param {String} key The key representing an entry.
    * @param {*} entry The entry to be added.
    */


    _createClass$1(KeyValueCache, [{
      key: "add",
      value: function add(key, entry) {
        key += '';

        if (typeof this.entries[key] !== 'undefined') {
          throw createEnigmaError(errorCodes.ENTRY_ALREADY_DEFINED, "Entry already defined with key ".concat(key));
        }

        this.entries[key] = entry;
      }
      /**
      * Sets an entry.
      * @private
      * @function KeyValueCache#set
      * @param {String} key The key representing an entry.
      * @param {*} entry The entry.
      */

    }, {
      key: "set",
      value: function set(key, entry) {
        key += '';
        this.entries[key] = entry;
      }
      /**
      * Removes an entry.
      * @private
      * @function KeyValueCache#remove
      * @param {String} key The key representing an entry.
      */

    }, {
      key: "remove",
      value: function remove(key) {
        delete this.entries[key];
      }
      /**
      * Gets an entry.
      * @private
      * @function KeyValueCache#get
      * @param {String} key The key representing an entry.
      * @returns {*} The entry for the key.
      */

    }, {
      key: "get",
      value: function get(key) {
        return this.entries[key];
      }
      /**
      * Gets a list of all entries.
      * @private
      * @function KeyValueCache#getAll
      * @returns {Array} The list of entries including its `key` and `value` properties.
      */

    }, {
      key: "getAll",
      value: function getAll() {
        var _this = this;

        return Object.keys(this.entries).map(function (key) {
          return {
            key: key,
            value: _this.entries[key]
          };
        });
      }
      /**
      * Gets a key for an entry.
      * @private
      * @function KeyValueCache#getKey
      * @param {*} entry The entry to locate the key for.
      * @returns {String} The key representing an entry.
      */

    }, {
      key: "getKey",
      value: function getKey(entry) {
        var _this2 = this;

        return Object.keys(this.entries).filter(function (key) {
          return _this2.entries[key] === entry;
        })[0];
      }
      /**
      * Clears the cache of all entries.
      * @private
      * @function KeyValueCache#clear
      */

    }, {
      key: "clear",
      value: function clear() {
        this.entries = {};
      }
    }]);

    return KeyValueCache;
  }();

  function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

  function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  /**
  * Returns the camelCase counterpart of a symbol.
  * @private
  * @param {String} symbol The symbol.
  * @return the camelCase counterpart.
  */

  function toCamelCase(symbol) {
    return symbol.substring(0, 1).toLowerCase() + symbol.substring(1);
  }
  /**
   * A facade function that allows parameters to be passed either by name
   * (through an object), or by position (through an array).
   * @private
   * @param {Function} base The function that is being overriden. Will be
   *                        called with parameters in array-form.
   * @param {Object} defaults Parameter list and it's default values.
   * @param {*} params The parameters.
   */


  function namedParamFacade(base, defaults) {
    for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }

    if (params.length === 1 && _typeof$1(params[0]) === 'object' && !Array.isArray(params[0])) {
      var valid = Object.keys(params[0]).every(function (key) {
        return hasOwnProperty$1.call(defaults, key);
      });

      if (valid) {
        params = Object.keys(defaults).map(function (key) {
          return params[0][key] || defaults[key];
        });
      }
    }

    return base.apply(this, params);
  }
  /**
  * Qix schema definition.
  * @private
  */


  var Schema =
  /*#__PURE__*/
  function () {
    /**
    * Create a new schema instance.
    * @private
    * @param {Configuration} config The configuration for QIX.
    */
    function Schema(config) {
      _classCallCheck$3(this, Schema);

      this.config = config;
      this.Promise = config.Promise;
      this.schema = config.schema;
      this.mixins = new KeyValueCache();
      this.types = new KeyValueCache();
    }

    _createClass$2(Schema, [{
      key: "registerMixin",
      value: function registerMixin(_ref) {
        var _this = this;

        var types = _ref.types,
            type = _ref.type,
            extend = _ref.extend,
            override = _ref.override,
            init = _ref.init;

        if (!Array.isArray(types)) {
          types = [types];
        } // to support a single type


        if (type) {
          types.push(type);
        }

        var cached = {
          extend: extend,
          override: override,
          init: init
        };
        types.forEach(function (typeKey) {
          var entryList = _this.mixins.get(typeKey);

          if (entryList) {
            entryList.push(cached);
          } else {
            _this.mixins.add(typeKey, [cached]);
          }
        });
      }
      /**
      * Function used to generate a type definition.
      * @private
      * @param {String} type The type.
      * @returns {{create: Function, def: Object}} Returns an object with a definition
      *          of the type and a create factory.
      */

    }, {
      key: "generate",
      value: function generate(type) {
        var entry = this.types.get(type);

        if (entry) {
          return entry;
        }

        if (!this.schema.structs[type]) {
          throw createEnigmaError(errorCodes.SCHEMA_STRUCT_TYPE_NOT_FOUND, "".concat(type, " not found"));
        }

        var factory = this.generateApi(type, this.schema.structs[type]);
        this.types.add(type, factory);
        return factory;
      }
      /**
      * Function used to generate an API definition for a given type.
      * @private
      * @param {String} type The type to generate.
      * @param {Object} schema The schema describing the type.
      * @returns {{create: (function(session:Object, handle:Number, id:String,
      *          customKey:String)), def: Object}} Returns the API definition.
      */

    }, {
      key: "generateApi",
      value: function generateApi(type, schema) {
        var api = Object.create({});
        this.generateDefaultApi(api, schema); // Generate default

        this.mixinType(type, api); // Mixin default type

        this.mixinNamedParamFacade(api, schema); // Mixin named parameter support

        return function create(session, handle, id, customKey) {
          var _this2 = this;

          var instance = Object.create(api);
          Events.mixin(instance); // Always mixin event-emitter per instance

          Object.defineProperties(instance, {
            session: {
              enumerable: true,
              value: session
            },
            handle: {
              enumerable: true,
              value: handle,
              writable: true
            },
            id: {
              enumerable: true,
              value: id
            },
            type: {
              enumerable: true,
              value: type
            },
            genericType: {
              enumerable: true,
              value: customKey
            }
          });
          var mixinList = this.mixins.get(type) || [];

          if (customKey !== type) {
            this.mixinType(customKey, instance); // Mixin custom types

            mixinList = mixinList.concat(this.mixins.get(customKey) || []);
          }

          mixinList.forEach(function (mixin) {
            if (typeof mixin.init === 'function') {
              mixin.init({
                config: _this2.config,
                api: instance
              });
            }
          });
          return instance;
        }.bind(this);
      }
      /**
      * Function used to generate the methods with the right handlers to the object
      * API that is being generated.
      * @private
      * @param {Object} api The object API that is currently being generated.
      * @param {Object} schema The API definition.
      */

    }, {
      key: "generateDefaultApi",
      value: function generateDefaultApi(api, schema) {
        Object.keys(schema).forEach(function (method) {
          var out = schema[method].Out;
          var outKey = out.length === 1 ? out[0].Name : -1;
          var fnName = toCamelCase(method);

          api[fnName] = function generatedMethod() {
            for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              params[_key2] = arguments[_key2];
            }

            return this.session.send({
              handle: this.handle,
              method: method,
              params: params,
              outKey: outKey
            });
          };
        });
      }
      /**
      * Function used to add mixin methods to a specified API.
      * @private
      * @param {String} type Used to specify which mixin should be woven in.
      * @param {Object} api The object that will be woven.
      */

    }, {
      key: "mixinType",
      value: function mixinType(type, api) {
        var mixinList = this.mixins.get(type);

        if (mixinList) {
          mixinList.forEach(function (_ref2) {
            var _ref2$extend = _ref2.extend,
                extend = _ref2$extend === void 0 ? {} : _ref2$extend,
                _ref2$override = _ref2.override,
                override = _ref2$override === void 0 ? {} : _ref2$override;
            Object.keys(override).forEach(function (key) {
              if (typeof api[key] === 'function' && typeof override[key] === 'function') {
                var baseFn = api[key];

                api[key] = function wrappedFn() {
                  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                  }

                  return override[key].apply(this, [baseFn.bind(this)].concat(args));
                };
              } else {
                throw createEnigmaError(errorCodes.SCHEMA_MIXIN_CANT_OVERRIDE_FUNCTION, "No function to override. Type: ".concat(type, " function: ").concat(key));
              }
            });
            Object.keys(extend).forEach(function (key) {
              // handle overrides
              if (typeof api[key] === 'function' && typeof extend[key] === 'function') {
                throw createEnigmaError(errorCodes.SCHEMA_MIXIN_EXTEND_NOT_ALLOWED, "Extend is not allowed for this mixin. Type: ".concat(type, " function: ").concat(key));
              } else {
                api[key] = extend[key];
              }
            });
          });
        }
      }
      /**
      * Function used to mixin the named parameter facade.
      * @private
      * @param {Object} api The object API that is currently being generated.
      * @param {Object} schema The API definition.
      */

    }, {
      key: "mixinNamedParamFacade",
      value: function mixinNamedParamFacade(api, schema) {
        Object.keys(schema).forEach(function (key) {
          var fnName = toCamelCase(key);
          var base = api[fnName];
          var defaults = schema[key].In.reduce(function (result, item) {
            result[item.Name] = item.DefaultValue;
            return result;
          }, {});

          api[fnName] = function namedParamWrapper() {
            for (var _len4 = arguments.length, params = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              params[_key4] = arguments[_key4];
            }

            return namedParamFacade.apply(this, [base, defaults].concat(params));
          };
        });
      }
    }]);

    return Schema;
  }();

  function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }
  /**
   * Helper class for handling RPC calls
   * @private
   */

  var RPCResolver =
  /*#__PURE__*/
  function () {
    function RPCResolver(id, handle, resolve, reject) {
      _classCallCheck$4(this, RPCResolver);

      Events.mixin(this);
      this.id = id;
      this.handle = handle;
      this.resolve = resolve;
      this.reject = reject;
    }

    _createClass$3(RPCResolver, [{
      key: "resolveWith",
      value: function resolveWith(data) {
        this.resolve(data);
        this.emit('resolved', this.id);
      }
    }, {
      key: "rejectWith",
      value: function rejectWith(err) {
        this.reject(err);
        this.emit('rejected', this.id);
      }
    }]);

    return RPCResolver;
  }();

  function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }
  /**
  * This class handles remote procedure calls on a web socket.
  * @private
  */

  var RPC =
  /*#__PURE__*/
  function () {
    /**
    * Create a new RPC instance.
    * @private
    * @param {Object} options The configuration options for this class.
    * @param {Function} options.Promise The promise constructor to use.
    * @param {String} options.url The complete websocket URL used to connect.
    * @param {Function} options.createSocket The function callback to create a WebSocket.
    */
    function RPC(options) {
      _classCallCheck$5(this, RPC);

      Object.assign(this, options);
      Events.mixin(this);
      this.resolvers = {};
      this.requestId = 0;
      this.openedPromise = undefined;
    }
    /**
    * Opens a connection to the configured endpoint.
    * @private
    * @param {Boolean} force - ignores all previous and outstanding open calls if set to true.
    * @returns {Object} A promise instance.
    */


    _createClass$4(RPC, [{
      key: "open",
      value: function open() {
        var _this = this;

        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!force && this.openedPromise) {
          return this.openedPromise;
        }

        try {
          this.socket = this.createSocket(this.url);
        } catch (err) {
          return this.Promise.reject(err);
        }

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.openedPromise = new this.Promise(function (resolve, reject) {
          return _this.registerResolver('opened', null, resolve, reject);
        });
        this.closedPromise = new this.Promise(function (resolve, reject) {
          return _this.registerResolver('closed', null, resolve, reject);
        });
        return this.openedPromise;
      }
      /**
      * Resolves the open promise when a connection is successfully established.
      * @private
      */

    }, {
      key: "onOpen",
      value: function onOpen() {
        var _this2 = this;

        this.resolvers.opened.resolveWith(function () {
          return _this2.closedPromise;
        });
      }
      /**
      * Resolves the close promise when a connection is closed.
      * @private
      * @param {Object} event - The event describing close.
      */

    }, {
      key: "onClose",
      value: function onClose(event) {
        this.emit('closed', event);

        if (this.resolvers && this.resolvers.closed) {
          this.resolvers.closed.resolveWith(event);
        }

        this.rejectAllOutstandingResolvers({
          code: -1,
          message: 'Socket closed'
        });
      }
      /**
      * Closes a connection.
      * @private
      * @param {Number} [code=1000] - The reason code for closing the connection.
      * @param {String} [reason=""] - The human readable string describing why the connection is closed.
      * @returns {Object} Returns a promise instance.
      */

    }, {
      key: "close",
      value: function close() {
        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
        var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        if (this.socket) {
          this.socket.close(code, reason);
          this.socket = null;
        }

        return this.closedPromise;
      }
      /**
      * Emits an error event and rejects the open promise if an error is raised on the connection.
      * @private
      * @param {Object} event - The event describing the error.
      */

    }, {
      key: "onError",
      value: function onError(event) {
        if (this.resolvers.opened) {
          this.resolvers.opened.rejectWith(event);
        } else {
          // only emit errors after the initial open promise has been resolved,
          // this makes it possible to catch early websocket errors as well
          // as run-time ones:
          this.emit('socket-error', event);
        }

        this.rejectAllOutstandingResolvers({
          code: -1,
          message: 'Socket error'
        });
      }
      /**
      * Parses the onMessage event on the connection and resolve the promise for the request.
      * @private
      * @param {Object} event - The event describing the message.
      */

    }, {
      key: "onMessage",
      value: function onMessage(event) {
        var data = JSON.parse(event.data);
        var resolver = this.resolvers[data.id] || {};
        this.emit('traffic', 'received', data, resolver.handle);

        if (typeof data.id !== 'undefined') {
          this.emit('message', data);
          this.resolvers[data.id].resolveWith(data);
        } else {
          this.emit(data.params ? 'notification' : 'message', data);
        }
      }
      /**
      * Rejects all outstanding resolvers.
      * @private
      * @param {Object} reason - The reject reason.
      */

    }, {
      key: "rejectAllOutstandingResolvers",
      value: function rejectAllOutstandingResolvers(reason) {
        var _this3 = this;

        Object.keys(this.resolvers).forEach(function (id) {
          if (id === 'opened' || id === 'closed') {
            return; // "opened" and "closed" should not be handled here
          }

          var resolver = _this3.resolvers[id];
          resolver.rejectWith(reason);
        });
      }
      /**
      * Unregisters a resolver.
      * @private
      * @param {Number|String} id - The ID to unregister the resolver with.
      */

    }, {
      key: "unregisterResolver",
      value: function unregisterResolver(id) {
        var resolver = this.resolvers[id];
        resolver.removeAllListeners();
        delete this.resolvers[id];
      }
      /**
      * Registers a resolver.
      * @private
      * @param {Number|String} id - The ID to register the resolver with.
      * @param {Number} handle - The associated handle.
      * @returns {Function} The promise executor function.
      */

    }, {
      key: "registerResolver",
      value: function registerResolver(id, handle, resolve, reject) {
        var _this4 = this;

        var resolver = new RPCResolver(id, handle, resolve, reject);
        this.resolvers[id] = resolver;
        resolver.on('resolved', function (resolvedId) {
          return _this4.unregisterResolver(resolvedId);
        });
        resolver.on('rejected', function (rejectedId) {
          return _this4.unregisterResolver(rejectedId);
        });
      }
      /**
      * Sends data on the socket.
      * @private
      * @param {Object} data - The data to send.
      * @returns {Object} A promise instance.
      */

    }, {
      key: "send",
      value: function send(data) {
        var _this5 = this;

        if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
          var error = createEnigmaError(errorCodes.NOT_CONNECTED, 'Not connected');
          return this.Promise.reject(error);
        }

        if (!data.id) {
          data.id = this.createRequestId();
        }

        data.jsonrpc = '2.0';
        return new this.Promise(function (resolve, reject) {
          _this5.socket.send(JSON.stringify(data));

          _this5.emit('traffic', 'sent', data, data.handle);

          return _this5.registerResolver(data.id, data.handle, resolve, reject);
        });
      }
    }, {
      key: "createRequestId",
      value: function createRequestId() {
        this.requestId += 1;
        return this.requestId;
      }
    }]);

    return RPC;
  }();

  function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); if (staticProps) _defineProperties$5(Constructor, staticProps); return Constructor; }
  var ON_ATTACHED_TIMEOUT_MS = 5000;
  var RPC_CLOSE_MANUAL_SUSPEND$1 = 4000;

  var SuspendResume =
  /*#__PURE__*/
  function () {
    /**
    * Creates a new SuspendResume instance.
    * @private
    * @param {Object} options The configuration option for this class.
    * @param {Promise<Object>} options.Promise The promise constructor to use.
    * @param {RPC} options.rpc The RPC instance to use when communicating towards Engine.
    * @param {ApiCache} options.apis The ApiCache instance to use.
    */
    function SuspendResume(options) {
      var _this = this;

      _classCallCheck$6(this, SuspendResume);

      Object.assign(this, options);
      this.isSuspended = false;
      this.rpc.on('traffic', function (dir, data) {
        if (dir === 'sent' && data.method === 'OpenDoc') {
          _this.openDocParams = data.params;
        }
      });
    }
    /**
    * Function used to restore the rpc connection.
    * @private
    * @param {Boolean} onlyIfAttached - if true, the returned promise will resolve
    *                                   only if the session can be re-attached.
    * @returns {Object} Returns a promise instance.
    */


    _createClass$5(SuspendResume, [{
      key: "restoreRpcConnection",
      value: function restoreRpcConnection(onlyIfAttached) {
        var _this2 = this;

        return this.reopen(ON_ATTACHED_TIMEOUT_MS).then(function (sessionState) {
          if (sessionState === 'SESSION_CREATED' && onlyIfAttached) {
            return _this2.Promise.reject(createEnigmaError(errorCodes.SESSION_NOT_ATTACHED, 'Not attached'));
          }

          return _this2.Promise.resolve();
        });
      }
      /**
      * Function used to restore the global API.
      * @private
      * @param {Object} changed - A list where the restored APIs will be added.
      * @returns {Object} Returns a promise instance.
      */

    }, {
      key: "restoreGlobal",
      value: function restoreGlobal(changed) {
        var global = this.apis.getApisByType('Global').pop();
        changed.push(global.api);
        return this.Promise.resolve();
      }
      /**
      * Function used to restore the doc API.
      * @private
      * @param {String} sessionState - The state of the session, attached or created.
      * @param {Array} closed - A list where the closed of APIs APIs will be added.
      * @param {Object} changed - A list where the restored APIs will be added.
      * @returns {Object} Returns a promise instance.
      */

    }, {
      key: "restoreDoc",
      value: function restoreDoc(closed, changed) {
        var _this3 = this;

        var doc = this.apis.getApisByType('Doc').pop();

        if (!doc) {
          return this.Promise.resolve();
        }

        return this.rpc.send({
          method: 'GetActiveDoc',
          handle: -1,
          params: []
        }).then(function (response) {
          if (response.error && _this3.openDocParams) {
            return _this3.rpc.send({
              method: 'OpenDoc',
              handle: -1,
              params: _this3.openDocParams
            });
          }

          return response;
        }).then(function (response) {
          if (response.error) {
            closed.push(doc.api);
            return _this3.Promise.resolve();
          }

          var handle = response.result.qReturn.qHandle;
          doc.api.handle = handle;
          changed.push(doc.api);
          return _this3.Promise.resolve(doc.api);
        });
      }
      /**
      * Function used to restore the APIs on the doc.
      * @private
      * @param {Object} doc - The doc API on which the APIs we want to restore exist.
      * @param {Array} closed - A list where the closed of APIs APIs will be added.
      * @param {Object} changed - A list where the restored APIs will be added.
      * @returns {Object} Returns a promise instance.
      */

    }, {
      key: "restoreDocObjects",
      value: function restoreDocObjects(doc, closed, changed) {
        var _this4 = this;

        var tasks = [];
        var apis = this.apis.getApis().map(function (entry) {
          return entry.api;
        }).filter(function (api) {
          return api.type !== 'Global' && api.type !== 'Doc';
        });

        if (!doc) {
          apis.forEach(function (api) {
            return closed.push(api);
          });
          return this.Promise.resolve();
        }

        apis.forEach(function (api) {
          var method = SuspendResume.buildGetMethodName(api.type);

          if (!method) {
            closed.push(api);
          } else {
            var request = _this4.rpc.send({
              method: method,
              handle: doc.handle,
              params: [api.id]
            }).then(function (response) {
              if (response.error || !response.result.qReturn.qHandle) {
                closed.push(api);
              } else {
                api.handle = response.result.qReturn.qHandle;
                changed.push(api);
              }
            });

            tasks.push(request);
          }
        });
        return this.Promise.all(tasks);
      }
      /**
      * Set the instance as suspended.
      * @private
      * @param {Number} [code=4000] - The reason code for suspending the connection.
      * @param {String} [reason=""] - The human readable string describing
      * why the connection is suspended.
      */

    }, {
      key: "suspend",
      value: function suspend() {
        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : RPC_CLOSE_MANUAL_SUSPEND$1;
        var reason = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        this.isSuspended = true;
        return this.rpc.close(code, reason);
      }
      /**
      * Resumes a previously suspended RPC connection, and refreshes the API cache.
      *                                APIs unabled to be restored has their 'closed'
      *                                event triggered, otherwise 'changed'.
      * @private
      * @emits API#changed
      * @emits APIfunction@#closed
      * @param {Boolean} onlyIfAttached if true, resume only if the session was re-attached.
      * @returns {Promise<Object>} Eventually resolved if the RPC connection was successfully resumed,
      *                    otherwise rejected.
      */

    }, {
      key: "resume",
      value: function resume(onlyIfAttached) {
        var _this5 = this;

        var changed = [];
        var closed = [];
        return this.restoreRpcConnection(onlyIfAttached).then(function () {
          return _this5.restoreGlobal(changed);
        }).then(function () {
          return _this5.restoreDoc(closed, changed);
        }).then(function (doc) {
          return _this5.restoreDocObjects(doc, closed, changed);
        }).then(function () {
          _this5.isSuspended = false;

          _this5.apis.clear();

          closed.forEach(function (api) {
            api.emit('closed');
            api.removeAllListeners();
          });
          changed.forEach(function (api) {
            _this5.apis.add(api.handle, api);

            if (api.type !== 'Global') {
              api.emit('changed');
            }
          });
        })["catch"](function (err) {
          return _this5.rpc.close().then(function () {
            return _this5.Promise.reject(err);
          });
        });
      }
      /**
      * Reopens the connection and waits for the OnConnected notification.
      * @private
      * @param {Number} timeout - The time to wait for the OnConnected notification.
      * @returns {Object} A promise containing the session state (SESSION_CREATED or SESSION_ATTACHED).
      */

    }, {
      key: "reopen",
      value: function reopen(timeout) {
        var _this6 = this;

        var timer;
        var notificationResolve;
        var notificationReceived = false;
        var notificationPromise = new this.Promise(function (resolve) {
          notificationResolve = resolve;
        });

        var waitForNotification = function waitForNotification() {
          if (!notificationReceived) {
            timer = setTimeout(function () {
              return notificationResolve('SESSION_CREATED');
            }, timeout);
          }

          return notificationPromise;
        };

        var onNotification = function onNotification(data) {
          if (data.method !== 'OnConnected') return;
          clearTimeout(timer);
          notificationResolve(data.params.qSessionState);
          notificationReceived = true;
        };

        this.rpc.on('notification', onNotification);
        return this.rpc.open(true).then(waitForNotification).then(function (state) {
          _this6.rpc.removeListener('notification', onNotification);

          return state;
        })["catch"](function (err) {
          _this6.rpc.removeListener('notification', onNotification);

          return _this6.Promise.reject(err);
        });
      }
      /**
      * Function used to build the get method names for Doc APIs.
      * @private
      * @param {String} type - The API type.
      * @returns {String} Returns the get method name, or undefined if the type cannot be restored.
      */

    }], [{
      key: "buildGetMethodName",
      value: function buildGetMethodName(type) {
        if (type === 'Field' || type === 'Variable') {
          return null;
        }

        if (type === 'GenericVariable') {
          return 'GetVariableById';
        }

        return type.replace('Generic', 'Get');
      }
    }]);

    return SuspendResume;
  }();

  var SUCCESS_KEY = 'qSuccess';
  function deltaRequestInterceptor(session, request) {
    var delta = session.config.protocol.delta && request.outKey !== -1 && request.outKey !== SUCCESS_KEY;

    if (delta) {
      request.delta = delta;
    }

    return request;
  }

  /**
  * Response interceptor for generating APIs. Handles the quirks of engine not
  * returning an error when an object is missing.
  * @private
  * @param {Session} session - The session the intercept is being executed on.
  * @param {Object} request - The JSON-RPC request.
  * @param {Object} response - The response.
  * @returns {Object} - Returns the generated API
  */

  function apiResponseInterceptor(session, request, response) {
    if (response.qHandle && response.qType) {
      return session.getObjectApi({
        handle: response.qHandle,
        type: response.qType,
        id: response.qGenericId,
        genericType: response.qGenericType
      });
    }

    if (response.qHandle === null && response.qType === null) {
      var error = createEnigmaError(errorCodes.OBJECT_NOT_FOUND, 'Object not found');
      return session.config.Promise.reject(error);
    }

    return response;
  }

  var hasOwn = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;
  var defineProperty = Object.defineProperty;
  var gOPD = Object.getOwnPropertyDescriptor;

  var isArray = function isArray(arr) {
  	if (typeof Array.isArray === 'function') {
  		return Array.isArray(arr);
  	}

  	return toStr.call(arr) === '[object Array]';
  };

  var isPlainObject = function isPlainObject(obj) {
  	if (!obj || toStr.call(obj) !== '[object Object]') {
  		return false;
  	}

  	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
  	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  	// Not own constructor property must be Object
  	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
  		return false;
  	}

  	// Own properties are enumerated firstly, so to speed up,
  	// if last one is own, then all properties are own.
  	var key;
  	for (key in obj) { /**/ }

  	return typeof key === 'undefined' || hasOwn.call(obj, key);
  };

  // If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
  var setProperty = function setProperty(target, options) {
  	if (defineProperty && options.name === '__proto__') {
  		defineProperty(target, options.name, {
  			enumerable: true,
  			configurable: true,
  			value: options.newValue,
  			writable: true
  		});
  	} else {
  		target[options.name] = options.newValue;
  	}
  };

  // Return undefined instead of __proto__ if '__proto__' is not an own property
  var getProperty = function getProperty(obj, name) {
  	if (name === '__proto__') {
  		if (!hasOwn.call(obj, name)) {
  			return void 0;
  		} else if (gOPD) {
  			// In early versions of node, obj['__proto__'] is buggy when obj has
  			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
  			return gOPD(obj, name).value;
  		}
  	}

  	return obj[name];
  };

  var extend = function extend() {
  	var options, name, src, copy, copyIsArray, clone;
  	var target = arguments[0];
  	var i = 1;
  	var length = arguments.length;
  	var deep = false;

  	// Handle a deep copy situation
  	if (typeof target === 'boolean') {
  		deep = target;
  		target = arguments[1] || {};
  		// skip the boolean and the target
  		i = 2;
  	}
  	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
  		target = {};
  	}

  	for (; i < length; ++i) {
  		options = arguments[i];
  		// Only deal with non-null/undefined values
  		if (options != null) {
  			// Extend the base object
  			for (name in options) {
  				src = getProperty(target, name);
  				copy = getProperty(options, name);

  				// Prevent never-ending loop
  				if (target !== copy) {
  					// Recurse if we're merging plain objects or arrays
  					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
  						if (copyIsArray) {
  							copyIsArray = false;
  							clone = src && isArray(src) ? src : [];
  						} else {
  							clone = src && isPlainObject(src) ? src : {};
  						}

  						// Never move original objects, clone them
  						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

  					// Don't bring in undefined values
  					} else if (typeof copy !== 'undefined') {
  						setProperty(target, { name: name, newValue: copy });
  					}
  				}
  			}
  		}
  	}

  	// Return the modified object
  	return target;
  };

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _typeof$2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }
  var extend$1 = extend.bind(null, true);
  var JSONPatch = {};
  var isArray$1 = Array.isArray;

  function isObject(v) {
    return v != null && !Array.isArray(v) && _typeof$2(v) === 'object';
  }

  function isUndef(v) {
    return typeof v === 'undefined';
  }

  function isFunction(v) {
    return typeof v === 'function';
  }
  /**
  * Generate an exact duplicate (with no references) of a specific value.
  *
  * @private
  * @param {Object} The value to duplicate
  * @returns {Object} a unique, duplicated value
  */


  function generateValue(val) {
    if (val) {
      return extend$1({}, {
        val: val
      }).val;
    }

    return val;
  }
  /**
  * An additional type checker used to determine if the property is of internal
  * use or not a type that can be translated into JSON (like functions).
  *
  * @private
  * @param {Object} obj The object which has the property to check
  * @param {String} The property name to check
  * @returns {Boolean} Whether the property is deemed special or not
  */


  function isSpecialProperty(obj, key) {
    return isFunction(obj[key]) || key.substring(0, 2) === '$$' || key.substring(0, 1) === '_';
  }
  /**
  * Finds the parent object from a JSON-Pointer ("/foo/bar/baz" = "bar" is "baz" parent),
  * also creates the object structure needed.
  *
  * @private
  * @param {Object} data The root object to traverse through
  * @param {String} The JSON-Pointer string to use when traversing
  * @returns {Object} The parent object
  */


  function getParent(data, str) {
    var seperator = '/';
    var parts = str.substring(1).split(seperator).slice(0, -1);
    var numPart;
    parts.forEach(function (part, i) {
      if (i === parts.length) {
        return;
      }

      numPart = +part;
      var newPart = !isNaN(numPart) ? [] : {};
      data[numPart || part] = isUndef(data[numPart || part]) ? newPart : data[part];
      data = data[numPart || part];
    });
    return data;
  }
  /**
  * Cleans an object of all its properties, unless they're deemed special or
  * cannot be removed by configuration.
  *
  * @private
  * @param {Object} obj The object to clean
  */


  function emptyObject(obj) {
    Object.keys(obj).forEach(function (key) {
      var config = Object.getOwnPropertyDescriptor(obj, key);

      if (config.configurable && !isSpecialProperty(obj, key)) {
        delete obj[key];
      }
    });
  }
  /**
  * Compare an object with another, could be object, array, number, string, bool.
  * @private
  * @param {Object} a The first object to compare
  * @param {Object} a The second object to compare
  * @returns {Boolean} Whether the objects are identical
  */


  function compare(a, b) {
    var isIdentical = true;

    if (isObject(a) && isObject(b)) {
      if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
      }

      Object.keys(a).forEach(function (key) {
        if (!compare(a[key], b[key])) {
          isIdentical = false;
        }
      });
      return isIdentical;
    }

    if (isArray$1(a) && isArray$1(b)) {
      if (a.length !== b.length) {
        return false;
      }

      for (var i = 0, l = a.length; i < l; i += 1) {
        if (!compare(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    return a === b;
  }
  /**
  * Generates patches by comparing two arrays.
  *
  * @private
  * @param {Array} oldA The old (original) array, which will be patched
  * @param {Array} newA The new array, which will be used to compare against
  * @returns {Array} An array of patches (if any)
  */


  function patchArray(original, newA, basePath) {
    var patches = [];
    var oldA = original.slice();
    var tmpIdx = -1;

    function findIndex(a, id, idx) {
      if (a[idx] && isUndef(a[idx].qInfo)) {
        return null;
      }

      if (a[idx] && a[idx].qInfo.qId === id) {
        // shortcut if identical
        return idx;
      }

      for (var ii = 0, ll = a.length; ii < ll; ii += 1) {
        if (a[ii] && a[ii].qInfo.qId === id) {
          return ii;
        }
      }

      return -1;
    }

    if (compare(newA, oldA)) {
      // array is unchanged
      return patches;
    }

    if (!isUndef(newA[0]) && isUndef(newA[0].qInfo)) {
      // we cannot create patches without unique identifiers, replace array...
      patches.push({
        op: 'replace',
        path: basePath,
        value: newA
      });
      return patches;
    }

    for (var i = oldA.length - 1; i >= 0; i -= 1) {
      tmpIdx = findIndex(newA, oldA[i].qInfo && oldA[i].qInfo.qId, i);

      if (tmpIdx === -1) {
        patches.push({
          op: 'remove',
          path: "".concat(basePath, "/").concat(i)
        });
        oldA.splice(i, 1);
      } else {
        patches = patches.concat(JSONPatch.generate(oldA[i], newA[tmpIdx], "".concat(basePath, "/").concat(i)));
      }
    }

    for (var _i = 0, l = newA.length; _i < l; _i += 1) {
      tmpIdx = findIndex(oldA, newA[_i].qInfo && newA[_i].qInfo.qId);

      if (tmpIdx === -1) {
        patches.push({
          op: 'add',
          path: "".concat(basePath, "/").concat(_i),
          value: newA[_i]
        });
        oldA.splice(_i, 0, newA[_i]);
      } else if (tmpIdx !== _i) {
        patches.push({
          op: 'move',
          path: "".concat(basePath, "/").concat(_i),
          from: "".concat(basePath, "/").concat(tmpIdx)
        });
        oldA.splice(_i, 0, oldA.splice(tmpIdx, 1)[0]);
      }
    }

    return patches;
  }
  /**
  * Generate an array of JSON-Patch:es following the JSON-Patch Specification Draft.
  *
  * See [specification draft](http://tools.ietf.org/html/draft-ietf-appsawg-json-patch-10)
  *
  * Does NOT currently generate patches for arrays (will replace them)
  * @private
  * @param {Object} original The object to patch to
  * @param {Object} newData The object to patch from
  * @param {String} [basePath] The base path to use when generating the paths for
  *                            the patches (normally not used)
  * @returns {Array} An array of patches
  */


  JSONPatch.generate = function generate(original, newData, basePath) {
    basePath = basePath || '';
    var patches = [];
    Object.keys(newData).forEach(function (key) {
      var val = generateValue(newData[key]);
      var oldVal = original[key];
      var tmpPath = "".concat(basePath, "/").concat(key);

      if (compare(val, oldVal) || isSpecialProperty(newData, key)) {
        return;
      }

      if (isUndef(oldVal)) {
        // property does not previously exist
        patches.push({
          op: 'add',
          path: tmpPath,
          value: val
        });
      } else if (isObject(val) && isObject(oldVal)) {
        // we need to generate sub-patches for this, since it already exist
        patches = patches.concat(JSONPatch.generate(oldVal, val, tmpPath));
      } else if (isArray$1(val) && isArray$1(oldVal)) {
        patches = patches.concat(patchArray(oldVal, val, tmpPath));
      } else {
        // it's a simple property (bool, string, number)
        patches.push({
          op: 'replace',
          path: "".concat(basePath, "/").concat(key),
          value: val
        });
      }
    });
    Object.keys(original).forEach(function (key) {
      if (isUndef(newData[key]) && !isSpecialProperty(original, key)) {
        // this property does not exist anymore
        patches.push({
          op: 'remove',
          path: "".concat(basePath, "/").concat(key)
        });
      }
    });
    return patches;
  };
  /**
  * Apply a list of patches to an object.
  * @private
  * @param {Object} original The object to patch
  * @param {Array} patches The list of patches to apply
  */


  JSONPatch.apply = function apply(original, patches) {
    patches.forEach(function (patch) {
      var parent = getParent(original, patch.path);
      var key = patch.path.split('/').splice(-1)[0];
      var target = key && isNaN(+key) ? parent[key] : parent[+key] || parent;
      var from = patch.from ? patch.from.split('/').splice(-1)[0] : null;

      if (patch.path === '/') {
        parent = null;
        target = original;
      }

      if (patch.op === 'add' || patch.op === 'replace') {
        if (isArray$1(parent)) {
          // trust indexes from patches, so don't replace the index if it's an add
          if (key === '-') {
            key = parent.length;
          }

          parent.splice(+key, patch.op === 'add' ? 0 : 1, patch.value);
        } else if (isArray$1(target) && isArray$1(patch.value)) {
          var _target;

          var newValues = patch.value.slice(); // keep array reference if possible...

          target.length = 0;

          (_target = target).push.apply(_target, _toConsumableArray(newValues));
        } else if (isObject(target) && isObject(patch.value)) {
          // keep object reference if possible...
          emptyObject(target);
          extend$1(target, patch.value);
        } else if (!parent) {
          throw createEnigmaError(errorCodes.PATCH_HAS_NO_PARENT, 'Patchee is not an object we can patch');
        } else {
          // simple value
          parent[key] = patch.value;
        }
      } else if (patch.op === 'move') {
        var oldParent = getParent(original, patch.from);

        if (isArray$1(parent)) {
          parent.splice(+key, 0, oldParent.splice(+from, 1)[0]);
        } else {
          parent[key] = oldParent[from];
          delete oldParent[from];
        }
      } else if (patch.op === 'remove') {
        if (isArray$1(parent)) {
          parent.splice(+key, 1);
        } else {
          delete parent[key];
        }
      }
    });
  };
  /**
  * Deep clone an object.
  * @private
  * @param {Object} obj The object to clone
  * @returns {Object} A new object identical to the `obj`
  */


  JSONPatch.clone = function clone(obj) {
    return extend$1({}, obj);
  };
  /**
  * Creates a JSON-patch.
  * @private
  * @param {String} op The operation of the patch. Available values: "add", "remove", "move"
  * @param {Object} [val] The value to set the `path` to. If `op` is `move`, `val`
  *                       is the "from JSON-path" path
  * @param {String} path The JSON-path for the property to change (e.g. "/qHyperCubeDef/columnOrder")
  * @returns {Object} A patch following the JSON-patch specification
  */


  JSONPatch.createPatch = function createPatch(op, val, path) {
    var patch = {
      op: op.toLowerCase(),
      path: path
    };

    if (patch.op === 'move') {
      patch.from = val;
    } else if (typeof val !== 'undefined') {
      patch.value = val;
    }

    return patch;
  };
  /**
  * Apply the differences of two objects (keeping references if possible).
  * Identical to running `JSONPatch.apply(original, JSONPatch.generate(original, newData));`
  * @private
  * @param {Object} original The object to update/patch
  * @param {Object} newData the object to diff against
  *
  * @example
  * var obj1 = { foo: [1,2,3], bar: { baz: true, qux: 1 } };
  * var obj2 = { foo: [4,5,6], bar: { baz: false } };
  * JSONPatch.updateObject(obj1, obj2);
  * // => { foo: [4,5,6], bar: { baz: false } };
  */


  JSONPatch.updateObject = function updateObject(original, newData) {
    if (!Object.keys(original).length) {
      extend$1(original, newData);
      return;
    }

    JSONPatch.apply(original, JSONPatch.generate(original, newData));
  };

  function _typeof$3(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }
  var sessions = {};
  /**
  * Function to make sure we release handle caches when they are closed.
  * @private
  * @param {Session} session The session instance to listen on.
  */

  var bindSession = function bindSession(session) {
    if (!sessions[session.id]) {
      var cache = {};
      sessions[session.id] = cache;
      session.on('traffic:received', function (data) {
        return data.close && data.close.forEach(function (handle) {
          return delete cache[handle];
        });
      });
      session.on('closed', function () {
        return delete sessions[session.id];
      });
    }
  };
  /**
  * Simple function that ensures the session events has been bound, and returns
  * either an existing key-value cache or creates one for the specified handle.
  * @private
  * @param {Session} session The session that owns the handle.
  * @param {Number} handle The object handle to retrieve the cache for.
  * @returns {KeyValueCache} The cache instance.
  */


  var getHandleCache = function getHandleCache(session, handle) {
    bindSession(session);
    var cache = sessions[session.id];

    if (!cache[handle]) {
      cache[handle] = new KeyValueCache();
    }

    return cache[handle];
  };
  /**
  * Function used to apply a list of patches and return the patched value.
  * @private
  * @param {Session} session The session.
  * @param {Number} handle The object handle.
  * @param {String} cacheId The cacheId.
  * @param {Array} patches The patches.
  * @returns {Object} Returns the patched value.
  */


  var patchValue = function patchValue(session, handle, cacheId, patches) {
    var cache = getHandleCache(session, handle);
    var entry = cache.get(cacheId);

    if (typeof entry === 'undefined') {
      entry = Array.isArray(patches[0].value) ? [] : {};
    }

    if (patches.length) {
      if (patches[0].path === '/' && _typeof$3(patches[0].value) !== 'object') {
        // 'plain' values on root path is not supported (no object reference),
        // so we simply store the value directly:
        entry = patches[0].value;
      } else {
        JSONPatch.apply(entry, patches);
      }

      cache.set(cacheId, entry);
    }

    return entry;
  };
  /**
  * Process delta interceptor.
  * @private
  * @param {Session} session The session the intercept is being executed on.
  * @param {Object} request The JSON-RPC request.
  * @param {Object} response The response.
  * @returns {Object} Returns the patched response
  */


  function deltaResponseInterceptor(session, request, response) {
    var delta = response.delta,
        result = response.result;

    if (delta) {
      // when delta is on the response data is expected to be an array of patches:
      Object.keys(result).forEach(function (key) {
        if (!Array.isArray(result[key])) {
          throw createEnigmaError(errorCodes.EXPECTED_ARRAY_OF_PATCHES, 'Unexpected RPC response, expected array of patches');
        }

        result[key] = patchValue(session, request.handle, "".concat(request.method, "-").concat(key), result[key]);
      }); // return a cloned response object to avoid patched object references:

      return JSON.parse(JSON.stringify(response));
    }

    return response;
  } // export object reference for testing purposes:

  deltaResponseInterceptor.sessions = sessions;

  /**
  * Process error interceptor.
  * @private
  * @param {Session} session - The session the intercept is being executed on.
  * @param {Object} request - The JSON-RPC request.
  * @param {Object} response - The response.
  * @returns {Object} - Returns the defined error for an error, else the response.
  */
  function errorResponseInterceptor(session, request, response) {
    if (typeof response.error !== 'undefined') {
      var data = response.error;
      var error = new Error(data.message);
      error.code = data.code;
      error.parameter = data.parameter;
      return session.config.Promise.reject(error);
    }

    return response;
  }

  var RETURN_KEY = 'qReturn';
  /**
  * Picks out the result "out" parameter based on the QIX method+schema, with
  * some specific handling for some methods that breaks the predictable protocol.
  * @private
  * @param {Session} session - The session the intercept is being executed on.
  * @param {Object} request - The JSON-RPC request.
  * @param {Object} response - The response.
  * @returns {Object} - Returns the result property on the response
  */

  function outParamResponseInterceptor(session, request, response) {
    if (request.method === 'CreateSessionApp' || request.method === 'CreateSessionAppFromApp') {
      // this method returns multiple out params that we need
      // to normalize before processing the response further:
      response[RETURN_KEY].qGenericId = response.qSessionAppId || response[RETURN_KEY].qGenericId;
    } else if (request.method === 'GetInteract') {
      // this method returns a qReturn value when it should only return
      // meta.outKey:
      delete response[RETURN_KEY];
    }

    if (hasOwnProperty.call(response, RETURN_KEY)) {
      return response[RETURN_KEY];
    }

    if (request.outKey !== -1) {
      return response[request.outKey];
    }

    return response;
  }

  /**
  * Process result interceptor.
  * @private
  * @param {Session} session - The session the intercept is being executed on.
  * @param {Object} request - The JSON-RPC request.
  * @param {Object} response - The response.
  * @returns {Object} - Returns the result property on the response
  */
  function resultResponseInterceptor(session, request, response) {
    return response.result;
  }

  function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _nonIterableSpread$1(); }

  function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray$1(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$6(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$6(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$6(Constructor.prototype, protoProps); if (staticProps) _defineProperties$6(Constructor, staticProps); return Constructor; }
  /**
   * Interceptors is a concept similar to mixins, but run on a lower level. The interceptor concept
   * can augment either the requests (i.e. before sent to QIX Engine), or the responses (i.e. after
   * QIX Engine has sent a response). The interceptor promises runs in parallel to the regular
   * promises used in enigma.js, which means that it can be really useful when you want to normalize
   * behaviors in your application.
   * @interface Interceptor
   */

  /**
    * @class InterceptorRequest
    * @implements {Interceptor}
    */

  /**
   * @class InterceptorResponse
   * @implements {Interceptor}
   */

  /**
   * This method is invoked when a request is about to be sent to QIX Engine.
   * @function InterceptorRequest#onFulfilled
   * @param {Session} session The session executing the interceptor.
   * @param {Object} request The JSON-RPC request that will be sent.
   */

  /**
   * This method is invoked when a previous interceptor has rejected the
   * promise, use this to handle for example errors before they are sent into mixins.
   * @function InterceptorResponse#onRejected
   * @param {Session} session The session executing the interceptor. You may use .retry() to retry
   * sending it to QIX Engine.
   * @param {Object} request The JSON-RPC request resulting in this error.
   * @param {Object} error Whatever the previous interceptor is rejected with.
   */

  /**
   * This method is invoked when a promise has been successfully resolved,
   * use this to modify the result or reject the promise chain before it is sent
   * to mixins.
   * @function InterceptorResponse#onFulfilled
   * @param {Session} session The session executing the interceptor.
   * @param {Object} request The JSON-RPC request resulting in this response.
   * @param {Object} result Whatever the previous interceptor is resolved with.
   */

  var Intercept =
  /*#__PURE__*/
  function () {
    /**
    * Create a new Intercept instance.
    * @private
    * @param {Object} options The configuration options for this class.
    * @param {Promise<Object>} options.Promise The promise constructor to use.
    * @param {ApiCache} options.apis The ApiCache instance to use.
    * @param {Array<Object>} [options.request] The additional request interceptors to use.
    * @param {Array<Object>} [options.response] The additional response interceptors to use.
    */
    function Intercept(options) {
      _classCallCheck$7(this, Intercept);

      Object.assign(this, options);
      this.request = [{
        onFulfilled: deltaRequestInterceptor
      }].concat(_toConsumableArray$1(this.request || []));
      this.response = [{
        onFulfilled: errorResponseInterceptor
      }, {
        onFulfilled: deltaResponseInterceptor
      }, {
        onFulfilled: resultResponseInterceptor
      }, {
        onFulfilled: outParamResponseInterceptor
      }].concat(_toConsumableArray$1(this.response || []), [{
        onFulfilled: apiResponseInterceptor
      }]);
    }
    /**
    * Execute the request interceptor queue, each interceptor will get the result from
    * the previous interceptor.
    * @private
    * @param {Session} session The session instance to execute against.
    * @param {Promise<Object>} promise The promise to chain on to.
    * @returns {Promise<Object>}
    */


    _createClass$6(Intercept, [{
      key: "executeRequests",
      value: function executeRequests(session, promise) {
        var _this = this;

        return this.request.reduce(function (interception, interceptor) {
          var intercept = interceptor.onFulfilled && interceptor.onFulfilled.bind(_this, session);
          return interception.then(intercept);
        }, promise);
      }
      /**
      * Execute the response interceptor queue, each interceptor will get the result from
      * the previous interceptor.
      * @private
      * @param {Session} session The session instance to execute against.
      * @param {Promise<Object>} promise The promise to chain on to.
      * @param {Object} request The JSONRPC request object for the intercepted response.
      * @returns {Promise<Object>}
      */

    }, {
      key: "executeResponses",
      value: function executeResponses(session, promise, request) {
        var _this2 = this;

        return this.response.reduce(function (interception, interceptor) {
          return interception.then(interceptor.onFulfilled && interceptor.onFulfilled.bind(_this2, session, request), interceptor.onRejected && interceptor.onRejected.bind(_this2, session, request));
        }, promise);
      }
    }]);

    return Intercept;
  }();

  function _typeof$4(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

  function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$7(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$7(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$7(Constructor.prototype, protoProps); if (staticProps) _defineProperties$7(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$4(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized$1(self); }

  function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf$1(object); if (object === null) break; } return object; }

  function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

  function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

  function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }
  /**
  * API cache for instances of QIX types, e.g. GenericObject.
  * @private
  * @extends KeyValueCache
  */

  var ApiCache =
  /*#__PURE__*/
  function (_KeyValueCache) {
    _inherits$1(ApiCache, _KeyValueCache);

    function ApiCache() {
      _classCallCheck$8(this, ApiCache);

      return _possibleConstructorReturn$1(this, _getPrototypeOf$1(ApiCache).apply(this, arguments));
    }

    _createClass$7(ApiCache, [{
      key: "add",

      /**
      * Adds an API.
      * @private
      * @function ApiCache#add
      * @param {Number} handle - The handle for the API.
      * @param {*} api - The API.
      * @returns {{api: *}} The entry.
      */
      value: function add(handle, api) {
        var _this = this;

        var entry = {
          api: api
        };

        _get(_getPrototypeOf$1(ApiCache.prototype), "add", this).call(this, handle.toString(), entry);

        api.on('closed', function () {
          return _this.remove(handle);
        });
        return entry;
      }
      /**
      * Gets an API.
      * @private
      * @function ApiCache#getApi
      * @param {Number} handle - The handle for the API.
      * @returns {*} The API for the handle.
      */

    }, {
      key: "getApi",
      value: function getApi(handle) {
        var entry = typeof handle !== 'undefined' ? this.get(handle.toString()) : undefined;
        return entry && entry.api;
      }
      /**
      * Gets a list of APIs.
      * @private
      * @function ApiCache#getApis
      * @returns {Array} The list of entries including `handle` and `api` properties for each entry.
      */

    }, {
      key: "getApis",
      value: function getApis() {
        return _get(_getPrototypeOf$1(ApiCache.prototype), "getAll", this).call(this).map(function (entry) {
          return {
            handle: entry.key,
            api: entry.value.api
          };
        });
      }
      /**
      * Gets a list of APIs with a given type.
      * @private
      * @function ApiCache#getApisByType
      * @param {String} type - The type of APIs to get.
      * @returns {Array} The list of entries including `handle` and `api` properties for each entry.
      */

    }, {
      key: "getApisByType",
      value: function getApisByType(type) {
        return this.getApis().filter(function (entry) {
          return entry.api.type === type;
        });
      }
    }]);

    return ApiCache;
  }(KeyValueCache);

  function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$8(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$8(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$8(Constructor.prototype, protoProps); if (staticProps) _defineProperties$8(Constructor, staticProps); return Constructor; }
  /**
   * The enigma.js configuration object.
   * @interface Configuration
   * @property {Object} schema Object containing the specification for the API to generate.
   * Corresponds to a specific version of the QIX Engine API.
   * @property {String} url String containing a proper websocker URL to QIX Engine.
   * @property {Function} [createSocket] A function to use when instantiating the WebSocket,
   * mandatory for Node.js.
   * @property {Object} [Promise] ES6-compatible Promise library.
   * @property {Boolean} [suspendOnClose=false] Set to true if the session should be suspended
   * instead of closed when the websocket is closed.
   * @property {Array<Mixin>} [mixins=[]] Mixins to extend/augment the QIX Engine API. Mixins
   * are applied in the array order.
   * @property {Array} [requestInterceptors=[]] Interceptors for augmenting requests before they
   * are sent to QIX Engine. Interceptors are applied in the array order.
   * @property {Array} [responseInterceptors=[]] Interceptors for augmenting responses before they
   * are passed into mixins and end-users. Interceptors are applied in the array order.
   * @property {Object} [protocol={}] An object containing additional JSON-RPC request parameters.
   * @property {Boolean} [protocol.delta=true] Set to false to disable the use of the
   * bandwidth-reducing delta protocol.
   */

  /**
   * Mixin object to extend/augment the QIX Engine API
   * @interface Mixin
   * @property {String|Array<String>} types String or array of strings containing the API-types that
   * will be mixed in.
   * @property {Object} [extend] Object literal containing the methods that will be extended on the
   * specified API.
   * @property {Object} [override] Object literal containing the methods to override existing methods.
   * @property {Function} [init] Init function that, if defined, will run when an API is instantiated.
   * It runs with Promise and API object as parameters
   */

  /**
   * The API for generated APIs depends on the QIX Engine schema you pass into your Configuration,
   * and on what QIX struct the API has.
   * @interface API
   * @property {String} id Contains the unique identifier for this API.
   * @property {String} type Contains the schema class name for this API.
   * @property {String} genericType Corresponds to the qInfo.qType property on the generic object's
   * properties object.
   * @property {Session} session Contains a reference to the session that this API belongs to.
   * @property {Number} handle Contains the handle QIX Engine assigned to the API. Used interally in
   * enigma.js for caches and JSON-RPC requests.
   */

  /**
   * Handle changes on the API. The changed event is triggered whenever enigma.js or QIX Engine has
   * identified potential changes on the underlying properties or hypercubes and you should re-fetch
   * your data.
   * @event API#changed
   * @type {Object}
   */

  /**
   * Handle closed API. The closed event is triggered whenever QIX Engine considers an API closed.
   * It usually means that it no longer exist in the QIX Engine document or session.
   * @event API#closed
   * @type {Object}
   */

  /**
   * Handle JSON-RPC requests/responses for this API. Generally used in debugging purposes.
   * traffic:* will handle all websocket messages, traffic:sent will handle outgoing messages
   * and traffic:received will handle incoming messages.
   * @event API#traffic
   * @type {Object}
   */

  /**
  * Qix service.
  */

  var Qix =
  /*#__PURE__*/
  function () {
    function Qix() {
      _classCallCheck$9(this, Qix);
    }

    _createClass$8(Qix, null, [{
      key: "getSession",

      /**
      * Function used to get a session.
      * @private
      * @param {Configuration} config The configuration object for this session.
      * @returns {Session} Returns a session instance.
      */
      value: function getSession(config) {
        var createSocket = config.createSocket,
            Promise = config.Promise,
            requestInterceptors = config.requestInterceptors,
            responseInterceptors = config.responseInterceptors,
            url = config.url;
        var apis = new ApiCache();
        var intercept = new Intercept({
          apis: apis,
          Promise: Promise,
          request: requestInterceptors,
          response: responseInterceptors
        });
        var rpc = new RPC({
          createSocket: createSocket,
          Promise: Promise,
          url: url
        });
        var suspendResume = new SuspendResume({
          apis: apis,
          Promise: Promise,
          rpc: rpc
        });
        var session = new Session({
          apis: apis,
          config: config,
          intercept: intercept,
          rpc: rpc,
          suspendResume: suspendResume
        });
        return session;
      }
      /**
      * Function used to create a QIX session.
      * @param {Configuration} config The configuration object for the QIX session.
      * @returns {Session} Returns a new QIX session.
      */

    }, {
      key: "create",
      value: function create(config) {
        Qix.configureDefaults(config);
        config.mixins.forEach(function (mixin) {
          config.definition.registerMixin(mixin);
        });
        return Qix.getSession(config);
      }
      /**
      * Function used to configure defaults.
      * @private
      * @param {Configuration} config The configuration object for how to connect
      *                               and retrieve end QIX APIs.
      */

    }, {
      key: "configureDefaults",
      value: function configureDefaults(config) {
        if (!config) {
          throw createEnigmaError(errorCodes.NO_CONFIG_SUPPLIED, 'You need to supply a configuration.');
        } // eslint-disable-next-line no-restricted-globals


        if (!config.Promise && typeof Promise === 'undefined') {
          throw createEnigmaError(errorCodes.PROMISE_REQUIRED, 'Your environment has no Promise implementation. You must provide a Promise implementation in the config.');
        }

        if (typeof config.createSocket !== 'function' && typeof WebSocket === 'function') {
          // eslint-disable-next-line no-undef
          config.createSocket = function (url) {
            return new WebSocket(url);
          };
        }

        if (typeof config.suspendOnClose === 'undefined') {
          config.suspendOnClose = false;
        }

        config.protocol = config.protocol || {};
        config.protocol.delta = typeof config.protocol.delta !== 'undefined' ? config.protocol.delta : true; // eslint-disable-next-line no-restricted-globals

        config.Promise = config.Promise || Promise;
        config.mixins = config.mixins || [];
        config.definition = config.definition || new Schema(config);
      }
    }]);

    return Qix;
  }();

  return Qix;

})));
//# sourceMappingURL=enigma.js.map


/***/ }),

/***/ "./node_modules/enigma.js/schemas/12.20.0.json":
/*!*****************************************************!*\
  !*** ./node_modules/enigma.js/schemas/12.20.0.json ***!
  \*****************************************************/
/*! exports provided: structs, enums, version, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"structs\":{\"Field\":{\"GetCardinal\":{\"In\":[],\"Out\":[]},\"GetAndMode\":{\"In\":[],\"Out\":[]},\"SelectValues\":{\"In\":[{\"Name\":\"qFieldValues\",\"DefaultValue\":[{\"qText\":\"\",\"qIsNumeric\":false,\"qNumber\":0}]},{\"Name\":\"qToggleMode\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"Select\":{\"In\":[{\"Name\":\"qMatch\",\"DefaultValue\":\"\"},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qExcludedValuesMode\",\"DefaultValue\":0,\"Optional\":true}],\"Out\":[]},\"ToggleSelect\":{\"In\":[{\"Name\":\"qMatch\",\"DefaultValue\":\"\"},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qExcludedValuesMode\",\"DefaultValue\":0,\"Optional\":true}],\"Out\":[]},\"ClearAllButThis\":{\"In\":[{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"SelectPossible\":{\"In\":[{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"SelectExcluded\":{\"In\":[{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"SelectAll\":{\"In\":[{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"Lock\":{\"In\":[],\"Out\":[]},\"Unlock\":{\"In\":[],\"Out\":[]},\"GetNxProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProperties\"}]},\"SetNxProperties\":{\"In\":[{\"Name\":\"qProperties\",\"DefaultValue\":{\"qOneAndOnlyOne\":false}}],\"Out\":[]},\"SetAndMode\":{\"In\":[{\"Name\":\"qAndMode\",\"DefaultValue\":false}],\"Out\":[]},\"SelectAlternative\":{\"In\":[{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"LowLevelSelect\":{\"In\":[{\"Name\":\"qValues\",\"DefaultValue\":[0]},{\"Name\":\"qToggleMode\",\"DefaultValue\":false},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"Clear\":{\"In\":[],\"Out\":[]}},\"Variable\":{\"GetContent\":{\"In\":[],\"Out\":[{\"Name\":\"qContent\"}]},\"GetRawContent\":{\"In\":[],\"Out\":[]},\"SetContent\":{\"In\":[{\"Name\":\"qContent\",\"DefaultValue\":\"\"},{\"Name\":\"qUpdateMRU\",\"DefaultValue\":false}],\"Out\":[]},\"ForceContent\":{\"In\":[{\"Name\":\"qs\",\"DefaultValue\":\"\"},{\"Name\":\"qd\",\"DefaultValue\":0}],\"Out\":[]},\"GetNxProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProperties\"}]},\"SetNxProperties\":{\"In\":[{\"Name\":\"qProperties\",\"DefaultValue\":{\"qName\":\"\",\"qNumberPresentation\":{\"qType\":0,\"qnDec\":0,\"qUseThou\":0,\"qFmt\":\"\",\"qDec\":\"\",\"qThou\":\"\"},\"qIncludeInBookmark\":false,\"qUsePredefListedValues\":false,\"qPreDefinedList\":[\"\"]}}],\"Out\":[]}},\"GenericObject\":{\"GetLayout\":{\"In\":[],\"Out\":[{\"Name\":\"qLayout\"}]},\"GetListObjectData\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qPages\",\"DefaultValue\":[{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0}]}],\"Out\":[{\"Name\":\"qDataPages\"}]},\"GetHyperCubeData\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qPages\",\"DefaultValue\":[{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0}]}],\"Out\":[{\"Name\":\"qDataPages\"}]},\"GetHyperCubeReducedData\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qPages\",\"DefaultValue\":[{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0}]},{\"Name\":\"qZoomFactor\",\"DefaultValue\":0},{\"Name\":\"qReductionMode\",\"DefaultValue\":0}],\"Out\":[{\"Name\":\"qDataPages\"}]},\"GetHyperCubePivotData\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qPages\",\"DefaultValue\":[{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0}]}],\"Out\":[{\"Name\":\"qDataPages\"}]},\"GetHyperCubeStackData\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qPages\",\"DefaultValue\":[{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0}]},{\"Name\":\"qMaxNbrCells\",\"DefaultValue\":0,\"Optional\":true}],\"Out\":[{\"Name\":\"qDataPages\"}]},\"GetHyperCubeContinuousData\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qOptions\",\"DefaultValue\":{\"qStart\":0,\"qEnd\":0,\"qNbrPoints\":0,\"qMaxNbrTicks\":0,\"qMaxNumberLines\":0}},{\"Name\":\"qReverseSort\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qDataPages\"},{\"Name\":\"qAxisData\"}]},\"GetHyperCubeBinnedData\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qPages\",\"DefaultValue\":[{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0}]},{\"Name\":\"qViewport\",\"DefaultValue\":{\"qWidth\":0,\"qHeight\":0,\"qZoomLevel\":0}},{\"Name\":\"qDataRanges\",\"DefaultValue\":[{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0}]},{\"Name\":\"qMaxNbrCells\",\"DefaultValue\":0},{\"Name\":\"qQueryLevel\",\"DefaultValue\":0},{\"Name\":\"qBinningMethod\",\"DefaultValue\":0}],\"Out\":[{\"Name\":\"qDataPages\"}]},\"ApplyPatches\":{\"In\":[{\"Name\":\"qPatches\",\"DefaultValue\":[{\"qOp\":0,\"qPath\":\"\",\"qValue\":\"\"}]},{\"Name\":\"qSoftPatch\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"ClearSoftPatches\":{\"In\":[],\"Out\":[]},\"SetProperties\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qExtendsId\":\"\",\"qMetaDef\":{}}}],\"Out\":[]},\"GetProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProp\"}]},\"GetEffectiveProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProp\"}]},\"SetFullPropertyTree\":{\"In\":[{\"Name\":\"qPropEntry\",\"DefaultValue\":{\"qProperty\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qExtendsId\":\"\",\"qMetaDef\":{}},\"qChildren\":[],\"qEmbeddedSnapshotRef\":null}}],\"Out\":[]},\"GetFullPropertyTree\":{\"In\":[],\"Out\":[{\"Name\":\"qPropEntry\"}]},\"GetInfo\":{\"In\":[],\"Out\":[{\"Name\":\"qInfo\"}]},\"ClearSelections\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qColIndices\",\"DefaultValue\":[0],\"Optional\":true}],\"Out\":[]},\"ExportData\":{\"In\":[{\"Name\":\"qFileType\",\"DefaultValue\":0},{\"Name\":\"qPath\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qFileName\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qExportState\",\"DefaultValue\":0,\"Optional\":true}],\"Out\":[{\"Name\":\"qUrl\"},{\"Name\":\"qWarnings\"}]},\"SelectListObjectValues\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qValues\",\"DefaultValue\":[0]},{\"Name\":\"qToggleMode\",\"DefaultValue\":false},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SelectListObjectPossible\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SelectListObjectExcluded\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SelectListObjectAlternative\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SelectListObjectAll\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SelectListObjectContinuousRange\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRanges\",\"DefaultValue\":[{\"qMin\":0,\"qMax\":0,\"qMinInclEq\":false,\"qMaxInclEq\":false}]},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SearchListObjectFor\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qMatch\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"AbortListObjectSearch\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"}],\"Out\":[]},\"AcceptListObjectSearch\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qToggleMode\",\"DefaultValue\":false},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"ExpandLeft\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRow\",\"DefaultValue\":0},{\"Name\":\"qCol\",\"DefaultValue\":0},{\"Name\":\"qAll\",\"DefaultValue\":false}],\"Out\":[]},\"ExpandTop\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRow\",\"DefaultValue\":0},{\"Name\":\"qCol\",\"DefaultValue\":0},{\"Name\":\"qAll\",\"DefaultValue\":false}],\"Out\":[]},\"CollapseLeft\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRow\",\"DefaultValue\":0},{\"Name\":\"qCol\",\"DefaultValue\":0},{\"Name\":\"qAll\",\"DefaultValue\":false}],\"Out\":[]},\"CollapseTop\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRow\",\"DefaultValue\":0},{\"Name\":\"qCol\",\"DefaultValue\":0},{\"Name\":\"qAll\",\"DefaultValue\":false}],\"Out\":[]},\"DrillUp\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qDimNo\",\"DefaultValue\":0},{\"Name\":\"qNbrSteps\",\"DefaultValue\":0}],\"Out\":[]},\"Lock\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qColIndices\",\"DefaultValue\":[0],\"Optional\":true}],\"Out\":[]},\"Unlock\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qColIndices\",\"DefaultValue\":[0],\"Optional\":true}],\"Out\":[]},\"SelectHyperCubeValues\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qDimNo\",\"DefaultValue\":0},{\"Name\":\"qValues\",\"DefaultValue\":[0]},{\"Name\":\"qToggleMode\",\"DefaultValue\":false}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SelectHyperCubeCells\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRowIndices\",\"DefaultValue\":[0]},{\"Name\":\"qColIndices\",\"DefaultValue\":[0]},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qDeselectOnlyOneSelected\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SelectPivotCells\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qSelections\",\"DefaultValue\":[{\"qType\":0,\"qCol\":0,\"qRow\":0}]},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qDeselectOnlyOneSelected\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"RangeSelectHyperCubeValues\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRanges\",\"DefaultValue\":[{\"qRange\":{\"qMin\":0,\"qMax\":0,\"qMinInclEq\":false,\"qMaxInclEq\":false},\"qMeasureIx\":0}]},{\"Name\":\"qColumnsToSelect\",\"DefaultValue\":[0],\"Optional\":true},{\"Name\":\"qOrMode\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qDeselectOnlyOneSelected\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"MultiRangeSelectHyperCubeValues\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRanges\",\"DefaultValue\":[{\"qRanges\":[{\"qRange\":{\"qMin\":0,\"qMax\":0,\"qMinInclEq\":false,\"qMaxInclEq\":false},\"qMeasureIx\":0}],\"qColumnsToSelect\":[0]}]},{\"Name\":\"qOrMode\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qDeselectOnlyOneSelected\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"SelectHyperCubeContinuousRange\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"},{\"Name\":\"qRanges\",\"DefaultValue\":[{\"qRange\":{\"qMin\":0,\"qMax\":0,\"qMinInclEq\":false,\"qMaxInclEq\":false},\"qDimIx\":0}]},{\"Name\":\"qSoftLock\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"GetChild\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"GetChildInfos\":{\"In\":[],\"Out\":[{\"Name\":\"qInfos\"}]},\"CreateChild\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qExtendsId\":\"\",\"qMetaDef\":{}}},{\"Name\":\"qPropForThis\",\"DefaultValue\":null,\"Optional\":true}],\"Out\":[{\"Name\":\"qInfo\"}]},\"DestroyChild\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"},{\"Name\":\"qPropForThis\",\"DefaultValue\":null,\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"DestroyAllChildren\":{\"In\":[{\"Name\":\"qPropForThis\",\"DefaultValue\":null,\"Optional\":true}],\"Out\":[]},\"SetChildArrayOrder\":{\"In\":[{\"Name\":\"qIds\",\"DefaultValue\":[\"\"]}],\"Out\":[]},\"GetLinkedObjects\":{\"In\":[],\"Out\":[{\"Name\":\"qItems\"}]},\"CopyFrom\":{\"In\":[{\"Name\":\"qFromId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"BeginSelections\":{\"In\":[{\"Name\":\"qPaths\",\"DefaultValue\":[\"\"]}],\"Out\":[]},\"EndSelections\":{\"In\":[{\"Name\":\"qAccept\",\"DefaultValue\":false}],\"Out\":[]},\"ResetMadeSelections\":{\"In\":[],\"Out\":[]},\"EmbedSnapshotObject\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"GetSnapshotObject\":{\"In\":[],\"Out\":[]},\"Publish\":{\"In\":[],\"Out\":[]},\"UnPublish\":{\"In\":[],\"Out\":[]}},\"GenericDimension\":{\"GetLayout\":{\"In\":[],\"Out\":[{\"Name\":\"qLayout\"}]},\"ApplyPatches\":{\"In\":[{\"Name\":\"qPatches\",\"DefaultValue\":[{\"qOp\":0,\"qPath\":\"\",\"qValue\":\"\"}]}],\"Out\":[]},\"SetProperties\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qDim\":{\"qGrouping\":0,\"qFieldDefs\":[\"\"],\"qFieldLabels\":[\"\"],\"qLabelExpression\":\"\"},\"qMetaDef\":{}}}],\"Out\":[]},\"GetProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProp\"}]},\"GetInfo\":{\"In\":[],\"Out\":[{\"Name\":\"qInfo\"}]},\"GetDimension\":{\"In\":[],\"Out\":[{\"Name\":\"qDim\"}]},\"GetLinkedObjects\":{\"In\":[],\"Out\":[{\"Name\":\"qItems\"}]},\"Publish\":{\"In\":[],\"Out\":[]},\"UnPublish\":{\"In\":[],\"Out\":[]}},\"GenericBookmark\":{\"GetFieldValues\":{\"In\":[{\"Name\":\"qField\",\"DefaultValue\":\"\"},{\"Name\":\"qGetExcludedValues\",\"DefaultValue\":false},{\"Name\":\"qDataPage\",\"DefaultValue\":{\"qStartIndex\":0,\"qEndIndex\":0}}],\"Out\":[{\"Name\":\"qFieldValues\"}]},\"GetLayout\":{\"In\":[],\"Out\":[{\"Name\":\"qLayout\"}]},\"ApplyPatches\":{\"In\":[{\"Name\":\"qPatches\",\"DefaultValue\":[{\"qOp\":0,\"qPath\":\"\",\"qValue\":\"\"}]}],\"Out\":[]},\"SetProperties\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qMetaDef\":{}}}],\"Out\":[]},\"GetProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProp\"}]},\"GetInfo\":{\"In\":[],\"Out\":[{\"Name\":\"qInfo\"}]},\"Apply\":{\"In\":[],\"Out\":[{\"Name\":\"qSuccess\"}]},\"Publish\":{\"In\":[],\"Out\":[]},\"UnPublish\":{\"In\":[],\"Out\":[]}},\"GenericVariable\":{\"GetLayout\":{\"In\":[],\"Out\":[{\"Name\":\"qLayout\"}]},\"ApplyPatches\":{\"In\":[{\"Name\":\"qPatches\",\"DefaultValue\":[{\"qOp\":0,\"qPath\":\"\",\"qValue\":\"\"}]}],\"Out\":[]},\"SetProperties\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qMetaDef\":{},\"qName\":\"\",\"qComment\":\"\",\"qNumberPresentation\":{\"qType\":0,\"qnDec\":0,\"qUseThou\":0,\"qFmt\":\"\",\"qDec\":\"\",\"qThou\":\"\"},\"qIncludeInBookmark\":false,\"qDefinition\":\"\"}}],\"Out\":[]},\"GetProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProp\"}]},\"GetInfo\":{\"In\":[],\"Out\":[{\"Name\":\"qInfo\"}]},\"SetStringValue\":{\"In\":[{\"Name\":\"qVal\",\"DefaultValue\":\"\"}],\"Out\":[]},\"SetNumValue\":{\"In\":[{\"Name\":\"qVal\",\"DefaultValue\":0}],\"Out\":[]},\"SetDualValue\":{\"In\":[{\"Name\":\"qText\",\"DefaultValue\":\"\"},{\"Name\":\"qNum\",\"DefaultValue\":0}],\"Out\":[]}},\"GenericMeasure\":{\"GetLayout\":{\"In\":[],\"Out\":[{\"Name\":\"qLayout\"}]},\"ApplyPatches\":{\"In\":[{\"Name\":\"qPatches\",\"DefaultValue\":[{\"qOp\":0,\"qPath\":\"\",\"qValue\":\"\"}]}],\"Out\":[]},\"SetProperties\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qMeasure\":{\"qLabel\":\"\",\"qDef\":\"\",\"qGrouping\":0,\"qExpressions\":[\"\"],\"qActiveExpression\":0,\"qLabelExpression\":\"\"},\"qMetaDef\":{}}}],\"Out\":[]},\"GetProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProp\"}]},\"GetInfo\":{\"In\":[],\"Out\":[{\"Name\":\"qInfo\"}]},\"GetMeasure\":{\"In\":[],\"Out\":[{\"Name\":\"qMeasure\"}]},\"GetLinkedObjects\":{\"In\":[],\"Out\":[{\"Name\":\"qItems\"}]},\"Publish\":{\"In\":[],\"Out\":[]},\"UnPublish\":{\"In\":[],\"Out\":[]}},\"GenericDerivedFields\":{\"SetProperties\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qDerivedDefinitionId\":\"\",\"qFieldName\":[\"\"],\"qMetaDef\":{}}}],\"Out\":[]},\"GetProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProp\"}]},\"GetInfo\":{\"In\":[],\"Out\":[{\"Name\":\"qInfo\"}]},\"GetDerivedFieldData\":{\"In\":[],\"Out\":[{\"Name\":\"qData\"}]},\"GetDerivedField\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qFields\"}]},\"GetListData\":{\"In\":[],\"Out\":[{\"Name\":\"qListData\"}]},\"GetDerivedFields\":{\"In\":[],\"Out\":[{\"Name\":\"qFields\"}]},\"GetDerivedGroups\":{\"In\":[],\"Out\":[{\"Name\":\"qGroups\"}]}},\"Doc\":{\"GetField\":{\"In\":[{\"Name\":\"qFieldName\",\"DefaultValue\":\"\"},{\"Name\":\"qStateName\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[]},\"GetFieldDescription\":{\"In\":[{\"Name\":\"qFieldName\",\"DefaultValue\":\"\"}],\"Out\":[]},\"GetVariable\":{\"In\":[{\"Name\":\"qName\",\"DefaultValue\":\"\"}],\"Out\":[]},\"GetLooselyCoupledVector\":{\"In\":[],\"Out\":[{\"Name\":\"qv\"}]},\"SetLooselyCoupledVector\":{\"In\":[{\"Name\":\"qv\",\"DefaultValue\":[0]}],\"Out\":[]},\"Evaluate\":{\"In\":[{\"Name\":\"qExpression\",\"DefaultValue\":\"\"}],\"Out\":[]},\"EvaluateEx\":{\"In\":[{\"Name\":\"qExpression\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qValue\"}]},\"ClearAll\":{\"In\":[{\"Name\":\"qLockedAlso\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qStateName\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[]},\"LockAll\":{\"In\":[{\"Name\":\"qStateName\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[]},\"UnlockAll\":{\"In\":[{\"Name\":\"qStateName\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[]},\"Back\":{\"In\":[],\"Out\":[]},\"Forward\":{\"In\":[],\"Out\":[]},\"CreateVariable\":{\"In\":[{\"Name\":\"qName\",\"DefaultValue\":\"\"}],\"Out\":[]},\"RemoveVariable\":{\"In\":[{\"Name\":\"qName\",\"DefaultValue\":\"\"}],\"Out\":[]},\"GetLocaleInfo\":{\"In\":[],\"Out\":[]},\"GetTablesAndKeys\":{\"In\":[{\"Name\":\"qWindowSize\",\"DefaultValue\":{\"qcx\":0,\"qcy\":0}},{\"Name\":\"qNullSize\",\"DefaultValue\":{\"qcx\":0,\"qcy\":0}},{\"Name\":\"qCellHeight\",\"DefaultValue\":0},{\"Name\":\"qSyntheticMode\",\"DefaultValue\":false},{\"Name\":\"qIncludeSysVars\",\"DefaultValue\":false}],\"Out\":[{\"Name\":\"qtr\"},{\"Name\":\"qk\"}]},\"GetViewDlgSaveInfo\":{\"In\":[],\"Out\":[]},\"SetViewDlgSaveInfo\":{\"In\":[{\"Name\":\"qInfo\",\"DefaultValue\":{\"qPos\":{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0},\"qCtlInfo\":{\"qInternalView\":{\"qTables\":[{\"qPos\":{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0},\"qCaption\":\"\"}],\"qBroomPoints\":[{\"qPos\":{\"qx\":0,\"qy\":0},\"qTable\":\"\",\"qFields\":[\"\"]}],\"qConnectionPoints\":[{\"qPos\":{\"qx\":0,\"qy\":0},\"qFields\":[\"\"]}],\"qZoomFactor\":0},\"qSourceView\":{\"qTables\":[{\"qPos\":{\"qLeft\":0,\"qTop\":0,\"qWidth\":0,\"qHeight\":0},\"qCaption\":\"\"}],\"qBroomPoints\":[{\"qPos\":{\"qx\":0,\"qy\":0},\"qTable\":\"\",\"qFields\":[\"\"]}],\"qConnectionPoints\":[{\"qPos\":{\"qx\":0,\"qy\":0},\"qFields\":[\"\"]}],\"qZoomFactor\":0}},\"qMode\":0}}],\"Out\":[]},\"GetEmptyScript\":{\"In\":[{\"Name\":\"qLocalizedMainSection\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[]},\"DoReload\":{\"In\":[{\"Name\":\"qMode\",\"DefaultValue\":0,\"Optional\":true},{\"Name\":\"qPartial\",\"DefaultValue\":false,\"Optional\":true},{\"Name\":\"qDebug\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"GetScriptBreakpoints\":{\"In\":[],\"Out\":[{\"Name\":\"qBreakpoints\"}]},\"SetScriptBreakpoints\":{\"In\":[{\"Name\":\"qBreakpoints\",\"DefaultValue\":[{\"qbufferName\":\"\",\"qlineIx\":0,\"qEnabled\":false}]}],\"Out\":[]},\"GetScript\":{\"In\":[],\"Out\":[{\"Name\":\"qScript\"}]},\"GetTextMacros\":{\"In\":[],\"Out\":[{\"Name\":\"qMacros\"}]},\"SetFetchLimit\":{\"In\":[{\"Name\":\"qLimit\",\"DefaultValue\":0}],\"Out\":[]},\"DoSave\":{\"In\":[{\"Name\":\"qFileName\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[]},\"GetTableData\":{\"In\":[{\"Name\":\"qOffset\",\"DefaultValue\":0},{\"Name\":\"qRows\",\"DefaultValue\":0},{\"Name\":\"qSyntheticMode\",\"DefaultValue\":false},{\"Name\":\"qTableName\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qData\"}]},\"GetAppLayout\":{\"In\":[],\"Out\":[{\"Name\":\"qLayout\"}]},\"SetAppProperties\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qTitle\":\"\",\"qLastReloadTime\":\"\",\"qMigrationHash\":\"\",\"qSavedInProductVersion\":\"\",\"qThumbnail\":{\"qUrl\":\"\"}}}],\"Out\":[]},\"GetAppProperties\":{\"In\":[],\"Out\":[{\"Name\":\"qProp\"}]},\"GetLineage\":{\"In\":[],\"Out\":[{\"Name\":\"qLineage\"}]},\"CreateSessionObject\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qExtendsId\":\"\",\"qMetaDef\":{}}}],\"Out\":[]},\"DestroySessionObject\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"CreateObject\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qExtendsId\":\"\",\"qMetaDef\":{}}}],\"Out\":[{\"Name\":\"qInfo\"}]},\"DestroyObject\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"GetObject\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"GetObjects\":{\"In\":[{\"Name\":\"qOptions\",\"DefaultValue\":{\"qTypes\":[\"\"],\"qIncludeSessionObjects\":false,\"qData\":{}}}],\"Out\":[{\"Name\":\"qList\"}]},\"GetBookmarks\":{\"In\":[{\"Name\":\"qOptions\",\"DefaultValue\":{\"qTypes\":[\"\"],\"qData\":{}}}],\"Out\":[{\"Name\":\"qList\"}]},\"CloneObject\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qCloneId\"}]},\"CreateDraft\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qDraftId\"}]},\"CommitDraft\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"DestroyDraft\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"},{\"Name\":\"qSourceId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"Undo\":{\"In\":[],\"Out\":[{\"Name\":\"qSuccess\"}]},\"Redo\":{\"In\":[],\"Out\":[{\"Name\":\"qSuccess\"}]},\"ClearUndoBuffer\":{\"In\":[],\"Out\":[]},\"CreateDimension\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qDim\":{\"qGrouping\":0,\"qFieldDefs\":[\"\"],\"qFieldLabels\":[\"\"],\"qLabelExpression\":\"\"},\"qMetaDef\":{}}}],\"Out\":[{\"Name\":\"qInfo\"}]},\"DestroyDimension\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"GetDimension\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"CloneDimension\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qCloneId\"}]},\"CreateMeasure\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qMeasure\":{\"qLabel\":\"\",\"qDef\":\"\",\"qGrouping\":0,\"qExpressions\":[\"\"],\"qActiveExpression\":0,\"qLabelExpression\":\"\"},\"qMetaDef\":{}}}],\"Out\":[{\"Name\":\"qInfo\"}]},\"DestroyMeasure\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"GetMeasure\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"CloneMeasure\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qCloneId\"}]},\"CreateSessionVariable\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qMetaDef\":{},\"qName\":\"\",\"qComment\":\"\",\"qNumberPresentation\":{\"qType\":0,\"qnDec\":0,\"qUseThou\":0,\"qFmt\":\"\",\"qDec\":\"\",\"qThou\":\"\"},\"qIncludeInBookmark\":false,\"qDefinition\":\"\"}}],\"Out\":[]},\"DestroySessionVariable\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"CreateVariableEx\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qMetaDef\":{},\"qName\":\"\",\"qComment\":\"\",\"qNumberPresentation\":{\"qType\":0,\"qnDec\":0,\"qUseThou\":0,\"qFmt\":\"\",\"qDec\":\"\",\"qThou\":\"\"},\"qIncludeInBookmark\":false,\"qDefinition\":\"\"}}],\"Out\":[{\"Name\":\"qInfo\"}]},\"DestroyVariableById\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"DestroyVariableByName\":{\"In\":[{\"Name\":\"qName\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"GetVariableById\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"GetVariableByName\":{\"In\":[{\"Name\":\"qName\",\"DefaultValue\":\"\"}],\"Out\":[]},\"MigrateVariables\":{\"In\":[],\"Out\":[]},\"MigrateDerivedFields\":{\"In\":[],\"Out\":[]},\"CheckExpression\":{\"In\":[{\"Name\":\"qExpr\",\"DefaultValue\":\"\"},{\"Name\":\"qLabels\",\"DefaultValue\":[\"\"],\"Optional\":true}],\"Out\":[{\"Name\":\"qErrorMsg\"},{\"Name\":\"qBadFieldNames\"},{\"Name\":\"qDangerousFieldNames\"}]},\"CheckNumberOrExpression\":{\"In\":[{\"Name\":\"qExpr\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qErrorMsg\"},{\"Name\":\"qBadFieldNames\"}]},\"AddAlternateState\":{\"In\":[{\"Name\":\"qStateName\",\"DefaultValue\":\"\"}],\"Out\":[]},\"RemoveAlternateState\":{\"In\":[{\"Name\":\"qStateName\",\"DefaultValue\":\"\"}],\"Out\":[]},\"CreateBookmark\":{\"In\":[{\"Name\":\"qProp\",\"DefaultValue\":{\"qInfo\":{\"qId\":\"\",\"qType\":\"\"},\"qMetaDef\":{}}}],\"Out\":[{\"Name\":\"qInfo\"}]},\"DestroyBookmark\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"GetBookmark\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"ApplyBookmark\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"CloneBookmark\":{\"In\":[{\"Name\":\"qId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qCloneId\"}]},\"AddFieldFromExpression\":{\"In\":[{\"Name\":\"qName\",\"DefaultValue\":\"\"},{\"Name\":\"qExpr\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"GetAllInfos\":{\"In\":[],\"Out\":[{\"Name\":\"qInfos\"}]},\"Resume\":{\"In\":[],\"Out\":[]},\"AbortModal\":{\"In\":[{\"Name\":\"qAccept\",\"DefaultValue\":false}],\"Out\":[]},\"Publish\":{\"In\":[{\"Name\":\"qStreamId\",\"DefaultValue\":\"\"},{\"Name\":\"qName\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[]},\"UnPublish\":{\"In\":[],\"Out\":[]},\"GetMatchingFields\":{\"In\":[{\"Name\":\"qTags\",\"DefaultValue\":[\"\"]},{\"Name\":\"qMatchingFieldMode\",\"DefaultValue\":0,\"Optional\":true}],\"Out\":[{\"Name\":\"qFieldNames\"}]},\"FindMatchingFields\":{\"In\":[{\"Name\":\"qFieldName\",\"DefaultValue\":\"\"},{\"Name\":\"qTags\",\"DefaultValue\":[\"\"]}],\"Out\":[{\"Name\":\"qFieldNames\"}]},\"Scramble\":{\"In\":[{\"Name\":\"qFieldName\",\"DefaultValue\":\"\"}],\"Out\":[]},\"SaveObjects\":{\"In\":[],\"Out\":[]},\"GetAssociationScores\":{\"In\":[{\"Name\":\"qTable1\",\"DefaultValue\":\"\"},{\"Name\":\"qTable2\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qScore\"}]},\"GetMediaList\":{\"In\":[],\"Out\":[{\"Name\":\"qList\"}]},\"GetContentLibraries\":{\"In\":[],\"Out\":[{\"Name\":\"qList\"}]},\"GetLibraryContent\":{\"In\":[{\"Name\":\"qName\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qList\"}]},\"DoReloadEx\":{\"In\":[{\"Name\":\"qParams\",\"DefaultValue\":{\"qMode\":0,\"qPartial\":false,\"qDebug\":false},\"Optional\":true}],\"Out\":[{\"Name\":\"qResult\"}]},\"BackCount\":{\"In\":[],\"Out\":[]},\"ForwardCount\":{\"In\":[],\"Out\":[]},\"ExportReducedData\":{\"In\":[{\"Name\":\"qOptions\",\"DefaultValue\":{\"qBookmarkId\":\"\",\"qExpires\":0},\"Optional\":true}],\"Out\":[{\"Name\":\"qDownloadInfo\"}]},\"SetScript\":{\"In\":[{\"Name\":\"qScript\",\"DefaultValue\":\"\"}],\"Out\":[]},\"CheckScriptSyntax\":{\"In\":[],\"Out\":[{\"Name\":\"qErrors\"}]},\"GetFavoriteVariables\":{\"In\":[],\"Out\":[{\"Name\":\"qNames\"}]},\"SetFavoriteVariables\":{\"In\":[{\"Name\":\"qNames\",\"DefaultValue\":[\"\"]}],\"Out\":[]},\"GetIncludeFileContent\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qContent\"}]},\"CreateConnection\":{\"In\":[{\"Name\":\"qConnection\",\"DefaultValue\":{\"qId\":\"\",\"qName\":\"\",\"qConnectionString\":\"\",\"qType\":\"\",\"qUserName\":\"\",\"qPassword\":\"\",\"qModifiedDate\":\"\",\"qMeta\":{\"qName\":\"\"},\"qLogOn\":0}}],\"Out\":[{\"Name\":\"qConnectionId\"}]},\"ModifyConnection\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qConnection\",\"DefaultValue\":{\"qId\":\"\",\"qName\":\"\",\"qConnectionString\":\"\",\"qType\":\"\",\"qUserName\":\"\",\"qPassword\":\"\",\"qModifiedDate\":\"\",\"qMeta\":{\"qName\":\"\"},\"qLogOn\":0}},{\"Name\":\"qOverrideCredentials\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"DeleteConnection\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"GetConnection\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qConnection\"}]},\"GetConnections\":{\"In\":[],\"Out\":[{\"Name\":\"qConnections\"}]},\"GetDatabaseInfo\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qInfo\"}]},\"GetDatabases\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qDatabases\"}]},\"GetDatabaseOwners\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qDatabase\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[{\"Name\":\"qOwners\"}]},\"GetDatabaseTables\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qDatabase\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qOwner\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[{\"Name\":\"qTables\"}]},\"GetDatabaseTableFields\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qDatabase\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qOwner\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qTable\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qFields\"}]},\"GetDatabaseTablePreview\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qDatabase\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qOwner\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qTable\",\"DefaultValue\":\"\"},{\"Name\":\"qConditions\",\"DefaultValue\":{\"qType\":0,\"qWherePredicate\":\"\"},\"Optional\":true}],\"Out\":[{\"Name\":\"qPreview\"},{\"Name\":\"qRowCount\"}]},\"GetFolderItemsForConnection\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qRelativePath\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[{\"Name\":\"qFolderItems\"}]},\"GuessFileType\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qRelativePath\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[{\"Name\":\"qDataFormat\"}]},\"GetFileTables\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qRelativePath\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qDataFormat\",\"DefaultValue\":{\"qType\":0,\"qLabel\":\"\",\"qQuote\":\"\",\"qComment\":\"\",\"qDelimiter\":{\"qName\":\"\",\"qScriptCode\":\"\",\"qNumber\":0,\"qIsMultiple\":false},\"qCodePage\":0,\"qHeaderSize\":0,\"qRecordSize\":0,\"qTabSize\":0,\"qIgnoreEOF\":false,\"qFixedWidthDelimiters\":\"\"}}],\"Out\":[{\"Name\":\"qTables\"}]},\"GetFileTableFields\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qRelativePath\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qDataFormat\",\"DefaultValue\":{\"qType\":0,\"qLabel\":\"\",\"qQuote\":\"\",\"qComment\":\"\",\"qDelimiter\":{\"qName\":\"\",\"qScriptCode\":\"\",\"qNumber\":0,\"qIsMultiple\":false},\"qCodePage\":0,\"qHeaderSize\":0,\"qRecordSize\":0,\"qTabSize\":0,\"qIgnoreEOF\":false,\"qFixedWidthDelimiters\":\"\"}},{\"Name\":\"qTable\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qFields\"},{\"Name\":\"qFormatSpec\"}]},\"GetFileTablePreview\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qRelativePath\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qDataFormat\",\"DefaultValue\":{\"qType\":0,\"qLabel\":\"\",\"qQuote\":\"\",\"qComment\":\"\",\"qDelimiter\":{\"qName\":\"\",\"qScriptCode\":\"\",\"qNumber\":0,\"qIsMultiple\":false},\"qCodePage\":0,\"qHeaderSize\":0,\"qRecordSize\":0,\"qTabSize\":0,\"qIgnoreEOF\":false,\"qFixedWidthDelimiters\":\"\"}},{\"Name\":\"qTable\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qPreview\"},{\"Name\":\"qFormatSpec\"}]},\"GetFileTablesEx\":{\"In\":[{\"Name\":\"qConnectionId\",\"DefaultValue\":\"\"},{\"Name\":\"qRelativePath\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qDataFormat\",\"DefaultValue\":{\"qType\":0,\"qLabel\":\"\",\"qQuote\":\"\",\"qComment\":\"\",\"qDelimiter\":{\"qName\":\"\",\"qScriptCode\":\"\",\"qNumber\":0,\"qIsMultiple\":false},\"qCodePage\":0,\"qHeaderSize\":0,\"qRecordSize\":0,\"qTabSize\":0,\"qIgnoreEOF\":false,\"qFixedWidthDelimiters\":\"\"}}],\"Out\":[{\"Name\":\"qTables\"}]},\"SendGenericCommandToCustomConnector\":{\"In\":[{\"Name\":\"qProvider\",\"DefaultValue\":\"\"},{\"Name\":\"qCommand\",\"DefaultValue\":\"\"},{\"Name\":\"qMethod\",\"DefaultValue\":\"\"},{\"Name\":\"qParameters\",\"DefaultValue\":[\"\"]},{\"Name\":\"qAppendConnection\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qResult\"}]},\"SearchSuggest\":{\"In\":[{\"Name\":\"qOptions\",\"DefaultValue\":{\"qSearchFields\":[\"\"],\"qContext\":0,\"qCharEncoding\":0,\"qAttributes\":[\"\"]}},{\"Name\":\"qTerms\",\"DefaultValue\":[\"\"]}],\"Out\":[{\"Name\":\"qResult\"}]},\"SearchAssociations\":{\"In\":[{\"Name\":\"qOptions\",\"DefaultValue\":{\"qSearchFields\":[\"\"],\"qContext\":0,\"qCharEncoding\":0,\"qAttributes\":[\"\"]}},{\"Name\":\"qTerms\",\"DefaultValue\":[\"\"]},{\"Name\":\"qPage\",\"DefaultValue\":{\"qOffset\":0,\"qCount\":0,\"qMaxNbrFieldMatches\":0,\"qGroupOptions\":[{\"qGroupType\":0,\"qOffset\":0,\"qCount\":0}],\"qGroupItemOptions\":[{\"qGroupItemType\":0,\"qOffset\":0,\"qCount\":0}]}}],\"Out\":[{\"Name\":\"qResults\"}]},\"SelectAssociations\":{\"In\":[{\"Name\":\"qOptions\",\"DefaultValue\":{\"qSearchFields\":[\"\"],\"qContext\":0,\"qCharEncoding\":0,\"qAttributes\":[\"\"]}},{\"Name\":\"qTerms\",\"DefaultValue\":[\"\"]},{\"Name\":\"qMatchIx\",\"DefaultValue\":0},{\"Name\":\"qSoftLock\",\"DefaultValue\":null,\"Optional\":true}],\"Out\":[]},\"SearchResults\":{\"In\":[{\"Name\":\"qOptions\",\"DefaultValue\":{\"qSearchFields\":[\"\"],\"qContext\":0,\"qCharEncoding\":0,\"qAttributes\":[\"\"]}},{\"Name\":\"qTerms\",\"DefaultValue\":[\"\"]},{\"Name\":\"qPage\",\"DefaultValue\":{\"qOffset\":0,\"qCount\":0,\"qMaxNbrFieldMatches\":0,\"qGroupOptions\":[{\"qGroupType\":0,\"qOffset\":0,\"qCount\":0}],\"qGroupItemOptions\":[{\"qGroupItemType\":0,\"qOffset\":0,\"qCount\":0}]}}],\"Out\":[{\"Name\":\"qResult\"}]},\"SearchObjects\":{\"In\":[{\"Name\":\"qOptions\",\"DefaultValue\":{\"qAttributes\":[\"\"],\"qCharEncoding\":0}},{\"Name\":\"qTerms\",\"DefaultValue\":[\"\"]},{\"Name\":\"qPage\",\"DefaultValue\":{\"qOffset\":0,\"qCount\":0,\"qMaxNbrFieldMatches\":0,\"qGroupOptions\":[{\"qGroupType\":0,\"qOffset\":0,\"qCount\":0}],\"qGroupItemOptions\":[{\"qGroupItemType\":0,\"qOffset\":0,\"qCount\":0}]}}],\"Out\":[{\"Name\":\"qResult\"}]}},\"Global\":{\"AbortRequest\":{\"In\":[{\"Name\":\"qRequestId\",\"DefaultValue\":0}],\"Out\":[]},\"AbortAll\":{\"In\":[],\"Out\":[]},\"GetProgress\":{\"In\":[{\"Name\":\"qRequestId\",\"DefaultValue\":0}],\"Out\":[{\"Name\":\"qProgressData\"}]},\"QvVersion\":{\"In\":[],\"Out\":[]},\"OSVersion\":{\"In\":[],\"Out\":[]},\"OSName\":{\"In\":[],\"Out\":[]},\"QTProduct\":{\"In\":[],\"Out\":[]},\"GetDocList\":{\"In\":[],\"Out\":[{\"Name\":\"qDocList\"}]},\"GetInteract\":{\"In\":[{\"Name\":\"qRequestId\",\"DefaultValue\":0}],\"Out\":[{\"Name\":\"qDef\"}]},\"InteractDone\":{\"In\":[{\"Name\":\"qRequestId\",\"DefaultValue\":0},{\"Name\":\"qDef\",\"DefaultValue\":{\"qType\":0,\"qTitle\":\"\",\"qMsg\":\"\",\"qButtons\":0,\"qLine\":\"\",\"qOldLineNr\":0,\"qNewLineNr\":0,\"qPath\":\"\",\"qHidden\":false,\"qResult\":0,\"qInput\":\"\"}}],\"Out\":[]},\"GetAuthenticatedUser\":{\"In\":[],\"Out\":[]},\"CreateDocEx\":{\"In\":[{\"Name\":\"qDocName\",\"DefaultValue\":\"\"},{\"Name\":\"qUserName\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qPassword\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qSerial\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qLocalizedScriptMainSection\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[{\"Name\":\"qDocId\"}]},\"GetActiveDoc\":{\"In\":[],\"Out\":[]},\"AllowCreateApp\":{\"In\":[],\"Out\":[]},\"CreateApp\":{\"In\":[{\"Name\":\"qAppName\",\"DefaultValue\":\"\"},{\"Name\":\"qLocalizedScriptMainSection\",\"DefaultValue\":\"\",\"Optional\":true}],\"Out\":[{\"Name\":\"qSuccess\"},{\"Name\":\"qAppId\"}]},\"DeleteApp\":{\"In\":[{\"Name\":\"qAppId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"IsDesktopMode\":{\"In\":[],\"Out\":[]},\"GetConfiguration\":{\"In\":[],\"Out\":[{\"Name\":\"qConfig\"}]},\"CancelRequest\":{\"In\":[{\"Name\":\"qRequestId\",\"DefaultValue\":0}],\"Out\":[]},\"ShutdownProcess\":{\"In\":[],\"Out\":[]},\"ReloadExtensionList\":{\"In\":[],\"Out\":[]},\"ReplaceAppFromID\":{\"In\":[{\"Name\":\"qTargetAppId\",\"DefaultValue\":\"\"},{\"Name\":\"qSrcAppID\",\"DefaultValue\":\"\"},{\"Name\":\"qIds\",\"DefaultValue\":[\"\"]}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"CopyApp\":{\"In\":[{\"Name\":\"qTargetAppId\",\"DefaultValue\":\"\"},{\"Name\":\"qSrcAppId\",\"DefaultValue\":\"\"},{\"Name\":\"qIds\",\"DefaultValue\":[\"\"]}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"ImportApp\":{\"In\":[{\"Name\":\"qAppId\",\"DefaultValue\":\"\"},{\"Name\":\"qSrcPath\",\"DefaultValue\":\"\"},{\"Name\":\"qIds\",\"DefaultValue\":[\"\"]}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"ImportAppEx\":{\"In\":[{\"Name\":\"qAppId\",\"DefaultValue\":\"\"},{\"Name\":\"qSrcPath\",\"DefaultValue\":\"\"},{\"Name\":\"qIds\",\"DefaultValue\":[\"\"]},{\"Name\":\"qExcludeConnections\",\"DefaultValue\":false}],\"Out\":[]},\"ExportApp\":{\"In\":[{\"Name\":\"qTargetPath\",\"DefaultValue\":\"\"},{\"Name\":\"qSrcAppId\",\"DefaultValue\":\"\"},{\"Name\":\"qIds\",\"DefaultValue\":[\"\"]}],\"Out\":[{\"Name\":\"qSuccess\"}]},\"PublishApp\":{\"In\":[{\"Name\":\"qAppId\",\"DefaultValue\":\"\"},{\"Name\":\"qName\",\"DefaultValue\":\"\"},{\"Name\":\"qStreamId\",\"DefaultValue\":\"\"}],\"Out\":[]},\"IsPersonalMode\":{\"In\":[],\"Out\":[]},\"GetUniqueID\":{\"In\":[],\"Out\":[{\"Name\":\"qUniqueID\"}]},\"OpenDoc\":{\"In\":[{\"Name\":\"qDocName\",\"DefaultValue\":\"\"},{\"Name\":\"qUserName\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qPassword\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qSerial\",\"DefaultValue\":\"\",\"Optional\":true},{\"Name\":\"qNoData\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[]},\"CreateSessionApp\":{\"In\":[],\"Out\":[{\"Name\":\"qSessionAppId\"}]},\"CreateSessionAppFromApp\":{\"In\":[{\"Name\":\"qSrcAppId\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qSessionAppId\"}]},\"ProductVersion\":{\"In\":[],\"Out\":[]},\"GetAppEntry\":{\"In\":[{\"Name\":\"qAppID\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qEntry\"}]},\"ConfigureReload\":{\"In\":[{\"Name\":\"qCancelOnScriptError\",\"DefaultValue\":false},{\"Name\":\"qUseErrorData\",\"DefaultValue\":false},{\"Name\":\"qInteractOnError\",\"DefaultValue\":false}],\"Out\":[]},\"CancelReload\":{\"In\":[],\"Out\":[]},\"GetBNF\":{\"In\":[{\"Name\":\"qBnfType\",\"DefaultValue\":0}],\"Out\":[{\"Name\":\"qBnfDefs\"}]},\"GetFunctions\":{\"In\":[{\"Name\":\"qGroup\",\"DefaultValue\":0,\"Optional\":true}],\"Out\":[{\"Name\":\"qFunctions\"}]},\"GetOdbcDsns\":{\"In\":[],\"Out\":[{\"Name\":\"qOdbcDsns\"}]},\"GetOleDbProviders\":{\"In\":[],\"Out\":[{\"Name\":\"qOleDbProviders\"}]},\"GetDatabasesFromConnectionString\":{\"In\":[{\"Name\":\"qConnection\",\"DefaultValue\":{\"qId\":\"\",\"qName\":\"\",\"qConnectionString\":\"\",\"qType\":\"\",\"qUserName\":\"\",\"qPassword\":\"\",\"qModifiedDate\":\"\",\"qMeta\":{\"qName\":\"\"},\"qLogOn\":0}}],\"Out\":[{\"Name\":\"qDatabases\"}]},\"IsValidConnectionString\":{\"In\":[{\"Name\":\"qConnection\",\"DefaultValue\":{\"qId\":\"\",\"qName\":\"\",\"qConnectionString\":\"\",\"qType\":\"\",\"qUserName\":\"\",\"qPassword\":\"\",\"qModifiedDate\":\"\",\"qMeta\":{\"qName\":\"\"},\"qLogOn\":0}}],\"Out\":[]},\"GetDefaultAppFolder\":{\"In\":[],\"Out\":[{\"Name\":\"qPath\"}]},\"GetMyDocumentsFolder\":{\"In\":[],\"Out\":[{\"Name\":\"qFolder\"}]},\"GetLogicalDriveStrings\":{\"In\":[],\"Out\":[{\"Name\":\"qDrives\"}]},\"GetFolderItemsForPath\":{\"In\":[{\"Name\":\"qPath\",\"DefaultValue\":\"\"}],\"Out\":[{\"Name\":\"qFolderItems\"}]},\"GetSupportedCodePages\":{\"In\":[],\"Out\":[{\"Name\":\"qCodePages\"}]},\"GetCustomConnectors\":{\"In\":[{\"Name\":\"qReloadList\",\"DefaultValue\":false,\"Optional\":true}],\"Out\":[{\"Name\":\"qConnectors\"}]},\"GetStreamList\":{\"In\":[],\"Out\":[{\"Name\":\"qStreamList\"}]},\"UploadToContentService\":{\"In\":[{\"Name\":\"qDirectory\",\"DefaultValue\":\"\"},{\"Name\":\"qAppId\",\"DefaultValue\":\"\"},{\"Name\":\"qQrsObjects\",\"DefaultValue\":[{\"qEngineObjectID\":\"\",\"qItemID\":\"\"}]}],\"Out\":[{\"Name\":\"qUploadedObjects\"}]},\"EngineVersion\":{\"In\":[],\"Out\":[{\"Name\":\"qVersion\"}]},\"GetBaseBNF\":{\"In\":[{\"Name\":\"qBnfType\",\"DefaultValue\":0}],\"Out\":[{\"Name\":\"qBnfDefs\"},{\"Name\":\"qBnfHash\"}]},\"GetBaseBNFHash\":{\"In\":[{\"Name\":\"qBnfType\",\"DefaultValue\":0}],\"Out\":[{\"Name\":\"qBnfHash\"}]}}},\"enums\":{\"LocalizedMessageCode\":{\"LOCMSG_SCRIPTEDITOR_EMPTY_MESSAGE\":0,\"LOCMSG_SCRIPTEDITOR_PROGRESS_SAVING_STARTED\":1,\"LOCMSG_SCRIPTEDITOR_PROGRESS_BYTES_LEFT\":2,\"LOCMSG_SCRIPTEDITOR_PROGRESS_STORING_TABLES\":3,\"LOCMSG_SCRIPTEDITOR_PROGRESS_QVD_ROWS_SO_FAR\":4,\"LOCMSG_SCRIPTEDITOR_PROGRESS_CONNECTED\":5,\"LOCMSG_SCRIPTEDITOR_PROGRESS_CONNECTING_TO\":6,\"LOCMSG_SCRIPTEDITOR_PROGRESS_CONNECT_FAILED\":7,\"LOCMSG_SCRIPTEDITOR_PROGRESS_QVD_ROWISH\":8,\"LOCMSG_SCRIPTEDITOR_PROGRESS_QVD_COLUMNAR\":9,\"LOCMSG_SCRIPTEDITOR_ERROR\":10,\"LOCMSG_SCRIPTEDITOR_DONE\":11,\"LOCMSG_SCRIPTEDITOR_LOAD_EXTERNAL_DATA\":12,\"LOCMSG_SCRIPTEDITOR_PROGRESS_OLD_QVD_ISLOADING\":13,\"LOCMSG_SCRIPTEDITOR_PROGRESS_QVC_LOADING\":14,\"LOCMSG_SCRIPTEDITOR_PROGRESS_QVD_BUFFERED\":15,\"LOCMSG_SCRIPTEDITOR_PROGRESS_QVC_PREPARING\":16,\"LOCMSG_SCRIPTEDITOR_PROGRESS_QVC_APPENDING\":17,\"LOCMSG_SCRIPTEDITOR_REMOVE_SYNTHETIC\":18,\"LOCMSG_SCRIPTEDITOR_PENDING_LINKEDTABLE_FETCHING\":19,\"LOCMSG_SCRIPTEDITOR_RELOAD\":20,\"LOCMSG_SCRIPTEDITOR_LINES_FETCHED\":21,\"LOCMSG_SCRIPTEDITOR_SEARCHINDEX_START\":22,\"LOCMSG_SCRIPTEDITOR_SEARCHINDEX_FIELD\":23,\"LOCMSG_SCRIPTEDITOR_SEARCHINDEX_SUCCESS\":24,\"LOCMSG_SCRIPTEDITOR_SEARCHINDEX_FAILURE\":25,\"LOCMSG_SCRIPTEDITOR_SEARCHINDEX_STARTABORT\":26,\"LOCMSG_SCRIPTEDITOR_SEARCHINDEX_ENDABORT\":27,\"LOCMSG_SCRIPTEDITOR_SEARCHINDEX_TIMEOUT\":28,\"LOCMSG_SCRIPTEDITOR_SEARCHINDEX_OUTOFMEMORY\":29},\"LocalizedErrorCode\":{\"LOCERR_INTERNAL_ERROR\":-128,\"LOCERR_GENERIC_UNKNOWN\":-1,\"LOCERR_GENERIC_OK\":0,\"LOCERR_GENERIC_NOT_SET\":1,\"LOCERR_GENERIC_NOT_FOUND\":2,\"LOCERR_GENERIC_ALREADY_EXISTS\":3,\"LOCERR_GENERIC_INVALID_PATH\":4,\"LOCERR_GENERIC_ACCESS_DENIED\":5,\"LOCERR_GENERIC_OUT_OF_MEMORY\":6,\"LOCERR_GENERIC_NOT_INITIALIZED\":7,\"LOCERR_GENERIC_INVALID_PARAMETERS\":8,\"LOCERR_GENERIC_EMPTY_PARAMETERS\":9,\"LOCERR_GENERIC_INTERNAL_ERROR\":10,\"LOCERR_GENERIC_CORRUPT_DATA\":11,\"LOCERR_GENERIC_MEMORY_INCONSISTENCY\":12,\"LOCERR_GENERIC_INVISIBLE_OWNER_ABORT\":13,\"LOCERR_GENERIC_PROHIBIT_VALIDATE\":14,\"LOCERR_GENERIC_ABORTED\":15,\"LOCERR_GENERIC_CONNECTION_LOST\":16,\"LOCERR_GENERIC_UNSUPPORTED_IN_PRODUCT_VERSION\":17,\"LOCERR_GENERIC_REST_CONNECTION_FAILURE\":18,\"LOCERR_HTTP_400\":400,\"LOCERR_HTTP_401\":401,\"LOCERR_HTTP_402\":402,\"LOCERR_HTTP_403\":403,\"LOCERR_HTTP_404\":404,\"LOCERR_HTTP_405\":405,\"LOCERR_HTTP_406\":406,\"LOCERR_HTTP_407\":407,\"LOCERR_HTTP_408\":408,\"LOCERR_HTTP_409\":409,\"LOCERR_HTTP_410\":410,\"LOCERR_HTTP_411\":411,\"LOCERR_HTTP_412\":412,\"LOCERR_HTTP_413\":413,\"LOCERR_HTTP_414\":414,\"LOCERR_HTTP_415\":415,\"LOCERR_HTTP_416\":416,\"LOCERR_HTTP_417\":417,\"LOCERR_HTTP_500\":500,\"LOCERR_HTTP_501\":501,\"LOCERR_HTTP_502\":502,\"LOCERR_HTTP_503\":503,\"LOCERR_HTTP_504\":504,\"LOCERR_HTTP_505\":505,\"LOCERR_HTTP_509\":509,\"LOCERR_HTTP_COULD_NOT_RESOLVE_HOST\":700,\"LOCERR_APP_ALREADY_EXISTS\":1000,\"LOCERR_APP_INVALID_NAME\":1001,\"LOCERR_APP_ALREADY_OPEN\":1002,\"LOCERR_APP_NOT_FOUND\":1003,\"LOCERR_APP_IMPORT_FAILED\":1004,\"LOCERR_APP_SAVE_FAILED\":1005,\"LOCERR_APP_CREATE_FAILED\":1006,\"LOCERR_APP_INVALID\":1007,\"LOCERR_APP_CONNECT_FAILED\":1008,\"LOCERR_APP_ALREADY_OPEN_IN_DIFFERENT_MODE\":1009,\"LOCERR_APP_MIGRATION_COULD_NOT_CONTACT_MIGRATION_SERVICE\":1010,\"LOCERR_APP_MIGRATION_COULD_NOT_START_MIGRATION\":1011,\"LOCERR_APP_MIGRATION_FAILURE\":1012,\"LOCERR_APP_SCRIPT_MISSING\":1013,\"LOCERR_CONNECTION_ALREADY_EXISTS\":2000,\"LOCERR_CONNECTION_NOT_FOUND\":2001,\"LOCERR_CONNECTION_FAILED_TO_LOAD\":2002,\"LOCERR_CONNECTION_FAILED_TO_IMPORT\":2003,\"LOCERR_CONNECTION_NAME_IS_INVALID\":2004,\"LOCERR_CONNECTOR_NO_FILE_STREAMING_SUPPORT\":2300,\"LOCERR_FILE_ACCESS_DENIED\":3000,\"LOCERR_FILE_NAME_INVALID\":3001,\"LOCERR_FILE_CORRUPT\":3002,\"LOCERR_FILE_NOT_FOUND\":3003,\"LOCERR_FILE_FORMAT_UNSUPPORTED\":3004,\"LOCERR_FILE_OPENED_IN_UNSUPPORTED_MODE\":3005,\"LOCERR_FILE_TABLE_NOT_FOUND\":3006,\"LOCERR_USER_ACCESS_DENIED\":4000,\"LOCERR_USER_IMPERSONATION_FAILED\":4001,\"LOCERR_SERVER_OUT_OF_SESSION_AND_USER_CALS\":5000,\"LOCERR_SERVER_OUT_OF_SESSION_CALS\":5001,\"LOCERR_SERVER_OUT_OF_USAGE_CALS\":5002,\"LOCERR_SERVER_OUT_OF_CALS\":5003,\"LOCERR_SERVER_OUT_OF_NAMED_CALS\":5004,\"LOCERR_SERVER_OFF_DUTY\":5005,\"LOCERR_SERVER_BUSY\":5006,\"LOCERR_SERVER_LICENSE_EXPIRED\":5007,\"LOCERR_SERVER_AJAX_DISABLED\":5008,\"LOCERR_HC_INVALID_OBJECT\":6000,\"LOCERR_HC_RESULT_TOO_LARGE\":6001,\"LOCERR_HC_INVALID_OBJECT_STATE\":6002,\"LOCERR_HC_MODAL_OBJECT_ERROR\":6003,\"LOCERR_CALC_INVALID_DEF\":7000,\"LOCERR_CALC_NOT_IN_LIB\":7001,\"LOCERR_CALC_HEAP_ERROR\":7002,\"LOCERR_CALC_TOO_LARGE\":7003,\"LOCERR_CALC_TIMEOUT\":7004,\"LOCERR_CALC_EVAL_CONDITION_FAILED\":7005,\"LOCERR_CALC_MIXED_LINKED_AGGREGATION\":7006,\"LOCERR_CALC_MISSING_LINKED\":7007,\"LOCERR_CALC_INVALID_COL_SORT\":7008,\"LOCERR_CALC_PAGES_TOO_LARGE\":7009,\"LOCERR_CALC_SEMANTIC_FIELD_NOT_ALLOWED\":7010,\"LOCERR_CALC_VALIDATION_STATE_INVALID\":7011,\"LOCERR_CALC_PIVOT_DIMENSIONS_ALREADY_EXISTS\":7012,\"LOCERR_CALC_MISSING_LINKED_FIELD\":7013,\"LOCERR_CALC_NOT_CALCULATED\":7014,\"LOCERR_LAYOUT_EXTENDS_INVALID_ID\":8000,\"LOCERR_LAYOUT_LINKED_OBJECT_NOT_FOUND\":8001,\"LOCERR_LAYOUT_LINKED_OBJECT_INVALID\":8002,\"LOCERR_PERSISTENCE_WRITE_FAILED\":9000,\"LOCERR_PERSISTENCE_READ_FAILED\":9001,\"LOCERR_PERSISTENCE_DELETE_FAILED\":9002,\"LOCERR_PERSISTENCE_NOT_FOUND\":9003,\"LOCERR_PERSISTENCE_UNSUPPORTED_VERSION\":9004,\"LOCERR_PERSISTENCE_MIGRATION_FAILED_READ_ONLY\":9005,\"LOCERR_PERSISTENCE_MIGRATION_CANCELLED\":9006,\"LOCERR_PERSISTENCE_MIGRATION_BACKUP_FAILED\":9007,\"LOCERR_PERSISTENCE_DISK_FULL\":9008,\"LOCERR_PERSISTENCE_NOT_SUPPORTED_FOR_SESSION_APP\":9009,\"LOCERR_PERSISTENCE_SYNC_SET_CHUNK_INVALID_PARAMETERS\":9510,\"LOCERR_PERSISTENCE_SYNC_GET_CHUNK_INVALID_PARAMETERS\":9511,\"LOCERR_SCRIPT_DATASOURCE_ACCESS_DENIED\":10000,\"LOCERR_RELOAD_IN_PROGRESS\":11000,\"LOCERR_RELOAD_TABLE_X_NOT_FOUND\":11001,\"LOCERR_RELOAD_UNKNOWN_STATEMENT\":11002,\"LOCERR_RELOAD_EXPECTED_SOMETHING_FOUND_UNKNOWN\":11003,\"LOCERR_RELOAD_EXPECTED_NOTHING_FOUND_UNKNOWN\":11004,\"LOCERR_RELOAD_EXPECTED_ONE_OF_1_TOKENS_FOUND_UNKNOWN\":11005,\"LOCERR_RELOAD_EXPECTED_ONE_OF_2_TOKENS_FOUND_UNKNOWN\":11006,\"LOCERR_RELOAD_EXPECTED_ONE_OF_3_TOKENS_FOUND_UNKNOWN\":11007,\"LOCERR_RELOAD_EXPECTED_ONE_OF_4_TOKENS_FOUND_UNKNOWN\":11008,\"LOCERR_RELOAD_EXPECTED_ONE_OF_5_TOKENS_FOUND_UNKNOWN\":11009,\"LOCERR_RELOAD_EXPECTED_ONE_OF_6_TOKENS_FOUND_UNKNOWN\":11010,\"LOCERR_RELOAD_EXPECTED_ONE_OF_7_TOKENS_FOUND_UNKNOWN\":11011,\"LOCERR_RELOAD_EXPECTED_ONE_OF_8_OR_MORE_TOKENS_FOUND_UNKNOWN\":11012,\"LOCERR_RELOAD_FIELD_X_NOT_FOUND\":11013,\"LOCERR_RELOAD_MAPPING_TABLE_X_NOT_FOUND\":11014,\"LOCERR_RELOAD_LIB_CONNECTION_X_NOT_FOUND\":11015,\"LOCERR_RELOAD_NAME_ALREADY_TAKEN\":11016,\"LOCERR_RELOAD_WRONG_FILE_FORMAT_DIF\":11017,\"LOCERR_RELOAD_WRONG_FILE_FORMAT_BIFF\":11018,\"LOCERR_RELOAD_WRONG_FILE_FORMAT_ENCRYPTED\":11019,\"LOCERR_RELOAD_OPEN_FILE_ERROR\":11020,\"LOCERR_RELOAD_AUTO_GENERATE_COUNT\":11021,\"LOCERR_RELOAD_PE_ILLEGAL_PREFIX_COMB\":11022,\"LOCERR_RELOAD_MATCHING_CONTROL_STATEMENT_ERROR\":11023,\"LOCERR_RELOAD_MATCHING_LIBPATH_X_NOT_FOUND\":11024,\"LOCERR_RELOAD_MATCHING_LIBPATH_X_INVALID\":11025,\"LOCERR_RELOAD_MATCHING_LIBPATH_X_OUTSIDE\":11026,\"LOCERR_RELOAD_NO_QUALIFIED_PATH_FOR_FILE\":11027,\"LOCERR_RELOAD_MODE_STATEMENT_ONLY_FOR_LIB_PATHS\":11028,\"LOCERR_RELOAD_INCONSISTENT_USE_OF_SEMANTIC_FIELDS\":11029,\"LOCERR_RELOAD_NO_OPEN_DATABASE\":11030,\"LOCERR_RELOAD_AGGREGATION_REQUIRED_BY_GROUP_BY\":11031,\"LOCERR_RELOAD_CONNECT_MUST_USE_LIB_PREFIX_IN_THIS_MODE\":11032,\"LOCERR_RELOAD_ODBC_CONNECT_FAILED\":11033,\"LOCERR_RELOAD_OLEDB_CONNECT_FAILED\":11034,\"LOCERR_RELOAD_CUSTOM_CONNECT_FAILED\":11035,\"LOCERR_RELOAD_ODBC_READ_FAILED\":11036,\"LOCERR_RELOAD_OLEDB_READ_FAILED\":11037,\"LOCERR_RELOAD_CUSTOM_READ_FAILED\":11038,\"LOCERR_RELOAD_BINARY_LOAD_PROHIBITED\":11039,\"LOCERR_RELOAD_CONNECTOR_START_FAILED\":11040,\"LOCERR_RELOAD_CONNECTOR_NOT_RESPONDING\":11041,\"LOCERR_RELOAD_CONNECTOR_REPLY_ERROR\":11042,\"LOCERR_RELOAD_CONNECTOR_CONNECT_ERROR\":11043,\"LOCERR_RELOAD_CONNECTOR_NOT_FOUND_ERROR\":11044,\"LOCERR_PERSONAL_NEW_VERSION_AVAILABLE\":12000,\"LOCERR_PERSONAL_VERSION_EXPIRED\":12001,\"LOCERR_PERSONAL_SECTION_ACCESS_DETECTED\":12002,\"LOCERR_PERSONAL_APP_DELETION_FAILED\":12003,\"LOCERR_USER_AUTHENTICATION_FAILURE\":12004,\"LOCERR_EXPORT_OUT_OF_MEMORY\":13000,\"LOCERR_EXPORT_NO_DATA\":13001,\"LOCERR_SYNC_INVALID_OFFSET\":14000,\"LOCERR_SEARCH_TIMEOUT\":15000,\"LOCERR_DIRECT_DISCOVERY_LINKED_EXPRESSION_FAIL\":16000,\"LOCERR_DIRECT_DISCOVERY_ROWCOUNT_OVERFLOW\":16001,\"LOCERR_DIRECT_DISCOVERY_EMPTY_RESULT\":16002,\"LOCERR_DIRECT_DISCOVERY_DB_CONNECTION_FAILED\":16003,\"LOCERR_DIRECT_DISCOVERY_MEASURE_NOT_ALLOWED\":16004,\"LOCERR_DIRECT_DISCOVERY_DETAIL_NOT_ALLOWED\":16005,\"LOCERR_DIRECT_DISCOVERY_NOT_SYNTH_CIRCULAR_ALLOWED\":16006,\"LOCERR_DIRECT_DISCOVERY_ONLY_ONE_DD_TABLE_ALLOWED\":16007,\"LOCERR_DIRECT_DISCOVERY_DB_AUTHORIZATION_FAILED\":16008,\"LOCERR_SMART_LOAD_TABLE_NOT_FOUND\":17000,\"LOCERR_SMART_LOAD_TABLE_DUPLICATED\":17001,\"LOCERR_VARIABLE_NO_NAME\":18000,\"LOCERR_VARIABLE_DUPLICATE_NAME\":18001,\"LOCERR_VARIABLE_INCONSISTENCY\":18002,\"LOCERR_MEDIA_LIBRARY_LIST_FAILED\":19000,\"LOCERR_MEDIA_LIBRARY_CONTENT_FAILED\":19001,\"LOCERR_MEDIA_BUNDLING_FAILED\":19002,\"LOCERR_MEDIA_UNBUNDLING_FAILED\":19003,\"LOCERR_MEDIA_LIBRARY_NOT_FOUND\":19004,\"LOCERR_FEATURE_DISABLED\":20000,\"LOCERR_JSON_RPC_INVALID_REQUEST\":-32600,\"LOCERR_JSON_RPC_METHOD_NOT_FOUND\":-32601,\"LOCERR_JSON_RPC_INVALID_PARAMETERS\":-32602,\"LOCERR_JSON_RPC_INTERNAL_ERROR\":-32603,\"LOCERR_JSON_RPC_PARSE_ERROR\":-32700,\"LOCERR_MQ_SOCKET_CONNECT_FAILURE\":33000,\"LOCERR_MQ_SOCKET_OPEN_FAILURE\":33001,\"LOCERR_MQ_PROTOCOL_NO_RESPONE\":33002,\"LOCERR_MQ_PROTOCOL_LIBRARY_EXCEPTION\":33003,\"LOCERR_MQ_PROTOCOL_CONNECTION_CLOSED\":33004,\"LOCERR_MQ_PROTOCOL_CHANNEL_CLOSED\":33005,\"LOCERR_MQ_PROTOCOL_UNKNOWN_ERROR\":33006,\"LOCERR_MQ_PROTOCOL_INVALID_STATUS\":33007,\"LOCERR_EXTENGINE_GRPC_STATUS_OK\":22000,\"LOCERR_EXTENGINE_GRPC_STATUS_CANCELLED\":22001,\"LOCERR_EXTENGINE_GRPC_STATUS_UNKNOWN\":22002,\"LOCERR_EXTENGINE_GRPC_STATUS_INVALID_ARGUMENT\":22003,\"LOCERR_EXTENGINE_GRPC_STATUS_DEADLINE_EXCEEDED\":22004,\"LOCERR_EXTENGINE_GRPC_STATUS_NOT_FOUND\":22005,\"LOCERR_EXTENGINE_GRPC_STATUS_ALREADY_EXISTS\":22006,\"LOCERR_EXTENGINE_GRPC_STATUS_PERMISSION_DENIED\":22007,\"LOCERR_EXTENGINE_GRPC_STATUS_UNAUTHENTICATED\":220016,\"LOCERR_EXTENGINE_GRPC_STATUS_RESOURCE_EXHAUSTED\":22008,\"LOCERR_EXTENGINE_GRPC_STATUS_FAILED_PRECONDITION\":22009,\"LOCERR_EXTENGINE_GRPC_STATUS_ABORTED\":22010,\"LOCERR_EXTENGINE_GRPC_STATUS_OUT_OF_RANGE\":22011,\"LOCERR_EXTENGINE_GRPC_STATUS_UNIMPLEMENTED\":22012,\"LOCERR_EXTENGINE_GRPC_STATUS_INTERNAL\":22013,\"LOCERR_EXTENGINE_GRPC_STATUS_UNAVAILABLE\":22014,\"LOCERR_EXTENGINE_GRPC_STATUS_DATA_LOSS\":22015},\"LocalizedWarningCode\":{\"LOCWARN_PERSONAL_RELOAD_REQUIRED\":0,\"LOCWARN_PERSONAL_VERSION_EXPIRES_SOON\":1,\"LOCWARN_EXPORT_DATA_TRUNCATED\":1000,\"LOCWARN_COULD_NOT_OPEN_ALL_OBJECTS\":2000},\"GrpType\":{\"GRP_NX_NONE\":0,\"GRP_NX_HIEARCHY\":1,\"GRP_NX_COLLECTION\":2},\"ExportFileType\":{\"EXPORT_CSV_C\":0,\"EXPORT_CSV_T\":1,\"EXPORT_OOXML\":2},\"ExportState\":{\"EXPORT_POSSIBLE\":0,\"EXPORT_ALL\":1},\"DimCellType\":{\"NX_DIM_CELL_VALUE\":0,\"NX_DIM_CELL_EMPTY\":1,\"NX_DIM_CELL_NORMAL\":2,\"NX_DIM_CELL_TOTAL\":3,\"NX_DIM_CELL_OTHER\":4,\"NX_DIM_CELL_AGGR\":5,\"NX_DIM_CELL_PSEUDO\":6,\"NX_DIM_CELL_ROOT\":7,\"NX_DIM_CELL_NULL\":8},\"StackElemType\":{\"NX_STACK_CELL_NORMAL\":0,\"NX_STACK_CELL_TOTAL\":1,\"NX_STACK_CELL_OTHER\":2,\"NX_STACK_CELL_SUM\":3,\"NX_STACK_CELL_VALUE\":4,\"NX_STACK_CELL_PSEUDO\":5},\"SortIndicatorType\":{\"NX_SORT_INDICATE_NONE\":0,\"NX_SORT_INDICATE_ASC\":1,\"NX_SORT_INDICATE_DESC\":2},\"DimensionType\":{\"NX_DIMENSION_TYPE_DISCRETE\":0,\"NX_DIMENSION_TYPE_NUMERIC\":1,\"NX_DIMENSION_TYPE_TIME\":2},\"FieldSelectionMode\":{\"SELECTION_MODE_NORMAL\":0,\"SELECTION_MODE_AND\":1,\"SELECTION_MODE_NOT\":2},\"FrequencyMode\":{\"NX_FREQUENCY_NONE\":0,\"NX_FREQUENCY_VALUE\":1,\"NX_FREQUENCY_PERCENT\":2,\"NX_FREQUENCY_RELATIVE\":3},\"DataReductionMode\":{\"DATA_REDUCTION_NONE\":0,\"DATA_REDUCTION_ONEDIM\":1,\"DATA_REDUCTION_SCATTERED\":2,\"DATA_REDUCTION_CLUSTERED\":3,\"DATA_REDUCTION_STACKED\":4},\"HypercubeMode\":{\"DATA_MODE_STRAIGHT\":0,\"DATA_MODE_PIVOT\":1,\"DATA_MODE_PIVOT_STACK\":2},\"PatchOperationType\":{\"Add\":0,\"Remove\":1,\"Replace\":2},\"SelectionCellType\":{\"NX_CELL_DATA\":0,\"NX_CELL_TOP\":1,\"NX_CELL_LEFT\":2},\"MatchingFieldMode\":{\"MATCHINGFIELDMODE_MATCH_ALL\":0,\"MATCHINGFIELDMODE_MATCH_ONE\":1},\"SessionState\":{\"SESSION_CREATED\":0,\"SESSION_ATTACHED\":1},\"QrsChangeType\":{\"QRS_CHANGE_UNDEFINED\":0,\"QRS_CHANGE_ADD\":1,\"QRS_CHANGE_UPDATE\":2,\"QRS_CHANGE_DELETE\":3},\"ExtEngineDataType\":{\"NX_EXT_DATATYPE_STRING\":0,\"NX_EXT_DATATYPE_DOUBLE\":1,\"NX_EXT_DATATYPE_BOTH\":2},\"ExtEngineFunctionType\":{\"NX_EXT_FUNCTIONTYPE_SCALAR\":0,\"NX_EXT_FUNCTIONTYPE_AGGR\":1,\"NX_EXT_FUNCTIONTYPE_TENSOR\":2},\"ExtEngineMsgType\":{\"NX_EXT_MSGTYPE_FUNCTION_CALL\":1,\"NX_EXT_MSGTYPE_SCRIPT_CALL\":2,\"NX_EXT_MSGTYPE_RETURN_VALUE\":3,\"NX_EXT_MSGTYPE_RETURN_MULTIPLE\":4,\"NX_EXT_MSGTYPE_RETURN_ERROR\":5}},\"version\":\"12.20.0\"}");

/***/ }),

/***/ "./node_modules/enigma.js/sense-utilities.js":
/*!***************************************************!*\
  !*** ./node_modules/enigma.js/sense-utilities.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * enigma.js v2.6.3
 * Copyright (c) 2019 QlikTech International AB
 * This library is licensed under MIT - See the LICENSE file for full details
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	// Copyright Joyent, Inc. and other Node contributors.

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	var decode = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};

	// Copyright Joyent, Inc. and other Node contributors.

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	var encode = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};

	var querystring = createCommonjsModule(function (module, exports) {

	exports.decode = exports.parse = decode;
	exports.encode = exports.stringify = encode;
	});
	var querystring_1 = querystring.decode;
	var querystring_2 = querystring.parse;
	var querystring_3 = querystring.encode;
	var querystring_4 = querystring.stringify;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
	/**
	* The Qlik Sense configuration object.
	* @typedef {Object} SenseConfiguration
	* @property {String} [appId] The app id. If omitted, only the global object is returned.
	*                            Otherwise both global and app object are returned.
	* @property {Boolean} [noData=false] Whether to open the app without data.
	* @property {Boolean} [secure=true] Set to false if an unsecure WebSocket should be used.
	* @property {String} [host] Host address.
	* @property {Number} [port] Port to connect to.
	* @property {String} [prefix="/"] The absolute base path to use when connecting.
	*                             Used for proxy prefixes.
	* @property {String} [subpath=""] The subpath.
	* @property {String} [route=""] Used to instruct Proxy to route to the correct receiver.
	* @property {String} [identity=""] Identity to use.
	* @property {Object} [urlParams={}] Used to add parameters to the WebSocket URL.
	* @property {Number} [ttl] A value in seconds that QIX Engine should keep the session
	*                             alive after socket disconnect (only works if QIX Engine supports it).
	*/

	function replaceLeadingAndTrailingSlashes(str) {
	  return str.replace(/(^[/]+)|([/]+$)/g, '');
	}

	var SenseUtilities =
	/*#__PURE__*/
	function () {
	  function SenseUtilities() {
	    _classCallCheck(this, SenseUtilities);
	  }

	  _createClass(SenseUtilities, null, [{
	    key: "configureDefaults",

	    /**
	    * Ensures that the configuration has defaults set.
	    *
	    * @private
	    * @param {SenseConfiguration} senseConfig The configuration to ensure defaults on.
	    */
	    value: function configureDefaults(senseConfig) {
	      if (!senseConfig.host) {
	        senseConfig.host = 'localhost';
	      }

	      if (typeof senseConfig.secure === 'undefined') {
	        senseConfig.secure = true;
	      }

	      if (!senseConfig.appId && !senseConfig.route) {
	        senseConfig.route = 'app/engineData';
	      }

	      if (typeof senseConfig.noData === 'undefined') {
	        senseConfig.noData = false;
	      }
	    }
	    /**
	    * Function used to build an URL.
	    * @param {SenseConfiguration} urlConfig - The URL configuration object.
	    * @returns {String} Returns the websocket URL.
	    */

	  }, {
	    key: "buildUrl",
	    value: function buildUrl(urlConfig) {
	      SenseUtilities.configureDefaults(urlConfig);
	      var secure = urlConfig.secure,
	          host = urlConfig.host,
	          port = urlConfig.port,
	          prefix = urlConfig.prefix,
	          subpath = urlConfig.subpath,
	          route = urlConfig.route,
	          identity = urlConfig.identity,
	          urlParams = urlConfig.urlParams,
	          ttl = urlConfig.ttl,
	          appId = urlConfig.appId;
	      var url = '';
	      url += "".concat(secure ? 'wss' : 'ws', "://");
	      url += host || 'localhost';

	      if (port) {
	        url += ":".concat(port);
	      }

	      if (prefix) {
	        url += "/".concat(replaceLeadingAndTrailingSlashes(prefix));
	      }

	      if (subpath) {
	        url += "/".concat(replaceLeadingAndTrailingSlashes(subpath));
	      }

	      if (route) {
	        url += "/".concat(replaceLeadingAndTrailingSlashes(route));
	      } else if (appId) {
	        url += "/app/".concat(encodeURIComponent(appId));
	      }

	      if (identity) {
	        url += "/identity/".concat(encodeURIComponent(identity));
	      }

	      if (ttl) {
	        url += "/ttl/".concat(ttl);
	      }

	      if (urlParams) {
	        url += "?".concat(querystring.stringify(urlParams));
	      }

	      return url;
	    }
	  }]);

	  return SenseUtilities;
	}();

	return SenseUtilities;

})));
//# sourceMappingURL=sense-utilities.js.map


/***/ }),

/***/ "./node_modules/ws/index.js":
/*!**********************************!*\
  !*** ./node_modules/ws/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const WebSocket = __webpack_require__(/*! ./lib/websocket */ "./node_modules/ws/lib/websocket.js");

WebSocket.createWebSocketStream = __webpack_require__(/*! ./lib/stream */ "./node_modules/ws/lib/stream.js");
WebSocket.Server = __webpack_require__(/*! ./lib/websocket-server */ "./node_modules/ws/lib/websocket-server.js");
WebSocket.Receiver = __webpack_require__(/*! ./lib/receiver */ "./node_modules/ws/lib/receiver.js");
WebSocket.Sender = __webpack_require__(/*! ./lib/sender */ "./node_modules/ws/lib/sender.js");

module.exports = WebSocket;


/***/ }),

/***/ "./node_modules/ws/lib/buffer-util.js":
/*!********************************************!*\
  !*** ./node_modules/ws/lib/buffer-util.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { EMPTY_BUFFER } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
function concat(list, totalLength) {
  if (list.length === 0) return EMPTY_BUFFER;
  if (list.length === 1) return list[0];

  const target = Buffer.allocUnsafe(totalLength);
  let offset = 0;

  for (let i = 0; i < list.length; i++) {
    const buf = list[i];
    target.set(buf, offset);
    offset += buf.length;
  }

  if (offset < totalLength) return target.slice(0, offset);

  return target;
}

/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
function _mask(source, mask, output, offset, length) {
  for (let i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
}

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
function _unmask(buffer, mask) {
  // Required until https://github.com/nodejs/node/issues/9006 is resolved.
  const length = buffer.length;
  for (let i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} buf The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 * @public
 */
function toArrayBuffer(buf) {
  if (buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/**
 * Converts `data` to a `Buffer`.
 *
 * @param {*} data The data to convert
 * @return {Buffer} The buffer
 * @throws {TypeError}
 * @public
 */
function toBuffer(data) {
  toBuffer.readOnly = true;

  if (Buffer.isBuffer(data)) return data;

  let buf;

  if (data instanceof ArrayBuffer) {
    buf = Buffer.from(data);
  } else if (ArrayBuffer.isView(data)) {
    buf = viewToBuffer(data);
  } else {
    buf = Buffer.from(data);
    toBuffer.readOnly = false;
  }

  return buf;
}

/**
 * Converts an `ArrayBuffer` view into a buffer.
 *
 * @param {(DataView|TypedArray)} view The view to convert
 * @return {Buffer} Converted view
 * @private
 */
function viewToBuffer(view) {
  const buf = Buffer.from(view.buffer);

  if (view.byteLength !== view.buffer.byteLength) {
    return buf.slice(view.byteOffset, view.byteOffset + view.byteLength);
  }

  return buf;
}

try {
  const bufferUtil = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'bufferutil'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  const bu = bufferUtil.BufferUtil || bufferUtil;

  module.exports = {
    concat,
    mask(source, mask, output, offset, length) {
      if (length < 48) _mask(source, mask, output, offset, length);
      else bu.mask(source, mask, output, offset, length);
    },
    toArrayBuffer,
    toBuffer,
    unmask(buffer, mask) {
      if (buffer.length < 32) _unmask(buffer, mask);
      else bu.unmask(buffer, mask);
    }
  };
} catch (e) /* istanbul ignore next */ {
  module.exports = {
    concat,
    mask: _mask,
    toArrayBuffer,
    toBuffer,
    unmask: _unmask
  };
}


/***/ }),

/***/ "./node_modules/ws/lib/constants.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/constants.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
  kStatusCode: Symbol('status-code'),
  kWebSocket: Symbol('websocket'),
  EMPTY_BUFFER: Buffer.alloc(0),
  NOOP: () => {}
};


/***/ }),

/***/ "./node_modules/ws/lib/event-target.js":
/*!*********************************************!*\
  !*** ./node_modules/ws/lib/event-target.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Class representing an event.
 *
 * @private
 */
class Event {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @param {Object} target A reference to the target to which the event was dispatched
   */
  constructor(type, target) {
    this.target = target;
    this.type = type;
  }
}

/**
 * Class representing a message event.
 *
 * @extends Event
 * @private
 */
class MessageEvent extends Event {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor(data, target) {
    super('message', target);

    this.data = data;
  }
}

/**
 * Class representing a close event.
 *
 * @extends Event
 * @private
 */
class CloseEvent extends Event {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {Number} code The status code explaining why the connection is being closed
   * @param {String} reason A human-readable string explaining why the connection is closing
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor(code, reason, target) {
    super('close', target);

    this.wasClean = target._closeFrameReceived && target._closeFrameSent;
    this.reason = reason;
    this.code = code;
  }
}

/**
 * Class representing an open event.
 *
 * @extends Event
 * @private
 */
class OpenEvent extends Event {
  /**
   * Create a new `OpenEvent`.
   *
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor(target) {
    super('open', target);
  }
}

/**
 * Class representing an error event.
 *
 * @extends Event
 * @private
 */
class ErrorEvent extends Event {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param {Object} error The error that generated this event
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor(error, target) {
    super('error', target);

    this.message = error.message;
    this.error = error;
  }
}

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} method A string representing the event type to listen for
   * @param {Function} listener The listener to add
   * @public
   */
  addEventListener(method, listener) {
    if (typeof listener !== 'function') return;

    function onMessage(data) {
      listener.call(this, new MessageEvent(data, this));
    }

    function onClose(code, message) {
      listener.call(this, new CloseEvent(code, message, this));
    }

    function onError(error) {
      listener.call(this, new ErrorEvent(error, this));
    }

    function onOpen() {
      listener.call(this, new OpenEvent(this));
    }

    if (method === 'message') {
      onMessage._listener = listener;
      this.on(method, onMessage);
    } else if (method === 'close') {
      onClose._listener = listener;
      this.on(method, onClose);
    } else if (method === 'error') {
      onError._listener = listener;
      this.on(method, onError);
    } else if (method === 'open') {
      onOpen._listener = listener;
      this.on(method, onOpen);
    } else {
      this.on(method, listener);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} method A string representing the event type to remove
   * @param {Function} listener The listener to remove
   * @public
   */
  removeEventListener(method, listener) {
    const listeners = this.listeners(method);

    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener || listeners[i]._listener === listener) {
        this.removeListener(method, listeners[i]);
      }
    }
  }
};

module.exports = EventTarget;


/***/ }),

/***/ "./node_modules/ws/lib/extension.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/extension.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
// Allowed token characters:
//
// '!', '#', '$', '%', '&', ''', '*', '+', '-',
// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
//
// tokenChars[32] === 0 // ' '
// tokenChars[33] === 1 // '!'
// tokenChars[34] === 0 // '"'
// ...
//
// prettier-ignore
const tokenChars = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

/**
 * Adds an offer to the map of extension offers or a parameter to the map of
 * parameters.
 *
 * @param {Object} dest The map of extension offers or parameters
 * @param {String} name The extension or parameter name
 * @param {(Object|Boolean|String)} elem The extension parameters or the
 *     parameter value
 * @private
 */
function push(dest, name, elem) {
  if (dest[name] === undefined) dest[name] = [elem];
  else dest[name].push(elem);
}

/**
 * Parses the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} header The field value of the header
 * @return {Object} The parsed object
 * @public
 */
function parse(header) {
  const offers = Object.create(null);

  if (header === undefined || header === '') return offers;

  let params = Object.create(null);
  let mustUnescape = false;
  let isEscaping = false;
  let inQuotes = false;
  let extensionName;
  let paramName;
  let start = -1;
  let end = -1;
  let i = 0;

  for (; i < header.length; i++) {
    const code = header.charCodeAt(i);

    if (extensionName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 /* ' ' */ || code === 0x09 /* '\t' */) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        const name = header.slice(start, end);
        if (code === 0x2c) {
          push(offers, name, params);
          params = Object.create(null);
        } else {
          extensionName = name;
        }

        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else if (paramName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 || code === 0x09) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        push(params, header.slice(start, end), true);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        start = end = -1;
      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
        paramName = header.slice(start, i);
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else {
      //
      // The value of a quoted-string after unescaping must conform to the
      // token ABNF, so only token characters are valid.
      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
      //
      if (isEscaping) {
        if (tokenChars[code] !== 1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (start === -1) start = i;
        else if (!mustUnescape) mustUnescape = true;
        isEscaping = false;
      } else if (inQuotes) {
        if (tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (code === 0x22 /* '"' */ && start !== -1) {
          inQuotes = false;
          end = i;
        } else if (code === 0x5c /* '\' */) {
          isEscaping = true;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
        inQuotes = true;
      } else if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
        if (end === -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        let value = header.slice(start, end);
        if (mustUnescape) {
          value = value.replace(/\\/g, '');
          mustUnescape = false;
        }
        push(params, paramName, value);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        paramName = undefined;
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    }
  }

  if (start === -1 || inQuotes) {
    throw new SyntaxError('Unexpected end of input');
  }

  if (end === -1) end = i;
  const token = header.slice(start, end);
  if (extensionName === undefined) {
    push(offers, token, params);
  } else {
    if (paramName === undefined) {
      push(params, token, true);
    } else if (mustUnescape) {
      push(params, paramName, token.replace(/\\/g, ''));
    } else {
      push(params, paramName, token);
    }
    push(offers, extensionName, params);
  }

  return offers;
}

/**
 * Builds the `Sec-WebSocket-Extensions` header field value.
 *
 * @param {Object} extensions The map of extensions and parameters to format
 * @return {String} A string representing the given object
 * @public
 */
function format(extensions) {
  return Object.keys(extensions)
    .map((extension) => {
      let configurations = extensions[extension];
      if (!Array.isArray(configurations)) configurations = [configurations];
      return configurations
        .map((params) => {
          return [extension]
            .concat(
              Object.keys(params).map((k) => {
                let values = params[k];
                if (!Array.isArray(values)) values = [values];
                return values
                  .map((v) => (v === true ? k : `${k}=${v}`))
                  .join('; ');
              })
            )
            .join('; ');
        })
        .join(', ');
    })
    .join(', ');
}

module.exports = { format, parse };


/***/ }),

/***/ "./node_modules/ws/lib/limiter.js":
/*!****************************************!*\
  !*** ./node_modules/ws/lib/limiter.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const kDone = Symbol('kDone');
const kRun = Symbol('kRun');

/**
 * A very simple job queue with adjustable concurrency. Adapted from
 * https://github.com/STRML/async-limiter
 */
class Limiter {
  /**
   * Creates a new `Limiter`.
   *
   * @param {Number} concurrency The maximum number of jobs allowed to run
   *     concurrently
   */
  constructor(concurrency) {
    this[kDone] = () => {
      this.pending--;
      this[kRun]();
    };
    this.concurrency = concurrency || Infinity;
    this.jobs = [];
    this.pending = 0;
  }

  /**
   * Adds a job to the queue.
   *
   * @public
   */
  add(job) {
    this.jobs.push(job);
    this[kRun]();
  }

  /**
   * Removes a job from the queue and runs it if possible.
   *
   * @private
   */
  [kRun]() {
    if (this.pending === this.concurrency) return;

    if (this.jobs.length) {
      const job = this.jobs.shift();

      this.pending++;
      job(this[kDone]);
    }
  }
}

module.exports = Limiter;


/***/ }),

/***/ "./node_modules/ws/lib/permessage-deflate.js":
/*!***************************************************!*\
  !*** ./node_modules/ws/lib/permessage-deflate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const zlib = __webpack_require__(/*! zlib */ "zlib");

const bufferUtil = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");
const Limiter = __webpack_require__(/*! ./limiter */ "./node_modules/ws/lib/limiter.js");
const { kStatusCode, NOOP } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const kPerMessageDeflate = Symbol('permessage-deflate');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');

//
// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's an issue.
//
let zlibLimiter;

/**
 * permessage-deflate implementation.
 */
class PerMessageDeflate {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} options Configuration options
   * @param {Boolean} options.serverNoContextTakeover Request/accept disabling
   *     of server context takeover
   * @param {Boolean} options.clientNoContextTakeover Advertise/acknowledge
   *     disabling of client context takeover
   * @param {(Boolean|Number)} options.serverMaxWindowBits Request/confirm the
   *     use of a custom server window size
   * @param {(Boolean|Number)} options.clientMaxWindowBits Advertise support
   *     for, or request, a custom client window size
   * @param {Object} options.zlibDeflateOptions Options to pass to zlib on deflate
   * @param {Object} options.zlibInflateOptions Options to pass to zlib on inflate
   * @param {Number} options.threshold Size (in bytes) below which messages
   *     should not be compressed
   * @param {Number} options.concurrencyLimit The number of concurrent calls to
   *     zlib
   * @param {Boolean} isServer Create the instance in either server or client
   *     mode
   * @param {Number} maxPayload The maximum allowed message length
   */
  constructor(options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold =
      this._options.threshold !== undefined ? this._options.threshold : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency =
        this._options.concurrencyLimit !== undefined
          ? this._options.concurrencyLimit
          : 10;
      zlibLimiter = new Limiter(concurrency);
    }
  }

  /**
   * @type {String}
   */
  static get extensionName() {
    return 'permessage-deflate';
  }

  /**
   * Create an extension negotiation offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer() {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept an extension negotiation offer/response.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Object} Accepted configuration
   * @public
   */
  accept(configurations) {
    configurations = this.normalizeParams(configurations);

    this.params = this._isServer
      ? this.acceptAsServer(configurations)
      : this.acceptAsClient(configurations);

    return this.params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup() {
    if (this._inflate) {
      this._inflate.close();
      this._inflate = null;
    }

    if (this._deflate) {
      if (this._deflate[kCallback]) {
        this._deflate[kCallback]();
      }

      this._deflate.close();
      this._deflate = null;
    }
  }

  /**
   *  Accept an extension negotiation offer.
   *
   * @param {Array} offers The extension negotiation offers
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer(offers) {
    const opts = this._options;
    const accepted = offers.find((params) => {
      if (
        (opts.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (params.server_max_window_bits &&
          (opts.serverMaxWindowBits === false ||
            (typeof opts.serverMaxWindowBits === 'number' &&
              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
        (typeof opts.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return false;
      }

      return true;
    });

    if (!accepted) {
      throw new Error('None of the extension offers can be accepted');
    }

    if (opts.serverNoContextTakeover) {
      accepted.server_no_context_takeover = true;
    }
    if (opts.clientNoContextTakeover) {
      accepted.client_no_context_takeover = true;
    }
    if (typeof opts.serverMaxWindowBits === 'number') {
      accepted.server_max_window_bits = opts.serverMaxWindowBits;
    }
    if (typeof opts.clientMaxWindowBits === 'number') {
      accepted.client_max_window_bits = opts.clientMaxWindowBits;
    } else if (
      accepted.client_max_window_bits === true ||
      opts.clientMaxWindowBits === false
    ) {
      delete accepted.client_max_window_bits;
    }

    return accepted;
  }

  /**
   * Accept the extension negotiation response.
   *
   * @param {Array} response The extension negotiation response
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient(response) {
    const params = response[0];

    if (
      this._options.clientNoContextTakeover === false &&
      params.client_no_context_takeover
    ) {
      throw new Error('Unexpected parameter "client_no_context_takeover"');
    }

    if (!params.client_max_window_bits) {
      if (typeof this._options.clientMaxWindowBits === 'number') {
        params.client_max_window_bits = this._options.clientMaxWindowBits;
      }
    } else if (
      this._options.clientMaxWindowBits === false ||
      (typeof this._options.clientMaxWindowBits === 'number' &&
        params.client_max_window_bits > this._options.clientMaxWindowBits)
    ) {
      throw new Error(
        'Unexpected or invalid parameter "client_max_window_bits"'
      );
    }

    return params;
  }

  /**
   * Normalize parameters.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Array} The offers/response with normalized parameters
   * @private
   */
  normalizeParams(configurations) {
    configurations.forEach((params) => {
      Object.keys(params).forEach((key) => {
        let value = params[key];

        if (value.length > 1) {
          throw new Error(`Parameter "${key}" must have only a single value`);
        }

        value = value[0];

        if (key === 'client_max_window_bits') {
          if (value !== true) {
            const num = +value;
            if (!Number.isInteger(num) || num < 8 || num > 15) {
              throw new TypeError(
                `Invalid value for parameter "${key}": ${value}`
              );
            }
            value = num;
          } else if (!this._isServer) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else if (key === 'server_max_window_bits') {
          const num = +value;
          if (!Number.isInteger(num) || num < 8 || num > 15) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
          value = num;
        } else if (
          key === 'client_no_context_takeover' ||
          key === 'server_no_context_takeover'
        ) {
          if (value !== true) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else {
          throw new Error(`Unknown parameter "${key}"`);
        }

        params[key] = value;
      });
    });

    return configurations;
  }

  /**
   * Decompress data. Concurrency limited.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        if (err || result) {
          callback(err, result);
        }
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress(data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._inflate = zlib.createInflateRaw({
        ...this._options.zlibInflateOptions,
        windowBits
      });
      this._inflate[kPerMessageDeflate] = this;
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = bufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress(data, fin, callback) {
    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        ...this._options.zlibDeflateOptions,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      //
      // An `'error'` event is emitted, only on Node.js < 10.0.0, if the
      // `zlib.DeflateRaw` instance is closed while data is being processed.
      // This can happen if `PerMessageDeflate#cleanup()` is called at the wrong
      // time due to an abnormal WebSocket closure.
      //
      this._deflate.on('error', NOOP);
      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kCallback] = callback;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      if (!this._deflate) {
        //
        // This `if` statement is only needed for Node.js < 10.0.0 because as of
        // commit https://github.com/nodejs/node/commit/5e3f5164, the flush
        // callback is no longer called if the deflate stream is closed while
        // data is being processed.
        //
        return;
      }

      let data = bufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) data = data.slice(0, data.length - 4);

      //
      // Ensure that the callback will not be called again in
      // `PerMessageDeflate#cleanup()`.
      //
      this._deflate[kCallback] = null;

      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
        this._deflate.close();
        this._deflate = null;
      } else {
        this._deflate[kTotalLength] = 0;
        this._deflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }
}

module.exports = PerMessageDeflate;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData(chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData(chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kPerMessageDeflate]._maxPayload < 1 ||
    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError] = new RangeError('Max payload size exceeded');
  this[kError][kStatusCode] = 1009;
  this.removeListener('data', inflateOnData);
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError(err) {
  //
  // There is no need to call `Zlib#close()` as the handle is automatically
  // closed when an error is emitted.
  //
  this[kPerMessageDeflate]._inflate = null;
  err[kStatusCode] = 1007;
  this[kCallback](err);
}


/***/ }),

/***/ "./node_modules/ws/lib/receiver.js":
/*!*****************************************!*\
  !*** ./node_modules/ws/lib/receiver.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { Writable } = __webpack_require__(/*! stream */ "stream");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  kStatusCode,
  kWebSocket
} = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const { concat, toArrayBuffer, unmask } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");
const { isValidStatusCode, isValidUTF8 } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
 * HyBi Receiver implementation.
 *
 * @extends stream.Writable
 */
class Receiver extends Writable {
  /**
   * Creates a Receiver instance.
   *
   * @param {String} binaryType The type for binary data
   * @param {Object} extensions An object containing the negotiated extensions
   * @param {Number} maxPayload The maximum allowed message length
   */
  constructor(binaryType, extensions, maxPayload) {
    super();

    this._binaryType = binaryType || BINARY_TYPES[0];
    this[kWebSocket] = undefined;
    this._extensions = extensions || {};
    this._maxPayload = maxPayload | 0;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._mask = undefined;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._state = GET_INFO;
    this._loop = false;
  }

  /**
   * Implements `Writable.prototype._write()`.
   *
   * @param {Buffer} chunk The chunk of data to write
   * @param {String} encoding The character encoding of `chunk`
   * @param {Function} cb Callback
   */
  _write(chunk, encoding, cb) {
    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

    this._bufferedBytes += chunk.length;
    this._buffers.push(chunk);
    this.startLoop(cb);
  }

  /**
   * Consumes `n` bytes from the buffered data.
   *
   * @param {Number} n The number of bytes to consume
   * @return {Buffer} The consumed bytes
   * @private
   */
  consume(n) {
    this._bufferedBytes -= n;

    if (n === this._buffers[0].length) return this._buffers.shift();

    if (n < this._buffers[0].length) {
      const buf = this._buffers[0];
      this._buffers[0] = buf.slice(n);
      return buf.slice(0, n);
    }

    const dst = Buffer.allocUnsafe(n);

    do {
      const buf = this._buffers[0];
      const offset = dst.length - n;

      if (n >= buf.length) {
        dst.set(this._buffers.shift(), offset);
      } else {
        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
        this._buffers[0] = buf.slice(n);
      }

      n -= buf.length;
    } while (n > 0);

    return dst;
  }

  /**
   * Starts the parsing loop.
   *
   * @param {Function} cb Callback
   * @private
   */
  startLoop(cb) {
    let err;
    this._loop = true;

    do {
      switch (this._state) {
        case GET_INFO:
          err = this.getInfo();
          break;
        case GET_PAYLOAD_LENGTH_16:
          err = this.getPayloadLength16();
          break;
        case GET_PAYLOAD_LENGTH_64:
          err = this.getPayloadLength64();
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          err = this.getData(cb);
          break;
        default:
          // `INFLATING`
          this._loop = false;
          return;
      }
    } while (this._loop);

    cb(err);
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getInfo() {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    const buf = this.consume(2);

    if ((buf[0] & 0x30) !== 0x00) {
      this._loop = false;
      return error(RangeError, 'RSV2 and RSV3 must be clear', true, 1002);
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
      this._loop = false;
      return error(RangeError, 'RSV1 must be clear', true, 1002);
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        this._loop = false;
        return error(RangeError, 'RSV1 must be clear', true, 1002);
      }

      if (!this._fragmented) {
        this._loop = false;
        return error(RangeError, 'invalid opcode 0', true, 1002);
      }

      this._opcode = this._fragmented;
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        this._loop = false;
        return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002);
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        this._loop = false;
        return error(RangeError, 'FIN must be set', true, 1002);
      }

      if (compressed) {
        this._loop = false;
        return error(RangeError, 'RSV1 must be clear', true, 1002);
      }

      if (this._payloadLength > 0x7d) {
        this._loop = false;
        return error(
          RangeError,
          `invalid payload length ${this._payloadLength}`,
          true,
          1002
        );
      }
    } else {
      this._loop = false;
      return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002);
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else return this.haveLength();
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getPayloadLength16() {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    this._payloadLength = this.consume(2).readUInt16BE(0);
    return this.haveLength();
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getPayloadLength64() {
    if (this._bufferedBytes < 8) {
      this._loop = false;
      return;
    }

    const buf = this.consume(8);
    const num = buf.readUInt32BE(0);

    //
    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
    // if payload length is greater than this number.
    //
    if (num > Math.pow(2, 53 - 32) - 1) {
      this._loop = false;
      return error(
        RangeError,
        'Unsupported WebSocket frame: payload length > 2^53 - 1',
        false,
        1009
      );
    }

    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
    return this.haveLength();
  }

  /**
   * Payload length has been read.
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  haveLength() {
    if (this._payloadLength && this._opcode < 0x08) {
      this._totalPayloadLength += this._payloadLength;
      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
        this._loop = false;
        return error(RangeError, 'Max payload size exceeded', false, 1009);
      }
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask() {
    if (this._bufferedBytes < 4) {
      this._loop = false;
      return;
    }

    this._mask = this.consume(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @param {Function} cb Callback
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  getData(cb) {
    let data = EMPTY_BUFFER;

    if (this._payloadLength) {
      if (this._bufferedBytes < this._payloadLength) {
        this._loop = false;
        return;
      }

      data = this.consume(this._payloadLength);
      if (this._masked) unmask(data, this._mask);
    }

    if (this._opcode > 0x07) return this.controlMessage(data);

    if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data, cb);
      return;
    }

    if (data.length) {
      //
      // This message is not compressed so its lenght is the sum of the payload
      // length of all fragments.
      //
      this._messageLength = this._totalPayloadLength;
      this._fragments.push(data);
    }

    return this.dataMessage();
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @param {Function} cb Callback
   * @private
   */
  decompress(data, cb) {
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) return cb(err);

      if (buf.length) {
        this._messageLength += buf.length;
        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
          return cb(
            error(RangeError, 'Max payload size exceeded', false, 1009)
          );
        }

        this._fragments.push(buf);
      }

      const er = this.dataMessage();
      if (er) return cb(er);

      this.startLoop(cb);
    });
  }

  /**
   * Handles a data message.
   *
   * @return {(Error|undefined)} A possible error
   * @private
   */
  dataMessage() {
    if (this._fin) {
      const messageLength = this._messageLength;
      const fragments = this._fragments;

      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];

      if (this._opcode === 2) {
        let data;

        if (this._binaryType === 'nodebuffer') {
          data = concat(fragments, messageLength);
        } else if (this._binaryType === 'arraybuffer') {
          data = toArrayBuffer(concat(fragments, messageLength));
        } else {
          data = fragments;
        }

        this.emit('message', data);
      } else {
        const buf = concat(fragments, messageLength);

        if (!isValidUTF8(buf)) {
          this._loop = false;
          return error(Error, 'invalid UTF-8 sequence', true, 1007);
        }

        this.emit('message', buf.toString());
      }
    }

    this._state = GET_INFO;
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  controlMessage(data) {
    if (this._opcode === 0x08) {
      this._loop = false;

      if (data.length === 0) {
        this.emit('conclude', 1005, '');
        this.end();
      } else if (data.length === 1) {
        return error(RangeError, 'invalid payload length 1', true, 1002);
      } else {
        const code = data.readUInt16BE(0);

        if (!isValidStatusCode(code)) {
          return error(RangeError, `invalid status code ${code}`, true, 1002);
        }

        const buf = data.slice(2);

        if (!isValidUTF8(buf)) {
          return error(Error, 'invalid UTF-8 sequence', true, 1007);
        }

        this.emit('conclude', code, buf.toString());
        this.end();
      }
    } else if (this._opcode === 0x09) {
      this.emit('ping', data);
    } else {
      this.emit('pong', data);
    }

    this._state = GET_INFO;
  }
}

module.exports = Receiver;

/**
 * Builds an error object.
 *
 * @param {(Error|RangeError)} ErrorCtor The error constructor
 * @param {String} message The error message
 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
 *     `message`
 * @param {Number} statusCode The status code
 * @return {(Error|RangeError)} The error
 * @private
 */
function error(ErrorCtor, message, prefix, statusCode) {
  const err = new ErrorCtor(
    prefix ? `Invalid WebSocket frame: ${message}` : message
  );

  Error.captureStackTrace(err, error);
  err[kStatusCode] = statusCode;
  return err;
}


/***/ }),

/***/ "./node_modules/ws/lib/sender.js":
/*!***************************************!*\
  !*** ./node_modules/ws/lib/sender.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { randomFillSync } = __webpack_require__(/*! crypto */ "crypto");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const { EMPTY_BUFFER } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const { isValidStatusCode } = __webpack_require__(/*! ./validation */ "./node_modules/ws/lib/validation.js");
const { mask: applyMask, toBuffer } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");

const mask = Buffer.alloc(4);

/**
 * HyBi Sender implementation.
 */
class Sender {
  /**
   * Creates a Sender instance.
   *
   * @param {net.Socket} socket The connection socket
   * @param {Object} extensions An object containing the negotiated extensions
   */
  constructor(socket, extensions) {
    this._extensions = extensions || {};
    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._deflating = false;
    this._queue = [];
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {Buffer} data The data to frame
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @return {Buffer[]} The framed data as a list of `Buffer` instances
   * @public
   */
  static frame(data, options) {
    const merge = options.mask && options.readOnly;
    let offset = options.mask ? 6 : 2;
    let payloadLength = data.length;

    if (data.length >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (data.length > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    target[1] = payloadLength;

    if (payloadLength === 126) {
      target.writeUInt16BE(data.length, 2);
    } else if (payloadLength === 127) {
      target.writeUInt32BE(0, 2);
      target.writeUInt32BE(data.length, 6);
    }

    if (!options.mask) return [target, data];

    randomFillSync(mask, 0, 4);

    target[1] |= 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (merge) {
      applyMask(data, mask, target, offset, data.length);
      return [target];
    }

    applyMask(data, mask, data, 0, data.length);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {(Number|undefined)} code The status code component of the body
   * @param {String} data The message component of the body
   * @param {Boolean} mask Specifies whether or not to mask the message
   * @param {Function} cb Callback
   * @public
   */
  close(code, data, mask, cb) {
    let buf;

    if (code === undefined) {
      buf = EMPTY_BUFFER;
    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
      throw new TypeError('First argument must be a valid error code number');
    } else if (data === undefined || data === '') {
      buf = Buffer.allocUnsafe(2);
      buf.writeUInt16BE(code, 0);
    } else {
      buf = Buffer.allocUnsafe(2 + Buffer.byteLength(data));
      buf.writeUInt16BE(code, 0);
      buf.write(data, 2);
    }

    if (this._deflating) {
      this.enqueue([this.doClose, buf, mask, cb]);
    } else {
      this.doClose(buf, mask, cb);
    }
  }

  /**
   * Frames and sends a close message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @private
   */
  doClose(data, mask, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x08,
        mask,
        readOnly: false
      }),
      cb
    );
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  ping(data, mask, cb) {
    const buf = toBuffer(data);

    if (this._deflating) {
      this.enqueue([this.doPing, buf, mask, toBuffer.readOnly, cb]);
    } else {
      this.doPing(buf, mask, toBuffer.readOnly, cb);
    }
  }

  /**
   * Frames and sends a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @param {Function} cb Callback
   * @private
   */
  doPing(data, mask, readOnly, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x09,
        mask,
        readOnly
      }),
      cb
    );
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  pong(data, mask, cb) {
    const buf = toBuffer(data);

    if (this._deflating) {
      this.enqueue([this.doPong, buf, mask, toBuffer.readOnly, cb]);
    } else {
      this.doPong(buf, mask, toBuffer.readOnly, cb);
    }
  }

  /**
   * Frames and sends a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @param {Function} cb Callback
   * @private
   */
  doPong(data, mask, readOnly, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x0a,
        mask,
        readOnly
      }),
      cb
    );
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  send(data, options, cb) {
    const buf = toBuffer(data);
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
    let opcode = options.binary ? 2 : 1;
    let rsv1 = options.compress;

    if (this._firstFragment) {
      this._firstFragment = false;
      if (rsv1 && perMessageDeflate) {
        rsv1 = buf.length >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    if (perMessageDeflate) {
      const opts = {
        fin: options.fin,
        rsv1,
        opcode,
        mask: options.mask,
        readOnly: toBuffer.readOnly
      };

      if (this._deflating) {
        this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
      } else {
        this.dispatch(buf, this._compress, opts, cb);
      }
    } else {
      this.sendFrame(
        Sender.frame(buf, {
          fin: options.fin,
          rsv1: false,
          opcode,
          mask: options.mask,
          readOnly: toBuffer.readOnly
        }),
        cb
      );
    }
  }

  /**
   * Dispatches a data message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} compress Specifies whether or not to compress `data`
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @param {Function} cb Callback
   * @private
   */
  dispatch(data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    this._deflating = true;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      this._deflating = false;
      options.readOnly = false;
      this.sendFrame(Sender.frame(buf, options), cb);
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue() {
    while (!this._deflating && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[1].length;
      Reflect.apply(params[0], this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue(params) {
    this._bufferedBytes += params[1].length;
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} cb Callback
   * @private
   */
  sendFrame(list, cb) {
    if (list.length === 2) {
      this._socket.cork();
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
      this._socket.uncork();
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

module.exports = Sender;


/***/ }),

/***/ "./node_modules/ws/lib/stream.js":
/*!***************************************!*\
  !*** ./node_modules/ws/lib/stream.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { Duplex } = __webpack_require__(/*! stream */ "stream");

/**
 * Emits the `'close'` event on a stream.
 *
 * @param {stream.Duplex} The stream.
 * @private
 */
function emitClose(stream) {
  stream.emit('close');
}

/**
 * The listener of the `'end'` event.
 *
 * @private
 */
function duplexOnEnd() {
  if (!this.destroyed && this._writableState.finished) {
    this.destroy();
  }
}

/**
 * The listener of the `'error'` event.
 *
 * @private
 */
function duplexOnError(err) {
  this.removeListener('error', duplexOnError);
  this.destroy();
  if (this.listenerCount('error') === 0) {
    // Do not suppress the throwing behavior.
    this.emit('error', err);
  }
}

/**
 * Wraps a `WebSocket` in a duplex stream.
 *
 * @param {WebSocket} ws The `WebSocket` to wrap
 * @param {Object} options The options for the `Duplex` constructor
 * @return {stream.Duplex} The duplex stream
 * @public
 */
function createWebSocketStream(ws, options) {
  let resumeOnReceiverDrain = true;

  function receiverOnDrain() {
    if (resumeOnReceiverDrain) ws._socket.resume();
  }

  if (ws.readyState === ws.CONNECTING) {
    ws.once('open', function open() {
      ws._receiver.removeAllListeners('drain');
      ws._receiver.on('drain', receiverOnDrain);
    });
  } else {
    ws._receiver.removeAllListeners('drain');
    ws._receiver.on('drain', receiverOnDrain);
  }

  const duplex = new Duplex({
    ...options,
    autoDestroy: false,
    emitClose: false,
    objectMode: false,
    writableObjectMode: false
  });

  ws.on('message', function message(msg) {
    if (!duplex.push(msg)) {
      resumeOnReceiverDrain = false;
      ws._socket.pause();
    }
  });

  ws.once('error', function error(err) {
    duplex.destroy(err);
  });

  ws.once('close', function close() {
    if (duplex.destroyed) return;

    duplex.push(null);
  });

  duplex._destroy = function(err, callback) {
    if (ws.readyState === ws.CLOSED) {
      callback(err);
      process.nextTick(emitClose, duplex);
      return;
    }

    ws.once('close', function close() {
      callback(err);
      process.nextTick(emitClose, duplex);
    });
    ws.terminate();
  };

  duplex._final = function(callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._final(callback);
      });
      return;
    }

    if (ws._socket._writableState.finished) {
      if (duplex._readableState.endEmitted) duplex.destroy();
      callback();
    } else {
      ws._socket.once('finish', function finish() {
        // `duplex` is not destroyed here because the `'end'` event will be
        // emitted on `duplex` after this `'finish'` event. The EOF signaling
        // `null` chunk is, in fact, pushed when the WebSocket emits `'close'`.
        callback();
      });
      ws.close();
    }
  };

  duplex._read = function() {
    if (ws.readyState === ws.OPEN && !resumeOnReceiverDrain) {
      resumeOnReceiverDrain = true;
      if (!ws._receiver._writableState.needDrain) ws._socket.resume();
    }
  };

  duplex._write = function(chunk, encoding, callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._write(chunk, encoding, callback);
      });
      return;
    }

    ws.send(chunk, callback);
  };

  duplex.on('end', duplexOnEnd);
  duplex.on('error', duplexOnError);
  return duplex;
}

module.exports = createWebSocketStream;


/***/ }),

/***/ "./node_modules/ws/lib/validation.js":
/*!*******************************************!*\
  !*** ./node_modules/ws/lib/validation.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


try {
  const isValidUTF8 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'utf-8-validate'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

  exports.isValidUTF8 =
    typeof isValidUTF8 === 'object'
      ? isValidUTF8.Validation.isValidUTF8 // utf-8-validate@<3.0.0
      : isValidUTF8;
} catch (e) /* istanbul ignore next */ {
  exports.isValidUTF8 = () => true;
}

/**
 * Checks if a status code is allowed in a close frame.
 *
 * @param {Number} code The status code
 * @return {Boolean} `true` if the status code is valid, else `false`
 * @public
 */
exports.isValidStatusCode = (code) => {
  return (
    (code >= 1000 &&
      code <= 1013 &&
      code !== 1004 &&
      code !== 1005 &&
      code !== 1006) ||
    (code >= 3000 && code <= 4999)
  );
};


/***/ }),

/***/ "./node_modules/ws/lib/websocket-server.js":
/*!*************************************************!*\
  !*** ./node_modules/ws/lib/websocket-server.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(/*! events */ "events");
const { createHash } = __webpack_require__(/*! crypto */ "crypto");
const { createServer, STATUS_CODES } = __webpack_require__(/*! http */ "http");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const WebSocket = __webpack_require__(/*! ./websocket */ "./node_modules/ws/lib/websocket.js");
const { format, parse } = __webpack_require__(/*! ./extension */ "./node_modules/ws/lib/extension.js");
const { GUID } = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");

const keyRegex = /^[+/0-9A-Za-z]{22}==$/;
const kUsedByWebSocketServer = Symbol('kUsedByWebSocketServer');

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {Number} options.backlog The maximum length of the queue of pending
   *     connections
   * @param {Boolean} options.clientTracking Specifies whether or not to track
   *     clients
   * @param {Function} options.handleProtocols A hook to handle protocols
   * @param {String} options.host The hostname where to bind the server
   * @param {Number} options.maxPayload The maximum allowed message size
   * @param {Boolean} options.noServer Enable no server mode
   * @param {String} options.path Accept only connections matching this path
   * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable
   *     permessage-deflate
   * @param {Number} options.port The port where to bind the server
   * @param {http.Server} options.server A pre-created HTTP/S server to use
   * @param {Function} options.verifyClient A hook to reject connections
   * @param {Function} callback A listener for the `listening` event
   */
  constructor(options, callback) {
    super();

    options = {
      maxPayload: 100 * 1024 * 1024,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null,
      ...options
    };

    if (options.port == null && !options.server && !options.noServer) {
      throw new TypeError(
        'One of the "port", "server", or "noServer" options must be specified'
      );
    }

    if (options.port != null) {
      this._server = createServer((req, res) => {
        const body = STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.listen(
        options.port,
        options.host,
        options.backlog,
        callback
      );
    } else if (options.server) {
      if (options.server[kUsedByWebSocketServer]) {
        throw new Error(
          'The HTTP/S server is already being used by another WebSocket server'
        );
      }

      options.server[kUsedByWebSocketServer] = true;
      this._server = options.server;
    }

    if (this._server) {
      this._removeListeners = addListeners(this._server, {
        listening: this.emit.bind(this, 'listening'),
        error: this.emit.bind(this, 'error'),
        upgrade: (req, socket, head) => {
          this.handleUpgrade(req, socket, head, (ws) => {
            this.emit('connection', ws, req);
          });
        }
      });
    }

    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
    if (options.clientTracking) this.clients = new Set();
    this.options = options;
  }

  /**
   * Returns the bound address, the address family name, and port of the server
   * as reported by the operating system if listening on an IP socket.
   * If the server is listening on a pipe or UNIX domain socket, the name is
   * returned as a string.
   *
   * @return {(Object|String|null)} The address of the server
   * @public
   */
  address() {
    if (this.options.noServer) {
      throw new Error('The server is operating in "noServer" mode');
    }

    if (!this._server) return null;
    return this._server.address();
  }

  /**
   * Close the server.
   *
   * @param {Function} cb Callback
   * @public
   */
  close(cb) {
    if (cb) this.once('close', cb);

    //
    // Terminate all associated clients.
    //
    if (this.clients) {
      for (const client of this.clients) client.terminate();
    }

    const server = this._server;

    if (server) {
      this._removeListeners();
      this._removeListeners = this._server = null;

      //
      // Close the http server if it was internally created.
      //
      if (this.options.port != null) {
        server.close(() => this.emit('close'));
        return;
      }

      delete server[kUsedByWebSocketServer];
    }

    process.nextTick(emitClose, this);
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle(req) {
    if (this.options.path) {
      const index = req.url.indexOf('?');
      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

      if (pathname !== this.options.path) return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade(req, socket, head, cb) {
    socket.on('error', socketOnError);

    const key =
      req.headers['sec-websocket-key'] !== undefined
        ? req.headers['sec-websocket-key'].trim()
        : false;
    const version = +req.headers['sec-websocket-version'];
    const extensions = {};

    if (
      req.method !== 'GET' ||
      req.headers.upgrade.toLowerCase() !== 'websocket' ||
      !key ||
      !keyRegex.test(key) ||
      (version !== 8 && version !== 13) ||
      !this.shouldHandle(req)
    ) {
      return abortHandshake(socket, 400);
    }

    if (this.options.perMessageDeflate) {
      const perMessageDeflate = new PerMessageDeflate(
        this.options.perMessageDeflate,
        true,
        this.options.maxPayload
      );

      try {
        const offers = parse(req.headers['sec-websocket-extensions']);

        if (offers[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        return abortHandshake(socket, 400);
      }
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin:
          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.connection.authorized || req.connection.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message, headers) => {
          if (!verified) {
            return abortHandshake(socket, code || 401, message, headers);
          }

          this.completeUpgrade(key, extensions, req, socket, head, cb);
        });
        return;
      }

      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
    }

    this.completeUpgrade(key, extensions, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {String} key The value of the `Sec-WebSocket-Key` header
   * @param {Object} extensions The accepted extensions
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @private
   */
  completeUpgrade(key, extensions, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${digest}`
    ];

    const ws = new WebSocket(null);
    let protocol = req.headers['sec-websocket-protocol'];

    if (protocol) {
      protocol = protocol.trim().split(/ *, */);

      //
      // Optionally call external protocol selection handler.
      //
      if (this.options.handleProtocols) {
        protocol = this.options.handleProtocols(protocol, req);
      } else {
        protocol = protocol[0];
      }

      if (protocol) {
        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
        ws.protocol = protocol;
      }
    }

    if (extensions[PerMessageDeflate.extensionName]) {
      const params = extensions[PerMessageDeflate.extensionName].params;
      const value = format({
        [PerMessageDeflate.extensionName]: [params]
      });
      headers.push(`Sec-WebSocket-Extensions: ${value}`);
      ws._extensions = extensions;
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('\r\n').join('\r\n'));
    socket.removeListener('error', socketOnError);

    ws.setSocket(socket, head, this.options.maxPayload);

    if (this.clients) {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    }

    cb(ws);
  }
}

module.exports = WebSocketServer;

/**
 * Add event listeners on an `EventEmitter` using a map of <event, listener>
 * pairs.
 *
 * @param {EventEmitter} server The event emitter
 * @param {Object.<String, Function>} map The listeners to add
 * @return {Function} A function that will remove the added listeners when called
 * @private
 */
function addListeners(server, map) {
  for (const event of Object.keys(map)) server.on(event, map[event]);

  return function removeListeners() {
    for (const event of Object.keys(map)) {
      server.removeListener(event, map[event]);
    }
  };
}

/**
 * Emit a `'close'` event on an `EventEmitter`.
 *
 * @param {EventEmitter} server The event emitter
 * @private
 */
function emitClose(server) {
  server.emit('close');
}

/**
 * Handle premature socket errors.
 *
 * @private
 */
function socketOnError() {
  this.destroy();
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {net.Socket} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @param {Object} [headers] Additional HTTP response headers
 * @private
 */
function abortHandshake(socket, code, message, headers) {
  if (socket.writable) {
    message = message || STATUS_CODES[code];
    headers = {
      Connection: 'close',
      'Content-type': 'text/html',
      'Content-Length': Buffer.byteLength(message),
      ...headers
    };

    socket.write(
      `HTTP/1.1 ${code} ${STATUS_CODES[code]}\r\n` +
        Object.keys(headers)
          .map((h) => `${h}: ${headers[h]}`)
          .join('\r\n') +
        '\r\n\r\n' +
        message
    );
  }

  socket.removeListener('error', socketOnError);
  socket.destroy();
}


/***/ }),

/***/ "./node_modules/ws/lib/websocket.js":
/*!******************************************!*\
  !*** ./node_modules/ws/lib/websocket.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(/*! events */ "events");
const https = __webpack_require__(/*! https */ "https");
const http = __webpack_require__(/*! http */ "http");
const net = __webpack_require__(/*! net */ "net");
const tls = __webpack_require__(/*! tls */ "tls");
const { randomBytes, createHash } = __webpack_require__(/*! crypto */ "crypto");
const { URL } = __webpack_require__(/*! url */ "url");

const PerMessageDeflate = __webpack_require__(/*! ./permessage-deflate */ "./node_modules/ws/lib/permessage-deflate.js");
const Receiver = __webpack_require__(/*! ./receiver */ "./node_modules/ws/lib/receiver.js");
const Sender = __webpack_require__(/*! ./sender */ "./node_modules/ws/lib/sender.js");
const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  GUID,
  kStatusCode,
  kWebSocket,
  NOOP
} = __webpack_require__(/*! ./constants */ "./node_modules/ws/lib/constants.js");
const { addEventListener, removeEventListener } = __webpack_require__(/*! ./event-target */ "./node_modules/ws/lib/event-target.js");
const { format, parse } = __webpack_require__(/*! ./extension */ "./node_modules/ws/lib/extension.js");
const { toBuffer } = __webpack_require__(/*! ./buffer-util */ "./node_modules/ws/lib/buffer-util.js");

const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000;

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
  /**
   * Create a new `WebSocket`.
   *
   * @param {(String|url.URL)} address The URL to which to connect
   * @param {(String|String[])} protocols The subprotocols
   * @param {Object} options Connection options
   */
  constructor(address, protocols, options) {
    super();

    this.readyState = WebSocket.CONNECTING;
    this.protocol = '';

    this._binaryType = BINARY_TYPES[0];
    this._closeFrameReceived = false;
    this._closeFrameSent = false;
    this._closeMessage = '';
    this._closeTimer = null;
    this._closeCode = 1006;
    this._extensions = {};
    this._receiver = null;
    this._sender = null;
    this._socket = null;

    if (address !== null) {
      this._bufferedAmount = 0;
      this._isServer = false;
      this._redirects = 0;

      if (Array.isArray(protocols)) {
        protocols = protocols.join(', ');
      } else if (typeof protocols === 'object' && protocols !== null) {
        options = protocols;
        protocols = undefined;
      }

      initAsClient(this, address, protocols, options);
    } else {
      this._isServer = true;
    }
  }

  get CONNECTING() {
    return WebSocket.CONNECTING;
  }
  get CLOSING() {
    return WebSocket.CLOSING;
  }
  get CLOSED() {
    return WebSocket.CLOSED;
  }
  get OPEN() {
    return WebSocket.OPEN;
  }

  /**
   * This deviates from the WHATWG interface since ws doesn't support the
   * required default "blob" type (instead we define a custom "nodebuffer"
   * type).
   *
   * @type {String}
   */
  get binaryType() {
    return this._binaryType;
  }

  set binaryType(type) {
    if (!BINARY_TYPES.includes(type)) return;

    this._binaryType = type;

    //
    // Allow to change `binaryType` on the fly.
    //
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * @type {Number}
   */
  get bufferedAmount() {
    if (!this._socket) return this._bufferedAmount;

    //
    // `socket.bufferSize` is `undefined` if the socket is closed.
    //
    return (this._socket.bufferSize || 0) + this._sender._bufferedBytes;
  }

  /**
   * @type {String}
   */
  get extensions() {
    return Object.keys(this._extensions).join();
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Number} maxPayload The maximum allowed message size
   * @private
   */
  setSocket(socket, head, maxPayload) {
    const receiver = new Receiver(
      this._binaryType,
      this._extensions,
      maxPayload
    );

    this._sender = new Sender(socket, this._extensions);
    this._receiver = receiver;
    this._socket = socket;

    receiver[kWebSocket] = this;
    socket[kWebSocket] = this;

    receiver.on('conclude', receiverOnConclude);
    receiver.on('drain', receiverOnDrain);
    receiver.on('error', receiverOnError);
    receiver.on('message', receiverOnMessage);
    receiver.on('ping', receiverOnPing);
    receiver.on('pong', receiverOnPong);

    socket.setTimeout(0);
    socket.setNoDelay();

    if (head.length > 0) socket.unshift(head);

    socket.on('close', socketOnClose);
    socket.on('data', socketOnData);
    socket.on('end', socketOnEnd);
    socket.on('error', socketOnError);

    this.readyState = WebSocket.OPEN;
    this.emit('open');
  }

  /**
   * Emit the `'close'` event.
   *
   * @private
   */
  emitClose() {
    this.readyState = WebSocket.CLOSED;

    if (!this._socket) {
      this.emit('close', this._closeCode, this._closeMessage);
      return;
    }

    if (this._extensions[PerMessageDeflate.extensionName]) {
      this._extensions[PerMessageDeflate.extensionName].cleanup();
    }

    this._receiver.removeAllListeners();
    this.emit('close', this._closeCode, this._closeMessage);
  }

  /**
   * Start a closing handshake.
   *
   *          +----------+   +-----------+   +----------+
   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
   *    |     +----------+   +-----------+   +----------+     |
   *          +----------+   +-----------+         |
   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
   *          +----------+   +-----------+   |
   *    |           |                        |   +---+        |
   *                +------------------------+-->|fin| - - - -
   *    |         +---+                      |   +---+
   *     - - - - -|fin|<---------------------+
   *              +---+
   *
   * @param {Number} code Status code explaining why the connection is closing
   * @param {String} data A string explaining why the connection is closing
   * @public
   */
  close(code, data) {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      return abortHandshake(this, this._req, msg);
    }

    if (this.readyState === WebSocket.CLOSING) {
      if (this._closeFrameSent && this._closeFrameReceived) this._socket.end();
      return;
    }

    this.readyState = WebSocket.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      //
      // This error is handled by the `'error'` listener on the socket. We only
      // want to know if the close frame has been sent here.
      //
      if (err) return;

      this._closeFrameSent = true;
      if (this._closeFrameReceived) this._socket.end();
    });

    //
    // Specify a timeout for the closing handshake to complete.
    //
    this._closeTimer = setTimeout(
      this._socket.destroy.bind(this._socket),
      closeTimeout
    );
  }

  /**
   * Send a ping.
   *
   * @param {*} data The data to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Function} cb Callback which is executed when the ping is sent
   * @public
   */
  ping(data, mask, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Send a pong.
   *
   * @param {*} data The data to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Function} cb Callback which is executed when the pong is sent
   * @public
   */
  pong(data, mask, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress
   *     `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback which is executed when data is written out
   * @public
   */
  send(data, options, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    const opts = {
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true,
      ...options
    };

    if (!this._extensions[PerMessageDeflate.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate() {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      return abortHandshake(this, this._req, msg);
    }

    if (this._socket) {
      this.readyState = WebSocket.CLOSING;
      this._socket.destroy();
    }
  }
}

readyStates.forEach((readyState, i) => {
  WebSocket[readyState] = i;
});

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    /**
     * Return the listener of the event.
     *
     * @return {(Function|undefined)} The event listener or `undefined`
     * @public
     */
    get() {
      const listeners = this.listeners(method);
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) return listeners[i]._listener;
      }

      return undefined;
    },
    /**
     * Add a listener for the event.
     *
     * @param {Function} listener The listener to add
     * @public
     */
    set(listener) {
      const listeners = this.listeners(method);
      for (let i = 0; i < listeners.length; i++) {
        //
        // Remove only the listeners added via `addEventListener`.
        //
        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
      }
      this.addEventListener(method, listener);
    }
  });
});

WebSocket.prototype.addEventListener = addEventListener;
WebSocket.prototype.removeEventListener = removeEventListener;

module.exports = WebSocket;

/**
 * Initialize a WebSocket client.
 *
 * @param {WebSocket} websocket The client to initialize
 * @param {(String|url.URL)} address The URL to which to connect
 * @param {String} protocols The subprotocols
 * @param {Object} options Connection options
 * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable
 *     permessage-deflate
 * @param {Number} options.handshakeTimeout Timeout in milliseconds for the
 *     handshake request
 * @param {Number} options.protocolVersion Value of the `Sec-WebSocket-Version`
 *     header
 * @param {String} options.origin Value of the `Origin` or
 *     `Sec-WebSocket-Origin` header
 * @param {Number} options.maxPayload The maximum allowed message size
 * @param {Boolean} options.followRedirects Whether or not to follow redirects
 * @param {Number} options.maxRedirects The maximum number of redirects allowed
 * @private
 */
function initAsClient(websocket, address, protocols, options) {
  const opts = {
    protocolVersion: protocolVersions[1],
    maxPayload: 100 * 1024 * 1024,
    perMessageDeflate: true,
    followRedirects: false,
    maxRedirects: 10,
    ...options,
    createConnection: undefined,
    socketPath: undefined,
    hostname: undefined,
    protocol: undefined,
    timeout: undefined,
    method: undefined,
    auth: undefined,
    host: undefined,
    path: undefined,
    port: undefined
  };

  if (!protocolVersions.includes(opts.protocolVersion)) {
    throw new RangeError(
      `Unsupported protocol version: ${opts.protocolVersion} ` +
        `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  let parsedUrl;

  if (address instanceof URL) {
    parsedUrl = address;
    websocket.url = address.href;
  } else {
    parsedUrl = new URL(address);
    websocket.url = address;
  }

  const isUnixSocket = parsedUrl.protocol === 'ws+unix:';

  if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
    throw new Error(`Invalid URL: ${websocket.url}`);
  }

  const isSecure =
    parsedUrl.protocol === 'wss:' || parsedUrl.protocol === 'https:';
  const defaultPort = isSecure ? 443 : 80;
  const key = randomBytes(16).toString('base64');
  const get = isSecure ? https.get : http.get;
  let perMessageDeflate;

  opts.createConnection = isSecure ? tlsConnect : netConnect;
  opts.defaultPort = opts.defaultPort || defaultPort;
  opts.port = parsedUrl.port || defaultPort;
  opts.host = parsedUrl.hostname.startsWith('[')
    ? parsedUrl.hostname.slice(1, -1)
    : parsedUrl.hostname;
  opts.headers = {
    'Sec-WebSocket-Version': opts.protocolVersion,
    'Sec-WebSocket-Key': key,
    Connection: 'Upgrade',
    Upgrade: 'websocket',
    ...opts.headers
  };
  opts.path = parsedUrl.pathname + parsedUrl.search;
  opts.timeout = opts.handshakeTimeout;

  if (opts.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate(
      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
      false,
      opts.maxPayload
    );
    opts.headers['Sec-WebSocket-Extensions'] = format({
      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
    });
  }
  if (protocols) {
    opts.headers['Sec-WebSocket-Protocol'] = protocols;
  }
  if (opts.origin) {
    if (opts.protocolVersion < 13) {
      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
    } else {
      opts.headers.Origin = opts.origin;
    }
  }
  if (parsedUrl.username || parsedUrl.password) {
    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
  }

  if (isUnixSocket) {
    const parts = opts.path.split(':');

    opts.socketPath = parts[0];
    opts.path = parts[1];
  }

  let req = (websocket._req = get(opts));

  if (opts.timeout) {
    req.on('timeout', () => {
      abortHandshake(websocket, req, 'Opening handshake has timed out');
    });
  }

  req.on('error', (err) => {
    if (websocket._req.aborted) return;

    req = websocket._req = null;
    websocket.readyState = WebSocket.CLOSING;
    websocket.emit('error', err);
    websocket.emitClose();
  });

  req.on('response', (res) => {
    const location = res.headers.location;
    const statusCode = res.statusCode;

    if (
      location &&
      opts.followRedirects &&
      statusCode >= 300 &&
      statusCode < 400
    ) {
      if (++websocket._redirects > opts.maxRedirects) {
        abortHandshake(websocket, req, 'Maximum redirects exceeded');
        return;
      }

      req.abort();

      const addr = new URL(location, address);

      initAsClient(websocket, addr, protocols, options);
    } else if (!websocket.emit('unexpected-response', req, res)) {
      abortHandshake(
        websocket,
        req,
        `Unexpected server response: ${res.statusCode}`
      );
    }
  });

  req.on('upgrade', (res, socket, head) => {
    websocket.emit('upgrade', res);

    //
    // The user may have closed the connection from a listener of the `upgrade`
    // event.
    //
    if (websocket.readyState !== WebSocket.CONNECTING) return;

    req = websocket._req = null;

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
      return;
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    const protList = (protocols || '').split(/, */);
    let protError;

    if (!protocols && serverProt) {
      protError = 'Server sent a subprotocol but none was requested';
    } else if (protocols && !serverProt) {
      protError = 'Server sent no subprotocol';
    } else if (serverProt && !protList.includes(serverProt)) {
      protError = 'Server sent an invalid subprotocol';
    }

    if (protError) {
      abortHandshake(websocket, socket, protError);
      return;
    }

    if (serverProt) websocket.protocol = serverProt;

    if (perMessageDeflate) {
      try {
        const extensions = parse(res.headers['sec-websocket-extensions']);

        if (extensions[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          websocket._extensions[
            PerMessageDeflate.extensionName
          ] = perMessageDeflate;
        }
      } catch (err) {
        abortHandshake(
          websocket,
          socket,
          'Invalid Sec-WebSocket-Extensions header'
        );
        return;
      }
    }

    websocket.setSocket(socket, head, opts.maxPayload);
  });
}

/**
 * Create a `net.Socket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {net.Socket} The newly created socket used to start the connection
 * @private
 */
function netConnect(options) {
  options.path = options.socketPath;
  return net.connect(options);
}

/**
 * Create a `tls.TLSSocket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {tls.TLSSocket} The newly created socket used to start the connection
 * @private
 */
function tlsConnect(options) {
  options.path = undefined;

  if (!options.servername && options.servername !== '') {
    options.servername = options.host;
  }

  return tls.connect(options);
}

/**
 * Abort the handshake and emit an error.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {(http.ClientRequest|net.Socket)} stream The request to abort or the
 *     socket to destroy
 * @param {String} message The error message
 * @private
 */
function abortHandshake(websocket, stream, message) {
  websocket.readyState = WebSocket.CLOSING;

  const err = new Error(message);
  Error.captureStackTrace(err, abortHandshake);

  if (stream.setHeader) {
    stream.abort();
    stream.once('abort', websocket.emitClose.bind(websocket));
    websocket.emit('error', err);
  } else {
    stream.destroy(err);
    stream.once('error', websocket.emit.bind(websocket, 'error'));
    stream.once('close', websocket.emitClose.bind(websocket));
  }
}

/**
 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {*} data The data to send
 * @param {Function} cb Callback
 * @private
 */
function sendAfterClose(websocket, data, cb) {
  if (data) {
    const length = toBuffer(data).length;

    //
    // The `_bufferedAmount` property is used only when the peer is a client and
    // the opening handshake fails. Under these circumstances, in fact, the
    // `setSocket()` method is not called, so the `_socket` and `_sender`
    // properties are set to `null`.
    //
    if (websocket._socket) websocket._sender._bufferedBytes += length;
    else websocket._bufferedAmount += length;
  }

  if (cb) {
    const err = new Error(
      `WebSocket is not open: readyState ${websocket.readyState} ` +
        `(${readyStates[websocket.readyState]})`
    );
    cb(err);
  }
}

/**
 * The listener of the `Receiver` `'conclude'` event.
 *
 * @param {Number} code The status code
 * @param {String} reason The reason for closing
 * @private
 */
function receiverOnConclude(code, reason) {
  const websocket = this[kWebSocket];

  websocket._socket.removeListener('data', socketOnData);
  websocket._socket.resume();

  websocket._closeFrameReceived = true;
  websocket._closeMessage = reason;
  websocket._closeCode = code;

  if (code === 1005) websocket.close();
  else websocket.close(code, reason);
}

/**
 * The listener of the `Receiver` `'drain'` event.
 *
 * @private
 */
function receiverOnDrain() {
  this[kWebSocket]._socket.resume();
}

/**
 * The listener of the `Receiver` `'error'` event.
 *
 * @param {(RangeError|Error)} err The emitted error
 * @private
 */
function receiverOnError(err) {
  const websocket = this[kWebSocket];

  websocket._socket.removeListener('data', socketOnData);

  websocket.readyState = WebSocket.CLOSING;
  websocket._closeCode = err[kStatusCode];
  websocket.emit('error', err);
  websocket._socket.destroy();
}

/**
 * The listener of the `Receiver` `'finish'` event.
 *
 * @private
 */
function receiverOnFinish() {
  this[kWebSocket].emitClose();
}

/**
 * The listener of the `Receiver` `'message'` event.
 *
 * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The message
 * @private
 */
function receiverOnMessage(data) {
  this[kWebSocket].emit('message', data);
}

/**
 * The listener of the `Receiver` `'ping'` event.
 *
 * @param {Buffer} data The data included in the ping frame
 * @private
 */
function receiverOnPing(data) {
  const websocket = this[kWebSocket];

  websocket.pong(data, !websocket._isServer, NOOP);
  websocket.emit('ping', data);
}

/**
 * The listener of the `Receiver` `'pong'` event.
 *
 * @param {Buffer} data The data included in the pong frame
 * @private
 */
function receiverOnPong(data) {
  this[kWebSocket].emit('pong', data);
}

/**
 * The listener of the `net.Socket` `'close'` event.
 *
 * @private
 */
function socketOnClose() {
  const websocket = this[kWebSocket];

  this.removeListener('close', socketOnClose);
  this.removeListener('end', socketOnEnd);

  websocket.readyState = WebSocket.CLOSING;

  //
  // The close frame might not have been received or the `'end'` event emitted,
  // for example, if the socket was destroyed due to an error. Ensure that the
  // `receiver` stream is closed after writing any remaining buffered data to
  // it. If the readable side of the socket is in flowing mode then there is no
  // buffered data as everything has been already written and `readable.read()`
  // will return `null`. If instead, the socket is paused, any possible buffered
  // data will be read as a single chunk and emitted synchronously in a single
  // `'data'` event.
  //
  websocket._socket.read();
  websocket._receiver.end();

  this.removeListener('data', socketOnData);
  this[kWebSocket] = undefined;

  clearTimeout(websocket._closeTimer);

  if (
    websocket._receiver._writableState.finished ||
    websocket._receiver._writableState.errorEmitted
  ) {
    websocket.emitClose();
  } else {
    websocket._receiver.on('error', receiverOnFinish);
    websocket._receiver.on('finish', receiverOnFinish);
  }
}

/**
 * The listener of the `net.Socket` `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function socketOnData(chunk) {
  if (!this[kWebSocket]._receiver.write(chunk)) {
    this.pause();
  }
}

/**
 * The listener of the `net.Socket` `'end'` event.
 *
 * @private
 */
function socketOnEnd() {
  const websocket = this[kWebSocket];

  websocket.readyState = WebSocket.CLOSING;
  websocket._receiver.end();
  this.end();
}

/**
 * The listener of the `net.Socket` `'error'` event.
 *
 * @private
 */
function socketOnError() {
  const websocket = this[kWebSocket];

  this.removeListener('error', socketOnError);
  this.on('error', NOOP);

  if (websocket) {
    websocket.readyState = WebSocket.CLOSING;
    this.destroy();
  }
}


/***/ }),

/***/ 0:
/*!*********************************!*\
  !*** multi ./extension/main.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./extension/main.ts */"./extension/main.ts");


/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map