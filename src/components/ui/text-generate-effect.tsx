import { motion, stagger, useAnimate } from "motion/react"
import * as React from "react"
import { cn } from "@/lib/utils"

type TextGenerateEffectProps = Omit<React.ComponentProps<"div">, "children"> & {
  words: string
  filter?: boolean
  duration?: number
  staggerDelay?: number
  progress?: number // Scroll progress (0 to 1)
  getWordStyle?: (word: string, idx: number, wordProgress: number) => React.CSSProperties
  getWordClassName?: (word: string, idx: number, wordProgress: number) => string
}

function TextGenerateEffect({
  ref,
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.2,
  progress,
  getWordStyle,
  getWordClassName,
  ...props
}: TextGenerateEffectProps) {
  const localRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref as any, () => localRef.current as HTMLDivElement)

  const [scope, animate] = useAnimate()
  const wordsArray = React.useMemo(() => words.split(" "), [words])

  React.useEffect(() => {
    if (progress === undefined && scope.current) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration,
          delay: stagger(staggerDelay),
        },
      )
    }
  }, [animate, duration, filter, scope, staggerDelay, progress])

  return (
    <div
      className={cn("font-bold", className)}
      data-slot="text-generate-effect"
      ref={localRef}
      {...(props as any)}
    >
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          let wordProgress = 1
          if (progress !== undefined) {
            const wordDuration = 0.25 // overlap factor
            const start = wordsArray.length > 1
              ? (idx / (wordsArray.length - 1)) * (1 - wordDuration)
              : 0
            wordProgress = Math.min(Math.max((progress - start) / wordDuration, 0), 1)
          }

          // Default styles for scroll progress if getWordStyle is not provided
          const defaultStyle: React.CSSProperties = progress !== undefined ? {
            opacity: 0.15 + 0.85 * wordProgress,
            filter: filter ? `blur(${(1 - wordProgress) * 10}px)` : "none",
            transform: `translateY(${(1 - wordProgress) * 6}px)`,
            display: "inline-block",
          } : {
            filter: filter ? "blur(10px)" : "none",
          }

          const resolvedStyle = getWordStyle 
            ? { ...defaultStyle, ...getWordStyle(word, idx, wordProgress) }
            : defaultStyle

          const defaultSpanClass = progress !== undefined 
            ? "will-change-transform will-change-opacity will-change-filter inline-block"
            : "opacity-0 will-change-transform will-change-opacity will-change-filter"

          const resolvedClassName = getWordClassName
            ? cn(defaultSpanClass, getWordClassName(word, idx, wordProgress))
            : defaultSpanClass

          return (
            <React.Fragment key={`${word}-${idx}`}>
              <motion.span
                className={resolvedClassName}
                style={resolvedStyle}
              >
                {word}
              </motion.span>
              {" "}
            </React.Fragment>
          )
        })}
      </motion.div>
    </div>
  )
}

export { TextGenerateEffect, type TextGenerateEffectProps }
export default TextGenerateEffect
