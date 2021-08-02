import { StyleSheet } from "react-native";
import { color, appStyle } from "../../utility";

export default StyleSheet.create({
  sendMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  input: {
    borderRadius: 20,
    width: "70%",
    backgroundColor: "rgb(228,230,235)",
    color: color.BLACK,

  },

  sendBtnContainer: {
    height: appStyle.fieldHeight,
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
  },
});
