/**
 * Destinations and ports for Total Price Calculator.
 * Shipping in USD: RORO typically cheaper than Container.
 */

export interface Port {
  id: string;
  label: string;
}

export interface Destination {
  id: string;
  label: string;
  ports: Port[];
  shippingRoro: number;
  shippingContainer: number;
}

export const destinations: Destination[] = [
  { id: "new-zealand", label: "New Zealand", ports: [{ id: "auckland", label: "Auckland" }, { id: "wellington", label: "Wellington" }, { id: "tauranga", label: "Tauranga" }], shippingRoro: 1200, shippingContainer: 2100 },
  { id: "kenya", label: "Kenya", ports: [{ id: "mombasa", label: "Mombasa" }, { id: "nairobi", label: "Nairobi" }], shippingRoro: 1800, shippingContainer: 3200 },
  { id: "uk", label: "United Kingdom", ports: [{ id: "southampton", label: "Southampton" }, { id: "bristol", label: "Bristol" }, { id: "liverpool", label: "Liverpool" }], shippingRoro: 1500, shippingContainer: 2800 },
  { id: "uganda", label: "Uganda", ports: [{ id: "entebbe", label: "Entebbe" }, { id: "kampala", label: "Kampala" }], shippingRoro: 1900, shippingContainer: 3400 },
  { id: "ireland", label: "Ireland", ports: [{ id: "dublin", label: "Dublin" }, { id: "cork", label: "Cork" }], shippingRoro: 1400, shippingContainer: 2600 },
  { id: "tanzania", label: "Tanzania", ports: [{ id: "dar-es-salaam", label: "Dar es Salaam" }], shippingRoro: 1850, shippingContainer: 3300 },
  { id: "jamaica", label: "Jamaica", ports: [{ id: "kingston", label: "Kingston" }, { id: "montego-bay", label: "Montego Bay" }], shippingRoro: 2000, shippingContainer: 3600 },
  { id: "south-africa", label: "South Africa", ports: [{ id: "durban", label: "Durban" }, { id: "cape-town", label: "Cape Town" }, { id: "port-elizabeth", label: "Port Elizabeth" }], shippingRoro: 1750, shippingContainer: 3100 },
  { id: "st-vincent", label: "St. Vincent", ports: [{ id: "kingstown", label: "Kingstown" }], shippingRoro: 1950, shippingContainer: 3500 },
  { id: "st-lucia", label: "St. Lucia", ports: [{ id: "castries", label: "Castries" }], shippingRoro: 1920, shippingContainer: 3450 },
  { id: "trinidad-tobago", label: "Trinidad & Tobago", ports: [{ id: "port-of-spain", label: "Port of Spain" }], shippingRoro: 1880, shippingContainer: 3350 },
  { id: "australia", label: "Australia", ports: [{ id: "sydney", label: "Sydney" }, { id: "melbourne", label: "Melbourne" }, { id: "brisbane", label: "Brisbane" }], shippingRoro: 1300, shippingContainer: 2400 },
  { id: "singapore", label: "Singapore", ports: [{ id: "singapore", label: "Singapore" }], shippingRoro: 800, shippingContainer: 1500 },
  { id: "uae", label: "UAE", ports: [{ id: "dubai", label: "Dubai" }, { id: "sharjah", label: "Sharjah" }], shippingRoro: 1100, shippingContainer: 2000 },
  { id: "sri-lanka", label: "Sri Lanka", ports: [{ id: "colombo", label: "Colombo" }], shippingRoro: 950, shippingContainer: 1800 },
  { id: "mauritius", label: "Mauritius", ports: [{ id: "port-louis", label: "Port Louis" }], shippingRoro: 1700, shippingContainer: 3000 },
  { id: "bangladesh", label: "Bangladesh", ports: [{ id: "chittagong", label: "Chittagong" }], shippingRoro: 900, shippingContainer: 1700 },
  { id: "pakistan", label: "Pakistan", ports: [{ id: "karachi", label: "Karachi" }], shippingRoro: 1000, shippingContainer: 1900 },
  { id: "ghana", label: "Ghana", ports: [{ id: "tema", label: "Tema" }], shippingRoro: 1850, shippingContainer: 3300 },
  { id: "nigeria", label: "Nigeria", ports: [{ id: "lagos", label: "Lagos" }], shippingRoro: 1950, shippingContainer: 3500 },
];

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

export function getPort(destId: string, portId: string): Port | undefined {
  const d = getDestination(destId);
  return d?.ports.find((p) => p.id === portId);
}
