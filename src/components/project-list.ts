/// <reference path="./base.ts" />
/// <reference path="./project-item.ts" />
/// <reference path="../models/project-model.ts" />
/// <reference path="../models/drag-drop-interfaces.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/project-management.ts" />

namespace App {
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
}
