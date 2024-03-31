import React from "react";

type Props = {};

export default function ApisComingSoon({}: Props) {
	const [open, setOpen] = React.useState(false);
	return (
		<div>
			<p
				onClick={() => setOpen(!open)}
				className={`w-max cursor-pointer text-gray-500 hover:text-gray-400 transition-colors font-bold`}
				title={`${open ? "Hide" : "Show"} Advanced Settings`}
			>
				Advanced
			</p>
			{open && (
				<div className='my-8'>
					<div>
						<p className='text-gray-400'>Api Integrations coming soon.</p>
					</div>
				</div>
			)}
		</div>
	);
}
