"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartComponent } from "../chart-component";

export function ChartsSection() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Contact Introduction Graph</CardTitle>
          <CardDescription>Your network connections and introductions</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {/* This would be a graph visualization in the real app */}
          <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-500">Network Graph Visualization</p>
              <p className="text-xs text-gray-400">(Interactive D3.js graph would appear here)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Communication Activity</CardTitle>
          <CardDescription>Email and meeting frequency over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartComponent />
        </CardContent>
      </Card>
    </div>
  );
} 