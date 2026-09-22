import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ChevronDownIcon,
  InformationCircleIcon,
  Moon02Icon,
  Sun03Icon,
} from '@hugeicons/core-free-icons'

type IconProps = {
  size?: number
  strokeWidth?: number
  className?: string
}

function Icon({
  icon,
  size = 16,
  strokeWidth = 1.75,
  className,
}: IconProps & { icon: typeof ArrowLeft01Icon }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  )
}

export function IconBack(props: IconProps) {
  return <Icon icon={ArrowLeft01Icon} {...props} />
}

export function IconArrowRight(props: IconProps) {
  return <Icon icon={ArrowRight01Icon} {...props} />
}

export function IconExternal(props: IconProps) {
  return <Icon icon={ArrowUpRight01Icon} {...props} />
}

export function IconChevronDown(props: IconProps) {
  return <Icon icon={ChevronDownIcon} {...props} />
}

export function IconInfo(props: IconProps) {
  return <Icon icon={InformationCircleIcon} size={props.size ?? 14} {...props} />
}

export function IconOk(props: IconProps) {
  return <Icon icon={CheckmarkCircle02Icon} size={props.size ?? 14} {...props} />
}

export function IconFail(props: IconProps) {
  return <Icon icon={Cancel01Icon} size={props.size ?? 14} {...props} />
}

export function IconSun(props: IconProps) {
  return <Icon icon={Sun03Icon} size={props.size ?? 16} {...props} />
}

export function IconMoon(props: IconProps) {
  return <Icon icon={Moon02Icon} size={props.size ?? 16} {...props} />
}
