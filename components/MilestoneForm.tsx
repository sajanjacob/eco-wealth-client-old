import React, { useEffect } from "react";
import "react-quill/dist/quill.bubble.css";
import dynamic from "next/dynamic";
type Props = {
	handleCreateMilestone: () => void | undefined;
	handleUpdateMilestone: () => void | undefined;
	setBody: any;
	body: string;
	title: string;
	setTitle: any;
	shortDescription: string;
	setShortDescription: any;
	editingMilestone: boolean;
	initialData?: any;
};
const DynamicComponent = dynamic(
	() => import("react-quill"),
	{ ssr: false } // This line
);
export default function MilestoneForm({
	handleCreateMilestone,
	handleUpdateMilestone,
	setBody,
	body,
	title,
	setTitle,
	shortDescription,
	setShortDescription,
	editingMilestone,
	initialData,
}: Props) {
	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title);
			setShortDescription(initialData.shortDescription);
			setBody(initialData.body);
		}
	}, [initialData]);

	return (
		<div>
			<h2 className='font-bold text-xl'>Create a new milestone</h2>
			<label htmlFor='title'>Title</label>
			<input
				type='text'
				name='title'
				id='title'
				className='border border-gray-300 p-2 rounded mb-2 w-full'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<label htmlFor='title'>Short Description</label>
			<input
				type='text'
				name='shortDescription'
				id='shortDescription'
				maxLength={280}
				className='border border-gray-300 p-2 rounded mb-2 w-full'
				value={shortDescription}
				onChange={(e) => setShortDescription(e.target.value)}
			/>
			<p className='text-right text-xs'>{shortDescription?.length}/280</p>
			<label htmlFor='title'>Body</label>
			<DynamicComponent
				theme='bubble'
				value={body}
				onChange={(value) => setBody(value)}
				className='border border-gray-300 p-0 rounded mb-2 w-full bg-white text-gray-900 h-[300px]'
			/>
			{!editingMilestone ? (
				<button
					onClick={() => handleCreateMilestone()}
					className='p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-500'
				>
					Create milestone
				</button>
			) : (
				<button
					onClick={() => handleUpdateMilestone()}
					className='p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-500'
				>
					Update milestone
				</button>
			)}
		</div>
	);
}
