import { useState } from "react"
import { AlertCircle, HelpCircle, Bell, AlignRight, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { ShowcaseSection } from "../showcase-section"
import { confirmModal } from "@/lib/client/confirm-modal"

export function DialogPlayground() {
  const [showCloseButton, setShowCloseButton] = useState(true)

  const code = `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update Profile Details</DialogTitle>
      <DialogDescription>
        Make changes to your profile info here. Click save when done.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4 text-sm text-muted-foreground">
      [Form content can go here]
    </div>
    <DialogFooter showCloseButton={${showCloseButton}}>
      <Button>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`

  return (
    <ShowcaseSection
      id="dialog"
      eyebrow="Feedback"
      title="Dialog / Modal"
      description="Interactive modal dialog overlay to focus user attention on forms, validation choices, or specific actions."
      code={code}
      knobs={
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Show Close Button</span>
          <input
            type="checkbox"
            checked={showCloseButton}
            onChange={(e) => setShowCloseButton(e.target.checked)}
            className="h-4 w-4 rounded-sm border-border bg-background accent-primary"
          />
        </div>
      }
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Details</DialogTitle>
            <DialogDescription>
              Make changes to your profile info here. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground border border-dashed border-border rounded-xl p-4 text-center">
            Form content or parameters go inside this content area.
          </div>
          <DialogFooter showCloseButton={showCloseButton}>
            <Button onClick={() => toast.success("Profile saved!")}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ShowcaseSection>
  )
}

export function ConfirmModalPlayground() {
  const handleTriggerConfirm = async () => {
    const confirmed = await confirmModal("Are you sure you want to permanently delete this system database? This action is irreversible.", {
      title: "Confirm Database Deletion",
      description: "Delete database production_main",
      confirmText: "Yes, Delete It",
      cancelText: "Cancel",
      destructive: true,
    })

    if (confirmed) {
      toast.success("Database successfully deleted! (Demo simulation)")
    } else {
      toast.info("Deletion canceled.")
    }
  }

  const code = `import { confirmModal } from "@/lib/client/confirm-modal"
import { toast } from "sonner"

const handleDelete = async () => {
  const confirmed = await confirmModal(
    "Are you sure you want to permanently delete this database?",
    {
      title: "Confirm Database Deletion",
      confirmText: "Yes, Delete It",
      cancelText: "Cancel",
      destructive: true,
    }
  )

  if (confirmed) {
    toast.success("Database deleted!")
  }
}`

  return (
    <ShowcaseSection
      id="confirm-modal"
      eyebrow="Feedback"
      title="Global Confirm Modal Helper"
      description="Demonstrates the custom confirm modal system built into the barebone template. Triggers a promise-based modal directly from typescript code."
      code={code}
    >
      <div className="flex flex-col items-center gap-3">
        <Button variant="destructive" onClick={handleTriggerConfirm} className="gap-1.5">
          <AlertCircle className="size-4" />
          Trigger Confirm Modal
        </Button>
        <span className="text-xs text-muted-foreground text-center">
          Uses <code className="font-semibold bg-muted px-1.5 py-0.5 rounded">ConfirmModalProvider</code> injected at root layout.
        </span>
      </div>
    </ShowcaseSection>
  )
}

export function SonnerPlayground() {
  const successCode = `import { toast } from "sonner"

toast.success("Workspace created successfully!", {
  description: "Your new dev-environment is ready.",
})`

  const infoCode = `import { toast } from "sonner"

toast.info("New software update available.", {
  description: "Version 2.4.0 is now live for download.",
})`

  const warningCode = `import { toast } from "sonner"

toast.warning("Low memory warning.", {
  description: "Database is running close to its limits.",
})`

  const errorCode = `import { toast } from "sonner"

toast.error("Deployment failed.", {
  description: "Server responded with status code 500.",
})`

  const actionCode = `import { toast } from "sonner"

toast("Message sent.", {
  description: "Sent to agent client-1024.",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo action triggered"),
  },
})`

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#sonner-success" className="hover:text-foreground hover:underline transition-colors">Success</a>
        <a href="#sonner-info" className="hover:text-foreground hover:underline transition-colors">• Info</a>
        <a href="#sonner-warning" className="hover:text-foreground hover:underline transition-colors">• Warning</a>
        <a href="#sonner-error" className="hover:text-foreground hover:underline transition-colors">• Error</a>
        <a href="#sonner-action" className="hover:text-foreground hover:underline transition-colors">• With Action</a>
      </div>

      <ShowcaseSection
        id="sonner-success"
        eyebrow="Feedback"
        title="Success Toast"
        description="Confirms a completed operation with a green accent notification."
        code={successCode}
      >
        <Button onClick={() => toast.success("Workspace created successfully!", {
          description: "Your new dev-environment is ready.",
        })} className="gap-2">
          <Bell className="size-4" />
          Trigger Success Toast
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="sonner-info"
        eyebrow="Feedback"
        title="Info Toast"
        description="Provides neutral informational alerts to the user."
        code={infoCode}
      >
        <Button onClick={() => toast.info("New software update available.", {
          description: "Version 2.4.0 is now live for download.",
        })} variant="outline" className="gap-2">
          <Bell className="size-4" />
          Trigger Info Toast
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="sonner-warning"
        eyebrow="Feedback"
        title="Warning Toast"
        description="Alerts the user about potential issues before they escalate."
        code={warningCode}
      >
        <Button onClick={() => toast.warning("Low memory warning.", {
          description: "Database is running close to its limits.",
        })} variant="outline" className="gap-2">
          <Bell className="size-4" />
          Trigger Warning Toast
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="sonner-error"
        eyebrow="Feedback"
        title="Error Toast"
        description="Reports a failed operation with a red accent notification."
        code={errorCode}
      >
        <Button onClick={() => toast.error("Deployment failed.", {
          description: "Server responded with status code 500.",
        })} variant="destructive" className="gap-2">
          <Bell className="size-4" />
          Trigger Error Toast
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="sonner-action"
        eyebrow="Feedback"
        title="With Action (Undo)"
        description="Shows a toast with an interactive action button for undo operations."
        code={actionCode}
      >
        <Button onClick={() => toast("Message sent.", {
          description: "Sent to agent client-1024.",
          action: {
            label: "Undo",
            onClick: () => toast.success("Message recalled!"),
          },
        })} variant="outline" className="gap-2">
          <Bell className="size-4" />
          Trigger Action Toast
        </Button>
      </ShowcaseSection>
    </div>
  )
}

export function SheetPlayground() {
  const rightCode = `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Right Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Navigation Menu</SheetTitle>
      <SheetDescription>Explore project sections.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`

  const leftCode = `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Left Sheet</Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Navigation Menu</SheetTitle>
      <SheetDescription>Explore project sections.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`

  const topCode = `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Top Sheet</Button>
  </SheetTrigger>
  <SheetContent side="top">
    <SheetHeader>
      <SheetTitle>Navigation Menu</SheetTitle>
      <SheetDescription>Explore project sections.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`

  const bottomCode = `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Bottom Sheet</Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>Navigation Menu</SheetTitle>
      <SheetDescription>Explore project sections.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#sheet-right" className="hover:text-foreground hover:underline transition-colors">Right</a>
        <a href="#sheet-left" className="hover:text-foreground hover:underline transition-colors">• Left</a>
        <a href="#sheet-top" className="hover:text-foreground hover:underline transition-colors">• Top</a>
        <a href="#sheet-bottom" className="hover:text-foreground hover:underline transition-colors">• Bottom</a>
      </div>

      <ShowcaseSection
        id="sheet-right"
        eyebrow="Feedback"
        title="Sheet Right"
        description="Slide-out panel from the right side — the standard placement for navigation drawers."
        code={rightCode}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <AlignRight className="size-4" />
              Open Sheet (Right)
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                This is a sheet sliding from the right side. Great for drawer menus, sidebar configs, and filters.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-4 flex flex-col gap-3">
              {["Getting Started", "Component Showcase", "Installed packages", "Security configuration"].map((text) => (
                <Button key={text} variant="ghost" className="justify-start text-sm">
                  {text}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>

      <ShowcaseSection
        id="sheet-left"
        eyebrow="Feedback"
        title="Sheet Left"
        description="Slide-out panel from the left side, suitable for menus or navigation lists."
        code={leftCode}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <AlignRight className="size-4" />
              Open Sheet (Left)
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                This is a sheet sliding from the left side. Great for drawer menus, sidebar configs, and filters.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-4 flex flex-col gap-3">
              {["Getting Started", "Component Showcase", "Installed packages", "Security configuration"].map((text) => (
                <Button key={text} variant="ghost" className="justify-start text-sm">
                  {text}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>

      <ShowcaseSection
        id="sheet-top"
        eyebrow="Feedback"
        title="Sheet Top"
        description="Slide-down panel from the top edge, useful for alerts or command palettes."
        code={topCode}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <AlignRight className="size-4" />
              Open Sheet (Top)
            </Button>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                This is a sheet sliding from the top side. Great for drawer menus, sidebar configs, and filters.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-4 flex flex-col gap-3">
              {["Getting Started", "Component Showcase", "Installed packages", "Security configuration"].map((text) => (
                <Button key={text} variant="ghost" className="justify-start text-sm">
                  {text}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>

      <ShowcaseSection
        id="sheet-bottom"
        eyebrow="Feedback"
        title="Sheet Bottom"
        description="Slide-up panel from the bottom edge, common for mobile-friendly actions or filters."
        code={bottomCode}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-1.5">
              <AlignRight className="size-4" />
              Open Sheet (Bottom)
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                This is a sheet sliding from the bottom side. Great for drawer menus, sidebar configs, and filters.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-4 flex flex-col gap-3">
              {["Getting Started", "Component Showcase", "Installed packages", "Security configuration"].map((text) => (
                <Button key={text} variant="ghost" className="justify-start text-sm">
                  {text}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </ShowcaseSection>
    </div>
  )
}

export function TooltipPlayground() {
  const topCode = `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover</Button>
    </TooltipTrigger>
    <TooltipContent side="top">
      Useful information block.
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`

  const bottomCode = `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover</Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      Useful information block.
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`

  const leftCode = `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover</Button>
    </TooltipTrigger>
    <TooltipContent side="left">
      Useful information block.
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`

  const rightCode = `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover</Button>
    </TooltipTrigger>
    <TooltipContent side="right">
      Useful information block.
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#tooltip-top" className="hover:text-foreground hover:underline transition-colors">Top</a>
        <a href="#tooltip-bottom" className="hover:text-foreground hover:underline transition-colors">• Bottom</a>
        <a href="#tooltip-left" className="hover:text-foreground hover:underline transition-colors">• Left</a>
        <a href="#tooltip-right" className="hover:text-foreground hover:underline transition-colors">• Right</a>
      </div>

      <ShowcaseSection
        id="tooltip-top"
        eyebrow="Feedback"
        title="Tooltip Top"
        description="Help text appearing above the trigger element on hover or focus."
        code={topCode}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="gap-2">
                <HelpCircle className="size-4 text-muted-foreground" />
                Hover (Top)
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="font-semibold text-xs flex items-center gap-1.5">
                <Info className="size-3.5" />
                Tip: Press `Cmd+K` to search anything
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ShowcaseSection>

      <ShowcaseSection
        id="tooltip-bottom"
        eyebrow="Feedback"
        title="Tooltip Bottom"
        description="Help text appearing below the trigger element on hover or focus."
        code={bottomCode}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="gap-2">
                <HelpCircle className="size-4 text-muted-foreground" />
                Hover (Bottom)
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="font-semibold text-xs flex items-center gap-1.5">
                <Info className="size-3.5" />
                Tip: Press `Cmd+K` to search anything
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ShowcaseSection>

      <ShowcaseSection
        id="tooltip-left"
        eyebrow="Feedback"
        title="Tooltip Left"
        description="Help text appearing to the left side of the trigger element on hover or focus."
        code={leftCode}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="gap-2">
                <HelpCircle className="size-4 text-muted-foreground" />
                Hover (Left)
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <span className="font-semibold text-xs flex items-center gap-1.5">
                <Info className="size-3.5" />
                Tip: Press `Cmd+K` to search anything
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ShowcaseSection>

      <ShowcaseSection
        id="tooltip-right"
        eyebrow="Feedback"
        title="Tooltip Right"
        description="Help text appearing to the right side of the trigger element on hover or focus."
        code={rightCode}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="gap-2">
                <HelpCircle className="size-4 text-muted-foreground" />
                Hover (Right)
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span className="font-semibold text-xs flex items-center gap-1.5">
                <Info className="size-3.5" />
                Tip: Press `Cmd+K` to search anything
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ShowcaseSection>
    </div>
  )
}

export function AlertDialogPlayground() {
  const code = `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Open Alert Dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`

  return (
    <ShowcaseSection
      id="alert-dialog"
      eyebrow="Feedback"
      title="Alert Dialog"
      description="A modal dialog that interrupts the user with urgent content and expects an explicit confirmation."
      code={code}
    >
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Open Alert Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => toast.success("Account deleted.")}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ShowcaseSection>
  )
}

export function DrawerPlayground() {
  const code = `<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Mobile Configurations</DrawerTitle>
      <DrawerDescription>Adjust parameters directly.</DrawerDescription>
    </DrawerHeader>
  </DrawerContent>
</Drawer>`

  return (
    <ShowcaseSection
      id="drawer"
      eyebrow="Feedback"
      title="Drawer"
      description="A drawer component for mobile-first overlay content, sliding up from the bottom of the screen."
      code={code}
    >
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle>Mobile Configurations</DrawerTitle>
            <DrawerDescription>Adjust parameters directly on your screen.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 border-t border-border mt-2 space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Drawers are optimized for mobile touch interaction (swipe to close).
            </p>
            <Button className="w-full" onClick={() => toast.success("Configurations saved!")}>
              Save Settings
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </ShowcaseSection>
  )
}

export function PopoverPlayground() {
  const code = `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Settings</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="grid gap-4">
      {/* Settings Form */}
    </div>
  </PopoverContent>
</Popover>`

  return (
    <ShowcaseSection
      id="popover"
      eyebrow="Feedback"
      title="Popover"
      description="Displays rich content in a portal, triggered by a button click, aligning to the target trigger."
      code={code}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Show Info Card</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Connection Info</h4>
              <p className="text-sm text-muted-foreground font-normal">
                Manage your server endpoints here.
              </p>
            </div>
            <div className="grid gap-2 border-t pt-2">
              <div className="flex items-center justify-between text-xs">
                <span>Status:</span>
                <Badge variant="secondary">Connected</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Host:</span>
                <span className="font-mono text-muted-foreground">127.0.0.1:3000</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </ShowcaseSection>
  )
}
