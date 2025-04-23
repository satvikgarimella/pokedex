"use client"

import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartBar, ChartBarItem } from "@/components/ui/chart"

interface PokemonStatsProps {
  stats: { base_stat: number; stat: { name: string } }[]
}

export default function PokemonStats({ stats }: PokemonStatsProps) {
  // Format stat names for better display
  const formatStatName = (name: string) => {
    switch (name) {
      case "hp":
        return "HP"
      case "attack":
        return "Attack"
      case "defense":
        return "Defense"
      case "special-attack":
        return "Sp. Atk"
      case "special-defense":
        return "Sp. Def"
      case "speed":
        return "Speed"
      default:
        return name
    }
  }

  // Get color based on stat value
  const getStatColor = (value: number) => {
    if (value < 50) return "bg-red-500"
    if (value < 80) return "bg-yellow-500"
    if (value < 100) return "bg-green-500"
    return "bg-blue-500"
  }

  // Format data for the chart
  const chartData = stats.map((stat) => ({
    name: formatStatName(stat.stat.name),
    value: stat.base_stat,
    color: getStatColor(stat.base_stat),
  }))

  return (
    <div className="space-y-6">
      <h4 className="font-semibold">Base Stats</h4>

      <div className="h-[250px] w-full">
        <ChartContainer data={chartData} xAxis={<></>} yAxis={<></>}>
          <Chart>
            {chartData.map((stat, index) => (
              <ChartBar key={index} x={stat.name} y={stat.value}>
                <ChartBarItem className={stat.color} />
              </ChartBar>
            ))}
          </Chart>
          <ChartTooltip>
            <ChartTooltipContent />
          </ChartTooltip>
        </ChartContainer>
      </div>

      <div className="space-y-2">
        {stats.map((stat) => (
          <div key={stat.stat.name} className="flex items-center">
            <div className="w-24 text-sm">{formatStatName(stat.stat.name)}</div>
            <div className="flex-1">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStatColor(stat.base_stat)}`}
                  style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="w-10 text-right text-sm">{stat.base_stat}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
