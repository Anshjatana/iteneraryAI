"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Overview {
  total_budget: string;
  highlights: string[];
  best_time_to_visit: string;
  travel_tips: string[];
}

interface Activity {
  name: string;
  description: string;
  duration: string;
  cost: string;
}

interface Day {
  morning_activity: Activity;
  afternoon_activity: Activity;
  evening_activity: Activity;
}

interface Itinerary {
  _id: string;
  destination: string;
  travelGroup: string;
  recommendations: {
    overview: Overview;
    days: Day[];
  };
}

export default function ItineraryPage() {
  const params = useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`https://be-itenerary-ai.vercel.app/api/itineraries/${params.id}`);
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
    return <div>Loading... ⏳</div>;
  }

  const { destination, travelGroup, recommendations } = itinerary;
  const { overview, days } = recommendations;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">🌍 {destination}</CardTitle>
          <p className="text-muted-foreground">
            👥 Travel Group: {travelGroup} | 📅 Duration: {days.length} days
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">📖 Overview</TabsTrigger>
          <TabsTrigger value="daily">📆 Daily Schedule</TabsTrigger>
          <TabsTrigger value="tips">💡 Travel Tips</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔎 Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {overview.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>💵 Total Budget</CardTitle>
              </CardHeader>
              <CardContent>{overview.total_budget}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>🗓️ Best Time to Visit</CardTitle>
              </CardHeader>
              <CardContent>{overview.best_time_to_visit}</CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Daily Schedule Tab */}
        <TabsContent value="daily">
          <div className="space-y-4">
            {days.map((day, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>📅 Day {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  {["morning_activity", "afternoon_activity", "evening_activity"].map((timeOfDay) => {
                    const activity = day[timeOfDay as keyof Day] as Activity;
                    return (
                      <div key={timeOfDay} className="mb-4">
                        <h4 className="font-semibold capitalize">{timeOfDay.replace("_", " ")}</h4>
                        <p>
                          <strong>📍 {activity.name}</strong>: {activity.description}
                        </p>
                        <p>
                          <strong>⏳ Duration:</strong> {activity.duration} | <strong>💰 Cost:</strong>{" "}
                          {activity.cost}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Travel Tips Tab */}
        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>💡 Travel Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {overview.travel_tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
