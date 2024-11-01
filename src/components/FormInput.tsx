type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
};

function FormInput({ label, name, type }: FormInputProps) {
  return (
    <div className="mb-2">
      <label htmlFor={name}>{label || name}</label>
      <input id={name} name={name} type={type} />
    </div>
  );
}

export default FormInput;
