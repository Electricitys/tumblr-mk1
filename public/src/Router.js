import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import App from "./App";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

const Router = () => {
  console.log("router");
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/" component={App} />
      </Switch>
    </Router>
  )
}