import { StyleSheet } from "react-native";
import { color } from "../../utility";

export default StyleSheet.create({
  cardStyle: {
    backgroundColor: "rgba(0,128,0,0.5)",
    borderRadius: 20,
    marginBottom: 10,
    marginLeft: 10.,
    marginRight:10
  },
  cardItemStyle: {
    backgroundColor: "rgb(0,128,0)",
    borderRadius: 20,
  },

  logoContainer: {
    height: 60,
    width: 60,
    borderColor: color.WHITE,
    borderWidth: 2,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.DARK_GRAY,
  },
  thumbnailName: { fontSize: 30, color: color.WHITE, fontWeight: "bold" },
  profileName: { fontSize: 20, color: color.WHITE, fontWeight: "bold" },
});
