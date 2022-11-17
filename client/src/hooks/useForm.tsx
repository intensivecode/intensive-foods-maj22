import { ChangeEvent, FormEvent, useState } from "react";
import Joi from "joi";

export function useForm<FormData>(
  formData: FormData,
  schema: Joi.ObjectSchema<FormData>
) {
  type Errors = {
    [Property in keyof FormData]?: string;
  };

  const [data, setData] = useState<FormData>(formData);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(doSubmit: () => void) {
    return function (e: FormEvent<HTMLFormElement>) {
      e.preventDefault();

      const errors = validate();
      setErrors(errors || {});

      if (errors) return;

      doSubmit();
    };
  }

  function handleChange({ target: input }: ChangeEvent<HTMLInputElement>) {
    const inputName = input.name as keyof FormData;

    const errorMessage = validateProperty(input);

    if (errorMessage) errors[inputName] = errorMessage;
    else delete errors[inputName];

    setErrors({ ...errors });

    data[inputName] = input.value as FormData[keyof FormData];

    setData({ ...data });
    console.log(input.name, input.value);
  }

  function validateProperty({ name, value }: HTMLInputElement) {
    const subSchema = schema.extract(name);
    const { error } = subSchema.validate(value);

    if (!error) return null;

    return error.message;
  }

  function validate() {
    const options: Joi.ValidationOptions = { abortEarly: false };
    const { error } = schema.validate(data, options);

    if (!error) return null;

    const errors: Errors = {};
    for (const detail of error.details)
      errors[detail.path[0] as keyof Errors] = detail.message;

    return errors;
  }

  function renderInput(name: keyof FormData, label: string): JSX.Element {
    return (
      <div>
        <label>{label}</label>
        <input
          name={name as string}
          value={data[name] as string}
          onChange={handleChange}
        />
        {errors[name] && <p>{errors[name]}</p>}
      </div>
    );
  }

  function renderButton(label: string): JSX.Element {
    return <button disabled={!!validate()}>{label}</button>;
  }

  return { data, errors, handleSubmit, renderButton, renderInput };
}
