import React, { useEffect, useState } from "react";

import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { getMonthlyReport } from "../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= CHART REGISTRATION ================= */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

export default function Reports() {
  /* ================= STATE (LOGIC ONLY) ================= */
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      const current = await getMonthlyReport(currentMonth);
      setReport(current);

      const temp = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentMonth + "-01");
        d.setMonth(d.getMonth() - i);
        const key = d.toISOString().slice(0, 7);

        const res = await getMonthlyReport(key);

        temp.push({
          label: d.toLocaleString("en-US", { month: "short" }),
          income: res.totalIncome || 0,
          expense: res.totalExpenses || 0
        });
      }

      setHistory(temp);
    };

    fetchData();
  }, []);

  if (!report) return null;

  /* ================= PDF (LOGIC ONLY) ================= */
  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(18);
    pdf.text("Monthly Financial Report", 14, 15);

    pdf.setFontSize(11);
    pdf.text("SpendWise – Personal Expense Tracker", 14, 22);
    pdf.line(14, 25, 196, 25);

    autoTable(pdf, {
      startY: 30,
      head: [["Summary", "Amount (₹)"]],
      body: [
        ["Total Income", report.totalIncome],
        ["Total Expenses", report.totalExpenses],
        ["Net Savings", report.netSavings]
      ],
      theme: "grid",
      styles: { halign: "center" },
      headStyles: { fillColor: [255, 193, 7], textColor: 0 }
    });

    autoTable(pdf, {
      startY: pdf.lastAutoTable.finalY + 10,
      head: [["Category", "Amount (₹)"]],
      body: Object.entries(report.categories || {}),
      theme: "striped"
    });

    autoTable(pdf, {
      startY: pdf.lastAutoTable.finalY + 10,
      head: [["Month", "Income (₹)", "Expenses (₹)"]],
      body: history.map(h => [h.label, h.income, h.expense]),
      theme: "grid"
    });

    pdf.save("Monthly_Report_Table.pdf");
  };

  /* ================= CHART DATA ================= */

  const doughnutData = {
    labels: Object.keys(report.categories || {}),
    datasets: [
      {
        data: Object.values(report.categories || {}),
        backgroundColor: [
          "rgb(239,68,68)",
          "rgb(59,130,246)",
          "rgb(34,197,94)",
          "rgb(251,146,60)"
        ],
        borderWidth: 0,
        spacing: 3
      }
    ]
  };

  const barData = {
    labels: history.map(h => h.label),
    datasets: [
      {
        label: "Expenses",
        data: history.map(h => h.expense),
        backgroundColor: "rgb(239,68,68)"
      },
      {
        label: "Income",
        data: history.map(h => h.income),
        backgroundColor: "rgb(34,197,94)"
      }
    ]
  };

  const lineData = {
    labels: history.map(h => h.label),
    datasets: [
      {
        label: "Expenses",
        data: history.map(h => h.expense),
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.1)",
        fill: true
      },
      {
        label: "Income",
        data: history.map(h => h.income),
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.1)",
        fill: true
      }
    ]
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8 p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Monthly Spending Reports
          </h2>
          <p className="text-gray-400 text-sm">
            Visual charts on screen, printable tables in PDF
          </p>
        </div>

        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition"
        >
          Download Report (PDF)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Income" value={`₹${report.totalIncome}`} color="text-green-500" />
        <SummaryCard title="Total Expenses" value={`₹${report.totalExpenses}`} color="text-red-500" />
        <SummaryCard title="Net Savings" value={`₹${report.netSavings}`} color="text-yellow-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard>
          <Doughnut data={doughnutData} options={chartOptions} />
        </ChartCard>

        <ChartCard>
          <Bar data={barData} options={barOptions} />
        </ChartCard>
      </div>

      <ChartCard height="h-80">
        <Line data={lineData} options={lineOptions} />
      </ChartCard>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

const SummaryCard = ({ title, value, color }) => (
  <div className="bg-gray-900 rounded-2xl p-6">
    <p className="text-sm text-gray-400">{title}</p>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const ChartCard = ({ children, height = "h-72" }) => (
  <div className={`bg-gray-900 rounded-2xl p-6 ${height}`}>
    {children}
  </div>
);

/* ================= CHART OPTIONS ================= */

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#fff" }
    }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { ticks: { color: "#fff" } },
    y: { ticks: { color: "#fff" } }
  }
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { ticks: { color: "#fff" } },
    y: { ticks: { color: "#fff" } }
  }
};
