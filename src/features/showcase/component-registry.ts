import {
  ButtonPlayground,
  ButtonGroupPlayground,
  TogglePlayground,
  ToggleGroupPlayground,
  BadgePlayground,
} from "./playgrounds/actions-playground"
import {
  InputPlayground,
  FieldPlayground,
  CheckboxSwitchPlayground,
  SelectPlayground,
  DatePickerPlayground,
  SliderPlayground,
} from "./playgrounds/forms-playground"
import { ComboboxPlayground } from "./playgrounds/combobox-playground"
import {
  DialogPlayground,
  ConfirmModalPlayground,
  SonnerPlayground,
  SheetPlayground,
  TooltipPlayground,
  AlertDialogPlayground,
  DrawerPlayground,
  PopoverPlayground,
} from "./playgrounds/feedback-playground"
import { FilePreviewPlayground } from "./playgrounds/global-playground"
import {
  AccordionPlayground,
  TabsPlayground,
  TablePlayground,
  CarouselPlayground,
  ProgressPlayground,
  SkeletonPlayground,
} from "./playgrounds/data-playground"
import { ChartsPlayground } from "./playgrounds/charts-playground"

export type ComponentDetail = {
  id: string
  label: string
  description: string
  playground: React.ComponentType
}

export type CategoryGroup = {
  group: string
  items: ComponentDetail[]
}

export const componentRegistry: CategoryGroup[] = [
  {
    group: "Actions",
    items: [
      { id: "button", label: "Button", description: "Interactive button trigger supporting multiple sizes, states, and variants.", playground: ButtonPlayground },
      { id: "button-group", label: "Button Group", description: "Aligns multiple buttons in horizontal or vertical unified groups.", playground: ButtonGroupPlayground },
      { id: "toggle", label: "Toggle", description: "A two-state button commonly used for active or inactive binary settings.", playground: TogglePlayground },
      { id: "toggle-group", label: "Toggle Group", description: "Group of buttons where only one or multiple can be active.", playground: ToggleGroupPlayground },
      { id: "badge", label: "Badge", description: "Small counter or status indicator displaying brief metadata labels.", playground: BadgePlayground },
    ]
  },
  {
    group: "Forms",
    items: [
      { id: "input", label: "Input & Groups", description: "Single-line fields supporting inline prefixes, suffixes, and passwords.", playground: InputPlayground },
      { id: "field", label: "Field Helper", description: "Standardizes label text, description helpers, and form validation error slots.", playground: FieldPlayground },
      { id: "checkbox-switch", label: "Checkbox & Switch", description: "Interactive binary options trigger. Toggle state displays alert toasts.", playground: CheckboxSwitchPlayground },
      { id: "select", label: "Select Dropdown", description: "Radix-wrapped dropdown menus to choose values from options lists.", playground: SelectPlayground },
      { id: "date-picker", label: "Date Picker", description: "Calendar popovers allowing selections of specific calendar dates.", playground: DatePickerPlayground },
      { id: "slider", label: "Slider Scale", description: "Range tracks allowing users to slide and specify numeric scale inputs.", playground: SliderPlayground },
      { id: "combobox", label: "Searchable Select (Combobox)", description: "Combobox inputs supporting single searchable dropdown selection or multi-select with chips.", playground: ComboboxPlayground },
    ]
  },
  {
    group: "Feedback",
    items: [
      { id: "dialog", label: "Dialog Modal", description: "Standard overlays to focus user tasks inside floating modal contexts.", playground: DialogPlayground },
      { id: "confirm-modal", label: "Confirm Helper", description: "A promise-based modal helper triggered directly from typescript callbacks.", playground: ConfirmModalPlayground },
      { id: "sonner", label: "Sonner Toast", description: "Lightweight popup alerts notifying user status in corner screens.", playground: SonnerPlayground },
      { id: "sheet", label: "Sheet Panel", description: "Slide-out navigation drawers from top, right, bottom, or left screens.", playground: SheetPlayground },
      { id: "tooltip", label: "Tooltip Info", description: "Floating advice popups appearing upon trigger element hovers.", playground: TooltipPlayground },
      { id: "alert-dialog", label: "Alert Dialog", description: "Action-blocking modals requiring explicit confirmations from users.", playground: AlertDialogPlayground },
      { id: "drawer", label: "Drawer Mobile", description: "Touch-optimized bottom sheet sliding overlays for touch screens.", playground: DrawerPlayground },
      { id: "popover", label: "Popover Card", description: "Floating cards displaying informational widgets when clicked.", playground: PopoverPlayground },
      { id: "file-preview", label: "File Preview", description: "Global preview helpers for images, PDFs, DOCX files, and attachment rows.", playground: FilePreviewPlayground },
    ]
  },
  {
    group: "Data & Surface",
    items: [
      { id: "accordion", label: "Accordion", description: "Vertically stacked headers collapsing and expanding detail contents.", playground: AccordionPlayground },
      { id: "tabs", label: "Tabs Switcher", description: "Organized content blocks divided into tabbed categories.", playground: TabsPlayground },
      { id: "table", label: "Table Grid", description: "Clean data displays built on table headers and responsive row outlines.", playground: TablePlayground },
      { id: "carousel", label: "Carousel Slider", description: "Horizontal swipe sliders powered by Embla motion transitions.", playground: CarouselPlayground },
      { id: "progress", label: "Progress Track", description: "Linear status progress bars indicating load or process metrics.", playground: ProgressPlayground },
      { id: "skeleton", label: "Skeleton Loader", description: "Placeholder layout pulsing elements indicating loading contents.", playground: SkeletonPlayground },
    ]
  },
  {
    group: "Utilities",
    items: [
      { id: "charts", label: "Visual Charts", description: "Responsive line, area, and bar charts powered by Recharts.", playground: ChartsPlayground },
    ]
  }
]
