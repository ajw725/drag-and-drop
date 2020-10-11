import DOMComponent from '../components/base.js';
import Autobind from '../decorators/autobind.js';
import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';

export class ProjectItem
  extends DOMComponent<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  get contributors() {
    return `${this.project.people} contributor${
      this.project.people === 1 ? '' : 's'
    }`;
  }

  constructor(hostElId: string, private project: Project) {
    super('single-project', hostElId, 'beforeend');

    this.renderContent();
    this.configure();
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.contributors;
    this.element.querySelector('p')!.textContent = this.project.description;
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_event: DragEvent) {}
}
