"use client";
import React, { useEffect } from "react";
import ProjectDetails from "@/components/ProjectDetails";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/features/userSlice";

type Props = {};

export default function PublicProject({}: Props) {
	const user = useAppSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
	}, [user, dispatch]);
	return (
		<div>
			<ProjectDetails pub={true} />
		</div>
	);
}
