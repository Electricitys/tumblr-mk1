import { Box, Flex } from "../../components/Grid"
import { Helmet } from "react-helmet";
import { Button } from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { List } from "./List";

export const Activity = () => {
  const history = useHistory();
  return (
    <>
      <Helmet>
        <title>Activity</title>
      </Helmet>
      <Flex sx={{
        position: "absolute",
        inset: 0,
        flexDirection: "column"
      }}>
        <Flex sx={{
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
              ml: 3,
              fontSize: 4,
            }}
          >Activity</Box>
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
    </>
  )
}