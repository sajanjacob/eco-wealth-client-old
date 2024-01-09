"use client";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";

type Props = {};

function Careers({}: Props) {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
	}, [user, dispatch]);
	return (
		<div>
			<h1 className='text-3xl font-semibold p-8'>Careers coming soon...</h1>
		</div>
	);
}
export default Careers;
