// import React from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import { Doughnut, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from 'chart.js';

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale
// );

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-black text-white">
      
//       {/* Navbar */}
//       <Navbar />

//       <div className="flex pt-16">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main */}
//         <main className="flex-1 p-6 md:p-10 lg:ml-64 space-y-8">
          
//           {/* Header */}
//           <div>
//             <h1 className="text-2xl font-semibold mb-2">User Dashboard</h1>
//             <p className="text-gray-400 text-sm">Track your expenses and income at a glance</p>
//           </div>

//           {/* Charts */}
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//             <Card title="Category-wise Spending">
//               <div className="h-64 flex justify-center items-center w-full">
//                 <div className="w-full h-full flex justify-center">
//                   <Doughnut
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: true,
//                       animation: {
//                         duration: 1500,
//                         easing: 'easeInOutQuart'
//                       },
//                       plugins: {
//                         legend: {
//                           position: 'bottom',
//                           labels: { color: '#9ca3af', font: { size: 12 } },
//                         },
//                       },
//                     }}
//                     data={{
//                       labels: ['Groceries', 'Transport', 'Utilities', 'Entertainment', 'Healthcare'],
//                       datasets: [
//                         {
//                           label: 'Expenses by Category',
//                           data: [350, 150, 200, 120, 80],
//                           backgroundColor: [
//                             '#fbbf24',
//                             '#60a5fa',
//                             '#34d399',
//                             '#f87171',
//                             '#a78bfa',
//                           ],
//                           borderColor: '#1f2937',
//                           borderWidth: 2,
//                         },
//                       ],
//                     }}
//                   />
//                 </div>
//               </div>
//             </Card>

//             <Card title="Monthly Financial Overview">
//               <div className="h-64 flex justify-center items-center w-full">
//                 <div className="w-full h-full flex justify-center">
//                   <Bar
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: true,
//                       indexAxis: "x",
//                       plugins: {
//                         legend: {
//                           labels: { color: '#9ca3af', font: { size: 12 } },
//                         },
//                       },
//                       scales: {
//                         y: {
//                           beginAtZero: true,
//                           stacked: false,
//                           ticks: { color: '#9ca3af' },
//                           grid: { color: '#374151' },
//                         },
//                         x: {
//                           stacked: false,
//                           ticks: { color: '#9ca3af' },
//                           grid: { color: '#374151' },
//                         },
//                       },
//                     }}
//                     data={{
//                       labels: ['January', 'February', 'March', 'April', 'May', 'June'],
//                       datasets: [
//                         {
//                           label: 'Income',
//                           data: [2500, 2700, 2500, 3000, 2800, 3200],
//                           backgroundColor: '#34d399',
//                           borderColor: '#10b981',
//                           borderWidth: 1,
//                         },
//                         {
//                           label: 'Expenses',
//                           data: [3000, 1400, 1350, 1500, 1450, 1600],
//                           backgroundColor: '#f87171',
//                           borderColor: '#ef4444',
//                           borderWidth: 1,
//                         },
//                       ],
//                     }}
//                   />
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Transactions */}
//           <Card title="Recent Transactions" extra="View All Transactions">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="text-gray-400 border-b border-gray-700">
//                   <tr>
//                     <th className="text-left py-2">Date</th>
//                     <th className="text-left">Category</th>
//                     <th className="text-left">Description</th>
//                     <th className="text-right">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-800">
//                   <TableRow date="2024-07-28" category="Groceries" desc="Weekly shopping" amount="-125.75" />
//                   <TableRow date="2024-07-27" category="Salary" desc="Monthly paycheck" amount="+2500.00" income />
//                   <TableRow date="2024-07-26" category="Rent" desc="Apartment rent" amount="-1200.00" />
//                   <TableRow date="2024-07-25" category="Utilities" desc="Electricity bill" amount="-90.00" />
//                 </tbody>
//               </table>
//             </div>
//           </Card>
//         </main>
//       </div>
//     </div>
//   );
// }

// /* Reusable Components */
// const Card = ({ title, children, extra }) => (
//   <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
//     <div className="flex justify-between items-center mb-4">
//       <h3 className="font-semibold">{title}</h3>
//       {extra && <span className="text-yellow-400 text-sm cursor-pointer">{extra}</span>}
//     </div>
//     {children}
//   </div>
// );

// const TableRow = ({ date, category, desc, amount, income }) => (
//   <tr className="hover:bg-gray-800/40">
//     <td className="py-3">{date}</td>
//     <td>{category}</td>
//     <td className="text-gray-400">{desc}</td>
//     <td className={`text-right ${income ? "text-yellow-400" : "text-red-400"}`}>
//       {amount}
//     </td>
//   </tr>
// );
