export default function debounce(
	callback: (...args: any[]) => void,
	delay = 1000
) {
	let time: any;

	return (...args: any[]) => {
		clearTimeout(time);
		time = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}
