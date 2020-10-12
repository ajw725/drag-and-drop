import { Project, ProjectStatus } from '../models/project';

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectManager extends State<Project> {
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
      Math.random().toString(),
      title,
      desc,
      people,
      status || ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.publishChanges();
  }

  publishChanges() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  updateProjectStatus(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project || project.status === newStatus) {
      return;
    }

    project.status = newStatus;
    this.publishChanges();
  }
}

export const projectManager = ProjectManager.getInstance();
