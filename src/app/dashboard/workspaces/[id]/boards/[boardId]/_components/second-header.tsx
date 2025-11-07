import {
  AlignStartHorizontal,
  AudioLines,
  Calendar,
  Link,
  Rows3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup, AvatarGroupTooltip } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AVATARS = [
  {
    src: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    fallback: "CN",
    tooltip: "Shadcn",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg",
    fallback: "SK",
    tooltip: "Skyleen",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
    fallback: "AW",
    tooltip: "Adam Wathan",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg",
    fallback: "GR",
    tooltip: "Guillermo Rauch",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg",
    fallback: "JH",
    tooltip: "Jhey",
  },
];

export default function SecondHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b px-1.5 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) lg:px-3.5">
      <div/>
      <div className="flex items-center gap-2">
        <Label className="hidden lg:block">Last updated 3 days ago</Label>
        <AvatarGroup variant="motion" className="-space-x-3 h-12">
          {AVATARS.map((avatar) => (
            <Avatar
              key={avatar.src}
              className="size-8 border-3 border-background"
            >
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
              <AvatarGroupTooltip>
                <p>{avatar.tooltip}</p>
              </AvatarGroupTooltip>
            </Avatar>
          ))}
        </AvatarGroup>
        <Button variant="secondary" size="sm">
          <Link />
          Share
        </Button>
      </div>
    </header>
  );
}
