import { Box } from "../components/Grid"
import Helmet from "react-helmet";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { Button, Callout, Card, Classes, FormGroup, H1, HTMLSelect, InputGroup } from "@blueprintjs/core";
import { Formik } from "formik";
import { useClient } from "../components/Client";

const Schema = Yup.object().shape({
  email: Yup.string().required("Fill with your email."),
  password: Yup.string().required("Fill with your email."),
  role: Yup.string().oneOf(["patient", "doctor"]),
})

export const Register = () => {
  const history = useHistory();
  const client = useClient();
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const lockButton = (<Button
    minimal={true}
    icon={isPasswordShow ? "eye-open" : "eye-off"}
    onClick={() => setIsPasswordShow(!isPasswordShow)}
  />)
  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <Box sx={{
        position: "absolute",
        inset: "0",
        bg: "gray.1"
      }}>
        <Box sx={{
          maxWidth: 340,
          my: 0,
          mx: "auto",
          px: 16
        }}>
          <Box
            as={H1}
            sx={{
              fontWeight: "lighter",
              textAlign: "center",
              mt: 5,
              mb: 4
            }}
          >Daftar akun baru</Box>
          <Box
            as={Card}
            sx={{
              mb: 3
            }}
          >
            <Formik
              initialValues={{
                email: "",
                password: "",
                role: "patient"
              }}
              validationSchema={Schema}
              onSubmit={async (value, { setSubmitting, setErrors }) => {
                try {
                  await client.service("users").create({
                    email: value["email"],
                    password: value["password"],
                    role: value["role"],
                  });
                  history.push("/login");
                } catch (err) {
                  console.log(err);
                  setErrors({
                    submit: err.message
                  });
                  setSubmitting(false);
                }
              }}
            >
              {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  {errors.submit &&
                    <Callout intent="danger">
                      {errors.submit}
                    </Callout>}
                  <FormGroup
                    label="Email"
                    labelFor="f-email"
                    intent={errors["email"] ? "danger" : "none"}
                    helperText={errors["email"]}
                  >
                    <InputGroup
                      id="f-email"
                      name="email"
                      type="text"
                      value={values["email"]}
                      intent={errors["email"] ? "danger" : "none"}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Password"
                    labelFor="f-password"
                    intent={errors["password"] ? "danger" : "none"}
                    helperText={errors["password"]}
                  >
                    <InputGroup
                      id="f-password"
                      rightElement={lockButton}
                      name="password"
                      type={isPasswordShow ? "text" : "password"}
                      value={values["password"]}
                      intent={errors["password"] ? "danger" : "none"}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Role"
                    labelFor="f-role"
                    intent={errors["role"] ? "danger" : "none"}
                    helperText={errors["role"]}
                  >
                    <HTMLSelect
                      fill={true}
                      id="f-role"
                      name="role"
                      value={values["role"]}
                      onChange={handleChange}
                      options={[
                        { label: "Pasien / Pendamping Pasien", value: "patient" },
                        { label: "Dokter / Petugas Kesehatan", value: "doctor" },
                      ]}
                      intent={errors["role"] ? "danger" : "none"}
                    />
                  </FormGroup>
                  <Button
                    type="submit"
                    text="Daftar"
                    intent="primary"
                    loading={isSubmitting}
                    fill={true}
                    disabled={Object.entries(errors).length > 0 && !errors.submit}
                  />
                </form>
              )}
            </Formik>
          </Box>
          <Box
            as={Card}
            sx={{
              textAlign: "center",
              mb: 4
            }}
          >
            <span>Sudah punya akun?</span>
            <Link to="/login"> Masuk</Link>.
          </Box>
          <Box sx={{
            textAlign: "center"
          }}>
            <a href={"mailto:ilomon10@gmail.com"} className={Classes.TEXT_SMALL}>Lapor sesuatu</a>
          </Box>
        </Box>
      </Box>
    </>
  )
}