import DOMPurify from "dompurify";
function sanitizeStringArray(stringArray: any[]) {
	return stringArray.map((str) => {
		if (typeof str === "string") {
			return DOMPurify.sanitize(str);
		}
		// If the element is not a string, return it as is. Alternatively, you might throw an error or handle it differently depending on your requirements.
		return str;
	});
}

export default sanitizeStringArray;
