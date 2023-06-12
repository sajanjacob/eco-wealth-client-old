import { useEffect } from "react";
import ReactDOM from "react-dom";

type Props = {
	isOpen: boolean;
	close: () => void;
	children: React.ReactNode;
};
const ProfileMenu = ({ isOpen, close, children }: Props) => {
	useEffect(() => {
		document.addEventListener("click", close);
		return () => document.removeEventListener("click", close);
	}, [close]);

	return isOpen
		? ReactDOM.createPortal(<div>{children}</div>, document.body)
		: null;
};

export default ProfileMenu;
