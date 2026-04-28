import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md border-0 shadow-lg bg-background">
        <CardContent className="pt-10 pb-8 px-8 text-center flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">404</h1>
          <p className="text-lg font-medium text-foreground mb-2">Page Not Found</p>
          <p className="text-sm text-muted-foreground mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/">
            <Button className="w-full">Return Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
