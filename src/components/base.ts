namespace App {
  type HostPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';

  export abstract class DOMComponent<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    hostPosition: HostPosition;

    constructor(
      templateElId: string,
      hostElId: string,
      hostPosition: HostPosition,
      newElId?: string
    ) {
      this.templateElement = document.getElementById(
        templateElId
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElId) as T;
      this.hostPosition = hostPosition;
      const newNode = document.importNode(this.templateElement.content, true);
      this.element = newNode.firstElementChild as U;
      if (newElId) {
        this.element.id = newElId;
      }

      this.attach();
    }

    abstract configure(): void;

    abstract renderContent(): void;

    private attach() {
      this.hostElement.insertAdjacentElement(this.hostPosition, this.element);
    }
  }
}
