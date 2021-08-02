import { Box, Flex } from "../../components/Grid"
import { Helmet } from "react-helmet";
import { Button } from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { ListGroup } from "../../components/ListGroup";

export const Activity = () => {
  const history = useHistory();
  useEffect(() => {

  }, []);
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
            <ListGroup sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}>
              <ListGroup.Header>
                <Flex sx={{
                  justifyContent: "space-between"
                }}>
                  <Button
                    small={true}
                    minimal={true}
                    icon="chevron-left"
                  />
                  <Button
                    small={true}
                    outlined={true}
                    text="Senin, 27 Agustus 2021"
                  />
                  <Button
                    small={true}
                    minimal={true}
                    icon="chevron-right"
                  />
                </Flex>
              </ListGroup.Header>
              <Box sx={{ flexGrow: 1, flexShrink: 1, height: "1%", overflowY: "auto" }}>
                {/* <Box sx={{ position: "absolute", inset: 0, height: "100%", overflowY: "hidden" }}> */}
                {[{
                  text: "Mengonsumsi obat Amoxilin tepat waktu",
                  date: "07:50 AM",
                }, {
                  text: "Mengonsumsi obat Amoxilin tepat waktu",
                  date: "07:50 AM",
                }, {
                  text: "Mengonsumsi obat Amoxilin tepat waktu",
                  date: "07:50 AM",
                }, {
                  text: "Mengonsumsi obat Amoxilin tepat waktu",
                  date: "07:50 AM",
                }, {
                  text: "Mengonsumsi obat Amoxilin tepat waktu",
                  date: "07:50 AM",
                }, {
                  text: "Mengonsumsi obat Amoxilin tepat waktu",
                  date: "07:50 AM",
                }].map((value, idx) => (
                  <ListGroup.Item key={idx}>
                    <Flex sx={{
                      fontSize: 0
                    }}>
                      <Box>#{idx}</Box>
                      <Box sx={{
                        flexGrow: 1,
                        textAlign: "right",
                        color: "gray.4"
                      }}>{value["date"]}</Box>
                    </Flex>
                    <Box sx={{
                      mt: 2,
                      fontSize: 2
                    }}>{value["text"]}</Box>
                  </ListGroup.Item>))}
                {/* </Box> */}
              </Box>
            </ListGroup>
          </Box>
        </Box>
      </Flex>
    </>
  )
}