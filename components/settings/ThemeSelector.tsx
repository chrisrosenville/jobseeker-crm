"use client";

import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [value, setValue] = useState<string>(theme || resolvedTheme || "light");

  useEffect(() => {
    setValue(theme || resolvedTheme || "light");
  }, [theme, resolvedTheme]);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose your preferred color scheme.</CardDescription>
      </CardHeader>
      <CardContent className="py-6">
        <div className="grid max-w-sm gap-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={value}
            onValueChange={(v) => {
              setValue(v);
              setTheme(v);
            }}
          >
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
