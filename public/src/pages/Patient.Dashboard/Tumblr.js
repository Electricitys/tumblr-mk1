import { Box } from "../../components/Grid"
import fullbodyImg from "../../image/fullbody.png";
import controllerImg from "../../image/controller.png";
import lvl1Img from "../../image/level-1.png";
import lvl2Img from "../../image/level-2.png";
import lvl3Img from "../../image/level-3.png";
import tankImg from "../../image/tank.png";

export const Tumblr = ({ active = null }) => {
  return (
    <Box
      className={active && "active"}
      sx={{
        m: 3,
        position: "absolute",
        inset: 0,
        "img": {
          width: "100%",
          height: "100%",
          objectFit: "contain",
          position: "absolute",
          display: "none",
          "&.fullbody": {
            display: "block"
          },
          "&.active": {
            display: "block"
          }
        },
        "&.active img.fullbody": {
          opacity: 0.25
        }
      }}
    >
      {[{
        type: "fullbody",
        src: fullbodyImg
      }, {
        type: "ctrl",
        src: controllerImg
      }, {
        type: "lvl3",
        src: lvl3Img
      }, {
        type: "lvl2",
        src: lvl2Img
      }, {
        type: "lvl1",
        src: lvl1Img
      }, {
        type: "tank",
        src: tankImg
      }].map((value, idx) => (
        <Box
          key={idx}
          as="img"
          className={`${value["type"]} ${active === value["type"] && "active"}`}
          src={value["src"]}
          sx={{}}
        />))}
    </Box>
  )
}