import { Helmet } from "react-helmet-async";

export default function Page403() {
  return (
    <>
      <Helmet>
        <title> 403 No Permission!</title>
      </Helmet>
      <h1> 403 No Permission!</h1>
    </>
  );
}
