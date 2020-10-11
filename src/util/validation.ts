namespace App {
  interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minVal?: number;
    maxVal?: number;
  }

  export function validate(inputVal: Validatable) {
    if (inputVal.required && inputVal.value.toString().trim().length === 0) {
      return false;
    }
    if (
      inputVal.minLength != null &&
      typeof inputVal.value === 'string' &&
      inputVal.value.trim().length < inputVal.minLength
    ) {
      return false;
    }
    if (
      inputVal.maxLength != null &&
      typeof inputVal.value === 'string' &&
      inputVal.value.trim().length > inputVal.maxLength
    ) {
      return false;
    }
    if (
      inputVal.minVal != null &&
      typeof inputVal.value === 'number' &&
      inputVal.value < inputVal.minVal
    ) {
      return false;
    }
    if (
      inputVal.maxVal != null &&
      typeof inputVal.value === 'number' &&
      inputVal.value > inputVal.maxVal
    ) {
      return false;
    }

    return true;
  }
}
