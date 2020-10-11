"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus["Active"] = "active";
        ProjectStatus["Finished"] = "finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
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
    App.DOMComponent = DOMComponent;
})(App || (App = {}));
var App;
(function (App) {
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
    App.Autobind = Autobind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
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
            const newProject = new App.Project(Math.random().toString(), title, desc, people, status || App.ProjectStatus.Active);
            this.projects.push(newProject);
            this.publishChanges();
        }
        publishChanges() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
        updateProjectStatus(projectId, newStatus) {
            const project = this.projects.find((p) => p.id === projectId);
            if (!project || project.status === newStatus) {
                return;
            }
            project.status = newStatus;
            this.publishChanges();
        }
    }
    App.ProjectManager = ProjectManager;
    App.projectManager = ProjectManager.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    class ProjectForm extends App.DOMComponent {
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
            App.projectManager.addProject(title, desc, people);
            this.resetForm();
        }
        gatherInputData() {
            const newTitle = this.titleInput.value;
            const newDesc = this.descriptionInput.value;
            const newPeople = this.peopleInput.value;
            if (!App.validate({ value: newTitle, required: true }) ||
                !App.validate({ value: newDesc, required: true }) ||
                !App.validate({ value: +newPeople, minVal: 1, maxVal: 10 })) {
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
        App.Autobind
    ], ProjectForm.prototype, "submitHandler", null);
    App.ProjectForm = ProjectForm;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.DOMComponent {
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
        App.Autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.DOMComponent {
        constructor(status) {
            super('project-list', 'app', 'beforeend', `${status}-projects`);
            this.status = status;
            this.assignedProjects = [];
            this.renderContent();
            this.configure();
        }
        configure() {
            App.projectManager.addListener(this.handleProjectAdded);
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
                const _ = new App.ProjectItem(listId, project);
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
            App.projectManager.updateProjectStatus(projectId, this.status);
        }
        dragLeaveHandler(event) {
            const listEl = this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        }
    }
    __decorate([
        App.Autobind
    ], ProjectList.prototype, "handleProjectAdded", null);
    __decorate([
        App.Autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.Autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.Autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    const _projInput = new App.ProjectForm();
    const _activeList = new App.ProjectList(App.ProjectStatus.Active);
    const _finishedList = new App.ProjectList(App.ProjectStatus.Finished);
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map