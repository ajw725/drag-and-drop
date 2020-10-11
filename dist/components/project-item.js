var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DOMComponent } from '../components/base.js';
import { Autobind } from '../decorators/autobind.js';
export class ProjectItem extends DOMComponent {
    constructor(hostElId, project) {
        super('single-project', hostElId, 'beforeend');
        this.project = project;
        this.renderContent();
        this.configure();
    }
    get contributors() {
        return `${this.project.people} contributor${this.project.people === 1 ? '' : 's'}`;
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.contributors;
        this.element.querySelector('p').textContent = this.project.description;
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(_event) { }
}
__decorate([
    Autobind
], ProjectItem.prototype, "dragStartHandler", null);
//# sourceMappingURL=project-item.js.map