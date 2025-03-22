import { Text, View } from "react-native";
import { styles } from "../../styles/auth.styles";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center gap-4 p-4">
      {/* Box 1 */}
      <View className="bg-blue-500 w-40 h-20 justify-center items-center rounded-lg shadow-md">
        <Text className="text-white text-lg font-bold">Box 1</Text>
      </View>

      {/* Box 2 */}
      <View className="bg-red-500 w-40 h-20 justify-center items-center rounded-lg shadow-md">
        <Text className="text-white text-lg font-bold">Box 2</Text>
      </View>

      {/* Box 3 */}
      <View className="bg-green-500 w-40 h-20 justify-center items-center rounded-lg shadow-md">
        <Text className="text-white text-lg font-bold">Box 3</Text>
      </View>
    </View>
  );
}
