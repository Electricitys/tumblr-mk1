import { Route } from "react-router-dom";
import { useAccount } from "./Account"
import { Spinner } from "@blueprintjs/core";
import { Landing } from "../pages/Landing";

export const PrivateRoute = (props) => {
  const { authenticated } = useAccount();
  console.log("Private Route");
  console.log(authenticated);
  const Loading = (
    <Spinner size={100} />
  )
  if (authenticated === null) {
    return (
      <Route {...props} component={undefined}>
        {Loading}
      </Route>
    )
  }
  if (authenticated === false) {
    return (<Route {...props} component={Landing} />)
  }
  return <Route {...props} />;
}