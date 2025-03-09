import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    as?: "div" | "article" | "section"
    interactive?: boolean
  }
>(({ className, as: Component = "div", interactive = true, ...props }, _ref) => {
  const cardRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!interactive || !cardRef.current) return

    const card = cardRef.current
    let bounds: DOMRect
    let isHovering = false

    const rotateElement = (e: MouseEvent) => {
      if (!isHovering) return
      
      const mouseX = e.clientX
      const mouseY = e.clientY
      const leftX = mouseX - bounds.x
      const topY = mouseY - bounds.y
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      }
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2)

      card.style.setProperty("--rx", `${(-center.y / 40)}deg`)
      card.style.setProperty("--ry", `${(center.x / 40)}deg`)
      card.style.setProperty("--distance", `${Math.min(distance, 40)}px`)
    }

    const handleMouseEnter = () => {
      isHovering = true
      bounds = card.getBoundingClientRect()
      document.addEventListener("mousemove", rotateElement)
      card.classList.remove("animate-card-leave")
      card.classList.add("animate-card-hover")
    }

    const handleMouseLeave = () => {
      isHovering = false
      document.removeEventListener("mousemove", rotateElement)
      card.classList.remove("animate-card-hover")
      card.classList.add("animate-card-leave")
      
      // Store the current rotation values
      const currentRx = card.style.getPropertyValue("--rx")
      const currentRy = card.style.getPropertyValue("--ry")
      
      // Ensure the animation starts from current position
      requestAnimationFrame(() => {
        card.style.setProperty("--rx", currentRx)
        card.style.setProperty("--ry", currentRy)
      })

      // Reset values after animation completes
      setTimeout(() => {
        if (!isHovering) {
          card.style.setProperty("--rx", "0")
          card.style.setProperty("--ry", "0")
          card.style.setProperty("--distance", "0")
        }
      }, 400) // Match the animation duration
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mousemove", rotateElement)
    }
  }, [interactive])

  return (
    <Component
      ref={cardRef}
      className={cn(
        "rounded-2xl border bg-card/50 text-card-foreground shadow-sm backdrop-blur-sm",
        interactive && "transition-transform duration-200 transform-gpu style-3d cursor-pointer",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } 