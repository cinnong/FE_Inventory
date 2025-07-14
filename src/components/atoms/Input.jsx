export default function Input({
  type = "text",
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

  const defaultClassName =
    "border rounded-md px-3 py-2 w-full focus:outline-indigo-500";
  const combinedClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return <input type={type} className={combinedClassName} {...props} />;
}
