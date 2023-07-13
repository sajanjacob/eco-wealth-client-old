"use client";
import withAuth from "@/utils/withAuth";
import React from "react";

type Props = {};

function Portfolio({}: Props) {
	return <div>Your Portfolio</div>;
}

export default withAuth(Portfolio);
