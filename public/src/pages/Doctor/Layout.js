import { Box, Flex } from "../../components/Grid"
import { Helmet } from "react-helmet";
import { AnchorButton, Button } from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { List } from "./List";

export const Layout = () => {
  const history = useHistory();
  return (
    <>
      <Helmet>
        <title>Doctor - Patient Activity</title>
      </Helmet>
      <Box sx={{
        position: "absolute",
        inset: 0,
      }}>
        <Flex sx={{
          height: "100%",
          maxWidth: 750,
          mx: "auto",
          flexDirection: "column"
        }}>
          <Flex sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            mt: 4,
          }}>
            <Box
              as="h1"
              sx={{
                flexGrow: 1,
                ml: 3,
                fontSize: 4,
              }}
            >Patient Activity</Box>
            <AnchorButton
              href="https://smartmedicaltumbler.wordpress.com/"
              target="_blank"
              minimal={true}
              large={true}
              icon="help"
              rel="noreferrer"
            />
            <Button
              minimal={true}
              large={true}
              icon="log-out"
              onClick={() => {
                history.push("/logout");
              }}
            />
          </Flex>
          <Box sx={{
            flexGrow: 1,
            mx: 3,
            my: 4,
            position: "relative"
          }}>
            <Box sx={{
              position: "absolute",
              inset: 0
            }}>
              <List />
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  )
}
