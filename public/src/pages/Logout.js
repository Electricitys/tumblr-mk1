import { NonIdealState } from "@blueprintjs/core";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAccount } from "../components/Account"
import { Box } from "../components/Grid"

export const Logout = () => {
  const { logout } = useAccount();
  const history = useHistory();
  useEffect(() => {
    logout();
    setTimeout(() => {
      history.push("/");
      history.go(0);
    }, 2500);
  }, []); // eslint-disable-line
  return (
    <Box sx={{ my: 5 }}>
      <NonIdealState
        title="Loggin out..."
        description="Wait. You will redirected."
      />
    </Box>
  )
}