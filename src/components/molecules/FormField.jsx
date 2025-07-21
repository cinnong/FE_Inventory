import Input from "../atoms/Input";
import Label from "../atoms/Label";

export default function FormField({ 
  label, 
  name, 
  children, 
  size = "md",
  required = false,
  error,
  className = "",
  spacing = "normal",
  ...props 
}) {
  const spacingStyles = {
    compact: "mb-2 md:mb-3",
    normal: "mb-4 md:mb-5",
    loose: "mb-6 md:mb-7"
  };

  // Jika ada children, render children (untuk custom usage)
  if (children) {
    return (
      <div className={`${spacingStyles[spacing]} ${className}`}>
        {children}
      </div>
    );
  }

  // Jika tidak ada children, render label dan input (untuk simple usage)
  return (
    <div className={`${spacingStyles[spacing]} ${className}`}>
      <Label 
        htmlFor={name} 
        size={size}
        required={required}
        error={!!error}
      >
        {label}
      </Label>
      <Input 
        id={name} 
        name={name} 
        size={size}
        error={error}
        {...props} 
      />
    </div>
  );
}
