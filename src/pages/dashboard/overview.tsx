import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PlusCircle, History, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/lib/contexts/auth-context'
import { getBloodTests } from '@/lib/firebase/blood-tests'
import { Skeleton } from '@/components/ui/skeleton'
import type { BloodTestWithMeta } from '@/types/blood-test-form'

export function DashboardOverview() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recentTests, setRecentTests] = useState<BloodTestWithMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecentTests() {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)
        const tests = await getBloodTests(user.uid)
        setRecentTests(tests.slice(0, 5)) // Get only the 5 most recent tests
      } catch (error) {
        console.error('Error loading recent tests:', error)
        setError('Failed to load recent tests. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadRecentTests()
  }, [user])

  const quickActions = [
    {
      title: 'New Blood Test',
      description: 'Create a new blood test requisition',
      icon: PlusCircle,
      onClick: () => navigate('/dashboard/new-test'),
    },
    {
      title: 'Test History',
      description: 'View all your blood test records',
      icon: History,
      onClick: () => navigate('/dashboard/history'),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.email ? `, ${user.email}` : ''}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={action.onClick}
          >
            <CardHeader className="flex flex-row items-center space-x-4">
              <action.icon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Recent Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Blood Tests</CardTitle>
          <CardDescription>
            Your {recentTests.length} most recent blood test records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : recentTests.length > 0 ? (
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {test.patientInfo?.firstName} {test.patientInfo?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {test.patientInfo?.collectionDate ? 
                        new Date(test.patientInfo.collectionDate).toLocaleDateString() :
                        'No date recorded'
                      }
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/dashboard/blood-tests/${test.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No blood tests found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/dashboard/new-test')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Test
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 