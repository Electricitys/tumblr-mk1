import { Button, NonIdealState } from "@blueprintjs/core"
import { DatePicker } from "@blueprintjs/datetime"
import { Popover2 } from "@blueprintjs/popover2"
import moment from "moment"
import { useEffect, useState } from "react"
import { useAccount } from "../../components/Account"
import { useClient } from "../../components/Client"
import { Box, Flex } from "../../components/Grid"
import { ListGroup } from "../../components/ListGroup"
import { Select } from "../../components/Select"

export const List = () => {
  const { user } = useAccount();
  const client = useClient();
  const [patientList, setPatientList] = useState([]);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({
    patientId: null,
    date: new Date()
  });
  useEffect(() => {
    async function fetch() {
      const date = moment(filter["date"]);
      const query = {
        createdAt: {
          $gte: date.startOf("day").toISOString(),
          $lte: date.endOf("day").toISOString(),
        },
        $include: [{
          model: "patient",
          as: "patient"
        }]
      }
      if (filter["patientId"]) {
        query["patientId"] = filter["patientId"];
      }
      const res = await client.service("activity").find({ query });
      console.log(res.data);

      setList(res.data.map((value) => {
        return {
          id: value.id,
          patient: value["patient.name"],
          text: value.message,
          type: value.type,
          date: moment(value.createdAt).format("hh:mm A")
        }
      }));

    }
    fetch();
  }, [client, user, filter]);
  useEffect(() => {
    async function fetch() {
      const res = await client.service("patient").find({
        query: {
          $select: ["id", "name"]
        }
      });
      console.log(res.data);

      setPatientList(res.data.map((value) => {
        return {
          value: value["id"],
          label: value["name"],
        }
      }));

    }
    fetch();
  }, [client, user, filter]);
  return (
    <ListGroup sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <ListGroup.Header>
        <Flex sx={{
          justifyContent: "space-between"
        }}>

          <Select
            small={true}
            outlined={true}
            value={filter["patientId"]}
            options={patientList}
            onChange={(value) => {
              setFilter(filter => {
                return {
                  ...filter,
                  patientId: value["value"]
                }
              })
              console.log(value);
            }}
          />
          <Popover2
            placement="bottom-end"
            content={(
              <Box>
                <DatePicker
                  highlightCurrentDay={true}
                  value={filter["date"]}
                  onChange={(value) => {
                    setFilter(filter => {
                      return {
                        ...filter,
                        date: value
                      }
                    });
                  }}
                />
              </Box>
            )}
          >
            <Button
              small={true}
              outlined={true}
              text={moment(filter["date"]).format("dddd, DD MMM yyyy")}
            />
          </Popover2>
        </Flex>
      </ListGroup.Header>
      <Box sx={{ flexGrow: 1, flexShrink: 1, height: "1%", overflowY: "auto" }}>
        {list.length === 0 && (
          <NonIdealState
            title="No activity yet"
          />
        )}
        {/* <Box sx={{ position: "absolute", inset: 0, height: "100%", overflowY: "hidden" }}> */}
        {list.map((value, idx) => (
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
  )
}
