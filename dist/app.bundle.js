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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const template = __webpack_require__(1);
const templateb = __webpack_require__(5);
const style = __webpack_require__(2);
const render = function (styleText, templateText) {
    this.attachShadow({
        mode: 'open'
    });
    const element = document.createElement('template');
    element.innerHTML = (styleText ? '<style>' + styleText + '</style>' : '') + templateText;
    const instance = element.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);
};
function WebComponent(args) {
    return function classDecorator(constructor) {
        const generated = class extends constructor {
            constructor() {
                super(...arguments);
                this.renderFirstTime = render.call(this, args.style, args.template);
            }
        };
        generated.observedAttributes = args.observe;
        generated.prototype.setElementTemplate = function (internalId, externalId) {
            if (this.shadowRoot) {
                const internalElement = this.shadowRoot.querySelector(internalId);
                internalElement.innerHTML = '';
                const externalElement = document.querySelector(externalId);
                if (externalElement) {
                    internalElement.appendChild(document.importNode(externalElement.content, true));
                }
            }
        };
        generated.prototype.onEvent = function (event, cb) {
            this.addEventListener(event, (e) => {
                cb(e.target, e.detail);
            }), true;
            ;
        };
        generated.prototype.removeEvent = function (event, cb) {
            this.removeEventListener(event, cb);
        };
        generated.prototype.emitEvent = function (event, detail) {
            this.dispatchEvent(new CustomEvent(event, {
                detail
            }));
        };
        window.customElements.define(args.selector, generated);
        return generated;
    };
}
let ParentComponent = class ParentComponent extends HTMLElement {
    connectedCallback() {
        this.onEvent('build', this.onSend.bind(this));
    }
    onSend(element, data) {
        console.log(element, data);
    }
    disconnectedCallback() {
        this.removeEvent('build', this.onSend.bind(this));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "header-template" && oldValue !== newValue)
            this.setElementTemplate('#header', this.getAttribute('header-template'));
        if (name === "footer-template" && oldValue !== newValue)
            this.setElementTemplate('#footer', this.getAttribute('footer-template'));
    }
};
ParentComponent = __decorate([
    WebComponent({
        selector: 'parent-component',
        template: template,
        style: style,
        observe: ['header-template', 'footer-template']
    })
], ParentComponent);
let ChildComponent = class ChildComponent extends HTMLElement {
    connectedCallback() {
        this.$button = this.shadowRoot.getElementById("button");
        this.$text = this.shadowRoot.getElementById("text");
        this.$button.addEventListener('click', this.onClick.bind(this), true);
    }
    onClick() {
        this.emitEvent('build', this.$text.value);
    }
    disconnectedCallback() {
        this.$button.removeEventListener('click', this.onClick.bind(this));
    }
};
ChildComponent = __decorate([
    WebComponent({
        selector: 'child-component',
        template: templateb
    })
], ChildComponent);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "<header class=\"container\" id=\"header\"></header>\n<slot></slot>\n<footer id=\"footer\"></footer>"

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ".container {\n    color: red;\n}"

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

module.exports = "Msg: <input type=\"text\" id=\"text\">\n<button id=\"button\">\n    Enviar\n</button>"

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map