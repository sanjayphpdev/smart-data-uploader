import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const importOptions = [
  { value: "", label: "Select an import rule" },
  { value: "createNewCompanies", label: "Create New Companies" },
  {
    value: "createNewAndUpdateCompanies",
    label: "Create New and Update Existing Companies (Without Overwrite)",
  },
  {
    value: "createNewAndUpdateCompaniesWithOverwrite",
    label: "Create New and Update Existing Companies (With Overwrite)",
  },
  {
    value: "updateExistingCompaniesOnly",
    label: "Update Only Existing Companies (Without Overwrite)",
  },
  {
    value: "updateExistingCompaniesWithOverwrite",
    label: "Update Only Existing Companies (With Overwrite)",
  },
];

export default function ImportRuleDialog({ open, onClose, onSubmit }) {
  const [selectedRule, setSelectedRule] = useState("");

  const handleSubmit = () => {
    if (selectedRule) {
      onSubmit(selectedRule);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Import Rule</DialogTitle>
          <DialogDescription>
            Choose how you'd like to import your data. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <select
          value={selectedRule}
          onChange={(e) => setSelectedRule(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mt-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {importOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={!option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedRule}>
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
