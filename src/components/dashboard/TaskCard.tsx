"use client";

import { Calendar, LoaderCircle, MessageSquare, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const AVATARS = [
  {
    src: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    fallback: "CN",
    tooltip: "Shadcn",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
    fallback: "SK",
    tooltip: "Skyleen",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
    fallback: "AW",
    tooltip: "Adam Wathan",
  },
];

interface TaskCardProps {
  title?: string;
  description?: string;
  categories?: string[];
  date?: string;
  comments?: number;
  progress?: string;
}

export default function TaskCard({
  title = "Design system update",
  description = "Enhance design system for consistency and usability",
  categories = ["Design", "Marketing", "New Releases", "Design1", "Design2"],
  date = "Jan 25",
  comments = 4,
  progress = "1/4",
}: TaskCardProps) {
  return (
    <Card className="cursor-grab bg-muted py-4 transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="px-4 pb-3">
        <CardTitle className="flex justify-between text-base">
          {title}
          <SquarePen
            size={16}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          />
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {/* Category Badge */}
        <div className="flex flex-wrap gap-2 px-4">
          {categories.slice(0, 3).map((badge) => (
            <Badge key={badge} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
          {categories.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{categories.length - 3}
            </Badge>
          )}
        </div>
        <Separator className="my-4 border border-dashed bg-muted-foreground/40" />
        <div className="flex items-center justify-between">
          {/* Info Badge */}
          <div className="flex gap-2 px-4">
            <Button variant="secondary" size="sm" className="h-6 text-xs">
              <Calendar className="mr-1 h-3 w-3" />
              {date}
            </Button>
            <Button variant="secondary" size="sm" className="h-6 text-xs">
              <MessageSquare className="mr-1 h-3 w-3" />
              {comments}
            </Button>
            <Button variant="secondary" size="sm" className="h-6 text-xs">
              <LoaderCircle className="mr-1 h-3 w-3" />
              {progress}
            </Button>
          </div>
          {/* Avatars */}
          <div className="flex gap-1 pr-3">
            {AVATARS.slice(0, 2).map((avatar, index) => {
              if (AVATARS.length > 2 && index === 1) {
                return (
                  <Avatar key="more-count" className="size-7">
                    <AvatarFallback className="bg-accent text-xs">
                      +{AVATARS.length - 1}
                    </AvatarFallback>
                  </Avatar>
                );
              }

              // Otherwise show normal avatar
              return (
                <Avatar key={avatar.src} className="size-7">
                  <AvatarImage src={avatar.src} alt={avatar.tooltip} />
                  <AvatarFallback className="bg-accent text-xs">
                    CN
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
