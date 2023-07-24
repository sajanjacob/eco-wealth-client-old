// Import necessary dependencies
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
type Props = {
	setCheckoutStep?: React.Dispatch<React.SetStateAction<number>>;
	numOfUnits: number;
	amountPerUnit: number;
	isNonProfit: boolean;
	projectName: string;
	type: string;
	projectId: string;
	project: Project;
};
const stripePromise = loadStripe(`${process.env.stripe_publishable_key}`);

// The main component
function ProceedToCheckoutButton({
	setCheckoutStep,
	numOfUnits,
	amountPerUnit,
	isNonProfit,
	projectName,
	type,
	projectId,
	project,
}: Props) {
	const user = useAppSelector((state: RootState) => state.user);
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
		<>
			<button
				className='w-full my-4 p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'
				onClick={(e) => Checkout(e)}
			>
				Checkout now
			</button>
		</>
	);
}

export default ProceedToCheckoutButton;
