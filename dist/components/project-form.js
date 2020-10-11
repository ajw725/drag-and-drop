var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DOMComponent } from '../components/base.js';
import { Autobind } from '../decorators/autobind.js';
import { validate } from '../util/validation.js';
import { projectManager } from '../state/project-management.js';
export class ProjectForm extends DOMComponent {
    constructor() {
        super('project-input', 'app', 'afterbegin', 'user-input');
        this.titleInput = this.element.querySelector('#title');
        this.descriptionInput = this.element.querySelector('#description');
        this.peopleInput = this.element.querySelector('#people');
        this.configure();
    }
    renderContent() {
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    submitHandler(event) {
        event.preventDefault();
        const formData = this.gatherInputData();
        if (!formData) {
            return;
        }
        const [title, desc, people] = formData;
        projectManager.addProject(title, desc, people);
        this.resetForm();
    }
    gatherInputData() {
        const newTitle = this.titleInput.value;
        const newDesc = this.descriptionInput.value;
        const newPeople = this.peopleInput.value;
        if (!validate({ value: newTitle, required: true }) ||
            !validate({ value: newDesc, required: true }) ||
            !validate({ value: +newPeople, minVal: 1, maxVal: 10 })) {
            alert('Invalid project. Please try again');
            return;
        }
        return [newTitle, newDesc, +newPeople];
    }
    resetForm() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
}
__decorate([
    Autobind
], ProjectForm.prototype, "submitHandler", null);
//# sourceMappingURL=project-form.js.map