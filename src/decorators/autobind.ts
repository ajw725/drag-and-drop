export function Autobind(
  _target: any,
  _methodName: string | Symbol,
  descriptor: PropertyDescriptor
) {
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      return descriptor.value.bind(this);
    },
  };
  return newDescriptor;
}
