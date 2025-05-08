declare module 'tailwindcss/lib/util/flattenColorPalette' {
  // Define a more specific type for the function instead of using 'any'
  const flattenColorPalette: <T>(colors: Record<string, T>) => Record<string, T>;
  export default flattenColorPalette;
}