import { Box } from "../../components/Grid"
import { Helmet } from "react-helmet";
import { useAccount } from "../../components/Account";
import { Button, Text } from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { Tumblr } from "./Tumblr";
import { useState } from "react";
import { DeviceInfo } from "./DeviceInfo";
import { NextAlarm } from "./NextAlarm";

export const Dashboard = () => {
  const { user } = useAccount();
  const history = useHistory();
  const [selectedSegment, setSelectedSegment] = useState(null);
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}>
        <Box sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          px: 2,
          mt: 4,
        }}>
          <Box sx={{
            ml: 2,
            mr: 1,
            flexGrow: 1,
          }}>
            <Box
              as="h1"
              sx={{
                fontSize: 4,
              }}
            >
              <Text ellipsize={true}>
                {user["patient.name"]}
              </Text>
            </Box>
            <Box
              as={Text}
              sx={{
                mt: 2,
                color: "gray.4"
              }}
            >
              {user["patient.disease"] || "Not set"}
            </Box>
          </Box>
          <Button
            minimal={true}
            large={true}
            icon="cog"
            onClick={() => history.push("/settings")}
          />
        </Box>
        <Box sx={{
          flexGrow: 1,
          px: 3,
          display: "flex",
          // alignItems: "center"
        }}>
          <Box sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            my: 4,
          }}>
            <DeviceInfo selectedSegment={selectedSegment} setSelectedSegment={setSelectedSegment} />
          </Box>
          <Box sx={{
            width: "50%",
            position: "relative"
          }}>
            <Tumblr active={selectedSegment} />
          </Box>
        </Box>
        <Box sx={{
          px: 3,
          mb: 3,
          flexShrink: 0,
          display: "flex",
          alignItems: "flex-end"
        }}>
          <Box sx={{
            flexShrink: 0
          }}>
            <Button
              intent="primary"
              outlined={true}
              text="Activity"
              onClick={(e) => {
                history.push("/activity");
              }}
            />
          </Box>
          <Box sx={{
            textAlign: "right",
            flexGrow: 1,
            fontFamily: "monospace",
            fontSize: 0
          }}>
            <NextAlarm />
          </Box>
        </Box>
      </Box>
    </>
  )
}