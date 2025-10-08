// Layout component untuk halaman publik
import React from "react";

export default function PublicLayout({ children }) {
	return (
		<div className="min-h-screen w-full bg-white">
			{children}
		</div>
	);
}