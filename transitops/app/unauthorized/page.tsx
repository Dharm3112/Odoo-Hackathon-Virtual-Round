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
          You don&apos;t have permission to access this page. Your role doesn&apos;t include access to this module.
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
          <Link href="/">
            <Button variant="default" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">
              Sign Out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}