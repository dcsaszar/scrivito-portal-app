export function alignmentClassName(
  widgetAlignment: string | null,
): string | undefined {
  if (widgetAlignment === 'center') return 'text-center'
  if (widgetAlignment === 'right') return 'text-end'
}

export function alignmentClassNameWithBlock(
  widgetAlignment: string | null,
): string | undefined {
  if (widgetAlignment === 'block') return 'btn-block'
  return alignmentClassName(widgetAlignment)
}
