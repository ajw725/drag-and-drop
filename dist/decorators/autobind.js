export function Autobind(_target, _methodName, descriptor) {
    const newDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return descriptor.value.bind(this);
        },
    };
    return newDescriptor;
}
//# sourceMappingURL=autobind.js.map