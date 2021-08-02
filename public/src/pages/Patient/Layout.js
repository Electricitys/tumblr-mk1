import { Box } from "../../components/Grid"
import { Router } from "./Router"

export const Layout = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        bg: "gray.2"
      }}
    >
      <Box sx={{
        mx: "auto",
        maxWidth: 360,
        maxHeight: 640,
        height: "100%",
        width: "100%",
        position: "relative",
      }}>
        <Box sx={{
          position: "absolute",
          bottom: -60,
          right: 0,
          left: 0,
          fontFamily: "monospace",
          fontSize: 0,
          color: "gray.4",
          textAlign: "center"
        }}>
          <span>Best experience on smartphone</span>
        </Box>
        <Box sx={{
          position: "absolute",
          inset: 0,
          bg: "white",
          borderRadius: 8
        }} />
        <Box sx={{
          position: "absolute",
          inset: 0
        }} >
          <Router />
        </Box>
      </Box>
    </Box>
  )
}