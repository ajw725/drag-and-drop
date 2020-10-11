// // code here!

// const appRoot = document.getElementById('app')!;
// const formTmpl = document.getElementById('project-input')! as HTMLTemplateElement;
// const formContent = formTmpl.content.cloneNode(true) as DocumentFragment;
// const formEl = formContent.querySelector('form')!;
// formEl.id = 'new-project-form';
// appRoot.appendChild(formContent);

// const listTmpl = document.getElementById('project-list')! as HTMLTemplateElement;
// const listContent = listTmpl.content.cloneNode(true) as DocumentFragment;
// const headerEl = listContent.querySelector('h2')!;
// headerEl.innerText = 'Current Projects';
// const listEl = listContent.querySelector('ul')!;
// listEl.id = 'all-projects';
// appRoot.appendChild(listContent);

// interface ValidatorStorage {
//   [className: string]: {
//     [propName: string]: {
//       [type: string]: any
//     }
//   };
// }

// const registeredValidators: ValidatorStorage = {};

// function validate(obj: any) {
//   const className = obj.constructor.name;
//   const classValidators = registeredValidators[className];
//   if(!classValidators) {
//     return true;
//   }

//   for(const propName in classValidators) {
//     const propValidators = classValidators[propName];
//     for(const validatorType in propValidators) {
//       switch (validatorType) {
//         case 'required':
//           if(!obj[propName]) {
//             return false;
//           }
//         case 'range':
//           const { min, max } = propValidators[validatorType];
//           if(obj[propName] < min || obj[propName] > max) {
//             return false;
//           }
//       }
//     }
//   }

//   return true;
// }

// function Required(target: any, propName: string) {
//   const className = target.constructor.name;
//   const classValidators = registeredValidators[className] || {};
//   const propValidators = classValidators[propName] || {};
//   registeredValidators[className] = {
//     ...classValidators,
//     [propName]: {
//       ...propValidators,
//       'required': true
//     }
//   };
// }

// function NumberRange(minVal: number, maxVal: number) {
//   return function(target: any, propName: string) {
//     const className = target.constructor.name;
//     const classValidators = registeredValidators[className] || {};
//     const propValidators = classValidators[propName] || {};
//     registeredValidators[className] = {
//       ...classValidators,
//       [propName]: {
//         ...propValidators,
//         'range': { min: minVal, max: maxVal }
//       }
//     }
//   };
// }

// class Project {
//   @Required title: string;
//   @Required description: string;
//   @NumberRange(0, 10) people: number;

//   constructor(title: string, description: string, people: number) {
//     this.title = title;
//     this.description = description;
//     this.people = people;
//   }
// }

// const form = document.getElementById('new-project-form')! as HTMLFormElement;
// form.addEventListener('submit', function(event) {
//   event.preventDefault();
//   const titleEl = document.getElementById('title') as HTMLInputElement;
//   const descriptionEl = document.getElementById('description') as HTMLTextAreaElement;
//   const peopleEl = document.getElementById('people') as HTMLInputElement;

//   const newProject = new Project(titleEl.value, descriptionEl.value, +peopleEl.value);
//   if(!validate(newProject)) {
//     alert('Invalid project attributes');
//     return;
//   }

//   titleEl.value = '';
//   descriptionEl.value = '';
//   peopleEl.value = '';
//   displayProject(newProject);
// });

// function displayProject(newProject: Project) {
//   const tmpl = document.getElementById('single-project')! as HTMLTemplateElement;
//   const content = tmpl.content.cloneNode(true) as DocumentFragment;
//   const itemEl = content.querySelector('li')!;
//   itemEl.innerText = newProject.title;

//   const targetEl = document.getElementById('all-projects')! as HTMLUListElement;
//   targetEl.appendChild(content);
// }