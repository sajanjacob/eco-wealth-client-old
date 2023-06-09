import { useState, useEffect } from "react";

export const useTheme = () => {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const localTheme = window.localStorage.getItem("theme");
		if (localTheme) {
			setTheme(localTheme);
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		window.localStorage.setItem("theme", newTheme);
	};

	return [theme, toggleTheme];
};
