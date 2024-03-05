import { linkClass } from "@/lib/tw-styles";
import React from "react";

type Props = {};

export default function How({}: Props) {
	return (
		<div
			id='how-it-works'
			className='anchor'
		>
			<div className='py-[50px] md:py-[100px] px-[64px]'>
				<h1 className='text-3xl md:text-5xl font-bold text-white mb-4'>
					How do{" "}
					<a
						href='https://www.enagic.com/en/'
						className={linkClass}
					>
						Enagic® Machines
					</a>{" "}
					work?
				</h1>
				<p className='text-2xl text-gray-300'>
					The filtered water moves through several electrode plates and
					membranes, separating into acidic and alkaline parts. It is split into
					OH- (hydroxide ions) and H+ (hydrogen ions). The hydrogen ions react
					with electrons given by the cathode (– charged electrode), forming H2,
					molecular Hydrogen. <br />
					<br />
					Hydroxide ions remain, making the water more alkaline around the
					cathode. Conversely, close to the anode (+ charged electrode),
					hydroxide ions give electrons to the anode, eventually forming O2
					(Oxygen). Hydrogen ions remain, making the water more acidic around
					the anode. The two kinds of water are separated by membranes and
					released through different hoses.
					<a
						className={linkClass}
						href='https://www.enagic.com/en_US/how-your-tap-water-becomes-kangen-water'
					>
						*
					</a>
				</p>
			</div>
		</div>
	);
}
