import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  History,
  PlusCircle,
  LogOut,
  Menu,
  UserCircle,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NavItemProps {
  href: string
  label: string
  icon: React.ElementType
  isActive?: boolean
  onClick?: () => void
}

function NavItem({ href, label, icon: Icon, isActive, onClick }: NavItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        isActive && "bg-muted"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  )
}

export function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      href: '/dashboard/history',
      label: 'Test History',
      icon: History
    },
    {
      href: '/dashboard/new-test',
      label: 'New Test',
      icon: PlusCircle
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">BloodTracker</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform lg:translate-x-0 lg:relative",
          !isMobileMenuOpen && "-translate-x-full"
        )}>
          {/* Logo */}
          <div className="hidden lg:flex h-14 items-center justify-between border-b px-6">
            <h1 className="text-xl font-bold">BloodTracker</h1>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={location.pathname === item.href}
                onClick={() => {
                  navigate(item.href)
                  setIsMobileMenuOpen(false)
                }}
              />
            ))}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden lg:block absolute bottom-0 left-0 right-0 border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <UserCircle className="h-4 w-4" />
                  <span className="flex-1 truncate text-left">
                    {user?.email}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-h-screen pt-14 lg:pt-0",
          isMobileMenuOpen && "lg:pl-64"
        )}>
          <div className="container py-6 px-4 max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
} 