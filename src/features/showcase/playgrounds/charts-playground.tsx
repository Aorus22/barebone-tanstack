import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ShowcaseSection } from "../showcase-section"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop Traffic",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile Traffic",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartsPlayground() {
  const areaCode = `import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  ...
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile:  { label: "Mobile",  color: "var(--chart-2)" },
}

<ChartContainer config={chartConfig} className="w-full h-[200px]">
  <AreaChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" />
    <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.4} stroke="var(--color-mobile)" />
  </AreaChart>
</ChartContainer>`

  const barCode = `import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  ...
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile:  { label: "Mobile",  color: "var(--chart-2)" },
}

<ChartContainer config={chartConfig} className="w-full h-[200px]">
  <BarChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile"  fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>`

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#charts-area" className="hover:text-foreground hover:underline transition-colors">Area Chart</a>
        <a href="#charts-bar" className="hover:text-foreground hover:underline transition-colors">• Bar Chart</a>
      </div>

      <ShowcaseSection
        id="charts-area"
        eyebrow="Utilities"
        title="Area Chart"
        description="Smooth gradient-filled area chart for showing trends and volume over time."
        code={areaCode}
      >
        <div className="w-full h-[240px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="desktop"
                type="natural"
                fill="var(--color-desktop)"
                fillOpacity={0.2}
                stroke="var(--color-desktop)"
                strokeWidth={2}
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="var(--color-mobile)"
                fillOpacity={0.2}
                stroke="var(--color-mobile)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="charts-bar"
        eyebrow="Utilities"
        title="Bar Chart"
        description="Side-by-side bar chart for comparing categories and values at a glance."
        code={barCode}
      >
        <div className="w-full h-[240px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </ShowcaseSection>
    </div>
  )
}
