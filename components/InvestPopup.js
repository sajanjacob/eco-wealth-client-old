// Import necessary dependencies
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import styled from "styled-components";
// Set up Stripe.js
const stripePromise = loadStripe(`${process.env.stripe_publishable_key}`);

// The main component
function InvestPopup({ calculateInvestmentTotalAmount, onInvestmentSuccess }) {
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
			<InvestNowButton onClick={openModal}>Invest Now</InvestNowButton>

			{showModal && (
				<Modal className='modal'>
					<ModalContent className='modal-content'>
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
					</ModalContent>
				</Modal>
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
			<button type='submit' disabled={!stripe}>
				Pay Now
			</button>
		</form>
	);
}

export default InvestPopup;

const Modal = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
`;
const ModalContent = styled.div`
	background-color: white;
	padding: 2rem;
	border-radius: 8px;
	width: 80%;
	max-width: 600px;
`;
const InvestNowButton = styled.button`
	background-color: forestgreen;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 8px 64px;
	font-size: 1rem;
	font-weight: bold;
	cursor: pointer;
	transition: 0.333s ease;
	&:hover {
		background-color: darkgreen;
	}
`;
