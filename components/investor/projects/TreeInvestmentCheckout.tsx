import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
// Set up Stripe.js
const stripePromise = loadStripe(`${process.env.stripe_publishable_key}`);
type Props = {
	calculateInvestmentTotalAmount: number;
	handleInvestmentSuccess: () => void;
	handleGoBack: () => void;
};

export default function TreeInvestmentCheckout({
	calculateInvestmentTotalAmount,
	handleInvestmentSuccess,
	handleGoBack,
}: Props) {
	return (
		<div>
			<>
				<h3>Card details</h3>
				<Elements stripe={stripePromise}>
					<CheckoutForm
						amount={calculateInvestmentTotalAmount}
						onSuccess={handleInvestmentSuccess}
					/>
				</Elements>

				<button onClick={handleGoBack}>Go Back</button>
			</>
		</div>
	);
}
