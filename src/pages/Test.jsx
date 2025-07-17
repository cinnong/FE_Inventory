import Input from "../components/atoms/Input";
import Label from "../components/atoms/Label";
import Button from "../components/atoms/Button";
import FormField from "../components/molecules/FormField";

const Test = () => {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Components</h1>

      {/* Test Individual Components */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="test1">Test Label</Label>
          <Input id="test1" type="text" placeholder="Test Input" />
        </div>

        {/* Test FormField with children */}
        <FormField>
          <Label htmlFor="test2">Email Test</Label>
          <Input id="test2" type="email" placeholder="test@example.com" />
        </FormField>

        <Button>Test Button</Button>
      </div>
    </div>
  );
};

export default Test;
