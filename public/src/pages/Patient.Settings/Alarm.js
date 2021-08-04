import { Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import _get from "lodash.get";
import { Button, Callout, Classes, FormGroup, InputGroup, Spinner } from "@blueprintjs/core";
import { TimePicker } from "@blueprintjs/datetime";
import moment from "moment";

import { Box, Flex } from "../../components/Grid"
import { useClient } from "../../components/Client";
import { useAccount } from "../../components/Account";


const Schema = Yup.object().shape({
  medicine: Yup.object().shape({
    lvl1: Yup.object().shape({
      name: Yup.string().required(),
      time: Yup.string().required()
    }),
    lvl2: Yup.object().shape({
      name: Yup.string().required(),
      time: Yup.string().required()
    }),
    lvl3: Yup.object().shape({
      name: Yup.string().required(),
      time: Yup.string().required()
    }),
  }),
})

export const Alarm = () => {
  const { user } = useAccount();
  const client = useClient();
  const history = useHistory();
  const [device, setDevice] = useState({
    id: null,
    config: {
      lvl1: {},
      lvl2: {},
      lvl3: {}
    }
  });
  useEffect(() => {
    const fetch = async () => {
      const res = await client.service("devices").find({
        query: {
          patientId: user["patient.id"]
        }
      });
      setDevice(res["data"][0]);
    }
    fetch()
  }, [client, user]);
  if (!device["id"]) return (
    <Spinner />
  )
  console.log(device["config"]["lvl1"]);
  return (
    <Formik
      initialValues={{
        medicine: {
          lvl3: {
            name: _get(device, `config.lvl3.name`),
            time: _get(device, `config.lvl3.time`)
          },
          lvl2: {
            name: _get(device, `config.lvl2.name`),
            time: _get(device, `config.lvl2.time`)
          },
          lvl1: {
            name: _get(device, `config.lvl1.name`),
            time: _get(device, `config.lvl1.time`)
          },
        },
      }}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting, setErrors, errors }) => {
        console.log(values);
        if (!device["id"]) return;
        const notApproved = Object.keys(values["medicine"]).reduce((prev, key) => {
          if (!prev) return prev;
          return Object.keys(_get(values, `medicine.${key}`)).reduce((p, k) => {
            if (!p) return p;
            if (_get(values, `medicine.${key}.${k}`)
              !== _get(device, `config.${key}.${k}`)) {
              return false;
            }
            return true;
          }, true);
        }, true);
        if (notApproved) {
          setErrors({ submit: "Noting changed" });
          return;
        }
        try {
          await client.service("devices").patch(device["id"], {
            config: values["medicine"],
          });
          history.go(0);
        } catch (err) {
          console.error(err);
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, setFieldValue, resetForm, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          {errors.submit &&
            <Callout intent="danger">
              {errors.submit}
            </Callout>}
          <FormGroup
            label="Medicine"
            labelFor="f-medicine"
          >
            {[
              "lvl3",
              "lvl2",
              "lvl1"
            ].map((value, idx) => {
              const error = _get(errors, `medicine.${value}`);
              return (
                <FormGroup
                  key={idx}
                  intent={error ? "danger" : "none"}
                  helperText={value}
                >
                  <Flex sx={{
                    alignItems: "center"
                  }}>
                    <Box sx={{
                      flexGrow: 1,
                    }}>
                      <InputGroup
                        fill={true}
                        id={`f-medicine-${value}-name`}
                        name={`medicine.${value}.name`}
                        placeholder="name"
                        type="text"
                        value={_get(values, `medicine.${value}.name`)}
                        intent={_get(errors, `medicine.${value}.name`) ? "danger" : "none"}
                        onChange={handleChange}
                      />
                    </Box>
                    <Box sx={{
                      flexShrink: 0,
                    }}>
                      <TimePicker
                        id={`f-medicine-${value}-time`}
                        name={`medicine.${value}.time`}
                        showArrowButtons={true}
                        placeholder="time"
                        type="text"
                        value={moment(_get(values, `medicine.${value}.time`), "HH:mm").toDate()}
                        intent={_get(errors, `medicine.${value}.time`) ? "danger" : "none"}
                        onChange={(e) => {
                          const val = moment(e).format("HH:mm");
                          console.log(val);
                          setFieldValue(`medicine.${value}.time`, moment(e).format("HH:mm"));
                        }}
                      />
                      {/* <TimePicker
                      id={`f-medicine-${value}-time`}
                      name={`medicine.${value}.time`}
                      placeholder="time"
                      type="text"
                      value={_get(values, `medicine.${value}.time`)}
                      intent={_get(errors, `medicine.${value}.time`) ? "danger" : "none"}
                      onChange={(e) => {
                        console.log(e);
                        // handleChange
                      }}
                    /> */}
                    </Box>
                  </Flex>
                </FormGroup>
              )
            })}
          </FormGroup>
          <Box sx={{
            textAlign: "right",
            [`.${Classes.BUTTON}`]: {
              ml: 2
            }
          }}>
            <Button
              type="reset"
              text="Reset"
              outlined={true}
              loading={isSubmitting}
              onClick={resetForm}
            />
            <Button
              type="submit"
              text="Simpan"
              intent="primary"
              loading={isSubmitting}
              disabled={Object.entries(errors).length > 0 && !errors.submit}
            />
          </Box>
        </form>
      )}
    </Formik>)
}