import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
type Props = {
	amount: number;
	onSuccess: () => void;
	onCancel?: () => void;
};
function CheckoutForm({ amount, onSuccess, onCancel }: Props) {
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (event: { preventDefault: () => void }) => {
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
		// const { error, paymentIntent } = await stripe.confirmCardPayment(
		// 	clientSecret,
		// 	{
		// 		payment_method: {
		// 			card: cardElement,
		// 		},
		// 	}
		// );

		// 	if (error) {
		// 		console.error("[error]", error);
		// 		// Handle payment errors
		// 		alert(`Payment error: ${error.message}`);
		// 		onCancel();
		// 	} else {
		// 		console.log("[PaymentIntent]", paymentIntent);

		// 		// Process the payment here, e.g., update the user's portfolio and the project's investor list and invested amount

		// 		// If the payment is successful, call onSuccess()
		// 		onSuccess();
		// 	}
		// };
	};
	return (
		<form
			onSubmit={handleSubmit}
			className='w-[500px]'
		>
			<CardElement className='py-4 px-8 border-white border-2 text-white' />
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

export default CheckoutForm;
