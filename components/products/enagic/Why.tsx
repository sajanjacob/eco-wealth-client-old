import React from "react";
import { linkClass } from "@/lib/tw-styles";
import Image from "next/image";
import plasticWasteImage from "@/assets/images/DALL·E 2024-03-03 22.04.26 - An impactful image depicting a clean, vibrant ocean on one side, symbolizing the positive impact of sustainable solutions, and on the other side, a cl.webp";
import GoToOrderButton from "./GoToOrderButton";
type Props = {};

export default function Why({}: Props) {
	return (
		<div
			id='why'
			className='anchor'
		>
			<div className='py-[100px] px-[64px]'>
				<div className='pt-64'>
					<h1 className='text-5xl md:text-7xl font-bold text-gray-400 leading-tight mb-16'>
						Every year, more than{" "}
						<span className='text-white'>
							8 million tons of plastic bottles
						</span>{" "}
						end up <span className='text-white'>in the ocean.</span>
					</h1>
					<div className='md:flex md:p-8 md:items-center'>
						<Image
							src={plasticWasteImage}
							className='md:w-1/3 h-max'
							alt='Plastic waste in the ocean'
						/>
						<div className='py-8 md:p-8'>
							<h2 className='text-4xl md:text-5xl font-bold text-gray-400'>
								<span className='text-white'>
									50 billion water & ~48 million bleach bottles
								</span>{" "}
								are purchased in America{" "}
								<span className='text-white'>every year.</span>
								<a
									className={linkClass}
									href='https://www.earthday.org/fact-sheet-single-use-plastics/#:~:text=Americans%20purchase%20about%2050%20billion,of%20156%20plastic%20bottles%20annually.'
								>
									*
								</a>
							</h2>
							<h3 className='text-2xl font-bold my-4 text-gray-300'>
								By using{" "}
								<a
									href='https://www.enagic.com/en/'
									className={linkClass}
								>
									Enagic®
								</a>{" "}
								water ionizing machines, you can help reduce the amount of
								plastic waste that ends up in the ocean.
							</h3>
							<GoToOrderButton />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
