import { ProjectStatus } from './models/project.js';
import { ProjectForm } from './components/project-form.js';
import { ProjectList } from './components/project-list.js';
const _projInput = new ProjectForm();
const _activeList = new ProjectList(ProjectStatus.Active);
const _finishedList = new ProjectList(ProjectStatus.Finished);
//# sourceMappingURL=app.js.map