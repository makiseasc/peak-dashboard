import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { FileText, ExternalLink } from "lucide-react";

const proofItems = [
  { 
    title: "Q4 Client Success Story - Tech Startup", 
    type: "Case Study", 
    date: "2024-01-15",
    impact: "2.5x ROI"
  },
  { 
    title: "LinkedIn Article: Scaling SaaS Sales", 
    type: "Content", 
    date: "2024-01-10",
    impact: "15K views"
  },
  { 
    title: "Product Launch Campaign Results", 
    type: "Case Study", 
    date: "2024-01-05",
    impact: "$125K generated"
  },
  { 
    title: "Guest Podcast: Growth Strategies", 
    type: "Content", 
    date: "2023-12-28",
    impact: "8K listens"
  },
];

export function ProofVault() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Social Proof & Content Library
          </CardTitle>
          <Badge variant="secondary">{proofItems.length} items</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {proofItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                  <span>{item.date}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-accent">{item.impact}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-primary">
            <span className="font-semibold">Pro tip:</span> Reference these assets in sales conversations for instant credibility
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
