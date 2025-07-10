export default function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      className="border rounded-md px-3 py-2 w-full focus:outline-indigo-500"
      {...props}
    />
  );
}
