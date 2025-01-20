'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

export default function CreateTrip() {
  const router = useRouter();
  const { data: session } = useSession();
  const [place, setPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState({
    userId:'',
    destination: "",
    placeId: "",
    startDate: null,
    endDate: null,
    travelGroup: "",
    interests: ["food"],
    budget: "",
  });
  

  interface FormData {
    userId: string;
    destination: string;
    placeId: string;
    startDate: Date | null;
    endDate: Date | null;
    travelGroup: string;
    interests: string[];
    budget: string;
  }

  interface Place {
    label: string;
    value: {
      place_id: string;
    };
  }

  const handleInputChange = (name: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePlaceSelect = async (place:Place) => {
    if (place) {
      try {
        // Extract location data (latitude and longitude)
        // Update formData with the selected place details
        setFormData({
          ...formData,
          userId: Date.now().toString(),
          destination: place.label, // Use the label for the destination name
          placeId: place.value.place_id, // Set the place_id
        });
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    

    if (!formData.userId || !formData.destination || !formData.placeId || !formData.startDate || !formData.endDate || !formData.travelGroup || !formData.interests.length || !formData.budget) {
      console.error("Please complete all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Itinerary created:", data);
        router.push(`/itinerary/${data._id}`);
      } else {
        console.error("Failed to create itinerary:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to create itinerary:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Plan Your Next Trip ✈️</CardTitle>
        <CardDescription className="text-md text-gray-400 " >Just Provide some basic information, and our trip planner will generate a customized itinerary based on your preference!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium">
              Destination 📍
            </label>
            <GooglePlacesAutocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              selectProps={{
                value: place,
                onChange: (v) => {
                  setPlace(v);
                  handlePlaceSelect(v);
                },
                placeholder: "Search for a destination...",
              }}
            />
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            {(["startDate", "endDate"] as const).map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium capitalize">
                  {field.replace("Date", " Date")} 📅
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData[field] && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData[field]
                        ? format(new Date(formData[field]), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData[field] || undefined}
                      onSelect={(date) => date && handleInputChange(field, date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
  
          <div className="space-y-2">
            <label className="text-sm font-medium">Travel Group 👥</label>
            <Select
              value={formData.travelGroup}
              onValueChange={(value) => handleInputChange("travelGroup", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select travel group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Solo Traveler 🧳</SelectItem>
                <SelectItem value="couple">Couple 💑</SelectItem>
                <SelectItem value="family">Family 👨‍👩‍👧‍👦</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          <div className="space-y-2">
  <label className="text-sm font-medium">Interests 🧳</label>
  <div className="flex flex-wrap gap-2">
    {[
      { value: "food", label: "Food 🍽️" },
      { value: "explore", label: "Explore 🧭" },
      { value: "markets", label: "Markets 🛍️" },
      { value: "culture", label: "Culture 🎭" },
    ].map((interest) => (
      <button
        key={interest.value}
        type="button"
        className={cn(
          "px-4 py-2 rounded-lg border font-medium",
          formData.interests.includes(interest.value)
            ? "bg-black text-white border-black"
            : "bg-white text-gray-700 border-gray-300"
        )}
        onClick={() => {
          const updatedInterests = formData.interests.includes(interest.value)
            ? formData.interests.filter((i) => i !== interest.value)
            : [...formData.interests, interest.value];
          handleInputChange("interests", updatedInterests);
        }}
      >
        {interest.label}
      </button>
    ))}
  </div>
</div>

  
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget 💰</label>
            <Select
              value={formData.budget}
              onValueChange={(value) => handleInputChange("budget", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cheap">Budget Friendly 💵</SelectItem>
                <SelectItem value="mid-range">Mid Range 💳</SelectItem>
                <SelectItem value="luxury">Luxury 🏰</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          <Button type="submit" className="w-full">
            Create Itinerary 📝
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
  
  );
}
