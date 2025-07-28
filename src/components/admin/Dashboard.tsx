import { FaUsers, FaBook, FaRegClock, FaChartLine, FaLink } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { useEffect, useState } from "react";
import { getDashbordData } from "../../services/admin/DashbordDataService";
import type { DashboardData } from "../../services/admin/DashbordDataService";
const shortcuts = [
	{ label: "Manage Users", icon: <FaUsers />, link: "/admin/users" },
	{ label: "Manage Books", icon: <MdLibraryBooks />, link: "/admin/books" },
	{ label: "Lending History", icon: <FaChartLine />, link: "/admin/lending" },
	{ label: "Reports", icon: <FaLink />, link: "/admin/reports" },
];

const Dashboard = () => {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const res = await getDashbordData();
			if (res.success && res.data) {
				setData(res.data);
			}
			setLoading(false);
		};
		fetchData();
	}, []);

	const stats = [
		{
			label: "Total Users",
			value: data?.totalUsers ?? "-",
			icon: <FaUsers className="text-blue-500 text-3xl" />,
			bg: "bg-blue-50",
		},
		{
			label: "Total Books",
			value: data?.totalBooks ?? "-",
			icon: <MdLibraryBooks className="text-green-500 text-3xl" />,
			bg: "bg-green-50",
		},
		{
			label: "Lended Books",
			value: data?.lendedBooks ?? "-",
			icon: <FaBook className="text-purple-500 text-3xl" />,
			bg: "bg-purple-50",
		},
		{
			label: "Delayed Books",
			value: data?.delayedBooks ?? "-",
			icon: <FaRegClock className="text-red-500 text-3xl" />,
			bg: "bg-red-50",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<h1 className="text-2xl font-bold mb-6 text-gray-800">
				Admin Dashboard
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
				{loading ? (
					<div className="col-span-4 text-center text-gray-500">Loading...</div>
				) : (
					stats.map((stat) => (
						<div
							key={stat.label}
							className={`rounded-xl shadow-sm p-6 flex items-center gap-4 ${stat.bg}`}
						>
							<div>{stat.icon}</div>
							<div>
								<div className="text-xl font-semibold text-gray-700">
									{stat.value}
								</div>
								<div className="text-sm text-gray-500">{stat.label}</div>
							</div>
						</div>
					))
				)}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Shortcuts Section */}
				<div className="col-span-1 rounded-xl bg-white shadow-sm p-6 flex flex-col gap-4">
					<div className="font-semibold text-gray-700 mb-2">Shortcuts</div>
					<div className="grid grid-cols-2 gap-4">
						{shortcuts.map((sc) => (
							<a
								key={sc.label}
								href={sc.link}
								className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
							>
								<span className="text-xl text-indigo-500">{sc.icon}</span>
								<span className="text-sm text-gray-600">{sc.label}</span>
							</a>
						))}
					</div>
				</div>
				{/* Remove Lending History Graph section */}
			</div>
		</div>
	);
};

export default Dashboard;