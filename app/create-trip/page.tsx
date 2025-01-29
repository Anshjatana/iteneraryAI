"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface FormData {
  userId: string;
  destination: string;
  placeId: string;
  numberOfDays: number; // New field for number of days
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

export default function CreateTrip() {
  const router = useRouter();
  const { data: session } = useSession();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    destination: "",
    placeId: "",
    numberOfDays: 1, // Added field for number of days
    travelGroup: "",
    interests: ["explore"],
    budget: "",
  });

  const handleInputChange = (name: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePlaceSelect = async (place: Place) => {
    if (place) {
      setFormData({
        ...formData,
        userId: session?.user?.email || "",
        destination: place.label,
        placeId: place.value.place_id,
      });
    }
  };

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: HandleSubmitEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);

    if (
      !formData.userId ||
      !formData.destination ||
      !formData.placeId ||
      !formData.numberOfDays ||
      !formData.travelGroup ||
      !formData.interests.length ||
      !formData.budget
    ) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://cors-anywhere.herokuapp.com/https://be-itenerary-ai.vercel.app/api/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data: { _id: string } = await response.json();
        console.log("Itinerary created:", data);
        router.push(`/itinerary/${data._id}`);
      } else {
        console.error("Failed to create itinerary:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to create itinerary:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  function cn(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <>
    {
      loading && (
        <div className="fixed z-[100] inset-0 flex flex-col gap-2 items-center justify-center bg-black bg-opacity-70">
          <div className="animate-spin z-[100] rounded-full h-10 w-10 border-t-2 border-l-2 border-b-2 border-white"></div>
            <p className="text-lg font-medium z-[100] text-white text-center">Hold on, creating itinerary...</p>
        </div>
      )
    }
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Plan Your Next Trip ✈️</CardTitle>
          <CardDescription className="text-md text-gray-400 ">
            Just Provide some basic information, and our trip planner will
            generate a customized itinerary based on your preference!
          </CardDescription>
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
                    if (v) handlePlaceSelect(v as Place);
                  },
                  placeholder: "Search for a destination...",
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Days 🗓️</label>
              <Input
                type="number"
                value={formData.numberOfDays}
                onChange={(e) =>
                  handleInputChange("numberOfDays", e.target.value)
                }
                min={1}
                placeholder="Enter number of days"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Travel Group 👥</label>
              <Select
                value={formData.travelGroup}
                onValueChange={(value) =>
                  handleInputChange("travelGroup", value)
                }
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
                  <Button
                    key={interest.value}
                    type="button"
                    className={cn(
                      "px-4 py-2 rounded-lg border font-medium",
                      formData.interests.includes(interest.value)
                        ? "bg-black text-white border-black"
                        : "bg-white hover:text-black hover:bg-gray-200 text-gray-700 border-gray-300"
                    )}
                    onClick={() => {
                      const updatedInterests = formData.interests.includes(
                        interest.value
                      )
                        ? formData.interests.filter((i) => i !== interest.value)
                        : [...formData.interests, interest.value];
                      handleInputChange("interests", updatedInterests);
                    }}
                  >
                    {interest.label}
                  </Button>
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
    </>
  );
}
