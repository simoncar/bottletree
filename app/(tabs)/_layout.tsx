import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { BigText } from "../../components/StyledText";

import Colors from "../../constants/Colors";
import { View } from "../../components/Themed";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome5>["name"]; color: string }) {
	return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					headerTitle: () => <BigText style={{ fontSize: 28 }}>One Build</BigText>,
					headerTitleAlign: "left",
					headerRight: () => (
						<View>
							<Link href="/modal" asChild>
								<Pressable>{({ pressed }) => <FontAwesome5 name="hammer" size={25} color={Colors[colorScheme ?? "light"].text} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />}</Pressable>
							</Link>
						</View>
					)
				}}
			/>

			<Tabs.Screen
				name="calendar"
				options={{
					title: "",
					headerTitle: () => <BigText style={{ fontSize: 28 }}>Calendar</BigText>,
					headerTitleAlign: "left",
					tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />
				}}
			/>

			<Tabs.Screen
				name="two"
				options={{
					title: "",
					headerTitle: () => <BigText style={{ fontSize: 28 }}>Add</BigText>,
					headerTitleAlign: "left",
					tabBarIcon: ({ color }) => <TabBarIcon name="plus-square" color={color} />
				}}
			/>
		</Tabs>
	);
}
