import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RecentRegistrations() {
	const [registrations, setRegistrations] = useState([]);
	const [count, setCount] = useState(0);
	useEffect(() => {
		const fetchRegistrations = async () =>
			axios.get("/api/recent_waiting_list_signups").then((res) => {
				console.log(res.data);
				setRegistrations(res.data);
			}); // 1 second delay between each toast});

		fetchRegistrations();
	}, []);

	useEffect(() => {
		registrations.forEach((registration: any, index: number) => {
			const toastId = `registration-${registration.id}`; // Assuming each registration has a unique 'id'
			setTimeout(() => {
				if (!toast.isActive(toastId)) {
					toast.success(
						`${registration.name.substring(
							0,
							registration.name?.indexOf(" ")
						)} signed up at ${new Date(
							registration.created_at
						).toLocaleTimeString()}`,
						{
							position: "bottom-left",
							theme: "dark",
							toastId,
						}
					);
				}
			}, 3333);
		});
	}, [registrations, count]);

	return <></>;
}
