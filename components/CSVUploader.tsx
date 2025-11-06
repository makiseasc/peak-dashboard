import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export function CSVUploader() {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      setUploadedFiles([...uploadedFiles, fileName]);
      
      toast({
        title: "File uploaded successfully",
        description: `${fileName} has been imported to your dashboard.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload CSV Files</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import revenue, health, or activity data to populate your dashboard
            </p>
            <label htmlFor="csv-upload">
              <Button asChild className="cursor-pointer">
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose CSV File
                </span>
              </Button>
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Supported Data Types:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Revenue & Sales Data (deals, calls, prospects)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Financial Records (income, expenses, cash flow)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Health Metrics (sleep, workouts, energy levels)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Activity Logs (HLAs, tasks, time tracking)
              </li>
            </ul>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Recently Uploaded:</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">{file}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
