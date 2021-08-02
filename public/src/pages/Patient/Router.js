import { Route, Switch } from "react-router-dom";
import { Activity } from "../Patient.Activity";
import { Dashboard } from "../Patient.Dashboard";
import { Settings } from "../Patient.Settings";

export const Router = () => {
  return (
    <Switch>
      <Route path="/activity" component={Activity} />
      <Route path="/settings" component={Settings} />
      <Route path="/" component={Dashboard} />
    </Switch>
  )
}