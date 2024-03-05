import { linkClass } from "@/lib/tw-styles";
import React from "react";
import GoToOrderButton from "./GoToOrderButton";

type Props = {};

export default function What({}: Props) {
	return (
		<div
			id='what'
			className='anchor'
		>
			<div className='py-[100px] px-[64px]'>
				<h1 className='text-4xl leading-tight font-bold text-gray-400 mb-12'>
					<a
						href='https://www.enagic.com/en/'
						className={linkClass}
					>
						Enagic® Machines are Electrolysis Machines
					</a>{" "}
					that{" "}
					<span className='text-white'>
						produce Kangen Water AKA Hydrogen-Rich Electrolyzed Reduced Water
						<a
							className={linkClass}
							href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9738607/'
						>
							*
						</a>{" "}
						and Hypochlorous Acid
						<a
							className={linkClass}
							href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7315945/'
						>
							*
						</a>
						.
					</span>
				</h1>
				<p className='text-2xl my-4 text-gray-300'>
					<span className='text-white font-bold'>
						Hydrogen-rich electrolyzed reduced water (ERW)
					</span>{" "}
					is a special type of water infused with extra hydrogen gas through a
					process called electrolysis. Scientific research has revealed that the
					real hero behind ERW&apos;s health benefits is the molecular hydrogen
					(H2) it contains. <br />
					<br />
					This tiny, powerful molecule can travel deep into our cells, offering
					antioxidant benefits by neutralizing harmful substances called free
					radicals, reducing inflammation, and protecting our cells from stress.
					<br />
					<br />
					Unlike some of the exaggerated claims you might have heard, the
					benefits of ERW come from this dissolved hydrogen, not from changing
					the water&apos;s structure or its alkalinity. <br />
					<br />
					In simple terms, drinking hydrogen-rich water is like giving your body
					a molecular shield, helping to keep your cells healthy and resilient
					against damage.
				</p>
				<hr className='border-green-900 my-16' />
				<p className='text-2xl mt-4 mb-16 text-gray-300'>
					<span className='text-white font-bold'>Hypochlorous Acid (HOCl)</span>{" "}
					is a gentle yet powerful disinfectant that is safe for humans but
					deadly for viruses and bacteria, including the coronavirus. <br />
					<br />
					It&apos;s a substance naturally produced by our own bodies to fight
					infections and kill harmful organisms. <br />
					<br />
					HOCl can be easily made using just water, salt, and a little
					electricity, making it an affordable and eco-friendly option for
					keeping spaces clean and safe. <br />
					<br />
					It works quickly to disinfect surfaces and can even be used in foggers
					to sanitize large areas without leaving toxic residues. <br />
					<br />
					Whether you&apos;re cleaning a medical office or your home, HOCl
					offers an effective way to protect against germs and viruses without
					harming people or the environment.
				</p>
				<GoToOrderButton />
			</div>
		</div>
	);
}
