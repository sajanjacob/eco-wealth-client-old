"use client";
import { buttonClass, inputClass } from "@/lib/tw-styles";
import React from "react";
import { useForm } from "react-hook-form";

export default function Order() {
	const { register, handleSubmit, watch } = useForm();
	const onSubmit = (data: any) => console.log(data);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col w-1/2 mx-auto gap-4 py-16'
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
			<select
				className={`w-full ${inputClass}`}
				{...register("machines", { required: true })}
			>
				<option value=''>Select a machine</option>
				{[
					"K8",
					"JR-IV",
					"SD501",
					"SD501 Platinum",
					"Super 501",
					"SD501U",
					"Anespa",
				].map((machine) => (
					<option
						key={machine}
						value={machine}
					>
						{machine}
					</option>
				))}
			</select>
			<input
				placeholder='Add-ons'
				className={`w-full ${inputClass}`}
				{...register("addons")}
			/>
			<label className='flex items-center gap-2'>
				<input
					type='checkbox'
					checked={true}
					{...register("freeBonusFluorideFilter")}
				/>
				Free bonus fluoride filter
			</label>
			<select
				className={`w-full ${inputClass}`}
				{...register("financing", { required: true })}
			>
				<option value=''>Select financing option</option>
				<option value='Need financing options'>Need financing options</option>
				<option value='Have financing'>Have financing</option>
				<option value='Credit/Debit Card'>Credit/Debit Card</option>
			</select>
			<input
				placeholder='Signature'
				className={`w-full ${inputClass}`}
				{...register("signature", { required: true })}
			/>
			<input
				placeholder='Referred by'
				className={`w-full ${inputClass}`}
				{...register("referredBy")}
			/>
			<button
				type='submit'
				className={buttonClass}
			>
				Submit order form
			</button>
		</form>
	);
}
