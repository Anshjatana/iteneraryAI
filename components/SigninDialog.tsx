"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface SignInProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}


export default function SignIn({ openDialog, setOpenDialog }: SignInProps) {
    const { data: session, status } = useSession();
    
    // Close dialog when user signs in
    useEffect(() => {
      if (status === 'authenticated') {
        setOpenDialog(false);
      }
    }, [status]);
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
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
                onClick={() => signIn('google', { callbackUrl: '/' })}
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
    </div>
  );
}