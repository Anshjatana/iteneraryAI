"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Calendar, Users, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Overview {
    total_budget: string;
    travel_dates: string;
    info: string;
  }
  
  interface Day {
    date: string;
    activities: any;
  }

interface Trip {
    _id: string;
    title: string;
    destination: string;
    travelGroup: string;
    recommendations: {
      overview: Overview[];
      days: Day[];
    };
}

export default function MyTrips() {
  const router = useRouter();
  const { data: session } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!session?.user?.email) return;
      const userId = session?.user?.email;

      try {
        const response = await fetch(`https://be-itenerary-ai.vercel.app/api/itineraries/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        }
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [session]);

  const getBudgetIcon = (budget: string) => {
    switch (budget) {
      case "budget":
        return <DollarSign className="h-4 w-4" />;
      case "mid-range":
        return (
          <div className="flex">
            <DollarSign className="h-4 w-4" />
            <DollarSign className="h-4 w-4" />
          </div>
        );
      case "luxury":
        return (
          <div className="flex">
            <DollarSign className="h-4 w-4" />
            <DollarSign className="h-4 w-4" />
            <DollarSign className="h-4 w-4" />
          </div>
        );
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getTravelGroupIcon = (group: string) => {
    switch (group) {
      case "single":
        return "Solo Traveler";
      case "couple":
        return "Couple";
      case "family":
        return "Family";
      default:
        return group;
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Sign in to view your trips</CardTitle>
            <CardDescription>
              Please sign in to access your travel itineraries
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Button onClick={() => router.push("/create-trip")}>
          Create New Trip
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card
              key={trip._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/itinerary/${trip._id}`)}
            >
              <CardHeader>
                <CardTitle>{trip.destination}</CardTitle>
                <CardDescription>
                  {trip.recommendations.days.length} day{trip.recommendations.days.length > 1 ? "s" : ""} trip
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{getTravelGroupIcon(trip.travelGroup)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No trips found</CardTitle>
            <CardDescription>
              You haven&apos;t created any trips yet. Click the button above to create
              your first trip!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}