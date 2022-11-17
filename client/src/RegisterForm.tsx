import Joi from "joi";
import { useForm } from "./hooks/useForm";

interface RegisterFormData {
  email: string;
  password: string;
}

function RegisterForm() {
  const schema = Joi.object<RegisterFormData>({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().min(6).max(24).required().label("Password"),
  });

  const { data, handleSubmit, renderInput, renderButton } =
    useForm<RegisterFormData>({ email: "", password: "" }, schema);

  function doSubmit() {
    console.log("Submitted!!", data);
  }

  return (
    <form onSubmit={handleSubmit(doSubmit)}>
      {renderInput("email", "Email")}
      {renderInput("password", "Password")}
      {renderButton("Submit")}
    </form>
  );
}

export default RegisterForm;
