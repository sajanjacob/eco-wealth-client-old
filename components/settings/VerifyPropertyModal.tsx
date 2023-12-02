import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	address: any;
	fetchAddresses: () => void;
};
function VerifyPropertyModal({
	isOpen,
	onClose,
	address,
	fetchAddresses,
}: Props) {
	const [verificationCode, setVerificationCode] = useState("");

	const handleVerify = async () => {
		try {
			const response = await axios.put(`/api/verify_property`, {
				code: verificationCode,
			});
			// Handle the response, possibly updating the UI to show success message
			console.log(response.data); // or however you want to handle the response
			toast.success("Property verified successfully!");
			fetchAddresses();
			onClose(); // Close modal after successful verification
		} catch (error) {
			toast.error(`Invalid verification code`);
			console.log("Error verifying property:", error);
			// Handle error, possibly showing an error message to the user
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-gray-800 bg-opacity-50 overflow-y-auto h-full w-full'>
			<div className='relative top-[30%] mx-auto p-5 border w-96 shadow-lg rounded-md bg-[var(--bg-two)]'>
				<div className='mt-3 text-center mx-6'>
					<h3 className='text-lg leading-6 font-medium text-gray-400'>
						Verify Property
					</h3>
					<p className='mt-3'>{address.addressLineOne}</p>
					<p>{address.addressLineTwo}</p>
					<p>
						{address.city}, {address.stateProvince}, {address.country}
					</p>
					<p>{address.postalCode}</p>
					<div className='mt-2 py-3'>
						<input
							type='text'
							className='w-[100%] rounded-md  text-lg text-gray-700 p-2 outline-[var(--cta-one)] transition-colors'
							placeholder='Enter verification code'
							value={verificationCode}
							onChange={(e) => setVerificationCode(e.target.value)}
						/>
					</div>
					<div className='items-center py-3'>
						<button
							id='verify-button'
							className={`px-4 py-2 ${
								verificationCode === ""
									? "bg-gray-500 cursor-default"
									: "bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] cursor-pointer"
							} text-white text-base font-medium rounded-md w-full shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-300`}
							onClick={handleVerify}
						>
							Verify
						</button>
					</div>
					<div className='items-center py-3'>
						<button
							id='close-button'
							className='px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300'
							onClick={onClose}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VerifyPropertyModal;
