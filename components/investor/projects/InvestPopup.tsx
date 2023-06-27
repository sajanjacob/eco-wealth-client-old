// Import necessary dependencies
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
// Set up Stripe.js
const stripePromise = loadStripe(`${process.env.stripe_publishable_key}`);

type Props = {
	calculateInvestmentTotalAmount: number;
	onInvestmentSuccess: () => void;
};

// The main component
function InvestPopup({
	calculateInvestmentTotalAmount,
	onInvestmentSuccess,
}: Props) {
	const [showModal, setShowModal] = useState(false);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setModalStep(0);
	};

	const handleInvestmentSuccess = () => {
		closeModal();
		onInvestmentSuccess();
	};

	const handleModalStep = () => {
		setModalStep(modalStep + 1);
	};

	const [modalStep, setModalStep] = useState(0);
	return (
		<>
			<button
				className='w-full my-4 p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'
				onClick={openModal}
			>
				Invest Now
			</button>

			{showModal && (
				<div className='modal'>
					<div className='modal-content'>
						{modalStep === 0 && (
							<>
								<h2>Investment Disclaimer</h2>
								<p>
									Are you sure you want to invest{" "}
									{calculateInvestmentTotalAmount}? Please note that it may take
									X years to generate a return.
								</p>
								<button onClick={handleModalStep}>
									Yes, I want to invest in this project now
								</button>
								<button onClick={closeModal}>
									No, I do not want to invest today
								</button>
							</>
						)}
						{modalStep === 1 && (
							<>
								<h3>Card details</h3>
								<Elements stripe={stripePromise}>
									<CheckoutForm
										amount={calculateInvestmentTotalAmount}
										onSuccess={handleInvestmentSuccess}
										onCancel={closeModal}
									/>
								</Elements>

								<button onClick={closeModal}>Close</button>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
}

function CheckoutForm({ amount, onSuccess, onCancel }) {
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		const cardElement = elements.getElement(CardElement);

		// Call the create_payment_intent API route to get the client secret
		const res = await fetch("/api/create_payment_intent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ amount }),
		});
		const { clientSecret } = await res.json();

		// Confirm the payment using the client secret
		const { error, paymentIntent } = await stripe.confirmCardPayment(
			clientSecret,
			{
				payment_method: {
					card: cardElement,
				},
			}
		);

		if (error) {
			console.error("[error]", error);
			// Handle payment errors
			alert(`Payment error: ${error.message}`);
			onCancel();
		} else {
			console.log("[PaymentIntent]", paymentIntent);

			// Process the payment here, e.g., update the user's portfolio and the project's investor list and invested amount

			// If the payment is successful, call onSuccess()
			onSuccess();
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardElement />
			<p>Total amount: {amount}</p>
			<button
				type='submit'
				disabled={!stripe}
			>
				Pay Now
			</button>
		</form>
	);
}

export default InvestPopup;
