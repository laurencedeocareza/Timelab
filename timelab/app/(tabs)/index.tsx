import { Text, View, Image, Button } from "react-native";
import { styles } from "../../styles/auth.styles";

export default function Index() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/timeLabLogo.png")} style={styles.image}/>
        <Button title = "Get Started" />
    </View>
  );
}
