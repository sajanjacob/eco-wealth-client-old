import DOMPurify from "dompurify";

function sanitizeJsonObject(jsonObject: { [key: string]: any }) {
	Object.keys(jsonObject).forEach((key) => {
		const value = jsonObject[key];
		if (typeof value === "string") {
			jsonObject[key] = DOMPurify.sanitize(value);
		} else if (typeof value === "object" && value !== null) {
			sanitizeJsonObject(value); // Recursively sanitize nested objects
		}
	});
	return jsonObject;
}

export default sanitizeJsonObject;
