import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "./ui/sheet"
import { Link, useLocation } from "react-router-dom"
import { AuthButton } from "./auth/AuthButton"

export function MobileNav() {
  const location = useLocation()

  const getLinkStyles = (path: string) => {
    const isActive = location.pathname === path
    return `text-3xl font-medium ${isActive ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-all hover:text-primary`
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[56%] rounded-t-[10px] px-6">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col space-y-6 mt-6">
          <SheetClose asChild>
            <Link
              to="/"
              className={getLinkStyles("/")}
            >
              Directory
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              to="/docs"
              className={getLinkStyles("/docs")}
            >
              Guide
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              to="/submit"
              className={`${getLinkStyles("/submit")} pb-6`}
            >
              Add Server
            </Link>
          </SheetClose>
          <div className="pt-6 border-t">
            <AuthButton variant="mobile" />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
} 