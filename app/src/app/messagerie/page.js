"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

/**
 * Données fictives : aucune API ni table n'existe pour la messagerie (hors
 * périmètre du livrable). Les conversations sont des constantes et les
 * messages envoyés ne vivent que dans l'état React de la page.
 * Point de vue : l'utilisateur connecté est un voyageur (rôle `client`) qui
 * écrit aux hôtes des logements — "me" = le voyageur, "them" = l'hôte.
 */
const CONVERSATIONS = [
  {
    id: "c1",
    name: "Nathalie",
    time: "11:04",
    preview: "Avec plaisir ! À très bientôt.",
    unread: true,
    messages: [
      { id: "m1", from: "me", time: "10:52", text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?" },
      { id: "m2", from: "them", time: "10:58", text: "Bonjour ! Oui, il est libre sur ces dates. Vous seriez combien de voyageurs ?" },
      { id: "m3", from: "me", time: "11:01", text: "Nous serions 4 adultes. Le parking est-il inclus ?" },
      { id: "m4", date: "03 Septembre 2025" },
      { id: "m5", from: "them", time: "09:15", text: "Oui, une place de parking privée est comprise dans la location." },
      { id: "m6", from: "me", time: "09:20", text: "Parfait, je réserve dès ce soir. Merci beaucoup !" },
      { id: "m7", from: "them", time: "11:04", text: "Avec plaisir ! À très bientôt." },
    ],
  },
  {
    id: "c2",
    name: "Karim",
    time: "09:31",
    preview: "Oui, les animaux calmes sont les bienvenus !",
    unread: true,
    messages: [
      { id: "m1", from: "me", time: "09:12", text: "Bonjour ! Est-ce que le logement accepte les animaux ? J'ai un petit chien très calme." },
      { id: "m2", from: "them", time: "09:31", text: "Oui, les animaux calmes sont les bienvenus !" },
    ],
  },
  {
    id: "c3",
    name: "Élodie",
    time: "Hier",
    preview: "Merci à vous, vous êtes les bienvenus quand vous voulez !",
    unread: false,
    messages: [
      { id: "m1", from: "me", time: "18:42", text: "Merci pour votre accueil, le séjour était parfait !" },
      { id: "m2", from: "them", time: "19:05", text: "Merci à vous, vous êtes les bienvenus quand vous voulez !" },
    ],
  },
  {
    id: "c4",
    name: "Marc",
    time: "Lundi",
    preview: "Ça fonctionne, merci pour votre réactivité !",
    unread: false,
    messages: [
      { id: "m1", from: "me", time: "14:10", text: "Bonjour, le code de la boîte à clés ne fonctionne pas, pouvez-vous m'aider ?" },
      { id: "m2", from: "them", time: "14:12", text: "Toutes mes excuses, le bon code est 4827. Bonne installation !" },
      { id: "m3", from: "me", time: "14:20", text: "Ça fonctionne, merci pour votre réactivité !" },
    ],
  },
];

/**
 * Page messagerie (démo) : liste des conversations + fil de discussion,
 * conforme à la maquette Messagerie.pdf. Les messages saisis sont ajoutés
 * localement à la conversation ouverte (aucun appel réseau). En mobile, un
 * seul volet est visible à la fois : la liste, puis le fil une fois une
 * conversation choisie (bouton retour pour revenir à la liste).
 */
export default function MessageriePage() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState(CONVERSATIONS[0].id);
  // Mobile uniquement : true = le fil est affiché à la place de la liste.
  const [threadOpen, setThreadOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const messagesRef = useRef(null);

  const selected = conversations.find((c) => c.id === selectedId);

  // Fait défiler le fil jusqu'au dernier message (à l'ouverture et à l'envoi).
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selectedId, selected.messages.length]);

  /**
   * Ouvre une conversation : la marque comme lue et, en mobile, bascule sur
   * le volet fil de discussion.
   * @param {string} id - Identifiant de la conversation.
   */
  function openConversation(id) {
    setSelectedId(id);
    setThreadOpen(true);
    setConversations((list) =>
      list.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  }

  /**
   * Ajoute le brouillon comme message sortant de la conversation ouverte.
   * @param {import("react").FormEvent<HTMLFormElement>} event
   */
  function handleSend(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setConversations((list) =>
      list.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              preview: text,
              messages: [
                ...c.messages,
                { id: `m${c.messages.length + 1}-${time}`, from: "me", time, text },
              ],
            }
          : c
      )
    );
    setDraft("");
  }

  return (
    <main className={styles.main}>
      <div
        className={`${styles.layout} ${threadOpen ? styles.threadOpen : ""}`}
      >
        {/* ── Volet gauche : liste des conversations ── */}
        <aside className={styles.sidebar}>
          <Link href="/" className={styles.back}>
            ← Retour
          </Link>
          <h1 className={styles.heading}>Messages</h1>

          <ul className={styles.list}>
            {conversations.map((conv) => (
              <li key={conv.id}>
                <button
                  type="button"
                  className={`${styles.item} ${
                    conv.id === selectedId ? styles.itemActive : ""
                  }`}
                  onClick={() => openConversation(conv.id)}
                  aria-current={conv.id === selectedId ? "true" : undefined}
                >
                  <span className={styles.avatar} aria-hidden="true">
                    {conv.name[0]}
                  </span>
                  <span className={styles.itemBody}>
                    <span className={styles.itemName}>{conv.name}</span>
                    <span className={styles.itemPreview}>{conv.preview}</span>
                  </span>
                  <span className={styles.itemMeta}>
                    <span className={styles.itemTime}>{conv.time}</span>
                    {conv.unread && (
                      <span className={styles.dot}>
                        <span className={styles.srOnly}>
                          messages non lus
                        </span>
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Volet droit : fil de discussion ── */}
        <section
          className={styles.thread}
          aria-label={`Conversation avec ${selected.name}`}
        >
          {/* Entête visible uniquement en mobile : retour vers la liste. */}
          <header className={styles.threadHeader}>
            <button
              type="button"
              className={styles.threadBack}
              onClick={() => setThreadOpen(false)}
            >
              ← Messages
            </button>
            <span className={styles.threadName}>{selected.name}</span>
          </header>

          <div className={styles.messages} ref={messagesRef}>
            {selected.messages.map((msg) =>
              msg.date ? (
                <p key={msg.id} className={styles.dateSep}>
                  {msg.date}
                </p>
              ) : (
                <div
                  key={msg.id}
                  className={`${styles.msg} ${
                    msg.from === "me" ? styles.msgOut : styles.msgIn
                  }`}
                >
                  <p className={styles.msgMeta}>
                    {msg.from === "me" ? "Vous" : selected.name} · {msg.time}
                  </p>
                  <p className={styles.bubble}>{msg.text}</p>
                </div>
              )
            )}
          </div>

          <form className={styles.composer} onSubmit={handleSend}>
            <label className={styles.srOnly} htmlFor="draft">
              Envoyer un message
            </label>
            <textarea
              className={styles.input}
              id="draft"
              rows={2}
              placeholder="Envoyer un message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              // Entrée envoie le message, Maj+Entrée insère un saut de ligne.
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form.requestSubmit();
                }
              }}
            />
            <button
              type="submit"
              className={styles.send}
              aria-label="Envoyer le message"
              disabled={!draft.trim()}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
