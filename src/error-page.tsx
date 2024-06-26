import { useRouteError } from "react-router-dom";

type RouteError = {
  statusText?: string;
  message?: string;
};

const ErrorPage = () => {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Soory, an unexpected error occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
