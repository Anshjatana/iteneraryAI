"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SigninDialog from "@/components/SigninDialog";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openDialog, setOpenDialog] = useState(false);


  const handleButtonClick = () => {
    if (status === "authenticated") {
      router.push("/create-trip");
    } else {
      setOpenDialog(true);
  }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Plan Your Perfect Trip
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover amazing places to eat, explore, and create unforgettable memories with our AI-powered travel planner.
        </p>
        
        {/* Create Trip Button */}
        <Button 
          size="lg" 
          className="mb-4"
          onClick={handleButtonClick}
        >
          Create New Trip
        </Button>
        
      </section>

      {/* Featured Destinations */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Paris",
              image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
              description: "The city of love and lights"
            },
            {
              title: "Tokyo",
              image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
              description: "Where tradition meets innovation"
            },
            {
              title: "New York",
              image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
              description: "The city that never sleeps"
            }
          ].map((destination, index) => (
            <Card key={index} className="overflow-hidden">
              <img 
                src={destination.image} 
                alt={destination.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{destination.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{destination.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Discover Your Interests</h2>
        <Tabs defaultValue="food" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="food">🍽️ Food</TabsTrigger>
            <TabsTrigger value="explore">🌎 Explore</TabsTrigger>
            <TabsTrigger value="monuments">🏛️ Monuments</TabsTrigger>
          </TabsList>
          <TabsContent value="food" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🍴 Local Cuisine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Discover the best local restaurants and street food spots.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>🚶‍♂️ Food Tours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Join guided food tours to experience authentic flavors.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="explore" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔍 Hidden Gems</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Explore off-the-beaten-path locations and local favorites.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>🌄 Adventure Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Find exciting outdoor activities and adventures.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="monuments" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🏰 Historical Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Visit iconic landmarks and historical monuments.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>📜 Guided Tours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Book expert-guided tours of famous monuments.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      {/* Sign In Dialog */
      openDialog && (
        <SigninDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
      )
      }
    </main>
  );
}