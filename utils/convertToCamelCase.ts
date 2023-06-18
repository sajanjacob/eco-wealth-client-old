function convertToCamelCase(data: any): any {
	if (Array.isArray(data)) {
		return data.map(convertToCamelCase);
	} else if (data !== null && typeof data === "object") {
		return Object.keys(data).reduce((accumulator: any, key) => {
			let newKey = key.replace(/([-_][a-z])/g, (group) =>
				group.toUpperCase().replace("-", "").replace("_", "")
			);
			accumulator[newKey] = convertToCamelCase(data[key]);
			return accumulator;
		}, {});
	}
	return data;
}

export default convertToCamelCase;
