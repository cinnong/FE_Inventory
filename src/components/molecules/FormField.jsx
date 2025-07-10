import Input from "../atoms/Input";
import Label from "../atoms/Label";

export default function FormField({ label, name, ...props }) {
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
