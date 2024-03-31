import sanitizeStringArray from "./sanitizeStringArray";
import sanitizeHTML from "sanitize-html";

function sanitizeJsonObject(jsonObject: { [key: string]: any }) {
	const sanitizedObject: { [key: string]: any } = {};

	Object.keys(jsonObject).forEach((key) => {
		const value = jsonObject[key];
		if (typeof value === "string") {
			sanitizedObject[key] = sanitizeHTML(value);
		} else if (
			typeof value === "object" &&
			value !== null &&
			!Array.isArray(value)
		) {
			sanitizedObject[key] = sanitizeJsonObject(value); // Recursively sanitize nested objects and assign to new object
		} else if (Array.isArray(value)) {
			sanitizedObject[key] = sanitizeStringArray(value); // Assuming sanitizeStringArray returns a new array
		} else {
			sanitizedObject[key] = value; // Copy over values that are not objects or strings unchanged
		}
	});

	return sanitizedObject;
}

export default sanitizeJsonObject;
