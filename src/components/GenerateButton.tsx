import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

export const GenerateButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
};
