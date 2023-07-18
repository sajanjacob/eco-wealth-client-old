import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import supabase from "@/utils/supabaseClient";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";

type Props = {
	setVerified: (verified: boolean) => void;
};

function AuthMFA({ setVerified }: Props) {
	const [verifyCode, setVerifyCode] = useState("");
	const [error, setError] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const user = useAppSelector((state: RootState) => state.user);

	const onSubmitClicked = () => {
		setLoading(true);
		setError("");
		(async () => {
			const factors = await supabase.auth.mfa.listFactors();
			if (factors.error) {
				return factors.error;
			}

			const totpFactor = factors.data.totp[0];

			if (!totpFactor) {
				return new Error("No TOTP factors found!");
			}

			const factorId = totpFactor.id;

			const challenge = await supabase.auth.mfa.challenge({ factorId });
			if (challenge.error) {
				setError(challenge.error.message);
				setLoading(false);
				return;
			}

			const challengeId = challenge.data.id;

			const verify = await supabase.auth.mfa.verify({
				factorId,
				challengeId,
				code: verifyCode,
			});
			if (verify.error) {
				setError(verify.error.message);
				setLoading(false);
				return;
			} else {
				await supabase
					.from("users")
					.update({
						mfa_verified: true,
						mfa_verified_at: new Date().toISOString(),
					})
					.eq("id", user.id);

				setVerified(true);
			}
		})();
	};
	useEffect(() => {
		if (verifyCode.length === 6) {
			onSubmitClicked();
			setDisabled(false);
		}
		if (verifyCode.length > 6) {
			setVerifyCode(verifyCode.slice(0, 6));
		}
		if (verifyCode.length < 6) {
			setVerified(false);
			setDisabled(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [verifyCode]);

	return (
		<div className='flex flex-col'>
			<Image
				src='/white_logo_transparent_background.png'
				width={200}
				height={200}
				alt='EcoWealth Logo'
			/>
			<h1 className='text-2xl font-semibold mb-4 flex items-center'>
				<FaLock className='mr-2' /> Verify MFA-Security Code
			</h1>
			<p className='mb-2'>Please enter the code from your authenticator app.</p>
			{error && <div className='error text-red-600'>MFA-Error: {error}</div>}
			<input
				type='text'
				value={verifyCode}
				maxLength={6}
				onChange={(e) => setVerifyCode(e.target.value.trim())}
				className='p-2 mb-4 rounded text-gray-500 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
			/>
			<button
				value='Submit'
				onClick={onSubmitClicked}
				disabled={disabled}
				className={
					disabled && loading
						? "bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						: !disabled && !loading
						? "bg-green-500 hover:bg-green-700 transition-colors text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						: "bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				}
			>
				{loading ? "Verifying..." : "Confirm Code"}
			</button>
		</div>
	);
}

export default AuthMFA;
