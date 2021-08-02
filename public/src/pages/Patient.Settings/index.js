import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { Button } from "@blueprintjs/core";
import { Box } from "../../components/Grid"
import { useAccount } from "../../components/Account";
import { User } from "./User";
import { Alarm } from "./Alarm";
import { DeleteButton } from "./DeleteButton";
import { DeviceInfo } from "./DeviceInfo";


export const Settings = () => {
  const { logout } = useAccount();
  const history = useHistory();
  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Box sx={{
        height: "100%",
        overflowY: "auto"
      }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          mt: 4,
        }}>
          <Button
            minimal={true}
            large={true}
            icon="chevron-left"
            onClick={() => history.push("/")}
          />
          <Box
            as="h1"
            sx={{
              flexGrow: 1,
              ml: 3,
              fontSize: 4,
            }}
          >Settings</Box>
          <Button
            minimal={true}
            large={true}
            icon="log-out"
            onClick={() => {
              logout();
              history.go(0);
            }}
          />
        </Box>
        <Box sx={{
          mt: 4,
          px: 3,
        }}>
          <User />
        </Box>
        <Box sx={{
          mt: 4,
          px: 3,
          mb: 3
        }}>
          <DeviceInfo />
        </Box>
        <Box sx={{
          mt: 4,
          px: 3,
          mb: 3
        }}>
          <Alarm />
        </Box>
        <Box sx={{
          mt: 4,
          px: 3,
          mb: 5
        }}>
          <DeleteButton />
        </Box>
      </Box>
    </>
  )
}