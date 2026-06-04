// Client API minimal pour le back-end Express de Kasa.
// Cote serveur (Server Components), on appelle l'API directement via API_URL.
const API_URL = process.env.API_URL || 'http://localhost:3000';

/**
 * Récupère la liste de tous les logements.
 * @returns {Promise<Array<Object>>} Tableau des logements (id, title, cover, location, price_per_night…).
 * @throws {Error} Si l'API répond avec un statut d'erreur.
 */
export async function getProperties() {
  const res = await fetch(`${API_URL}/api/properties`);
  if (!res.ok) throw new Error(`Echec du chargement des proprietes (${res.status})`);
  return res.json();
}

/**
 * Récupère le détail d'un logement par son id (ou slug).
 * @param {string} id - Identifiant du logement.
 * @returns {Promise<Object|null>} Le logement complet (pictures, equipments, tags, host, rating_avg…), ou null s'il n'existe pas — la page appelante déclenche alors notFound().
 */
export async function getProperty(id) {
  const res = await fetch(`${API_URL}/api/properties/${id}`);
  if (!res.ok) return null;
  return res.json();
}
