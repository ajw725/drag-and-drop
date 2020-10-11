export default class DOMComponent {
    constructor(templateElId, hostElId, hostPosition, newElId) {
        this.templateElement = document.getElementById(templateElId);
        this.hostElement = document.getElementById(hostElId);
        this.hostPosition = hostPosition;
        const newNode = document.importNode(this.templateElement.content, true);
        this.element = newNode.firstElementChild;
        if (newElId) {
            this.element.id = newElId;
        }
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement(this.hostPosition, this.element);
    }
}
//# sourceMappingURL=base.js.map