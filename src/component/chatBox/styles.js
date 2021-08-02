import { StyleSheet } from "react-native";
import { color, appStyle } from "../../utility";

export default StyleSheet.create({
  chatContainer: { backgroundColor: "rgb(228,230,235)", borderTopLeftRadius:15, borderBottomRightRadius: 15, borderTopRightRadius:15, marginLeft: 5 },
  chatTxt: {
    color: color.BLACK,
    fontSize: 18,
    marginVertical: 5,
    fontWeight: "500",
    paddingHorizontal: 12,
    paddingVertical: 3   
  },
});
