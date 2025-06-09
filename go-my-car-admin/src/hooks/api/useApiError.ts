import Toast from "@/components/toast/commonToast";

interface ApiErrorResponse {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);
  if (typeof error === "string") {
    Toast("destructive", "Error", error);
    return;
  }
  if (error && typeof error === "object" && "errors" in error) {
    const apiError = error as ApiErrorResponse;

    if (apiError.errors) {
      Object.entries(apiError.errors).forEach(([key, messages]) => {
        messages.forEach((msg) => {
          Toast("destructive", "Error", msg);
        });
      });
    } else if (apiError.message) {
      Toast("destructive", "Error", apiError.message);
    }
  } else {
    Toast(
      "destructive",
      "Unexpected Error",
      "Something went wrong. Please try again later."
    );
  }
}
