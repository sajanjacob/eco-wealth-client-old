import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

export default function RecentRegistrations() {
	const [registrations, setRegistrations] = useState<any>([]);
	useEffect(() => {
		const fetchRegistrations = async () =>
			axios.get("/api/recent_waiting_list_signups").then((res) => {
				setRegistrations(res.data);
			}); // 1 second delay between each toast});

		fetchRegistrations();
	}, []);

	useEffect(() => {
		async function DisplayPopup(index: number, name: string) {
			await setTimeout(async () => {
				toast.success(
					`${
						name?.split(" ").length > 1
							? name.substring(0, name?.indexOf(" "))
							: name
					} joined ${moment(registrations[index].created_at).fromNow()}`,
					{
						position: "bottom-left",
						theme: "dark",
					}
				);
			}, index * 5000);
		}
		for (let i = 0; i < registrations.length; i++) {
			const toastId = `registration-${registrations[i].id}`; // Assuming each registration has a unique 'id'

			DisplayPopup(i, registrations[i].name);
		}
	}, [registrations]);

	return <></>;
}
