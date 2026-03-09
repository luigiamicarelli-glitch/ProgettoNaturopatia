/**
 * TEST SUITE 4 — Logica di Business
 * Testa: KB context, PubMed term extraction, session/referto logic,
 *        validazioni form, tags parsing, injectPubmedInChat, etc.
 */

// ─── Funzioni utility necessarie ─────────────────────────────────────────────
function obfuscate(text, key) {
  if (!text || !key) return "";
  return btoa(
    Array.from(text)
      .map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
      )
      .join("")
  );
}

function genCode() {
  return `NAT-${new Date().getFullYear()}-${Math.random()
    .toString(36)
    .substr(2, 4)
    .toUpperCase()}`;
}

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

const DISCIPLINES = [
  { id: "fitoterapia", label: "Fitoterapia" },
  { id: "nutraceutica", label: "Nutraceutica" },
  { id: "omeopatia", label: "Omeopatia" },
  { id: "aromaterapia", label: "Aromaterapia" },
  { id: "shiatsu", label: "Shiatsu" },
  { id: "reiki", label: "Reiki" },
];
// ─────────────────────────────────────────────────────────────────────────────

// ─── kbContext: genera il testo di contesto dalla Banca Dati ────────────────
function kbContext(kb) {
  if (!kb.length) return "";
  return (
    "\n\n--- BANCA DATI ---\n" +
    kb
      .map(
        (e) =>
          `[${e.title} | ${DISCIPLINES.find((d) => d.id === e.discipline)?.label || e.discipline}]\n${e.content}`
      )
      .join("\n\n") +
    "\n--- FINE BANCA DATI ---"
  );
}

// ─── Estrazione termini per PubMed dal contesto chat ────────────────────────
function pubmedTermsFromMessages(messages) {
  const recentText = messages.slice(-4).map((m) => m.content).join(" ");
  return recentText
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 5)
    .slice(0, 5)
    .join(" ");
}

// ─── Parsing tags KB ─────────────────────────────────────────────────────────
function parseTags(tagsString) {
  return tagsString
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// ─── Costruzione titolo sessione ──────────────────────────────────────────────
function buildSessionTitle(activePatient) {
  const dateStr = fmtDate(new Date());
  return `Sessione ${dateStr}${activePatient ? " - " + activePatient : ""}`;
}

// ─── Generazione testo citazione PubMed ──────────────────────────────────────
function buildPubmedRef(article) {
  return `[PUBMED] ${article.authors} (${article.year}). "${article.title}". ${article.journal}. PMID: ${article.pmid} — ${article.url}`;
}

// ─── Validazioni form ─────────────────────────────────────────────────────────
function validateSetupForm(form, T) {
  if (!form.username || !form.password) return T.err_fields;
  if (form.password !== form.confirm) return T.err_match;
  if (form.password.length < 8) return T.err_short;
  return null;
}

function validateLoginForm(form, T) {
  if (!form.username || !form.password) return T.err_fields;
  return null;
}

function validateKbEntry(form) {
  return !!(form.title && form.content);
}

// ─── Mock T (traduzioni IT) ───────────────────────────────────────────────────
const T = {
  err_fields: "Compila tutti i campi",
  err_match: "Le password non coincidono",
  err_short: "Password minimo 8 caratteri",
};

// ─────────────────────────────────────────────────────────────────────────────

describe("kbContext()", () => {
  test("ritorna stringa vuota se KB è vuoto", () => {
    expect(kbContext([])).toBe("");
  });

  test("include il separatore '--- BANCA DATI ---'", () => {
    const kb = [{ title: "Curcuma", discipline: "nutraceutica", content: "Antiinfiammatorio" }];
    expect(kbContext(kb)).toContain("--- BANCA DATI ---");
    expect(kbContext(kb)).toContain("--- FINE BANCA DATI ---");
  });

  test("include titolo e contenuto di ogni fonte", () => {
    const kb = [
      { title: "Fitoterapia base", discipline: "fitoterapia", content: "Testo sulla fitoterapia" },
    ];
    const ctx = kbContext(kb);
    expect(ctx).toContain("Fitoterapia base");
    expect(ctx).toContain("Testo sulla fitoterapia");
  });

  test("usa label disciplina se id trovato", () => {
    const kb = [{ title: "Test", discipline: "nutraceutica", content: "..." }];
    const ctx = kbContext(kb);
    expect(ctx).toContain("Nutraceutica");
  });

  test("usa id raw se disciplina non trovata", () => {
    const kb = [{ title: "Test", discipline: "disciplina_nuova", content: "..." }];
    const ctx = kbContext(kb);
    expect(ctx).toContain("disciplina_nuova");
  });

  test("include tutte le fonti nella stringa", () => {
    const kb = [
      { title: "Fonte A", discipline: "fitoterapia", content: "Contenuto A" },
      { title: "Fonte B", discipline: "omeopatia", content: "Contenuto B" },
      { title: "Fonte C", discipline: "aromaterapia", content: "Contenuto C" },
    ];
    const ctx = kbContext(kb);
    expect(ctx).toContain("Fonte A");
    expect(ctx).toContain("Fonte B");
    expect(ctx).toContain("Fonte C");
  });

  test("il formato delle entry è [Titolo | Disciplina]", () => {
    const kb = [{ title: "Libro di Weiss", discipline: "fitoterapia", content: "..." }];
    const ctx = kbContext(kb);
    expect(ctx).toContain("[Libro di Weiss | Fitoterapia]");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("pubmedTermsFromMessages()", () => {
  test("ritorna stringa vuota per array di messaggi vuoti", () => {
    const terms = pubmedTermsFromMessages([]);
    expect(terms).toBe("");
  });

  test("filtra parole con lunghezza > 5", () => {
    const messages = [
      { content: "it of at the was", role: "user" }, // parole corte
      { content: "curcumin berberina inflammation", role: "assistant" },
    ];
    const terms = pubmedTermsFromMessages(messages);
    expect(terms).toContain("curcumin");
    expect(terms).toContain("berberina");
    expect(terms).toContain("inflammation");
    // "it", "of", "at" devono essere filtrate
    expect(terms).not.toContain(" it ");
  });

  test("considera solo gli ultimi 4 messaggi", () => {
    const messages = [
      { content: "primissimo messaggio vecchio", role: "user" },
      { content: "secondo vecchio", role: "assistant" },
      { content: "terzo vecchio", role: "user" },
      { content: "quarto più recente curcumina", role: "assistant" },
      { content: "quinto recente berberina", role: "user" },
      { content: "sesto recente fitoterapia", role: "assistant" },
      { content: "settimo recente omeopatia", role: "user" },
    ];
    const terms = pubmedTermsFromMessages(messages);
    // "primissimo" è nel primo messaggio (non negli ultimi 4), non dovrebbe comparire
    expect(terms).not.toContain("primissimo");
  });

  test("prende al massimo 5 termini", () => {
    const messages = [
      { content: "curcumina berberina fitoterapia omeopatia aromaterapia shiatsu riflessologia gemmoterapia", role: "user" },
    ];
    const terms = pubmedTermsFromMessages(messages);
    const wordCount = terms.trim().split(/\s+/).filter(Boolean).length;
    expect(wordCount).toBeLessThanOrEqual(5);
  });

  test("rimuove punteggiatura prima del parsing", () => {
    const messages = [
      { content: "curcumina, berberina. fitoterapia!", role: "user" },
    ];
    const terms = pubmedTermsFromMessages(messages);
    expect(terms).not.toContain(",");
    expect(terms).not.toContain(".");
    expect(terms).not.toContain("!");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("parseTags()", () => {
  test("splitting per virgola base", () => {
    expect(parseTags("fegato, digestione, bile")).toEqual(["fegato", "digestione", "bile"]);
  });

  test("rimuove spazi bianchi attorno ai tag", () => {
    expect(parseTags("  fegato  ,  digestione  ")).toEqual(["fegato", "digestione"]);
  });

  test("stringa vuota ritorna array vuoto", () => {
    expect(parseTags("")).toEqual([]);
  });

  test("solo virgole ritorna array vuoto", () => {
    expect(parseTags(",,,")).toEqual([]);
  });

  test("tag singolo senza virgola", () => {
    expect(parseTags("fegato")).toEqual(["fegato"]);
  });

  test("virgola finale non crea tag vuoto", () => {
    expect(parseTags("fegato,digestione,")).toEqual(["fegato", "digestione"]);
  });

  test("mantiene tag con caratteri speciali (es. nome botanico)", () => {
    expect(parseTags("Curcuma longa, Berberis vulgaris")).toEqual([
      "Curcuma longa",
      "Berberis vulgaris",
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("buildSessionTitle()", () => {
  test("senza paziente: contiene 'Sessione' e data", () => {
    const title = buildSessionTitle("");
    expect(title).toMatch(/^Sessione /);
  });

  test("con paziente: include il codice paziente", () => {
    const title = buildSessionTitle("NAT-2025-AB12");
    expect(title).toContain("NAT-2025-AB12");
    expect(title).toContain(" - ");
  });

  test("senza paziente (null): non include ' - '", () => {
    const title = buildSessionTitle(null);
    // null è falsy, quindi non aggiunge il codice
    expect(title).not.toContain(" - null");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("buildPubmedRef()", () => {
  const mockArticle = {
    authors: "Smith J, Rossi M",
    year: "2023",
    title: "Curcumin anti-inflammatory effects",
    journal: "Journal of Natural Medicine",
    pmid: "38123456",
    url: "https://pubmed.ncbi.nlm.nih.gov/38123456/",
  };

  test("contiene il prefisso [PUBMED]", () => {
    expect(buildPubmedRef(mockArticle)).toMatch(/^\[PUBMED\]/);
  });

  test("contiene autori, anno, titolo, rivista e PMID", () => {
    const ref = buildPubmedRef(mockArticle);
    expect(ref).toContain("Smith J, Rossi M");
    expect(ref).toContain("2023");
    expect(ref).toContain("Curcumin anti-inflammatory effects");
    expect(ref).toContain("Journal of Natural Medicine");
    expect(ref).toContain("PMID: 38123456");
  });

  test("contiene l'URL dell'articolo", () => {
    const ref = buildPubmedRef(mockArticle);
    expect(ref).toContain("https://pubmed.ncbi.nlm.nih.gov/38123456/");
  });

  test("il titolo è tra virgolette", () => {
    const ref = buildPubmedRef(mockArticle);
    expect(ref).toContain('"Curcumin anti-inflammatory effects"');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("validateSetupForm()", () => {
  test("errore se username mancante", () => {
    const err = validateSetupForm({ username: "", password: "pass1234", confirm: "pass1234" }, T);
    expect(err).toBe(T.err_fields);
  });

  test("errore se password mancante", () => {
    const err = validateSetupForm({ username: "admin", password: "", confirm: "" }, T);
    expect(err).toBe(T.err_fields);
  });

  test("errore se password e confirm non coincidono", () => {
    const err = validateSetupForm(
      { username: "admin", password: "pass1234", confirm: "pass5678" },
      T
    );
    expect(err).toBe(T.err_match);
  });

  test("errore se password < 8 caratteri", () => {
    const err = validateSetupForm(
      { username: "admin", password: "abc", confirm: "abc" },
      T
    );
    expect(err).toBe(T.err_short);
  });

  test("nessun errore con form valido", () => {
    const err = validateSetupForm(
      { username: "admin", password: "password123", confirm: "password123" },
      T
    );
    expect(err).toBeNull();
  });

  test("password esattamente 8 caratteri è valida", () => {
    const err = validateSetupForm(
      { username: "admin", password: "12345678", confirm: "12345678" },
      T
    );
    expect(err).toBeNull();
  });

  test("password di 7 caratteri è troppo corta", () => {
    const err = validateSetupForm(
      { username: "admin", password: "1234567", confirm: "1234567" },
      T
    );
    expect(err).toBe(T.err_short);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("validateLoginForm()", () => {
  test("errore se username mancante", () => {
    expect(validateLoginForm({ username: "", password: "pass" }, T)).toBe(T.err_fields);
  });

  test("errore se password mancante", () => {
    expect(validateLoginForm({ username: "admin", password: "" }, T)).toBe(T.err_fields);
  });

  test("nessun errore con form valido", () => {
    expect(validateLoginForm({ username: "admin", password: "pass" }, T)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("validateKbEntry()", () => {
  test("valido se title e content sono presenti", () => {
    expect(validateKbEntry({ title: "Titolo", content: "Testo", discipline: "fitoterapia", tags: "" })).toBe(true);
  });

  test("invalido se title mancante", () => {
    expect(validateKbEntry({ title: "", content: "Testo", discipline: "fitoterapia", tags: "" })).toBe(false);
  });

  test("invalido se content mancante", () => {
    expect(validateKbEntry({ title: "Titolo", content: "", discipline: "fitoterapia", tags: "" })).toBe(false);
  });

  test("invalido se entrambi mancanti", () => {
    expect(validateKbEntry({ title: "", content: "", discipline: "fitoterapia", tags: "" })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Gestione pazienti — codice e obfuscazione CF", () => {
  test("genCode produce formato NAT-ANNO-XXXX", () => {
    expect(genCode()).toMatch(/^NAT-\d{4}-[A-Z0-9]{4}$/);
  });

  test("obfuscate con pwdHash definito produce output non vuoto", () => {
    const cf = "RSSMRA80A01H501Z";
    const result = obfuscate(cf, "myPwdHash123");
    expect(result).not.toBe("");
    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  test("CF nullo produce obfuscation vuota", () => {
    // Se l'utente non inserisce CF, il campo rimane null/""
    expect(obfuscate("", "myPwdHash")).toBe("");
    expect(obfuscate(null, "myPwdHash")).toBe("");
  });

  test("obfuscate con chiave fallback 'key' produce output", () => {
    // Documenta il comportamento del fallback (pwdHash non definito)
    const result = obfuscate("RSSMRA80A01H501Z", "key");
    expect(result).not.toBe("");
  });

  test("codice paziente contiene anno corrente", () => {
    const year = new Date().getFullYear().toString();
    expect(genCode()).toContain(year);
  });

  test("il prefisso è sempre NAT", () => {
    const code = genCode();
    expect(code.startsWith("NAT-")).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Logica getRefMsgs e getRefPatientCode (simulata)", () => {
  const messages = [
    { role: "assistant", content: "Ciao", time: new Date() },
    { role: "user", content: "Ho un paziente con...", time: new Date() },
  ];

  const consultations = [
    {
      id: "cons-1",
      patient_code: "NAT-2024-ABCD",
      messages: [
        { role: "user", content: "Caso precedente", time: new Date() },
        { role: "assistant", content: "Analisi precedente", time: new Date() },
      ],
    },
  ];

  // Simulazione di getRefMsgs
  function getRefMsgs(refSession, messages, consultations) {
    if (refSession === "current") return messages;
    const c = consultations.find((x) => x.id === refSession);
    return c?.messages || messages;
  }

  // Simulazione di getRefPatientCode
  function getRefPatientCode(refSession, activePatient, consultations) {
    if (refSession === "current") return activePatient;
    return consultations.find((x) => x.id === refSession)?.patient_code || "";
  }

  test("getRefMsgs con 'current' ritorna messaggi correnti", () => {
    const result = getRefMsgs("current", messages, consultations);
    expect(result).toBe(messages);
  });

  test("getRefMsgs con id sessione ritorna messaggi della consultazione", () => {
    const result = getRefMsgs("cons-1", messages, consultations);
    expect(result).toHaveLength(2);
    expect(result[0].content).toBe("Caso precedente");
  });

  test("getRefMsgs con id inesistente ritorna messaggi correnti come fallback", () => {
    const result = getRefMsgs("cons-99", messages, consultations);
    expect(result).toBe(messages);
  });

  test("getRefPatientCode con 'current' ritorna paziente attivo", () => {
    const result = getRefPatientCode("current", "NAT-2025-XYZ1", consultations);
    expect(result).toBe("NAT-2025-XYZ1");
  });

  test("getRefPatientCode con id sessione ritorna codice paziente della consultazione", () => {
    const result = getRefPatientCode("cons-1", "NAT-2025-XYZ1", consultations);
    expect(result).toBe("NAT-2024-ABCD");
  });

  test("getRefPatientCode con id inesistente ritorna stringa vuota", () => {
    const result = getRefPatientCode("cons-99", "NAT-2025-XYZ1", consultations);
    expect(result).toBe("");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Costruzione messaggi per Anthropic API", () => {
  // Simula la logica in sendChat
  function buildApiMessages(messages) {
    return messages.map((m) => ({ role: m.role, content: m.content }));
  }

  test("converte correttamente i messaggi (rimuove time e hasWebSearch)", () => {
    const msgs = [
      { role: "user", content: "Ciao", time: new Date(), extra: "x" },
      { role: "assistant", content: "Risposta", time: new Date(), hasWebSearch: true },
    ];
    const api = buildApiMessages(msgs);
    expect(api).toEqual([
      { role: "user", content: "Ciao" },
      { role: "assistant", content: "Risposta" },
    ]);
  });

  test("l'ordine dei messaggi è preservato", () => {
    const msgs = [
      { role: "user", content: "1", time: new Date() },
      { role: "assistant", content: "2", time: new Date() },
      { role: "user", content: "3", time: new Date() },
    ];
    const api = buildApiMessages(msgs);
    expect(api[0].content).toBe("1");
    expect(api[1].content).toBe("2");
    expect(api[2].content).toBe("3");
  });
});
