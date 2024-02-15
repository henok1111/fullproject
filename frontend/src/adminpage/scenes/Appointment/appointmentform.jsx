import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
const Appointmentform = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return <p>hello</p>;
};

export default Appointmentform;
