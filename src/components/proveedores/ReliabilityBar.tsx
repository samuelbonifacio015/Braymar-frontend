"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReliabilityBarProps {
  score: number
  maxScore?: number
  className?: string
}

export function ReliabilityBar({ score, maxScore = 5, className = "" }: ReliabilityBarProps) {
  const percent = (score / maxScore) * 100
  const filledStars = Math.round(score)

  const barColor =
    score >= 4.5 ? "bg-green-500" :
    score >= 3.5 ? "bg-blue-500" :
    score >= 2.5 ? "bg-amber-500" :
    "bg-red-500"

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        <div className="relative h-2 flex-1 rounded-full bg-muted">
          <div
            className={cn("absolute left-0 top-0 h-full rounded-full transition-all", barColor)}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-sm font-semibold tabular-nums w-10 text-right">{score}</span>
      </div>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxScore }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={cn(
              i < filledStars ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  )
}