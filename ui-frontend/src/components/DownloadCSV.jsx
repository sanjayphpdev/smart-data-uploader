import React from "react";

const DownloadCSV = () => {
  const handleDownload = () => {
    const data = [["Name", "Industry", "Location", "Email", "Phone"]];

    const csvContent = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <a
      href="javascript:void(0)"
      onClick={handleDownload}
      target="_blank"
      rel="noopener noreferrer"
    >
      Download Sample CSV
    </a>
  );
};

export default DownloadCSV;
