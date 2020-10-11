import { Project, ProjectStatus } from '../models/project.js';
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectManager extends State {
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
        const newProject = new Project(Math.random().toString(), title, desc, people, status || ProjectStatus.Active);
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
export const projectManager = ProjectManager.getInstance();
//# sourceMappingURL=project-management.js.map