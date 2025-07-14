export default function Label({ children, htmlFor, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-1 text-sm font-medium text-gray-700"
      {...props}
    >
      {children}
    </label>
  );
}
