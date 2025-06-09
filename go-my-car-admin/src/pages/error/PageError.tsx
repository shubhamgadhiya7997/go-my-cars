import { Helmet } from "react-helmet-async";

import type { FallbackProps } from "react-error-boundary";
// import { useRouter } from "@/routes/hooks";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

export default function PageError({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  //   const { replace } = useRouter();

  const goHome = () => {
    resetErrorBoundary();
    // replace(HOMEPAGE);
  };
  return (
    <div>
      <Helmet>
        <title>Sorry, Page error occurred!</title>
      </Helmet>
      <h1>{error}</h1>
    </div>
  );
}
