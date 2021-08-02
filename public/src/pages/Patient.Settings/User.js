import { Formik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Button, Callout, Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import { Box } from "../../components/Grid"
import { useClient } from "../../components/Client";
import { useAccount } from "../../components/Account";

const Schema = Yup.object().shape({
  name: Yup.string().required(),
  address: Yup.string().required(),
  age: Yup.number().required(),
  disease: Yup.string().required(),
})

export const User = () => {
  const { user } = useAccount();
  const client = useClient();
  const history = useHistory();
  return (
    <Formik
      initialValues={{
        name: user["patient.name"] || "",
        address: user["patient.address"] || "",
        age: user["patient.age"] || "",
        disease: user["patient.disease"] || "",
      }}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        console.log(values);
        try {
          await client.service("patient").patch(user["patient.id"], {
            name: values["name"],
            address: values["address"],
            age: values["age"],
            disease: values["disease"],
          });
          history.go(0);
        } catch (err) {
          console.error(err);
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, resetForm, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          {errors.submit &&
            <Callout intent="danger">
              {errors.submit}
            </Callout>}
          <FormGroup
            label="Nama"
            labelFor="f-name"
            intent={errors["name"] ? "danger" : "none"}
            helperText={errors["name"]}
          >
            <InputGroup
              id="f-name"
              name="name"
              type="text"
              value={values["name"]}
              intent={errors["name"] ? "danger" : "none"}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup
            label="Alamat"
            labelFor="f-address"
            intent={errors["address"] ? "danger" : "none"}
            helperText={errors["address"]}
          >
            <InputGroup
              id="f-address"
              name="address"
              type="text"
              value={values["address"]}
              intent={errors["address"] ? "danger" : "none"}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup
            label="Umur"
            labelFor="f-age"
            intent={errors["age"] ? "danger" : "none"}
            helperText={errors["age"]}
          >
            <InputGroup
              id="f-age"
              name="age"
              type="text"
              value={values["age"]}
              intent={errors["age"] ? "danger" : "none"}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup
            label="Penyakit"
            labelFor="f-disease"
            intent={errors["disease"] ? "danger" : "none"}
            helperText={errors["disease"]}
          >
            <InputGroup
              id="f-disease"
              name="disease"
              type="text"
              value={values["disease"]}
              intent={errors["disease"] ? "danger" : "none"}
              onChange={handleChange}
            />
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