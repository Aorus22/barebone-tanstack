import { useState, type ReactNode } from "react"
import { Check, Copy, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type ShowcaseSectionProps = {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  code: string
  knobs?: ReactNode
  children: ReactNode
}

export function ShowcaseSection({
  id,
  eyebrow,
  title,
  description,
  code,
  knobs,
  children,
}: ShowcaseSectionProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy code.")
    }
  }

  return (
    <section id={id} className="space-y-4 pt-6 first:pt-0">
      {/* Component Title & Header */}
      <div className="space-y-1 group/header">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground flex items-center gap-1.5">
            {id ? (
              <a href={`#${id}`} className="hover:underline flex items-center gap-1">
                {title}
                <span className="text-muted-foreground/0 group-hover/header:text-muted-foreground/60 transition-colors text-xs font-normal">
                  #
                </span>
              </a>
            ) : (
              title
            )}
          </h3>
          {eyebrow && (
            <Badge
              variant="outline"
              className="rounded-md px-1.5 py-0 text-[10px] font-medium uppercase tracking-wider bg-muted/40 text-muted-foreground border-border/60"
            >
              {eyebrow}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Showcase Card Wrapper */}
      <div className="rounded-xl border border-border/80 bg-background overflow-hidden shadow-xs">
        {/* Card Toolbar Header */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-2.5">
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/40">
            <button
              onClick={() => setActiveTab("preview")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                activeTab === "preview"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                activeTab === "code"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Code
            </button>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={handleCopy}
            className="gap-1.5 h-7 px-2.5 bg-background border-border/80 hover:bg-muted font-medium text-xs rounded-lg"
          >
            {isCopied ? (
              <>
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-muted-foreground" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>

        {/* Card Body */}
        {activeTab === "preview" ? (
          <div className="flex flex-col">
            {/* Live Preview Render Box */}
            <div className="flex min-h-[350px] items-center justify-center p-6 sm:p-10 bg-linear-to-br from-background via-muted/10 to-background bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px] overflow-auto">
              <div className="w-full max-w-lg flex justify-center py-4">
                {children}
              </div>
            </div>

            {/* Knobs Controls Panel underneath */}
            {knobs && (
              <div className="border-t border-border/60 bg-muted/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="size-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Options
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {knobs}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative max-h-[500px] overflow-auto bg-zinc-950 p-5 text-zinc-100 font-mono text-[11px] leading-relaxed selection:bg-zinc-800">
            <pre className="whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}
