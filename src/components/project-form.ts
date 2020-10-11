import DOMComponent from '../components/base.js';
import Autobind from '../decorators/autobind.js';
import { validate } from '../util/validation.js';
import { projectManager } from '../state/project-management.js';

export class ProjectForm extends DOMComponent<HTMLDivElement, HTMLFormElement> {
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
