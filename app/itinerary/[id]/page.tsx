"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";



interface Overview {
  total_budget: string;
  travel_dates: string;
  info: string;
}

interface Day {
  date: string;
  activities: any;
}

interface Itinerary {
  _id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelGroup: string;
  recommendations: {
    overview: Overview[];
    days: Day[];
  };
}

export default function ItineraryPage() {
  const params = useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/itineraries/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setItinerary(data);
        } else {
          console.error("Failed to fetch itinerary:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };

    if (params.id) {
      fetchItinerary();
    }
  }, [params.id]);

  if (!itinerary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">{itinerary.destination}</CardTitle>
          <p className="text-muted-foreground">
            {format(new Date(itinerary.startDate), "PPP")} -{" "}
            {format(new Date(itinerary.endDate), "PPP")}
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Schedule</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
  <h3 className="text-lg font-semibold">Travel Group: {itinerary.travelGroup}</h3>
  <div className="space-y-4 mt-4">
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Total Budget:</strong> {itinerary.recommendations.overview.total_budget}</p>
        <p><strong>Travel Dates:</strong> {itinerary.recommendations.overview.travel_dates}</p>
        <p><strong>Info:</strong> {itinerary.recommendations.overview.info}</p>
      </CardContent>
    </Card>
  </div>
</TabsContent>


        {/* Daily Schedule Tab */}
        <TabsContent value="daily">
          <div className="space-y-4">
            {itinerary.recommendations.days.map((day, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Day {index + 1}</CardTitle>
                  {/* <p className="text-muted-foreground">{format(new Date(day.date), "PPP")}</p> */}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {day.activities.map((place, placeIndex) => (
                      <li key={placeIndex}>
                        <p className="text-muted-foreground">{place}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-center">Map view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
