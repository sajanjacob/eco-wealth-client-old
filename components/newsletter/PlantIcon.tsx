import React from "react";
import { PiPlantBold } from "react-icons/pi";

type Props = {};

export default function PlantIcon({}: Props) {
	return (
		<div className='border-[8px] rounded-full p-8 px-10 border-green-700 mb-8'>
			<PiPlantBold className='text-green-700 text-8xl mb-4' />
		</div>
	);
}
