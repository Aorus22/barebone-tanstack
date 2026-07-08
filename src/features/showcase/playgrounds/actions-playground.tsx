import { Bold, Italic, Underline, Sparkles, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { ShowcaseSection } from "../showcase-section"

export function ButtonPlayground() {
  const defaultCode = `import { Button } from "@/components/ui/button"

<Button>Button</Button>`

  const secondaryCode = `import { Button } from "@/components/ui/button"

<Button variant="secondary">Secondary</Button>`

  const destructiveCode = `import { Button } from "@/components/ui/button"

<Button variant="destructive">Destructive</Button>`

  const outlineCode = `import { Button } from "@/components/ui/button"

<Button variant="outline">Outline</Button>`

  const ghostCode = `import { Button } from "@/components/ui/button"

<Button variant="ghost">Ghost</Button>`

  const linkCode = `import { Button } from "@/components/ui/button"

<Button variant="link">Link</Button>`

  const iconCode = `import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

<Button size="icon">
  <Sparkles className="size-4" />
</Button>`

  const withIconCode = `import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

<Button>
  <Sparkles className="size-4 mr-2" /> With Icon
</Button>`

  const loadingCode = `import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

<Button disabled>
  <Loader2 className="size-4 animate-spin mr-2" /> Please wait
</Button>`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#secondary" className="hover:text-foreground hover:underline transition-colors">• Secondary</a>
        <a href="#destructive" className="hover:text-foreground hover:underline transition-colors">• Destructive</a>
        <a href="#outline" className="hover:text-foreground hover:underline transition-colors">• Outline</a>
        <a href="#ghost" className="hover:text-foreground hover:underline transition-colors">• Ghost</a>
        <a href="#link" className="hover:text-foreground hover:underline transition-colors">• Link</a>
        <a href="#icon" className="hover:text-foreground hover:underline transition-colors">• Icon Only</a>
        <a href="#with-icon" className="hover:text-foreground hover:underline transition-colors">• With Icon</a>
        <a href="#loading" className="hover:text-foreground hover:underline transition-colors">• Loading State</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Actions"
        title="Default"
        description="The primary button component style."
        code={defaultCode}
      >
        <Button>Button</Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="secondary"
        eyebrow="Actions"
        title="Secondary"
        description="A secondary button component style."
        code={secondaryCode}
      >
        <Button variant="secondary">Secondary</Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="destructive"
        eyebrow="Actions"
        title="Destructive"
        description="A button style designed to indicate actions that delete or destroy data."
        code={destructiveCode}
      >
        <Button variant="destructive">Destructive</Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="outline"
        eyebrow="Actions"
        title="Outline"
        description="A border-only button variant."
        code={outlineCode}
      >
        <Button variant="outline">Outline</Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="ghost"
        eyebrow="Actions"
        title="Ghost"
        description="A clean text-only button with background hover transitions."
        code={ghostCode}
      >
        <Button variant="ghost">Ghost</Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="link"
        eyebrow="Actions"
        title="Link"
        description="A button style styled as an inline link."
        code={linkCode}
      >
        <Button variant="link">Link</Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="icon"
        eyebrow="Actions"
        title="Icon Only"
        description="A square button optimized for rendering standalone icons."
        code={iconCode}
      >
        <Button size="icon">
          <Sparkles className="size-4" />
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="with-icon"
        eyebrow="Actions"
        title="With Icon"
        description="A button component incorporating an icon alongside text."
        code={withIconCode}
      >
        <Button>
          <Sparkles className="size-4 mr-2" /> With Icon
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        id="loading"
        eyebrow="Actions"
        title="Loading State"
        description="A disabled button displaying a spinning loading spinner."
        code={loadingCode}
      >
        <Button disabled>
          <Loader2 className="size-4 animate-spin mr-2" /> Please wait
        </Button>
      </ShowcaseSection>
    </div>
  )
}

export function ButtonGroupPlayground() {
  const horizontalCode = `import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

<ButtonGroup orientation="horizontal">
  <Button variant="outline">Year</Button>
  <Button variant="outline">Month</Button>
  <Button variant="outline">Week</Button>
  <Button>Day</Button>
</ButtonGroup>`

  const verticalCode = `import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

<ButtonGroup orientation="vertical">
  <Button variant="outline">Year</Button>
  <Button variant="outline">Month</Button>
  <Button variant="outline">Week</Button>
  <Button>Day</Button>
</ButtonGroup>`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#horizontal" className="hover:text-foreground hover:underline transition-colors">Horizontal</a>
        <a href="#vertical" className="hover:text-foreground hover:underline transition-colors">• Vertical</a>
      </div>

      <ShowcaseSection
        id="horizontal"
        eyebrow="Actions"
        title="Horizontal"
        description="Groups multiple buttons together horizontally as a unified control set."
        code={horizontalCode}
      >
        <ButtonGroup orientation="horizontal">
          <Button variant="outline">Year</Button>
          <Button variant="outline">Month</Button>
          <Button variant="outline">Week</Button>
          <Button>Day</Button>
        </ButtonGroup>
      </ShowcaseSection>

      <ShowcaseSection
        id="vertical"
        eyebrow="Actions"
        title="Vertical"
        description="Groups multiple buttons vertically to form structured vertical toolbars."
        code={verticalCode}
      >
        <ButtonGroup orientation="vertical">
          <Button variant="outline" className="w-28 justify-center">Year</Button>
          <Button variant="outline" className="w-28 justify-center">Month</Button>
          <Button variant="outline" className="w-28 justify-center">Week</Button>
          <Button className="w-28 justify-center">Day</Button>
        </ButtonGroup>
      </ShowcaseSection>
    </div>
  )
}

export function TogglePlayground() {
  const defaultCode = `import { Toggle } from "@/components/ui/toggle"
import { Bold } from "lucide-react"

<Toggle aria-label="Toggle bold">
  <Bold className="size-4" />
</Toggle>`

  const outlineCode = `import { Toggle } from "@/components/ui/toggle"
import { Bold } from "lucide-react"

<Toggle variant="outline" aria-label="Toggle bold">
  <Bold className="size-4" />
</Toggle>`

  const sizeCode = `import { Toggle } from "@/components/ui/toggle"
import { Bold } from "lucide-react"

<Toggle size="sm" aria-label="Toggle bold">
  <Bold className="size-3.5" />
</Toggle>`

  const disabledCode = `import { Toggle } from "@/components/ui/toggle"
import { Bold } from "lucide-react"

<Toggle disabled aria-label="Toggle bold">
  <Bold className="size-4" />
</Toggle>`

  const withTextCode = `import { Toggle } from "@/components/ui/toggle"
import { Sparkles } from "lucide-react"

<Toggle aria-label="Toggle spark">
  <Sparkles className="size-4 mr-2" /> Spark
</Toggle>`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#outline" className="hover:text-foreground hover:underline transition-colors">• Outline</a>
        <a href="#size" className="hover:text-foreground hover:underline transition-colors">• Small Size</a>
        <a href="#with-text" className="hover:text-foreground hover:underline transition-colors">• With Text</a>
        <a href="#disabled" className="hover:text-foreground hover:underline transition-colors">• Disabled</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Actions"
        title="Default"
        description="A default transparent background two-state toggle."
        code={defaultCode}
      >
        <Toggle aria-label="Toggle bold">
          <Bold className="size-4" />
        </Toggle>
      </ShowcaseSection>

      <ShowcaseSection
        id="outline"
        eyebrow="Actions"
        title="Outline"
        description="An outline variant of the toggle."
        code={outlineCode}
      >
        <Toggle variant="outline" aria-label="Toggle bold">
          <Bold className="size-4" />
        </Toggle>
      </ShowcaseSection>

      <ShowcaseSection
        id="size"
        eyebrow="Actions"
        title="Small Size"
        description="A small size variant of the toggle."
        code={sizeCode}
      >
        <Toggle size="sm" aria-label="Toggle bold">
          <Bold className="size-3.5" />
        </Toggle>
      </ShowcaseSection>

      <ShowcaseSection
        id="with-text"
        eyebrow="Actions"
        title="With Text"
        description="A toggle component incorporating text along with its icon."
        code={withTextCode}
      >
        <Toggle aria-label="Toggle spark">
          <Sparkles className="size-4 mr-2" /> Spark
        </Toggle>
      </ShowcaseSection>

      <ShowcaseSection
        id="disabled"
        eyebrow="Actions"
        title="Disabled"
        description="A toggle component blocked from user interaction."
        code={disabledCode}
      >
        <Toggle disabled aria-label="Toggle bold">
          <Bold className="size-4" />
        </Toggle>
      </ShowcaseSection>
    </div>
  )
}

export function ToggleGroupPlayground() {
  const defaultCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

<ToggleGroup type="multiple">
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    <Underline className="size-4" />
  </ToggleGroupItem>
</ToggleGroup>`

  const outlineCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

<ToggleGroup type="multiple" variant="outline">
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    <Underline className="size-4" />
  </ToggleGroupItem>
</ToggleGroup>`

  const singleCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

<ToggleGroup type="single">
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    <Underline className="size-4" />
  </ToggleGroupItem>
</ToggleGroup>`

  const sizeCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

<ToggleGroup type="multiple" size="sm">
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold className="size-3.5" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic className="size-3.5" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    <Underline className="size-3.5" />
  </ToggleGroupItem>
</ToggleGroup>`

  const verticalCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

<ToggleGroup type="multiple" orientation="vertical">
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    <Underline className="size-4" />
  </ToggleGroupItem>
</ToggleGroup>`

  const disabledCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

<ToggleGroup type="multiple" disabled>
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    <Bold className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    <Italic className="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    <Underline className="size-4" />
  </ToggleGroupItem>
</ToggleGroup>`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#outline" className="hover:text-foreground hover:underline transition-colors">• Outline</a>
        <a href="#single" className="hover:text-foreground hover:underline transition-colors">• Single Select</a>
        <a href="#size" className="hover:text-foreground hover:underline transition-colors">• Small Size</a>
        <a href="#vertical" className="hover:text-foreground hover:underline transition-colors">• Vertical</a>
        <a href="#disabled" className="hover:text-foreground hover:underline transition-colors">• Disabled</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Actions"
        title="Default"
        description="A default multiple-selection toggle group."
        code={defaultCode}
      >
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ShowcaseSection>

      <ShowcaseSection
        id="outline"
        eyebrow="Actions"
        title="Outline"
        description="Use the outline variant for toggle items."
        code={outlineCode}
      >
        <ToggleGroup type="multiple" variant="outline">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ShowcaseSection>

      <ShowcaseSection
        id="single"
        eyebrow="Actions"
        title="Single Select"
        description="Use type='single' to allow only one toggle item to be selected at a time."
        code={singleCode}
      >
        <ToggleGroup type="single" defaultValue="bold">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ShowcaseSection>

      <ShowcaseSection
        id="size"
        eyebrow="Actions"
        title="Small Size"
        description="Use the size='sm' prop to render small toggle group items."
        code={sizeCode}
      >
        <ToggleGroup type="multiple" size="sm">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="size-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ShowcaseSection>

      <ShowcaseSection
        id="vertical"
        eyebrow="Actions"
        title="Vertical Orientation"
        description="Use the orientation='vertical' prop to align toggle items vertically."
        code={verticalCode}
      >
        <ToggleGroup type="multiple" orientation="vertical">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ShowcaseSection>

      <ShowcaseSection
        id="disabled"
        eyebrow="Actions"
        title="Disabled"
        description="Use the disabled prop to prevent interaction with the toggle group items."
        code={disabledCode}
      >
        <ToggleGroup type="multiple" disabled>
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </ShowcaseSection>
    </div>
  )
}

export function BadgePlayground() {
  const defaultCode = `import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>`

  const secondaryCode = `import { Badge } from "@/components/ui/badge"

<Badge variant="secondary">Secondary</Badge>`

  const outlineCode = `import { Badge } from "@/components/ui/badge"

<Badge variant="outline">Outline</Badge>`

  const destructiveCode = `import { Badge } from "@/components/ui/badge"

<Badge variant="destructive">Destructive</Badge>`

  return (
    <div className="space-y-12">
      {/* Table of Contents */}
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#default" className="hover:text-foreground hover:underline transition-colors">Default</a>
        <a href="#secondary" className="hover:text-foreground hover:underline transition-colors">• Secondary</a>
        <a href="#outline" className="hover:text-foreground hover:underline transition-colors">• Outline</a>
        <a href="#destructive" className="hover:text-foreground hover:underline transition-colors">• Destructive</a>
      </div>

      <ShowcaseSection
        id="default"
        eyebrow="Actions"
        title="Default"
        description="A default status badge indicator."
        code={defaultCode}
      >
        <Badge>Default</Badge>
      </ShowcaseSection>

      <ShowcaseSection
        id="secondary"
        eyebrow="Actions"
        title="Secondary"
        description="A secondary status badge variant."
        code={secondaryCode}
      >
        <Badge variant="secondary">Secondary</Badge>
      </ShowcaseSection>

      <ShowcaseSection
        id="outline"
        eyebrow="Actions"
        title="Outline"
        description="A border-only status badge variant."
        code={outlineCode}
      >
        <Badge variant="outline">Outline</Badge>
      </ShowcaseSection>

      <ShowcaseSection
        id="destructive"
        eyebrow="Actions"
        title="Destructive"
        description="A badge variant indicating warnings or system delete errors."
        code={destructiveCode}
      >
        <Badge variant="destructive">Destructive</Badge>
      </ShowcaseSection>
    </div>
  )
}
