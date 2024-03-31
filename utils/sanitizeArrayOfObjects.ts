import sanitizeJsonObject from "./sanitizeJsonObject"; // Assuming this is the improved version

function sanitizeArrayOfObjects(
	arrayOfObjects: Array<{ [key: string]: any }>
): Array<{ [key: string]: any }> {
	return arrayOfObjects.map((obj) => sanitizeJsonObject(obj));
}

export default sanitizeArrayOfObjects;
