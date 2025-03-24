import { Text, View, Image } from "react-native";
import { styles } from "../../styles/auth.styles";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.image}
      />
    </View> 
  );
}
