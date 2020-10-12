import { ProjectStatus } from './models/project';
import { ProjectForm } from './components/project-form';
import { ProjectList } from './components/project-list';

const _projInput = new ProjectForm();
const _activeList = new ProjectList(ProjectStatus.Active);
const _finishedList = new ProjectList(ProjectStatus.Finished);
