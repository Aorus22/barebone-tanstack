export type ComponentCatalogGroup = {
  title: string
  description: string
  items: string[]
}

export const componentCatalogGroups: ComponentCatalogGroup[] = [
  {
    title: "Actions",
    description: "Call-to-action, quick trigger, dan grouped actions.",
    items: ["button", "button-group", "toggle", "toggle-group", "pagination"],
  },
  {
    title: "Forms",
    description: "Input dasar, pilihan, dan field untuk alur create/edit.",
    items: [
      "checkbox",
      "combobox",
      "date-picker",
      "field",
      "input",
      "input-group",
      "input-otp",
      "label",
      "native-select",
      "radio-group",
      "select",
      "slider",
      "switch",
      "textarea",
    ],
  },
  {
    title: "Surface",
    description: "Container dan area konten untuk blok UI yang lebih besar.",
    items: [
      "accordion",
      "alert",
      "aspect-ratio",
      "avatar",
      "badge",
      "card",
      "carousel",
      "empty",
      "hover-card",
      "item",
      "separator",
      "skeleton",
      "spinner",
      "table",
    ],
  },
  {
    title: "Navigation",
    description: "Struktur untuk orientasi user dan perpindahan antar area.",
    items: [
      "breadcrumb",
      "command",
      "context-menu",
      "dropdown-menu",
      "menubar",
      "navigation-menu",
      "sidebar",
      "tabs",
    ],
  },
  {
    title: "Overlay",
    description: "Komponen floating, modal, dan panel interaktif.",
    items: [
      "alert-dialog",
      "dialog",
      "drawer",
      "file-preview",
      "popover",
      "sheet",
      "tooltip",
    ],
  },
  {
    title: "Utilities",
    description: "Pendukung layout, motion, dan visualisasi data.",
    items: ["calendar", "chart", "direction", "kbd", "progress", "resizable", "scroll-area", "sonner"],
  },
]

export const showcasedComponents = [
  "button",
  "badge",
  "card",
  "input",
  "textarea",
  "checkbox",
  "switch",
  "select",
  "tabs",
  "accordion",
  "alert",
  "dialog",
  "table",
  "separator",
] as const
