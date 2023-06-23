import React from "react";
import DOMPurify from "dompurify";
import moment from "moment";

type Props = {
	project: Project | null | undefined;
};

export default function Milestones({ project }: Props) {
	const milestones = project?.projectMilestones;
	return (
		<div className='mt-8'>
			<div className='flex justify-between mb-2'>
				<h2 className='font-bold text-2xl mb-2'>Milestones</h2>
				<button className='p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600'>
					+ Milestone
				</button>
			</div>
			<hr />
			{milestones &&
				milestones.map(
					({ id, title, description, createdAt, updatedAt, body }) => {
						const cleanHtml = DOMPurify.sanitize(body);
						return (
							<div key={id}>
								<div className='dark:border-white dark:border-[1px] rounded mt-2 p-2'>
									<h3 className='font-bold text-xl '>{title}</h3>
									<p className='text-sm'>{description}</p>
									<div
										dangerouslySetInnerHTML={{ __html: cleanHtml }}
										className='text-sm'
									></div>
								</div>
								<div className='flex justify-end mt-[2px] opacity-40'>
									<p className='text-xs'>
										Created {moment(createdAt).format("MMMM DD, YYYY")}
										{updatedAt && (
											<>
												<span className='text-xs'>
													Last updated {moment(updatedAt).fromNow()}
												</span>
												<p className='text-xs'>Note: only you see this</p>
											</>
										)}{" "}
									</p>
								</div>
							</div>
						);
					}
				)}
		</div>
	);
}
