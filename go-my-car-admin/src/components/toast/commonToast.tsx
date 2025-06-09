import { toast } from "@/hooks/use-toast";

const Toast = (
  variant:
    | "default"
    | "destructive"
    | "success"
    | "info"
    | "warning" = "default",
  title: string,
  description?: string,

  duration: number = 3000
) => {
  const variantStyles: Record<string, string> = {
    default: "",
    destructive: "",
    success: "bg-success text-white border-none",
    info: "bg-primary text-white border-none",
    warning: "bg-yellow-500 text-black border-none",
  };
  const defaultVariants = ["default", "destructive"];
  if (defaultVariants.includes(variant)) {
    toast({
      variant,
      title,
      description,
      duration,
    });
  } else {
    toast({
      title,
      description,
      className: variantStyles[variant] || "",
      duration,
    });
  }
};

export default Toast;
