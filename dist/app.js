"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Active"] = "active";
    ProjectStatus["Finished"] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectManager extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProjectManager();
        }
        return this.instance;
    }
    addProject(title, desc, people, status) {
        const newProject = new Project(Math.random.toString(), title, desc, people, status || ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectManager = ProjectManager.getInstance();
function Autobind(_target, _methodName, descriptor) {
    const newDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return descriptor.value.bind(this);
        },
    };
    return newDescriptor;
}
function validate(inputVal) {
    if (inputVal.required && inputVal.value.toString().trim().length === 0) {
        return false;
    }
    if (inputVal.minLength != null &&
        typeof inputVal.value === 'string' &&
        inputVal.value.trim().length < inputVal.minLength) {
        return false;
    }
    if (inputVal.maxLength != null &&
        typeof inputVal.value === 'string' &&
        inputVal.value.trim().length > inputVal.maxLength) {
        return false;
    }
    if (inputVal.minVal != null &&
        typeof inputVal.value === 'number' &&
        inputVal.value < inputVal.minVal) {
        return false;
    }
    if (inputVal.maxVal != null &&
        typeof inputVal.value === 'number' &&
        inputVal.value > inputVal.maxVal) {
        return false;
    }
    return true;
}
class DOMComponent {
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
class ProjectItem extends DOMComponent {
    constructor(hostElId, textContent) {
        super('single-project', hostElId, 'beforeend');
        this.textContent = textContent;
        this.renderContent();
    }
    configure() { }
    renderContent() {
        if (!this.textContent) {
            return;
        }
        this.element.textContent = this.textContent;
    }
}
class ProjectList extends DOMComponent {
    constructor(status) {
        super('project-list', 'app', 'beforeend', `${status}-projects`);
        this.status = status;
        this.assignedProjects = [];
        this.renderContent();
        projectManager.addListener(this.handleProjectAdded);
    }
    configure() {
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
            const _ = new ProjectItem(listId, project.title);
        }
    }
}
__decorate([
    Autobind
], ProjectList.prototype, "handleProjectAdded", null);
class ProjectForm extends DOMComponent {
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
const projInput = new ProjectForm();
const activeList = new ProjectList(ProjectStatus.Active);
const finishedList = new ProjectList(ProjectStatus.Finished);
//# sourceMappingURL=app.js.map