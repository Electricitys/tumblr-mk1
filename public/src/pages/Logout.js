import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAccount } from "../components/Account"
import { Box } from "../components/Grid"

export const Logout = () => {
  const { logout } = useAccount();
  const history = useHistory();
  useEffect(() => {
    logout();
    setInterval(() => {
      history.push("/");
      history.go(0);
    }, 2500);
  }, []); // eslint-disable-line
  return (
    <Box>
      You will be redirect.
    </Box>
  )
}