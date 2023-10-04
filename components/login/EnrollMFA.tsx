"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

/**
 * EnrollMFA shows a simple enrollment dialog. When shown on screen it calls
 * the `enroll` API. Each time a user clicks the Enable button it calls the
 * `challenge` and `verify` APIs to check if the code provided by the user is
 * valid.
 * When enrollment is successful, it calls `onEnrolled`. When the user clicks
 * Cancel the `onCancelled` callback is called.
 */
function EnrollMFA({
	onEnrolled,
	onCancelled,
	enableLogout,
	redirectTo,
}: {
	onEnrolled: () => void;
	onCancelled: () => void;
	enableLogout?: boolean;
	redirectTo?: string;
}) {
	const [factorId, setFactorId] = useState("");
	const [qr, setQR] = useState(""); // holds the QR code image SVG
	const [verifyCode, setVerifyCode] = useState(""); // contains the code entered by the user
	const [error, setError] = useState(""); // holds an error message
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [verified, setVerified] = useState(false);
	const user = useAppSelector((state: RootState) => state.user);
	const router = useRouter();
	const path = usePathname();
	const onEnableClicked = () => {
		setLoading(true);
		setError("");
		(async () => {
			const challenge = await supabase.auth.mfa.challenge({ factorId });
			if (challenge.error) {
				setError(challenge.error.message);
				setLoading(false);
				return challenge.error;
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
						mfa_enabled: true,
					})
					.eq("id", user.id);
				setVerified(true);
				onEnrolled();
				if (redirectTo) router.push(redirectTo);
			}
		})();
	};

	useEffect(() => {
		console.log("setup mfa user >>> ", user);
		if (user.mfaEnabled && path === "/setup-mfa") {
			if (user.activeRole === "investor") {
				return router.push("/i/dashboard");
			}
			if (user.activeRole === "producer") {
				return router.push("/i/dashboard");
			}
		}
		(async () => {
			const { data, error } = await supabase.auth.mfa.enroll({
				factorType: "totp",
			});
			if (error) {
				if (
					error.message ===
					"Enrolled factors exceed allowed limit, unenroll to continue"
				) {
					const factors = await supabase.auth.mfa.listFactors();
					console.log("factors >>> ", factors?.data?.all);
					if (factors?.data?.all.length === 10) {
						for (let i = 0; i < factors?.data?.all.length; i++) {
							await supabase.auth.mfa.unenroll({
								factorId: factors?.data?.all[i].id,
							});
						}
					}
					console.log("error >>> ", error);
					setError(error.message);
					return;
				}
			}
			console.log("mfa enroll data >>> ", data);
			setFactorId((data as any)?.id);

			// Supabase Auth returns an SVG QR code which you can convert into a data
			// URL that you can place in an <img> tag.
			setQR((data as any)?.totp.qr_code);
		})();
	}, []);

	useEffect(() => {
		if (verifyCode.length === 6) {
			onEnableClicked();
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
		<>
			{error && <div className='error'>{error}</div>}
			<div className='border-[1px] border-white rounded-md p-4 flex flex-col'>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={qr}
					alt=''
					className='w-1/2 h-1/2 mx-auto mb-4'
				/>
				<p>{factorId}</p>
				<p className='text-sm text-center mb-2'>
					Scan the QR code above with an authenticator app and <br />
					enter the corresponding code that appears in the auth app below.
				</p>
				<input
					type='text'
					className='p-2 mb-4 rounded text-gray-500 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
					value={verifyCode}
					maxLength={6}
					onChange={(e) => setVerifyCode(e.target.value.trim())}
				/>
				<div className={enableLogout ? "flex" : "flex justify-end"}>
					{enableLogout && (
						<button
							className='flex items-center px-4 py-2 ml-4 rounded bg-red-900 text-white font-bold transition-all hover:bg-orange-900'
							onClick={onCancelled}
						>
							Logout & Cancel MFA Setup
						</button>
					)}
					<button
						className={
							disabled && loading
								? "bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								: !disabled && !loading
								? "bg-green-500 hover:bg-green-700 transition-colors text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								: "bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						}
						onClick={onEnableClicked}
					>
						{loading ? "Activating..." : "Activate MF-Auth"}
					</button>
				</div>
			</div>
		</>
	);
}

export default EnrollMFA;
