import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabaseClient";
import UserContext from "@/state/UserContext";
import { toast } from "react-toastify";

export default function AddProject() {
	const router = useRouter();
	const { state, send } = useContext(UserContext);

	const [title, setTitle] = useState("");
	const [image, setImage] = useState(null);
	const [coordinatorName, setCoordinatorName] = useState("");
	const [coordinatorPhone, setCoordinatorPhone] = useState("");
	const [description, setDescription] = useState("");
	const [numTrees, setNumTrees] = useState(0);
	const [pricePerTree, setPricePerTree] = useState(0);
	const [agreements, setAgreements] = useState([false, false, false]);
	const [imageFile, setImageFile] = useState(null);
	const [imageUrlInput, setImageUrlInput] = useState("");
	const [uploadMethod, setUploadMethod] = useState(true);
	const [treeType, setTreeType] = useState("");

	const handleAgreementChange = (index) => {
		const newAgreements = [...agreements];
		newAgreements[index] = !newAgreements[index];
		setAgreements(newAgreements);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!agreements.every((val) => val)) {
			toast.warning("Please accept all agreements before submitting.");
			return;
		}

		const userId = state.context.user.id;
		let projectImageUrl = imageUrlInput;

		if (imageFile) {
			try {
				projectImageUrl = await uploadImage(imageFile);
			} catch (error) {
				toast.error(`Error uploading image. ${error.message}`);
				return;
			}
		}

		const projectData = {
			title: title,
			image_url: imageUrlInput, // You will need to upload the image and replace this with the image URL
			project_coordinator_contact: JSON.stringify({
				name: coordinatorName,
				phone: coordinatorPhone,
			}),
			description: description,
			tree_target: numTrees,
			funds_requested_per_tree: pricePerTree,
			user_id: userId,
			status: "pending verification",
			type: treeType,
			project_verification_consent_given: true,
			admin_fee_consent: true,
			agree_to_pay_investor: true,
		};

		const { data, error } = await supabase.from("projects").insert(projectData);

		if (error) {
			toast.error(`Error submitting project. ${error.message}`);
		} else {
			toast.success("Project submitted successfully!");
			router.push("/p/projects");
		}
	};
	const toggleUploadMethod = () => {
		setUploadMethod(!uploadMethod);
	};
	return (
		<div>
			<h1>Add Project</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Project Title:
					<input
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</label>
				<br />
				<label>
					Project Type:
					<select
						value={treeType}
						onChange={(event) => setTreeType(event.target.value)}
						required
					>
						<option value=''>Select a project type</option>
						<option value='Timber / Lumber'>Timber / Lumber</option>
						<option value='Fruit'>Fruits</option>
						<option value='Nut'>Nuts</option>
						<option value='Bio Fuel'>Bio Fuel</option>
						<option value='Pulp'>Pulp</option>
						<option value='Syrup'>Syrup</option>
						<option value='Oil / Chemical'>Oils / Chemicals</option>
						<option value='Non-Profit Initiative'>
							Non-Profit Initiatives
						</option>
					</select>
				</label>
				<br />
				<label>Project Banner/Main Image:</label>
				<br />
				<button type='button' onClick={toggleUploadMethod}>
					{uploadMethod ? "Switch to URL" : "Switch to Upload"}
				</button>
				<br />
				{uploadMethod ? (
					<input
						type='file'
						onChange={(event) => setImageFile(event.target.files[0])}
						accept='image/*'
					/>
				) : (
					<label>
						Paste direct image URL:
						<input
							type='text'
							value={imageUrlInput}
							onChange={(event) => setImageUrlInput(event.target.value)}
						/>
					</label>
				)}
				<br />

				<br />
				<label>
					Project Coordinator Name:
					<input
						type='text'
						value={coordinatorName}
						onChange={(event) => setCoordinatorName(event.target.value)}
						required
					/>
				</label>

				<label>
					Project Coordinator Phone:
					<input
						type='tel'
						value={coordinatorPhone}
						onChange={(event) => setCoordinatorPhone(event.target.value)}
						required
					/>
				</label>
				<br />
				<label>
					Project Description:
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</label>
				<br />
				<label>
					Number of Trees:
					<input
						type='number'
						value={numTrees}
						onChange={(e) => setNumTrees(e.target.value)}
						required
					/>
				</label>
				<br />
				<label>
					Price per Tree:
					<input
						type='number'
						step='0.01'
						value={pricePerTree}
						onChange={(e) => setPricePerTree(e.target.value)}
						required
					/>
				</label>
				<br />
				<h3>Agreements:</h3>
				<label>
					<input
						type='checkbox'
						checked={agreements[0]}
						onChange={() => handleAgreementChange(0)}
					/>
					Agreement 1
				</label>
				<br />
				<label>
					<input
						type='checkbox'
						checked={agreements[1]}
						onChange={() => handleAgreementChange(1)}
					/>
					Agreement 2
				</label>
				<br />
				<label>
					<input
						type='checkbox'
						checked={agreements[2]}
						onChange={() => handleAgreementChange(2)}
					/>
					Agreement 3
				</label>
				<br />
				<button type='submit'>Submit Project</button>
			</form>
		</div>
	);
}
