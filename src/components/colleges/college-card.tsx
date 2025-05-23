"use client"

import { useState } from "react"
import { Database } from "@/types/supabase"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ExternalLinkIcon,
  FileIcon,
  MapPinIcon,
  BuildingIcon,
  TrashIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { useUserRole } from "@/hooks/useUserRole"

type College = Database['public']['Tables']['colleges']['Row']

interface CollegeCardProps {
  college: College
  onDelete: (id: string) => Promise<void>
}

export function CollegeCard({ college, onDelete }: CollegeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { userRole } = useUserRole()
  const isAgent = userRole === "agent"

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-200 border-zinc-400">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className="bg-teal-50 text-black hover:bg-teal-100">
              Institution
            </Badge>
          </div>
          <CardTitle className="text-xl flex items-center">
            {college.name}
          </CardTitle>
          <CardDescription className="flex items-center text-base">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
            {college.location}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <ExternalLinkIcon className="h-4 w-4 mr-2" />
            <a
              href={college.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-600 truncate"
            >
              {college.website_url || 'No website available'}
            </a>
          </div>

          {college.brochure_url && (
            <div className="flex items-center text-sm text-gray-600">
              <FileIcon className="h-4 w-4 mr-2" />
              <a
                href={college.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-600"
              >
                View Brochure
              </a>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          {isAgent && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="bg-[#FFC11F] text-black border-none hover:bg-amber-300 hover:text-black py-5"
            asChild
          >
            <Link href={`/dashboard/colleges/${college.id}`}>
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => onDelete(college.id)}
        title="Delete College"
        description={`Are you sure you want to delete ${college.name}? This action cannot be undone.`}
      />
    </>
  )
}
