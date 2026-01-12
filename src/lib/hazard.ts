export const HAZARD_RULES: Record<string, 'Low' | 'Medium' | 'High'> = {
  'Laptops': 'Medium',
  'Smartphones': 'Medium',
  'Monitors': 'Medium',
  'Batteries': 'High',
  'Appliances': 'Low',
  'Industrial': 'High',
  'Accessories': 'Low',
};

export function getHazardLevel(category: string): 'Low' | 'Medium' | 'High' {
  return HAZARD_RULES[category] || 'Low';
}
