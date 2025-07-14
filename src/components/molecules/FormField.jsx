import Input from "../atoms/Input";
import Label from "../atoms/Label";

export default function FormField({ label, name, children, ...props }) {
  // Jika ada children, render children (untuk custom usage)
  if (children) {
    return <div className="mb-4">{children}</div>;
  }

  // Jika tidak ada children, render label dan input (untuk simple usage)
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
