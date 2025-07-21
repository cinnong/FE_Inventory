export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all rounded-md";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-sm",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
  };

  const sizes = {
    xs: "text-xs px-2 py-1 md:px-2.5 md:py-1.5",
    sm: "text-sm px-2.5 py-1.5 md:px-3 md:py-2",
    md: "text-sm px-3.5 py-2 md:px-4 md:py-2.5",
    lg: "text-base px-4 py-2.5 md:px-6 md:py-3",
    xl: "text-base px-6 py-3 md:px-7 md:py-4"
  };

  const combinedClassName = `
    ${baseStyle}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
