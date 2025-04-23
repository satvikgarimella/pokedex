"use client"

import * as React from "react"
import * as Recharts from "recharts"

const ChartContainer = ({
  children,
  data,
  xAxis,
  yAxis,
}: {
  children: React.ReactNode
  data: any[]
  xAxis: React.ReactNode
  yAxis: React.ReactNode
}) => {
  return (
    <Recharts.ResponsiveContainer width="100%" height="100%">
      <Recharts.ComposedChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        {xAxis && <Recharts.XAxis dataKey="name" />}
        {yAxis && <Recharts.YAxis />}
        {children}
      </Recharts.ComposedChart>
    </Recharts.ResponsiveContainer>
  )
}

const Chart = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ChartBar = ({ x, y, children }: { x: string; y: number; children: React.ReactNode }) => {
  return <Recharts.Bar dataKey="value">{children}</Recharts.Bar>
}

interface ChartBarItemProps {
  className?: string
}

const ChartBarItem = React.forwardRef<SVGRectElement, ChartBarItemProps>(({ className, ...props }, ref) => {
  return <Recharts.Cell ref={ref} className={className} {...props} />
})

ChartBarItem.displayName = "ChartBarItem"

const ChartTooltip = ({ children }: { children?: React.ReactNode }) => {
  return <Recharts.Tooltip content={<ChartTooltipContent />} />
}

const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-md p-2 shadow-md">
        <p className="font-bold">{`${label}`}</p>
        <p className="text-gray-700">{`Value: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartBar, ChartBarItem }
export type { ChartBarItemProps }
