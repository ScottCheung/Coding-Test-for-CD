/** @format */

// AFL venue coordinates mapping
export const venueCoordinates: Record<string, { lat: number; lng: number; city: string }> = {
  'MCG': { lat: -37.8200, lng: 144.9834, city: 'Melbourne' },
  'Marvel Stadium': { lat: -37.8164, lng: 144.9475, city: 'Melbourne' },
  'Adelaide Oval': { lat: -34.9155, lng: 138.5959, city: 'Adelaide' },
  'Optus Stadium': { lat: -31.9505, lng: 115.8890, city: 'Perth' },
  'SCG': { lat: -33.8915, lng: 151.2247, city: 'Sydney' },
  'Gabba': { lat: -27.4858, lng: 153.0381, city: 'Brisbane' },
  'GMHBA Stadium': { lat: -38.1580, lng: 144.3540, city: 'Geelong' },
  'TIO Stadium': { lat: -12.3714, lng: 130.8426, city: 'Darwin' },
  'Blundstone Arena': { lat: -42.8608, lng: 147.3389, city: 'Hobart' },
  'UTAS Stadium': { lat: -41.4332, lng: 147.1441, city: 'Launceston' },
  'Manuka Oval': { lat: -35.3197, lng: 149.1344, city: 'Canberra' },
  'Cazaly\'s Stadium': { lat: -16.9186, lng: 145.7781, city: 'Cairns' },
  'Metricon Stadium': { lat: -28.0023, lng: 153.4301, city: 'Gold Coast' },
  'TIO Traeger Park': { lat: -23.6980, lng: 133.8807, city: 'Alice Springs' },
  'Giants Stadium': { lat: -33.8486, lng: 151.0631, city: 'Sydney' },
  'Heritage Bank Stadium': { lat: -42.8608, lng: 147.3389, city: 'Hobart' },
  'Mars Stadium': { lat: -37.5622, lng: 143.8503, city: 'Ballarat' },
  'Norwood Oval': { lat: -34.9186, lng: 138.6267, city: 'Adelaide' },
  'People First Stadium': { lat: -28.0023, lng: 153.4301, city: 'Gold Coast' },
  'Riverway Stadium': { lat: -19.3089, lng: 146.7583, city: 'Townsville' },
};

// Get coordinates for a venue, with fallback to Melbourne
export function getVenueCoordinates(venueName: string): { lat: number; lng: number; city: string } {
  // Try exact match first
  if (venueCoordinates[venueName]) {
    return venueCoordinates[venueName];
  }
  
  // Try partial match
  const partialMatch = Object.keys(venueCoordinates).find(key => 
    venueName.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(venueName.toLowerCase())
  );
  
  if (partialMatch) {
    return venueCoordinates[partialMatch];
  }
  
  // Default to Melbourne (MCG)
  return { lat: -37.8200, lng: 144.9834, city: 'Melbourne' };
}
