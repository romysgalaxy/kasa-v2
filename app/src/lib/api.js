// Client API minimal pour le back-end Express de Kasa.
// Cote serveur (Server Components), on appelle l'API directement via API_URL.
const API_URL = process.env.API_URL || 'http://localhost:3000';

export async function getProperties() {
  const res = await fetch(`${API_URL}/api/properties`);
  if (!res.ok) throw new Error(`Echec du chargement des proprietes (${res.status})`);
  return res.json();
}

export async function getProperty(id) {
  const res = await fetch(`${API_URL}/api/properties/${id}`);
  if (!res.ok) return null;
  return res.json();
}
