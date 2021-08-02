import { Box, Flex } from "../../components/Grid"
import { Helmet } from "react-helmet";
import { useAccount } from "../../components/Account";
import { Button } from "@blueprintjs/core";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { ListGroup } from "../../components/ListGroup";

export const Layout = () => {
  const { logout } = useAccount();
  const history = useHistory();
  useEffect(() => {

  }, []);
  return (
    <>
      <Helmet>
        <title>Doctor - Activity</title>
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
            <Button
              minimal={true}
              large={true}
              icon="log-out"
              onClick={() => {
                logout();
                history.go(0);
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
                      outlined={true}
                      text="John Doe"
                    />
                    <Button
                      small={true}
                      outlined={true}
                      text="Senin, 27 Agustus 2021"
                    />
                  </Flex>
                </ListGroup.Header>
                <Box sx={{ flexGrow: 1, flexShrink: 1, height: "1%", overflowY: "auto" }}>
                  {/* <Box sx={{ position: "absolute", inset: 0, height: "100%", overflowY: "hidden" }}> */}
                  {[{
                    patient: "John Doe",
                    text: "Mengonsumsi obat Amoxilin tepat waktu",
                    date: "07:50 AM",
                  }, {
                    patient: "John Doe",
                    text: "Mengonsumsi obat Amoxilin tepat waktu",
                    date: "07:50 AM",
                  }, {
                    patient: "John Doe",
                    text: "Mengonsumsi obat Amoxilin tepat waktu",
                    date: "07:50 AM",
                  }, {
                    patient: "John Doe",
                    text: "Mengonsumsi obat Amoxilin tepat waktu",
                    date: "07:50 AM",
                  }, {
                    patient: "John Doe",
                    text: "Mengonsumsi obat Amoxilin tepat waktu",
                    date: "07:50 AM",
                  }, {
                    patient: "John Doe",
                    text: "Mengonsumsi obat Amoxilin tepat waktu",
                    date: "07:50 AM",
                  }].map((value, idx) => (
                    <ListGroup.Item key={idx}>
                      <Flex sx={{
                        fontSize: 0
                      }}>
                        <Box>#{idx}</Box>
                        <Box sx={{
                          ml: 3,
                          fontWeight: "bold",
                          color: "gray.5"
                        }}>{value["patient"]}</Box>
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
      </Box>
    </>
  )
}