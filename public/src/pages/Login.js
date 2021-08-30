import { Box } from "../components/Grid"
import Helmet from "react-helmet";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { useAccount } from "../components/Account";
import { useState } from "react";
import { Button, Callout, Card, Classes, FormGroup, H1, InputGroup } from "@blueprintjs/core";
import { Formik } from "formik";

const Schema = Yup.object().shape({
  email: Yup.string().required("Fill with your email."),
  password: Yup.string().required("Fill with your password."),
})

export const Login = () => {
  const history = useHistory();
  const account = useAccount();
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const lockButton = (<Button
    minimal={true}
    icon={isPasswordShow ? "eye-open" : "eye-off"}
    onClick={() => setIsPasswordShow(!isPasswordShow)}
  />)
  return (
    <>
      <Helmet>
        <title>Login</title>
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
          >Masuk ke Aplikasi</Box>
          <Box
            as={Card}
            sx={{
              mb: 3
            }}
          >
            <Formik
              initialValues={{
                email: "",
                password: ""
              }}
              validationSchema={Schema}
              onSubmit={async (value, { setSubmitting, setErrors }) => {
                try {
                  await account.login(value["email"], value["password"]);
                  history.push("/");
                } catch (err) {
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
                  <Button
                    type="submit"
                    text="Masuk"
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
            <span>Memulai akun baru?</span>
            <Link to="/register"> Di sini</Link>.
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