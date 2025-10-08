// Layout untuk halaman admin
import React from "react";

export default function AdminLayout({ children }) {
	return (
		<div className="min-h-screen w-full bg-gray-50">
			{/* Tambahkan komponen navigasi/sidebar di sini jika diperlukan */}
			{children}
		</div>
	);
}
