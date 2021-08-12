import { Button, NonIdealState } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useEffect, useState } from "react";
import { useAccount } from "../../components/Account";
import { useClient } from "../../components/Client";
import { Box, Flex } from "../../components/Grid";
import { ListGroup } from "../../components/ListGroup";
import moment from "moment";
import { DatePicker } from "@blueprintjs/datetime";

export const List = () => {
  const { user } = useAccount();
  const client = useClient();
  const [list, setList] = useState([]);
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    console.log(user);
    async function fetch() {
      const res = await client.service("activity").find({
        query: {
          patientId: user["patient.id"],
          $select: ["id", "createdAt", "type", "message"],
          createdAt: {
            $gte: moment(date).startOf("day").toISOString(),
            $lte: moment(date).endOf("day").toISOString(),
          }
        }
      });
      setList(res.data.map((value) => {
        return {
          id: value.id,
          text: value.message,
          date: moment(value.createdAt).format("hh:mm A")
        }
      }));
      console.log(res.data);
    }
    fetch();
  }, [client, user, date]);
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
          <Button
            small={true}
            minimal={true}
            icon="chevron-left"
            onClick={() => {
              setDate(moment(date).subtract(1, "day").toDate());
            }}
          />
          <Popover2
            placement="bottom"
            content={(
              <Box>
                <DatePicker
                  highlightCurrentDay={true}
                  value={date}
                  onChange={(value) => {
                    setDate(value);
                  }}
                />
              </Box>
            )}
          >
            <Button
              small={true}
              outlined={true}
              text={moment(date).format("dddd, DD MMM yyyy")}
            />
          </Popover2>
          <Button
            small={true}
            minimal={true}
            icon="chevron-right"
            onClick={() => {
              setDate(date => moment(date).add(1, "day").toDate());
            }}
          />
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
          <ListGroup.Item key={value.id}>
            <Flex sx={{
              fontSize: 0
            }}>
              <Box>#{value.id}</Box>
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