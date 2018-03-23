const template = require('raw-loader!./template.html');
const templateb = require('raw-loader!./templateb.html');
const style = require( 'raw-loader!./style.css');

const render = function(this: any, styleText: string, templateText: string) {
    this.attachShadow({
        mode: 'open'
    });

    const element = document.createElement('template');

    element.innerHTML = (styleText ? '<style>' + styleText + '</style>' : '' ) + templateText;
    const instance = element.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);
};

function WebComponent(args: any) {
    return function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
        const generated: any = class extends constructor {
            renderFirstTime = render.call(this, args.style, args.template);
        }

        generated.observedAttributes =  args.observe;

        generated.prototype.setElementTemplate = function (this: any, internalId: string|null, externalId: any) {
            if (this.shadowRoot) {
                const internalElement = this.shadowRoot.querySelector(internalId);
                internalElement.innerHTML = '';

                const externalElement: HTMLTemplateElement = document.querySelector(<string>externalId) as HTMLTemplateElement;
            
                if (externalElement) {
                    internalElement.appendChild(document.importNode(externalElement.content, true));
                }
            }
        };

        generated.prototype.onEvent = function(event, cb) {
            this.addEventListener(event, (e) => {
                cb(e.target, e.detail)
            }), true);
        }

        generated.prototype.removeEvent = function(event, cb) {
            this.removeEventListener(event, cb);
        }

        generated.prototype.emitEvent = function(event, detail) {
            this.dispatchEvent(new CustomEvent(event, {
                detail 
            }));
        }

        window.customElements.define(args.selector, generated)
        return generated;
    }
  }


@WebComponent({
    selector: 'parent-component',
    template: template,
    style: style,
    observe: ['header-template', 'footer-template']
})
class ParentComponent extends HTMLElement {
    connectedCallback() {
        this.onEvent('build', this.onSend.bind(this));
    }

    onSend(element, data)  {
        console.log(element, data);
    }

    disconnectedCallback() { 
        this.removeEvent('build', this.onSend.bind(this));
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) { 
        if (name === "header-template" && oldValue !== newValue) this.setElementTemplate('#header', this.getAttribute('header-template'));
        if (name === "footer-template" && oldValue !== newValue) this.setElementTemplate('#footer', this.getAttribute('footer-template'));
    }
}

@WebComponent({
    selector: 'child-component',
    template: templateb
})
class ChildComponent extends HTMLElement{
    connectedCallback() {        
        this.$button = this.shadowRoot.getElementById("button") as HTMLButtonElement;
        this.$text = this.shadowRoot.getElementById("text") as HTMLInputElement;

        this.$button.addEventListener('click', this.onClick.bind(this), true);
    }

    onClick() {
        this.emitEvent('build', this.$text.value);
    }

    disconnectedCallback() { 
        this.$button.removeEventListener('click', this.onClick.bind(this));
    }
}