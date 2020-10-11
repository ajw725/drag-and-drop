var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import DOMComponent from '../components/base.js';
import Autobind from '../decorators/autobind.js';
import { ProjectItem } from '../components/project-item.js';
import { projectManager } from '../state/project-management.js';
export class ProjectList extends DOMComponent {
    constructor(status) {
        super('project-list', 'app', 'beforeend', `${status}-projects`);
        this.status = status;
        this.assignedProjects = [];
        this.renderContent();
        this.configure();
    }
    configure() {
        projectManager.addListener(this.handleProjectAdded);
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
    }
    renderContent() {
        const listId = `${this.status}-projects-list`;
        this.element.querySelector('ul').id = listId;
        const titleText = `${this.status.toUpperCase()} PROJECTS`;
        this.element.querySelector('h2').textContent = titleText;
    }
    handleProjectAdded(projects) {
        this.assignedProjects = projects.filter((p) => p.status === this.status);
        this.renderProjects();
    }
    renderProjects() {
        const listId = `${this.status}-projects-list`;
        const listEl = document.getElementById(listId);
        listEl.innerHTML = '';
        for (const project of this.assignedProjects) {
            const _ = new ProjectItem(listId, project);
        }
    }
    dragOverHandler(event) {
        if (!event.dataTransfer || event.dataTransfer.types[0] !== 'text/plain') {
            return;
        }
        event.preventDefault();
        const listEl = this.element.querySelector('ul');
        listEl.classList.add('droppable');
    }
    dropHandler(event) {
        event.preventDefault();
        const projectId = event.dataTransfer.getData('text/plain');
        projectManager.updateProjectStatus(projectId, this.status);
    }
    dragLeaveHandler(event) {
        const listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    }
}
__decorate([
    Autobind
], ProjectList.prototype, "handleProjectAdded", null);
__decorate([
    Autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=project-list.js.map