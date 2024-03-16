"use client";
import { buttonClass, inactiveButtonClass, inputClass } from "@/lib/tw-styles";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import enagicLogo from "@/assets/images/enagic_logo.svg";
import Image from "next/image";
import Logo from "@/components/Logo";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import handleReferrerIds from "@/utils/handleReferrerIds";
import ReCAPTCHA from "react-google-recaptcha";
import { isEmailValid } from "@/utils/isEmailValid";
import { maxNumberOfReferrers } from "@/utils/constants";
interface MachineItem {
	selected: boolean;
	quantity: number;
}

interface AddonItem {
	selected: boolean;
	quantity: number;
}

interface FormValues {
	name: string;
	email: string;
	phoneNumber: string;
	machines: Record<string, MachineItem>;
	addons: Record<string, AddonItem>;
	financing: string;
	signature: string;
	referredBy: string;
	freeBonusFluorideFilter: boolean;
}
const machines = [
	{ name: "K8", price: 100, quantity: 0 },
	{ name: "JR-IV", price: 200, quantity: 0 },
	{ name: "SD501", price: 300, quantity: 0 },
	{ name: "SD501 Platinum", price: 400, quantity: 0 },
	{ name: "Super 501", price: 500, quantity: 0 },
	{ name: "SD501U", price: 600, quantity: 0 },
	{ name: "Anespa", price: 700, quantity: 0 },
];

const addons = [
	{ name: "Addon 1", price: 50, quantity: 0 },
	{ name: "Addon 2", price: 60, quantity: 0 },
	// Add more add-ons as needed
];
export default function Order() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [error, setError] = useState({ module: "", message: "" });
	const [showAllMachines, setShowAllMachines] = useState(false);
	const [showAllAddons, setShowAllAddons] = useState(false);
	const sigPadRef = useRef(null);
	const searchParams = useSearchParams();
	const ref = searchParams?.get("r");
	const [referrers, setReferrers] = useState([{}]);
	const [specificReferral, setSpecificReferral] = useState("");
	const [captcha, setCaptcha] = useState<string | null>("");
	const router = useRouter();
	const RECAPTCHA_SITE_KEY = process.env.recaptcha_site_key;
	const [isFormValid, setIsFormValid] = useState(false);
	const path = usePathname();
	// Check if referrerIds is present in localStorage
	const handleExistingReferral = async (referrerIds: string[]) => {
		await handleReferrerIds({
			urlReferrerIds: referrerIds,
			pageSource: path!,
			setReferrers,
		});
	};
	const handleCheckReferral = () => {
		if (typeof window !== "undefined") {
			// The code now runs only on the client side

			if (ref) {
				handleExistingReferral(JSON.parse(ref as string));
				return;
			} else {
				const storedData = localStorage.getItem("referrerData");
				if (!storedData) return;
				const { referrerIds } = JSON.parse(storedData as string);
				handleExistingReferral(referrerIds);
			}
		}
	};
	// Check if referrerIds is present in URL or localStorage
	useEffect(() => {
		// Check if referrerIds is present in URL
		handleCheckReferral();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref, path]);
	const getReferrerIds = () => {
		const storedData = localStorage.getItem("referrerData");
		if (!storedData) return null;
		const { referrerIds } = JSON.parse(storedData as string);
		return referrerIds;
	};
	const defaultMachineValues = machines.reduce(
		(acc, { name }) => ({
			...acc,
			[name]: { selected: false, quantity: 0 },
		}),
		{}
	);

	const defaultAddonValues = addons.reduce(
		(acc, { name }) => ({
			...acc,
			[name]: { selected: false, quantity: 0 },
		}),
		{}
	);
	const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
		defaultValues: {
			machines: defaultMachineValues,
			addons: defaultAddonValues,
			freeBonusFluorideFilter: true,
		},
	});
	const onSubmit = (data: FormValues) => {
		// TODO: Sanitize inputs before submitting to database
		if (sigPadRef.current && !(sigPadRef.current as any).isEmpty()) {
			const signatureImage = (sigPadRef.current as any)
				.getTrimmedCanvas()
				.toDataURL("image/png");
			console.log("Collected Data:", { ...data, signature: signatureImage });
			// Here, you'd include the logic to handle form submission, including the signature.
		} else {
			// Handle the case where the signature is required but missing.
			setError({
				module: "signature",
				message: "Signature is required",
			});
		}
	};
	const handleItemChange = (
		item: { name: any; price?: number },
		type: "machines" | "addons",
		field: string,
		value: {}
	) => {
		setValue(
			`${type}[${item.name}].${field}` as "machines" | "addons",
			field === "selected" ? (value as any).target.checked : value
		);
	};

	const handleQuantityChange = (
		item: { name: string },
		type: "machines" | "addons",
		delta: number
	) => {
		const currentQuantity = Number(
			watch(`${type}[${item.name}].quantity` as "machines" | "addons")
		);
		const newQuantity: Record<string, MachineItem> = {
			...watch(type),
			[item.name]: {
				...(watch(
					`${type}[${item.name}]` as "machines" | "addons"
				) as unknown as MachineItem),
				quantity: Math.max(0, currentQuantity + delta),
			},
		};
		setValue(type, newQuantity);
	};
	useEffect(() => {
		// Check if all required fields are filled and valid
		const isValid =
			name.trim() !== "" &&
			isEmailValid(email) &&
			captcha !== null &&
			captcha !== "" &&
			captcha !== undefined;
		// Add reCaptcha validation here
		setIsFormValid(isValid);
	}, [name, email, captcha]);

	return (
		<div className='w-1/2 mx-auto'>
			<div className='flex my-16 justify-between'>
				<Logo width={200} />
				<Link href='https://enagic.com'>
					<Image
						src={enagicLogo}
						alt='Enagic Logo'
						width={200}
						height={200}
					/>
				</Link>
			</div>
			<h2 className='text-2xl font-bold'>
				Eco Wealth — Enagic Machine Order Form
			</h2>
			<hr className='border-green-950 mt-16' />
			<form
				onSubmit={handleSubmit(onSubmit) as () => void | Promise<any>}
				className='flex flex-col gap-4 py-16'
			>
				<input
					placeholder='Full name'
					className={`w-full ${inputClass}`}
					{...register("name", { required: true })}
				/>
				<input
					type='email'
					placeholder='Email address'
					className={`w-full ${inputClass}`}
					{...register("email", { required: true })}
				/>
				<input
					type='tel'
					placeholder='Phone number'
					className={`w-full ${inputClass}`}
					{...register("phoneNumber", { required: true })}
				/>
				<hr className='border-green-950 my-4' />

				<div className='flex flex-col'>
					<span>Machines:</span>
					{(showAllMachines ? machines : machines.slice(0, 1)).map(
						(machine) => (
							<label
								key={machine.name}
								className='flex items-center gap-2 my-4'
							>
								<input
									type='checkbox'
									{...register(
										`machines[${machine.name}].selected` as "machines"
									)}
									onChange={(e) =>
										handleItemChange(machine, "machines", "selected", e)
									}
								/>
								<span>{machine.name}</span>
								<div className='flex flex-col'>
									<input
										type='number'
										className={
											!watch(`machines[${machine.name}].selected` as "machines")
												? `${inputClass} border-transparent text-lg font-bold`
												: `${inputClass} text-lg font-bold`
										}
										{...register(
											`machines[${machine.name}].quantity` as "machines"
										)}
										onChange={(e) =>
											handleItemChange(
												machine,
												"machines",
												"quantity",
												e.target.value
											)
										}
										disabled={
											!watch(`machines[${machine.name}].selected` as "machines")
										}
									/>
									<div className='flex mt-2'>
										<button
											type='button'
											className={
												!watch(
													`machines[${machine.name}].selected` as "machines"
												)
													? `${buttonClass} bg-gray-400 hover:bg-gray-400 hover:scale-100 cursor-default my-0 py-[0px] px-[0px] w-full mb-2 mr-2`
													: `${buttonClass}  my-0 py-[0px] px-[0px] w-full mb-2 mr-2`
											}
											onClick={() =>
												handleQuantityChange(machine, "machines", -1)
											}
											disabled={
												!watch(
													`machines[${machine.name}].selected` as "machines"
												)
											}
										>
											-
										</button>
										<button
											type='button'
											className={
												!watch(
													`machines[${machine.name}].selected` as "machines"
												)
													? `${buttonClass} bg-gray-400 hover:bg-gray-400 hover:scale-100 cursor-default my-0 py-[0px] px-[0px] w-full mb-2 mr-2`
													: `${buttonClass}  my-0 py-[0px] px-[0px] w-full mb-2 mr-2`
											}
											onClick={() =>
												handleQuantityChange(machine, "machines", 1)
											}
											disabled={
												!watch(
													`machines[${machine.name}].selected` as "machines"
												)
											}
										>
											+
										</button>
									</div>
								</div>
							</label>
						)
					)}
					{!showAllMachines ? (
						<button
							type='button'
							className={`${buttonClass} mt-2`}
							onClick={() => setShowAllMachines(true)}
						>
							See more machines
						</button>
					) : (
						<button
							type='button'
							className={`${buttonClass} mt-2`}
							onClick={() => setShowAllMachines(false)}
						>
							See less machines
						</button>
					)}
				</div>
				<div className='flex flex-col'>
					<span>Add-ons:</span>
					{(showAllAddons ? addons : addons.slice(0, 1)).map((addon) => (
						<label
							key={addon.name}
							className='flex items-center gap-2 my-4'
						>
							<input
								type='checkbox'
								{...register(`addons[${addon.name}].selected` as "addons")}
								onChange={(e) =>
									handleItemChange(addon, "addons", "selected", e)
								}
							/>
							<span>{addon.name}</span>
							<div className='flex flex-col'>
								<input
									type='number'
									className={
										!watch(`addons[${addon.name}].selected` as "addons")
											? `${inputClass} border-transparent text-lg font-bold`
											: `${inputClass} text-lg font-bold`
									}
									{...register(`addons[${addon.name}].quantity` as "addons")}
									onChange={(e) =>
										handleItemChange(
											addon,
											"addons",
											"quantity",
											e.target.value
										)
									}
									disabled={
										!watch(`addons[${addon.name}].selected` as "addons")
									}
								/>
								<div className='flex mt-2'>
									<button
										type='button'
										className={
											!watch(`addons[${addon.name}].selected` as "addons")
												? `${buttonClass} bg-gray-400 hover:bg-gray-400 hover:scale-100 cursor-default my-0 py-[0px] px-[0px] w-full mb-2 mr-2`
												: `${buttonClass}  my-0 py-[0px] px-[0px] w-full mb-2 mr-2`
										}
										onClick={() => handleQuantityChange(addon, "addons", -1)}
										disabled={
											!watch(`addons[${addon.name}].selected` as "addons")
										}
									>
										-
									</button>
									<button
										type='button'
										className={
											!watch(`addons[${addon.name}].selected` as "addons")
												? `${buttonClass} bg-gray-400 hover:bg-gray-400 hover:scale-100 cursor-default my-0 py-[0px] px-[0px] w-full mb-2 mr-2`
												: `${buttonClass}  my-0 py-[0px] px-[0px] w-full mb-2 mr-2`
										}
										onClick={() => handleQuantityChange(addon, "addons", 1)}
										disabled={
											!watch(`addons[${addon.name}].selected` as "addons")
										}
									>
										+
									</button>
								</div>
							</div>
						</label>
					))}
					{!showAllAddons ? (
						<button
							type='button'
							className={`${buttonClass} mt-2`}
							onClick={() => setShowAllAddons(true)}
						>
							See more add-ons
						</button>
					) : (
						<button
							type='button'
							className={`${buttonClass} mt-2`}
							onClick={() => setShowAllAddons(false)}
						>
							See less add-ons
						</button>
					)}
				</div>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={true}
						{...register("freeBonusFluorideFilter")}
					/>
					Get a free bonus fluoride pre-filter with your machine purchase
				</label>
				<hr className='border-green-950 my-4' />
				<select
					className={`w-full ${inputClass}`}
					{...register("financing", { required: true })}
				>
					<option value=''>Select financing option</option>
					<option value='Need financing options'>Need financing options</option>
					<option value='Have financing'>Have financing</option>
					<option value='Credit/Debit Card'>Credit/Debit Card</option>
				</select>
				{/* Create an order confirmation form that gets sent when a team member confirms the order details */}
				<hr className='border-green-950 my-4' />
				<div>
					<div>Signature</div>
					<div className={`mt-1 w-full ${inputClass}`}>
						<SignatureCanvas
							ref={sigPadRef}
							penColor='green'
							canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
						/>
					</div>
				</div>
				<button
					type='button'
					onClick={() => (sigPadRef.current as SignatureCanvas | null)?.clear()} // Added type assertion to SignatureCanvas | null
					className={`${buttonClass} mt-0 !text-sm`}
				>
					Clear Signature
				</button>
				<input
					placeholder='Referred by'
					className={`w-full ${inputClass}`}
					{...register("referredBy")}
				/>
				<ReCAPTCHA
					sitekey={RECAPTCHA_SITE_KEY!}
					onChange={setCaptcha}
					className='rounded-md mx-auto mt-2'
				/>
				<button
					type='submit'
					className={isFormValid ? buttonClass : inactiveButtonClass}
					disabled={!isFormValid}
				>
					Submit order form
				</button>
			</form>
		</div>
	);
}
function setError(arg0: string, arg1: { type: string; message: string }) {
	throw new Error("Function not implemented.");
}
