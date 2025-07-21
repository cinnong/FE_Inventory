export default function Input({
  type = "text",
  size = "md",
  variant = "default",
  error,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  // Input adalah void element, tidak boleh ada children
  // Jika ada children yang diberikan, abaikan dan berikan warning di console
  if (children) {
    console.warn(
      "Input component tidak boleh memiliki children. Children diabaikan."
    );
  }

  const baseStyle = "w-full rounded-md transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-opacity-50";

  const sizes = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-2.5 text-lg"
  };

  const variants = {
    default: "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50"
  };

  const states = {
    disabled: "bg-gray-100 cursor-not-allowed opacity-75"
  };

  const currentVariant = error ? "error" : variant;
  
  const combinedClassName = `
    ${baseStyle}
    ${sizes[size]}
    ${variants[currentVariant]}
    ${disabled ? states.disabled : ""}
    ${className}
  `.trim();

  return (
    <div className="relative">
      <input 
        type={type} 
        disabled={disabled}
        className={combinedClassName}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
