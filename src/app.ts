/// <reference path="models/project-model.ts" />
/// <reference path="components/project-form.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  const _projInput = new ProjectForm();
  const _activeList = new ProjectList(ProjectStatus.Active);
  const _finishedList = new ProjectList(ProjectStatus.Finished);
}
