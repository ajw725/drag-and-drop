import { DOMComponent } from '../components/base.js';
import { Autobind } from '../decorators/autobind.js';
import { DragTarget } from '../models/drag-drop.js';
import { Project, ProjectStatus } from '../models/project.js';
import { ProjectItem } from '../components/project-item.js';
import { projectManager } from '../state/project-management.js';

export class ProjectList
  extends DOMComponent<HTMLDivElement, HTMLElement>
  implements DragTarget {
  assignedProjects: Project[] = [];

  constructor(public status: ProjectStatus) {
    super('project-list', 'app', 'beforeend', `${status}-projects`);

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

  @Autobind
  dragOverHandler(event: DragEvent) {
    if (!event.dataTransfer || event.dataTransfer.types[0] !== 'text/plain') {
      return;
    }

    event.preventDefault();
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.add('droppable');
  }

  @Autobind
  dropHandler(event: DragEvent) {
    event.preventDefault();
    const projectId = event.dataTransfer!.getData('text/plain');
    projectManager.updateProjectStatus(projectId, this.status);
  }

  @Autobind
  dragLeaveHandler(event: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }
}
