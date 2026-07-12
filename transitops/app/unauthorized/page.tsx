"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft, UserX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 text-destructive mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Your role doesn't include access to this module.
        </p>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserX className="w-5 h-5" />
              Insufficient Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Please contact your administrator if you believe this is an error.
            </p>
            <div className="p-3 bg-muted rounded-lg text-left">
              <p className="font-medium text-foreground">Required Access:</p>
              <p className="text-muted-foreground text-xs mt-1">
                This module requires a role with appropriate permissions.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">
              Sign Out
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}