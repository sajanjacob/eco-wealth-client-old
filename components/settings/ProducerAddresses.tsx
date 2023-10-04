import { useState, useEffect } from "react";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import CityPicker from "../CityPicker";
import postalCodes from "postal-codes-js";
import { BiEdit, BiTrash } from "react-icons/bi";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AddressForm from "../AddressForm";
import { toast } from "react-toastify";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";
type Props = {
	user: UserState;
};

function ProducerAddresses({ user }: Props) {
	const producerId = user.producerId;
	const [properties, setProperties] = useState<Property[]>([]);
	const [addNewAddress, setAddNewAddress] = useState(false);
	const theme = useAppSelector((state: RootState) => state.user?.currentTheme);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const handleOpenCreateModal = () => setOpenCreateModal(true);
	const handleCloseCreateModal = () => setOpenCreateModal(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const handleOpenDeleteModal = () => setOpenDeleteModal(true);
	const handleCloseDeleteModal = () => setOpenDeleteModal(false);
	const [selectedPropertyId, setSelectedPropertyId] = useState("");
	const createModalStyle = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "60vw",
		background: `${theme === "dark" ? "rgb(12 33 0 / 90%)" : "white"}`,
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};
	// Fetch addresses on initial render
	useEffect(() => {
		console.log("producerId >>> ", producerId);
		if (!producerId) return;
		fetchAddresses();
	}, [producerId]);

	async function fetchAddresses() {
		console.log("fetching addresses...");
		const res = await axios.get(
			`${getBasePath()}/api/properties?producer_id=${producerId}`
		);
		const data = await res.data;
		const propertyData = convertToCamelCase(data.propertyData);
		setProperties(convertToCamelCase(propertyData) as Property[]);
	}

	async function addAddress() {
		const { data, error } = await supabase
			.from("producer_properties")
			.insert([
				{
					producer_id: producerId,
					address: newAddressDetails,
					is_verified: false,
				},
			])
			.select();

		if (error) {
			console.error("Error adding address:", error);
		} else {
			// Update local addresses and clear input
			if (!data) return;
			setProperties(() => [...properties, convertToCamelCase(data[0])]);
			setAddressDetails({
				addressLineOne: "",
				addressLineTwo: "",
				city: "",
				country: "",
				postalCode: "",
				stateProvince: "",
			});
			setAddNewAddress(false);
			toast.success(`Address added successfully`);
			fetchAddresses();
		}
	}
	const [newAddressDetails, setNewAddressDetails] = useState<any>({
		addressLineOne: "",
		addressLineTwo: "",
		city: "",
		country: "",
		postalCode: "",
		stateProvince: "",
	});

	const [addressDetails, setAddressDetails] = useState<any>({
		addressLineOne: "",
		addressLineTwo: "",
		city: "",
		country: "",
		postalCode: "",
		stateProvince: "",
	});

	async function updateAddress(addressId: string) {
		await axios
			.put(`${getBasePath()}/api/properties/update`, {
				addressId: addressId,
				newAddressDetails: newAddressDetails,
				producerId: producerId,
			})
			.then((res) => {
				console.log("res >>> ", res);
				setProperties((prev) =>
					prev.map((address) =>
						address.id === addressId
							? { ...address, ...convertToCamelCase(res.data[0] as Property[]) }
							: address
					)
				);
			})
			.catch((err) => {
				console.log("err >>> ", err);
			});
	}
	const [disableNextStep, setDisableNextStep] = useState(true);
	const [countryCode, setCountryCode] = useState("");

	const city = useAppSelector((state: RootState) => state.onboarding.city);
	const stateProvince = useAppSelector(
		(state: RootState) => state.onboarding.stateProvince
	);

	// Here we validate the postal code
	const [postalCodeError, setPostalCodeError] = useState(false);
	useEffect(() => {
		const validPostalCode = postalCodes.validate(
			countryCode,
			newAddressDetails.postalCode
		);
		if (validPostalCode === true) {
			setPostalCodeError(false);
		} else {
			setPostalCodeError(true);
		}
	}, [countryCode, newAddressDetails.postalCode]);

	// Here we handle the next step button
	useEffect(() => {
		if (
			newAddressDetails.addressLineOne !== "" &&
			countryCode &&
			!postalCodeError &&
			newAddressDetails.city &&
			newAddressDetails.stateProvince
		) {
			setDisableNextStep(false);
		} else {
			setDisableNextStep(true);
		}
	}, [newAddressDetails, countryCode, postalCodeError, city, stateProvince]);
	const handleUpdateAddress = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		updateAddress(selectedPropertyId);
	};

	const handleDeleteAddress = async (addressId: string) => {
		await axios
			.put(`${getBasePath()}/api/properties/delete`, {
				addressId: addressId,
				producerId: producerId,
			})
			.then((res) => {
				console.log("res >>> ", res);
				setProperties((prev) =>
					prev.filter((address) => address.id !== addressId)
				);
			})
			.catch((err) => {
				console.log("err >>> ", err);
				toast.error(`Error deleting address: ${err}`);
			});
	};

	return (
		<div className='w-[80%]'>
			<h1>Your Properties</h1>

			<div className='flex justify-end mt-4'>
				<button
					className='bg-green-500 hover:bg-green-600 text-white rounded-md p-2'
					onClick={() => setAddNewAddress(!addNewAddress)}
				>
					{addNewAddress ? "Close" : `+ New Address`}
				</button>
			</div>
			{addNewAddress ? (
				<div className='mb-8'>
					<h2>Add a New Address:</h2>
					<fieldset className='flex flex-col'>
						<legend className='text-xl font-light mb-2'>
							What is the address you will operate your projects on?
						</legend>
						<label
							htmlFor='addressLineOne'
							className='flex items-center '
						>
							Address Line One
						</label>
						<input
							id='addressLineOne'
							type='text'
							value={newAddressDetails.addressLineOne}
							onChange={(e) =>
								setNewAddressDetails({
									...newAddressDetails,
									addressLineOne: e.target.value,
								})
							}
							className='rounded-md  text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
						/>
						<label
							htmlFor='addressLineTwo'
							className='flex items-center mt-3'
						>
							Address Line Two
						</label>
						<input
							id='addressLineTwo'
							type='text'
							value={newAddressDetails.addressLineTwo}
							onChange={(e) =>
								setNewAddressDetails({
									...newAddressDetails,
									addressLineTwo: e.target.value,
								})
							}
							className='rounded-md text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
						/>
						<CityPicker
							setCountryCode={setCountryCode}
							setAddress={setNewAddressDetails}
							address={newAddressDetails}
						/>

						{countryCode && (
							<>
								<label
									htmlFor='postalCode'
									className='flex items-center mt-3'
								>
									{countryCode === "CA"
										? "Postal Code"
										: countryCode === "US"
										? "Zip Code"
										: null}{" "}
								</label>
								<input
									id='postalCode'
									type='text'
									value={newAddressDetails.postalCode}
									onChange={(e) =>
										setNewAddressDetails({
											...newAddressDetails,
											postalCode: e.target.value,
										})
									}
									className='rounded-md w-[300px] text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
								/>
								{/* {postalCodeError && (
									<p className='text-red-500'>
										Please enter a valid{" "}
										{countryCode === "CA"
											? "postal code."
											: countryCode === "US"
											? "zip code."
											: null}
									</p>
								)} */}
							</>
						)}
					</fieldset>
					<div className='flex justify-end'>
						<button
							onClick={addAddress}
							className='bg-green-500 hover:bg-green-600 text-white rounded-md p-2 mt-4'
						>
							Add Address
						</button>
					</div>
				</div>
			) : null}

			<h2>Your Addresses:</h2>
			{properties &&
				properties.map(({ id, address, isVerified }) => (
					<div
						key={id}
						className='border-[1px] border-white rounded-md flex justify-between p-4 mt-4'
					>
						<div>
							<p
								className={
									isVerified
										? "text-green-400 border-green-400 border-[1px] rounded-md px-3 py-[4px] w-[max-content]"
										: "text-orange-400 border-orange-400 border-[1px] rounded-md px-3 py-[4px] w-[max-content]"
								}
							>
								{isVerified ? "Address verified" : "Pending verification"}
							</p>
							<p className='mt-3'>{address.addressLineOne}</p>
							<p>{address.addressLineTwo}</p>
							<p>
								{address.city}, {address.stateProvince}, {address.country}
							</p>
							<p>{address.postalCode}</p>
						</div>
						<div className='text-right flex flex-col'>
							<button
								onClick={() => {
									setSelectedPropertyId(id);
									handleOpenCreateModal();
								}}
								className='bg-green-500 hover:bg-green-600 text-white rounded-md p-2 mb-2 text-lg'
							>
								<BiEdit />
							</button>
							<Modal
								open={openCreateModal}
								onClose={handleCloseCreateModal}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'
							>
								<Box sx={createModalStyle}>
									<AddressForm
										handleUpdateAddress={handleUpdateAddress}
										setAddress={setAddressDetails}
										address={addressDetails}
										initialDetails={address}
										editing={true}
									/>
								</Box>
							</Modal>
							<button
								onClick={handleOpenDeleteModal}
								className='bg-red-500 hover:b-red-600 text-white rounded-md p-2 text-lg'
							>
								<BiTrash />
							</button>
							<Modal
								open={openDeleteModal}
								onClose={handleCloseDeleteModal}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'
							>
								<Box sx={createModalStyle}>
									<h1>Are you sure you want to delete this address?</h1>
									<div className='flex justify-end'>
										<button
											onClick={() => {
												handleDeleteAddress(id);
												handleCloseDeleteModal();
											}}
											className='bg-red-500 hover:bg-red-600 text-white rounded-md p-2 mt-4'
										>
											Yes, delete Address
										</button>
									</div>
								</Box>
							</Modal>
						</div>
					</div>
				))}
		</div>
	);
}

export default ProducerAddresses;
