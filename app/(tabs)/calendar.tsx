import React, { Component } from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from "react-native-calendars";

interface State {
	items?: AgendaSchedule;
}

const agendaItems = [
	{
		title: "Title 1",
		data: [{ hour: "12am", duration: "1h", title: "First Yoga" }]
	},
	{
		title: "Title 1",
		data: [
			{ hour: "4pm", duration: "1h", title: "Pilates ABC" },
			{ hour: "5pm", duration: "1h", title: "Vinyasa Yoga" }
		]
	},
	{
		title: "Title 1",
		data: [
			{ hour: "1pm", duration: "1h", title: "Ashtanga Yoga" },
			{ hour: "2pm", duration: "1h", title: "Deep Stretches" },
			{ hour: "3pm", duration: "1h", title: "Private Yoga" }
		]
	},
	{
		title: "Title 1",
		data: [{ hour: "12am", duration: "1h", title: "Ashtanga Yoga" }]
	},
	{
		title: "Title 1",
		data: [{}]
	},
	{
		title: "Title 1",
		data: [
			{ hour: "9pm", duration: "1h", title: "Middle Yoga" },
			{ hour: "10pm", duration: "1h", title: "Ashtanga" },
			{ hour: "11pm", duration: "1h", title: "TRX" },
			{ hour: "12pm", duration: "1h", title: "Running Group" }
		]
	},
	{
		title: "Title 1",
		data: [{ hour: "12am", duration: "1h", title: "Ashtanga Yoga" }]
	},
	{
		title: "Title 1",
		data: [{}]
	},
	{
		title: "Title 1",
		data: [
			{ hour: "9pm", duration: "1h", title: "Pilates Reformer" },
			{ hour: "10pm", duration: "1h", title: "Ashtanga" },
			{ hour: "11pm", duration: "1h", title: "TRX" },
			{ hour: "12pm", duration: "1h", title: "Running Group" }
		]
	},
	{
		title: "Title 1",
		data: [
			{ hour: "1pm", duration: "1h", title: "Ashtanga Yoga" },
			{ hour: "2pm", duration: "1h", title: "Deep Stretches" },
			{ hour: "3pm", duration: "1h", title: "Private Yoga" }
		]
	},
	{
		title: "Title 1",
		data: [{ hour: "12am", duration: "1h", title: "Last Yoga" }]
	},
	{
		title: "Title 1",
		data: [
			{ hour: "1pm", duration: "1h", title: "Ashtanga Yoga" },
			{ hour: "2pm", duration: "1h", title: "Deep Stretches" },
			{ hour: "3pm", duration: "1h", title: "Private Yoga" }
		]
	},
	{
		title: "Title 1",
		data: [{ hour: "12am", duration: "1h", title: "Last Yoga" }]
	},
	{
		title: "Title 1",
		data: [{ hour: "12am", duration: "1h", title: "Last Yoga" }]
	}
];

const ITEMS: any[] = agendaItems;

export default class AgendaScreen extends Component<State> {
	state: State = {
		items: undefined
	};

	// reservationsKeyExtractor = (item, index) => {
	//   return `${item?.reservation?.day}${index}`;
	// };

	render() {
		return (
			<Agenda
				items={{
					"2023-06-10": [
						{
							name: "Build Started",
							description: "Team will be onsite at 8am to start build"
						},
						{
							name: "Plans Approved",
							description: "See attached plans for details"
						}
					],
					"2023-06-11": [
						{
							name: "Foundations",
							description: "Trucks have parking permits for the day"
						}
					],
					"2023-06-12": [{ name: "Slab" }],
					"2023-06-13": [{ name: "Walls" }],
					"2023-06-14": [
						{
							name: "Roof",
							description: "High winds expected, please secure materials"
						}
					],
					"2023-06-15": [
						{
							name: "Deadline Taps Order",
							description: "Order must be confirmed by 5pm",
							contact: "Stefanie (555) 555-5555"
						}
					],
					"2023-06-16": [{ name: "Plumbing" }],
					"2023-06-17": [{ name: "Doors" }],
					"2023-06-18": [{ name: "Move In" }]
				}}
				loadItemsForMonth={this.loadItems}
				selected={"2023-06-10"}
				renderItem={this.renderItem}
				rowHasChanged={this.rowHasChanged}
				showClosingKnob={true}
				markingType={"period"}
				markedDates={{
					"2023-05-08": { textColor: "#43515c" },
					"2023-05-09": { textColor: "#43515c" },
					"2023-05-14": { startingDay: true, endingDay: true },
					"2023-05-21": { startingDay: true },
					"2023-05-22": { endingDay: true, color: "gray" },
					"2023-05-24": { startingDay: true, color: "gray" },
					"2023-05-25": { color: "gray" },
					"2023-05-26": { endingDay: true, color: "gray" }
				}}
				monthFormat={"yyyy"}
				theme={{ agendaKnobColor: "lightgrey" }}
				hideExtraDays={false}
				reservationsKeyExtractor={this.reservationsKeyExtractor}
			/>
		);
	}

	renderItem = (reservation: any, isFirst: boolean) => {
		const fontSize = isFirst ? 16 : 14;
		const color = isFirst ? "black" : "#43515c";

		return (
			<TouchableOpacity style={[styles.item, { height: reservation.height }]} onPress={() => Alert.alert(reservation.name)}>
				<Text style={{ fontSize, color }}>{reservation.name}</Text>
				<Text style={styles.description}>{reservation.description}</Text>
				<Text style={styles.description}>{reservation.contact}</Text>
			</TouchableOpacity>
		);
	};

	renderEmptyDate = () => {
		return (
			<View style={styles.emptyDate}>
				<Text>This is empty date!</Text>
			</View>
		);
	};

	rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
		return r1.name !== r2.name;
	};

	timeToString(time: number) {
		const date = new Date(time);
		return date.toISOString().split("T")[0];
	}
}

const styles = StyleSheet.create({
	item: {
		backgroundColor: "white",
		flex: 1,
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		marginTop: 17
	},
	description: {
		paddingTop: 10,
		color: "#43515c"
	},
	emptyDate: {
		height: 15,
		flex: 1,
		paddingTop: 30
	}
});
