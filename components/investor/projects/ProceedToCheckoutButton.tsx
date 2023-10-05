// Import necessary dependencies
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Image from "next/image";
import darkStripeLogo from "@/assets/images/stripe_logo_dark.svg";
import lightStripeLogo from "@/assets/images/stripe_logo_light.svg";
import acceptedCards from "@/assets/images/visa-mastercard-discover-americanexpress.png";
type Props = {
	setCheckoutStep?: React.Dispatch<React.SetStateAction<number>>;
	numOfUnits: number;
	amountPerUnit: number;
	projectName: string;
	type: string;
	projectId?: string;
	project: Project;
};
const stripePromise = loadStripe(`${process.env.stripe_publishable_key}`);
// TODO: fix light and dark mode -> Stripe logos
// The main component
function ProceedToCheckoutButton({
	setCheckoutStep,
	numOfUnits,
	amountPerUnit,
	projectName,
	type,
	projectId,
	project,
}: Props) {
	const user = useAppSelector((state: RootState) => state.user);
	const isNonProfit = project.isNonProfit;
	const Checkout = async (e: any) => {
		e.preventDefault();
		// Get Stripe.js instance
		const stripe = await stripePromise;
		if (!stripe) return;
		console.log("stripe", stripe);
		// Call your backend to create the Checkout Session
		const response = await fetch("/api/checkout_sessions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				numOfUnits,
				amountPerUnit,
				projectName,
				isNonProfit,
				type,
				projectId,
				user,
				project,
			}),
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));

		const session = await response;
		console.log("session", session);

		// When the customer clicks on the button, redirect them to Checkout.
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			// If `redirectToCheckout` fails due to a browser or network
			// error, display the localized error
			// message to your customer.
			alert(result.error.message);
		}
	};
	return (
		<div>
			<button
				className='w-full my-4 p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'
				onClick={(e) => Checkout(e)}
			>
				Proceed to payment
			</button>
			<span className='flex justify-end'>
				<span className='flex items-center px-2 rounded-sm mr-2'>
					<Image
						src={acceptedCards}
						alt=''
						className='w-32 h-10 object-contain'
					/>
				</span>
				<Image
					src={lightStripeLogo}
					alt=''
					className='w-32 h-10 object-contain'
				/>
			</span>
		</div>
	);
}

export default ProceedToCheckoutButton;
