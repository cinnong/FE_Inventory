export default function Label({ 
  children, 
  htmlFor, 
  size = "md",
  required = false,
  error = false,
  className = "",
  ...props 
}) {
  const baseStyle = "block font-medium transition-colors duration-200";
  
  const sizes = {
    sm: "text-xs md:text-sm mb-1",
    md: "text-sm md:text-base mb-1.5",
    lg: "text-base md:text-lg mb-2"
  };

  const colors = {
    default: "text-gray-700",
    error: "text-red-500",
  };

  return (
    <label
      htmlFor={htmlFor}
      className={`
        ${baseStyle} 
        ${sizes[size]} 
        ${error ? colors.error : colors.default}
        ${className}
      `}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
