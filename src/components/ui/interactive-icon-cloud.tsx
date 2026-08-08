import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud"

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 0,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.08, -0.08],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.035,
    minSpeed: 0.015,
  },
}

export const renderCustomIcon = (icon: SimpleIcon, _theme: string) => {
  const bgHex = "#F2F2F2"
  const fallbackHex = "#171717"
  const minContrastRatio = 1.2

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 40,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  })
}

export type DynamicCloudProps = {
  iconSlugs: string[]
}

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>

// On touch devices (phones / small tablets) the cloud keeps spinning
// beautifully but pointer drag & click-to-front interactions are disabled,
// so users can scroll the page up and down without the globe stealing touches.
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)")
    const update = (matches: boolean) => setIsTouch(matches)
    update(query.matches)
    const listener = (e: MediaQueryListEvent) => update(e.matches)
    query.addEventListener("change", listener)
    return () => query.removeEventListener("change", listener)
  }, [])

  return isTouch
}

export function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null)
  const { theme } = useTheme()
  const isTouch = useIsTouchDevice()

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData)
  }, [iconSlugs])

  const renderedIcons = useMemo(() => {
    if (!data) return null

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon as SimpleIcon, theme || "light"),
    )
  }, [data, theme])

  const effectiveProps = useMemo(() => {
    if (!isTouch) return cloudProps
    return {
      ...cloudProps,
      containerProps: {
        style: {
          ...cloudProps.containerProps.style,
          touchAction: "pan-y",
        },
      },
      options: {
        ...cloudProps.options,
        dragControl: false,
        clickToFront: 0,
        tooltip: null as unknown as undefined,
      },
    }
  }, [isTouch])

  return (
    // @ts-ignore
    <Cloud key={isTouch ? "touch" : "mouse"} {...effectiveProps}>
      <>{renderedIcons}</>
    </Cloud>
  )
}
