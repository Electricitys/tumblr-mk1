import {
  HashRouter,
  Switch,
  Route
} from "react-router-dom";
import App from "./App";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const Router = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/" component={App} />
      </Switch>
    </HashRouter>
  )
}