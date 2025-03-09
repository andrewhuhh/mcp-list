import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Link } from "react-router-dom"
import { AuthButton } from "./auth/AuthButton"

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[56%] rounded-t-[10px] px-6">
        <nav className="flex flex-col space-y-6 mt-6">
          <Link
            to="/"
            className="text-base font-medium transition-colors hover:text-primary"
          >
            Directory
          </Link>
          <Link
            to="/docs"
            className="text-base font-medium transition-colors hover:text-primary"
          >
            Guide
          </Link>
          <Link
            to="/submit"
            className="text-base font-medium transition-colors hover:text-primary"
          >
            Publish
          </Link>
          <div className="pt-6 border-t">
            <AuthButton />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
} 