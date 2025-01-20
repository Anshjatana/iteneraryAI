"use client";

import { useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { LogOut, User } from 'lucide-react';

function Navbar() {
  const { data: session, status } = useSession();
  const [openDialog, setOpenDialog] = useState(false);

  // Close dialog when user signs in
  useEffect(() => {
    if (status === 'authenticated') {
      setOpenDialog(false);
    }
  }, [status]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container w-full flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              height={44} 
              width={44} 
              src="https://res.cloudinary.com/dywhcxdix/image/upload/v1737286045/map_fb2dut.svg" 
              alt="Logo" 
            />
            <span className="font-bold text-xl">Itinerary AI</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/create-trip">
                <Button variant="outline">
                  + Create Trip
                </Button>
              </Link>
              <Link href="/my-trips">
                <Button variant="ghost">
                  My Trips
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        className="rounded-full"
                        fill
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => setOpenDialog(true)}>
              Sign In
            </Button>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogDescription className="text-center pt-4 space-y-4">
              <div className="flex justify-center">
                <Image 
                  height={44} 
                  width={44} 
                  src="https://res.cloudinary.com/dywhcxdix/image/upload/v1737286045/map_fb2dut.svg" 
                  alt="Logo" 
                />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                Welcome to Itinerary AI
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to plan your next adventure
              </p>
              <Button 
                className="w-full"
                onClick={() => signIn('google')}
              >
                <Image
                  src="https://authjs.dev/img/providers/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Continue with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

export default Navbar;