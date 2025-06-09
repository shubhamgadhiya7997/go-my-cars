import { toast } from "@/hooks/use-toast";

/**
 * Shows a detailed error toast.
 * @param message - The error message.
 * @param statusCode - The HTTP status code (optional).
 * @param endpoint - The API endpoint where the error occurred (optional).
 */
export const showApiErrorToast = (
  message: string,
  statusCode?: number,
  endpoint?: string
) => {
  const timestamp = new Date().toLocaleTimeString(); // Add timestamp

  toast({
    variant: "destructive", // Red error toast
    title: `Error ${statusCode ? `(${statusCode})` : ""}`,
    description: (
      <div className="flex flex-col space-y-1">
        <p className="font-semibold">{message}</p>
        {endpoint && (
          <p className="text-xs text-gray-400">🔗 API: {endpoint}</p>
        )}
        <p className="text-xs text-gray-500">⏰ {timestamp}</p>
      </div>
    ),
  });
};
