// whatever

enum ProjectStatus {
  Active = 'active',
  Finished = 'finished',
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectManager extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectManager;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectManager();
    }

    return this.instance;
  }

  addProject(
    title: string,
    desc: string,
    people: number,
    status?: ProjectStatus
  ) {
    const newProject = new Project(
      Math.random.toString(),
      title,
      desc,
      people,
      status || ProjectStatus.Active
    );
    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectManager = ProjectManager.getInstance();

function Autobind(
  _target: any,
  _methodName: string | Symbol,
  descriptor: PropertyDescriptor
) {
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      return descriptor.value.bind(this);
    },
  };
  return newDescriptor;
}

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minVal?: number;
  maxVal?: number;
}

function validate(inputVal: Validatable) {
  if (inputVal.required && inputVal.value.toString().trim().length === 0) {
    return false;
  }
  if (
    inputVal.minLength != null &&
    typeof inputVal.value === 'string' &&
    inputVal.value.trim().length < inputVal.minLength
  ) {
    return false;
  }
  if (
    inputVal.maxLength != null &&
    typeof inputVal.value === 'string' &&
    inputVal.value.trim().length > inputVal.maxLength
  ) {
    return false;
  }
  if (
    inputVal.minVal != null &&
    typeof inputVal.value === 'number' &&
    inputVal.value < inputVal.minVal
  ) {
    return false;
  }
  if (
    inputVal.maxVal != null &&
    typeof inputVal.value === 'number' &&
    inputVal.value > inputVal.maxVal
  ) {
    return false;
  }

  return true;
}

type HostPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';

abstract class DOMComponent<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;
  hostPosition: HostPosition;

  constructor(
    templateElId: string,
    hostElId: string,
    hostPosition: HostPosition,
    newElId?: string
  ) {
    this.templateElement = document.getElementById(
      templateElId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElId) as T;
    this.hostPosition = hostPosition;
    const newNode = document.importNode(this.templateElement.content, true);
    this.element = newNode.firstElementChild as U;
    if (newElId) {
      this.element.id = newElId;
    }

    this.attach();
  }

  abstract configure(): void;

  abstract renderContent(): void;

  private attach() {
    this.hostElement.insertAdjacentElement(this.hostPosition, this.element);
  }
}

class ProjectItem extends DOMComponent<HTMLUListElement, HTMLLIElement> {
  get contributors() {
    return `${this.project.people} contributor${
      this.project.people === 1 ? '' : 's'
    }`;
  }

  constructor(hostElId: string, private project: Project) {
    super('single-project', hostElId, 'beforeend');

    this.renderContent();
  }

  configure() {}

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.contributors;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

class ProjectList extends DOMComponent<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[] = [];

  constructor(public status: ProjectStatus) {
    super('project-list', 'app', 'beforeend', `${status}-projects`);

    this.renderContent();
    projectManager.addListener(this.handleProjectAdded);
  }

  configure() {
    // nothing to do
  }

  renderContent() {
    const listId = `${this.status}-projects-list`;
    this.element.querySelector('ul')!.id = listId;

    const titleText = `${this.status.toUpperCase()} PROJECTS`;
    this.element.querySelector('h2')!.textContent = titleText;
  }

  @Autobind
  handleProjectAdded(projects: Project[]) {
    this.assignedProjects = projects.filter((p) => p.status === this.status);
    this.renderProjects();
  }

  renderProjects() {
    const listId = `${this.status}-projects-list`;
    const listEl = document.getElementById(listId)! as HTMLUListElement;
    listEl.innerHTML = ''; // not optimal, but fine for this project
    for (const project of this.assignedProjects) {
      const _ = new ProjectItem(listId, project);
    }
  }
}

class ProjectForm extends DOMComponent<HTMLDivElement, HTMLFormElement> {
  titleInput: HTMLInputElement;
  descriptionInput: HTMLTextAreaElement;
  peopleInput: HTMLInputElement;

  constructor() {
    super('project-input', 'app', 'afterbegin', 'user-input');

    this.titleInput = this.element.querySelector('#title')! as HTMLInputElement;
    this.descriptionInput = this.element.querySelector(
      '#description'
    ) as HTMLTextAreaElement;
    this.peopleInput = this.element.querySelector(
      '#people'
    )! as HTMLInputElement;

    this.configure();
  }

  renderContent() {
    // nothing to do
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const formData = this.gatherInputData();
    if (!formData) {
      return;
    }

    const [title, desc, people] = formData;
    projectManager.addProject(title, desc, people);
    this.resetForm();
  }

  private gatherInputData(): [string, string, number] | void {
    const newTitle = this.titleInput.value;
    const newDesc = this.descriptionInput.value;
    const newPeople = this.peopleInput.value;

    if (
      !validate({ value: newTitle, required: true }) ||
      !validate({ value: newDesc, required: true }) ||
      !validate({ value: +newPeople, minVal: 1, maxVal: 10 })
    ) {
      alert('Invalid project. Please try again');
      return;
    }

    return [newTitle, newDesc, +newPeople];
  }

  private resetForm() {
    this.titleInput.value = '';
    this.descriptionInput.value = '';
    this.peopleInput.value = '';
  }
}

const projInput = new ProjectForm();
const activeList = new ProjectList(ProjectStatus.Active);
const finishedList = new ProjectList(ProjectStatus.Finished);
