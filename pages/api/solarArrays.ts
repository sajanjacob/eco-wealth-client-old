// pages/api/solarArrays.js
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// TODO: Connect to your database and retrieve the total number of solar arrays installed

	const totalSolarArraysInstalled = 0; // replace with actual number

	res.status(200).json({ total: totalSolarArraysInstalled });
}
