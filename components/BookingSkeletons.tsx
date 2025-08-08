import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// Skeleton for booking card
export function BookingCardSkeleton() {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-6 w-20 ml-4" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <Skeleton className="h-8 w-16" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton for booking list
export function BookingListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <BookingCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton for booking details page
export function BookingDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule section */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-44" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User information */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meeting link */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status card */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Skeleton className="h-3 w-3 rounded-full mt-2" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Skeleton for booking form
export function BookingFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Form */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Service selection */}
            <div>
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Category selection */}
            <div>
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Level selection */}
            <div>
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Instructor selection */}
            <div>
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Date and time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-5 w-24 mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-5 w-24 mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Duration */}
            <div>
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Notes */}
            <div>
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Submit button */}
            <div className="flex justify-end space-x-4 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton for edit booking form
export function EditBookingFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Form */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Booking purpose */}
            <div>
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Schedule */}
            <div>
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Duration */}
            <div>
              <Skeleton className="h-5 w-32 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Participant type */}
            <div>
              <Skeleton className="h-5 w-36 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Number of participants */}
            <div>
              <Skeleton className="h-5 w-48 mb-3" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Notes */}
            <div>
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Submit button */}
            <div className="flex justify-end space-x-4 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 