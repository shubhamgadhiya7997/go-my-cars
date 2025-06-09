import { useState, ComponentType } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WithPasswordToggleProps {
  id: string;
  placeholder?: string;
  register: any;
}

const withPasswordToggle = (WrappedComponent: ComponentType<any>) => {
  return ({ id, placeholder, register }: WithPasswordToggleProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <WrappedComponent
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(id)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-500" />
          ) : (
            <Eye className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
    );
  };
};

// Create a new PasswordInput component by wrapping the Input component
export const PasswordInput = withPasswordToggle(Input);
