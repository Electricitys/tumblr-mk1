import { Button, Classes, Divider } from "@blueprintjs/core";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { Box } from "../components/Grid"

export const Landing = () => {
  const history = useHistory();
  return (
    <>
      <Helmet>
        <title>Tumblr MK1</title>
      </Helmet>
      <Box sx={{
        maxWidth: 360,
        mx: "auto",
      }}>
        <Box
          as="h1"
          className={Classes.HEADING}
          sx={{
            textAlign: "center",
            px: 3,
            mb: 4,
            mt: 5,
            fontWeight: "lighter"
          }}
        >Selamat Datang</Box>
        <Box
          as="p"
          sx={{
            mt: 5,
            mx: 3,
            fontFamily: "monospace",
            color: "gray.4"
          }}
        >
          Project ini diperuntukan kepada dokter dan pasien sebagai monitor perkembangan pasien dengan menganalisa aktifitas frekuensi obat yang diminum.
        </Box>
        <Box sx={{ px: 3, my: 3, mt: 5, }}>
          <Button
            fill={true}
            intent="primary"
            // outlined={true}
            text="Masuk"
            large={true}
            onClick={() => {
              history.push("/login");
            }}
          />
          <Box as={Divider} sx={{
            my: 4,
          }} />
          <Button
            fill={true}
            outlined={true}
            text="Daftar"
            large={true}
            onClick={() => {
              history.push("/register");
            }}
          />
        </Box>

        <Box
          as="p"
          sx={{
            mt: 5,
            mx: 3,
            fontFamily: "monospace",
            color: "gray.4"
          }}
        >
          Created with love by Team.
        </Box>
      </Box>
    </>
  );
}