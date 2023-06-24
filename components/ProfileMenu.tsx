import { useEffect } from "react";
import ReactDOM from "react-dom";

type Props = {
	isOpen: boolean;
	close: () => void;
	children: React.ReactNode;
};
const ProfileMenu = ({ isOpen, close, children }: Props) => {
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.document.addEventListener("click", close);
		}
		if (typeof window !== "undefined") {
			return () => window.document.removeEventListener("click", close);
		}
	}, [close]);
	if (typeof window !== "undefined") {
		return isOpen
			? ReactDOM.createPortal(<div>{children}</div>, window.document.body)
			: null;
	}
};

export default ProfileMenu;
