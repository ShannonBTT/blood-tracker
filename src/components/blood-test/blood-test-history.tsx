import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { getBloodTests, deleteBloodTest } from '@/lib/firebase/blood-tests'
import { useAuth } from '@/lib/contexts/auth-context'
import type { BloodTestForm } from '@/types/blood-test-form'
import { Skeleton } from '@/components/ui/skeleton'

interface BloodTestWithMeta extends BloodTestForm {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'completed' | 'archived'
}

interface BloodTestHistoryProps {
  onCountChange?: (count: number) => void
}

export function BloodTestHistory({ onCountChange }: BloodTestHistoryProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tests, setTests] = useState<BloodTestWithMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)

  useEffect(() => {
    async function loadTests() {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await getBloodTests(user.uid)
        setTests(data)
        onCountChange?.(data.length)
      } catch (err) {
        console.error('Failed to load blood tests:', err)
        setError('Failed to load blood tests. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTests()
  }, [user, onCountChange])

  function handleViewTest(id: string) {
    navigate(`/dashboard/blood-tests/${id}`)
  }

  function handleNewTest() {
    navigate('/dashboard/new-test')
  }

  function handleEditTest(id: string) {
    navigate(`/dashboard/blood-tests/${id}/edit`)
  }

  async function handleDelete(id: string) {
    try {
      setIsLoading(true)
      await deleteBloodTest(id)
      
      // Update the local state to remove the deleted test
      setTests(prevTests => {
        const newTests = prevTests.filter(test => test.id !== id)
        onCountChange?.(newTests.length)
        return newTests
      })
      
      toast.success('Blood test deleted successfully')
    } catch (error) {
      console.error('Failed to delete blood test:', error)
      toast.error('Failed to delete blood test', {
        description: error instanceof Error ? error.message : 'Please try again later'
      })
    } finally {
      setIsLoading(false)
      setTestToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test History</CardTitle>
          <CardDescription>Loading your blood test history...</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test History</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Test History</CardTitle>
          <CardDescription>
            {tests.length} {tests.length === 1 ? 'test' : 'tests'} recorded
          </CardDescription>
        </div>
        <Button onClick={handleNewTest}>New Test</Button>
      </CardHeader>
      <CardContent>
        {tests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No blood tests found. Click "New Test" to create one.
            </p>
            <Button onClick={handleNewTest}>
              Create Your First Test
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>PHN</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Physician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>
                    {format(new Date(test.patientInfo.collectionDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {test.patientInfo.firstName} {test.patientInfo.lastName}
                  </TableCell>
                  <TableCell>{test.patientInfo.phn}</TableCell>
                  <TableCell>{test.patientInfo.clinicName}</TableCell>
                  <TableCell>
                    {test.requestingPhysician.firstName} {test.requestingPhysician.lastName}
                  </TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      test.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {test.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTest(test.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTest(test.id)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Blood Test</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this blood test? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(test.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
} 