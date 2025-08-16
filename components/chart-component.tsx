"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", emails: 45, meetings: 12 },
  { month: "Feb", emails: 52, meetings: 15 },
  { month: "Mar", emails: 48, meetings: 18 },
  { month: "Apr", emails: 61, meetings: 20 },
  { month: "May", emails: 55, meetings: 21 },
  { month: "Jun", emails: 67, meetings: 25 },
]

export function ChartComponent() {
  return (
    <ChartContainer
      config={{
        emails: {
          label: "Emails",
          color: "hsl(var(--chart-1))",
        },
        meetings: {
          label: "Meetings",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="emails" stroke="var(--color-emails)" name="Emails" />
          <Line type="monotone" dataKey="meetings" stroke="var(--color-meetings)" name="Meetings" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
