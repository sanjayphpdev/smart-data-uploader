import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ImportRuleDialog from "./ImportRuleDialog";
import DownloadCSV from "./DownloadCSV";
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export default function CompanyUpload() {
  const [file, setFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a valid .csv or .xlsx file");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
    setDialogOpen(true);
  };

  const handleSubmit = async (uploadRule) => {
    if (!file || !uploadRule) {
      setError("Please select a file and an import rule.");
      return;
    }
    console.log(`uploadRule = ${uploadRule}`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_rule", uploadRule);

    try {
      const res = await fetch(apiUrl + "/company/importdata", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Import successful!");
        setFile(null);
        setDialogOpen(false);
      } else {
        setError(data.message || "Upload failed.");
      }
    } catch (err) {
      setError("An error occurred during upload.");
    }
  };

  return (
    <div className="mt-3 flex">
      <Card className="flex flex-col md:flex-row gap-4">
        <CardContent className="flex flex-col gap-4 p-3">
          <Label htmlFor="file">
            Upload csv or xlsx file to import company data
          </Label>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="mb-2"
            id="file"
          />
          <DownloadCSV></DownloadCSV>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>
      <ImportRuleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      ></ImportRuleDialog>
    </div>
  );
}
