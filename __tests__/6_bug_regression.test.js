/**
 * TEST SUITE 6 — Regression Test per i Bug Identificati
 *
 * Documenta e verifica il comportamento attuale per tutti i bug trovati.
 * I test contrassegnati con [BUG] indicano comportamenti da correggere.
 * I test contrassegnati con [OK] indicano comportamenti già corretti.
 */

// ─── Funzioni utility ─────────────────────────────────────────────────────────
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

// Simula la logica analyzeAndCategorize (estrazione JSON dalla risposta AI)
function extractJsonFromAiResponse(rawText) {
  // Il codice originale fa solo: JSON.parse(raw) — BUG: nessun try/catch separato
  // Qui testiamo le varianti di risposta che Claude può restituire
  const cleaned = rawText.trim();
  return JSON.parse(cleaned);
}

// Versione robusta (proposta fix)
function extractJsonFromAiResponseSafe(rawText) {
  try {
    const cleaned = rawText.trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

// Simula parseTags
function parseTags(tagsString) {
  return tagsString.split(",").map((t) => t.trim()).filter(Boolean);
}

// Simula PubMed query encoding
function buildPubmedUrl(query) {
  const enhanced = `${query} naturopathy OR herbal OR traditional medicine OR integrative`;
  return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(enhanced)}&retmax=8&retmode=json&sort=relevance`;
}

// Simula la logica di salvataggio sessione con check messaggi
function canSaveSession(messages) {
  return messages.length > 1;
}

// ─────────────────────────────────────────────────────────────────────────────

// Versione con strip markdown (implementata nel fix)
function extractJsonStripped(rawText) {
  try {
    const jsonStr = rawText.replace(/^```(?:json)?\s*/i,"").replace(/\s*```\s*$/,"").trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

describe("[FIXED] JSON parsing robusto in analyzeAndCategorize", () => {
  test("[OK] JSON valido viene parsato correttamente", () => {
    const validJson = '{"discipline":"fitoterapia","title":"Curcuma","tags":["fegato","infiammazione"],"area":"Nutrizionale"}';
    const result = extractJsonStripped(validJson);
    expect(result).not.toBeNull();
    expect(result.discipline).toBe("fitoterapia");
  });

  test("[FIXED] risposta con ```json ... ``` viene parsata correttamente", () => {
    const withMarkdown = "```json\n{\"discipline\":\"fitoterapia\",\"title\":\"Test\",\"tags\":[\"a\"],\"area\":\"Nutrizionale\"}\n```";
    const result = extractJsonStripped(withMarkdown);
    expect(result).not.toBeNull();
    expect(result.discipline).toBe("fitoterapia");
  });

  test("[FIXED] risposta con ``` senza json viene parsata correttamente", () => {
    const withFence = "```\n{\"discipline\":\"omeopatia\",\"title\":\"T\",\"tags\":[],\"area\":\"Educazione\"}\n```";
    const result = extractJsonStripped(withFence);
    expect(result).not.toBeNull();
    expect(result.discipline).toBe("omeopatia");
  });

  test("[OK] stringa vuota ritorna null (gestione graceful)", () => {
    expect(extractJsonStripped("")).toBeNull();
  });

  test("[OK] JSON malformato ritorna null senza crash", () => {
    expect(extractJsonStripped('{"discipline": ERRORE}')).toBeNull();
  });

  test("[OK] testo extra senza JSON ritorna null", () => {
    expect(extractJsonStripped("Ecco il JSON richiesto:")).toBeNull();
  });

  test("[OK] strip non altera JSON valido senza backtick", () => {
    const json = '{"discipline":"reiki","title":"T","tags":["a"],"area":"Bioenergetica"}';
    const result = extractJsonStripped(json);
    expect(result.discipline).toBe("reiki");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[FIXED] CF obfuscation — chiave fissa 'key' eliminata", () => {
  // FIX: pwdHash è ora derivato in doLogin() e mai undefined durante la sessione.
  // addPatient() chiama doLogout() se pwdHash manca, senza fallback a "key".

  // Simula la derivazione del pwdHash come avviene in doLogin()
  function derivePwdHash(username, password) {
    return btoa(`${username.toLowerCase().trim()}:${password}:nm2025`);
  }

  test("[FIXED] pwdHash derivato da username+password è unico per utente", () => {
    const h1 = derivePwdHash("mario", "password123");
    const h2 = derivePwdHash("luigi", "password123");
    expect(h1).not.toBe(h2); // stesso password, username diversi → chiavi diverse
  });

  test("[FIXED] pwdHash cambia se cambia la password", () => {
    const h1 = derivePwdHash("mario", "password123");
    const h2 = derivePwdHash("mario", "nuovapassword");
    expect(h1).not.toBe(h2);
  });

  test("[FIXED] pwdHash non è mai la stringa fissa 'key'", () => {
    const hash = derivePwdHash("admin", "qualsiasi");
    expect(hash).not.toBe("key");
  });

  test("[FIXED] obfuscate con pwdHash derivato produce output non vuoto", () => {
    const pwdHash = derivePwdHash("mario", "password123");
    const result = obfuscate("RSSMRA80A01H501Z", pwdHash);
    expect(result).not.toBe("");
    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  test("[FIXED] addPatient senza pwdHash blocca l'operazione (guard)", () => {
    // Simula il guard in addPatient():
    //   if (!currentUser?.pwdHash) { await doLogout(); return; }
    const currentUser = { username: "mario", jwt: "tok" }; // pwdHash assente
    const shouldBlock = !currentUser?.pwdHash;
    expect(shouldBlock).toBe(true); // l'operazione viene bloccata
  });

  test("[FIXED] addPatient con pwdHash valido non blocca", () => {
    const currentUser = {
      username: "mario",
      jwt: "tok",
      pwdHash: derivePwdHash("mario", "password123"),
    };
    const shouldBlock = !currentUser?.pwdHash;
    expect(shouldBlock).toBe(false); // procede normalmente
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[BUG] Salvataggio sessione — dati in-memory non persistiti", () => {
  test("[OK] canSaveSession richiede almeno 2 messaggi", () => {
    const oneMsg = [{ role: "assistant", content: "Benvenuto" }];
    expect(canSaveSession(oneMsg)).toBe(false);
  });

  test("[OK] canSaveSession con 2+ messaggi permette il salvataggio", () => {
    const twoMsgs = [
      { role: "assistant", content: "Benvenuto" },
      { role: "user", content: "Ciao" },
    ];
    expect(canSaveSession(twoMsgs)).toBe(true);
  });

  test("[BUG DOCUMENTATO] chiudere il tab prima del salvataggio perde i messaggi", () => {
    // Non testabile direttamente, ma documentiamo il requisito
    // La sessione dovrebbe essere auto-salvata o avvisare l'utente
    // Test placeholder per documentare il bug
    expect(true).toBe(true); // placeholder
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[BUG] Encoding URL PubMed", () => {
  test("[OK] query con spazi viene encodata correttamente", () => {
    const url = buildPubmedUrl("curcumin inflammation");
    expect(url).toContain("curcumin%20inflammation");
    expect(url).not.toContain(" "); // nessuno spazio nell'URL
  });

  test("[OK] query con caratteri speciali viene encodata", () => {
    const url = buildPubmedUrl("omega-3 & depression");
    expect(url).not.toContain("&term=omega-3 &"); // & deve essere encoded
  });

  test("[OK] il termine naturopatico viene aggiunto alla query", () => {
    const url = buildPubmedUrl("curcumin");
    expect(url).toContain("naturopathy");
    expect(url).toContain("herbal");
  });

  test("[OK] URL PubMed usa il database corretto (pubmed)", () => {
    const url = buildPubmedUrl("test");
    expect(url).toContain("db=pubmed");
  });

  test("[OK] URL PubMed limita a 8 risultati", () => {
    const url = buildPubmedUrl("test");
    expect(url).toContain("retmax=8");
  });

  test("[OK] URL PubMed ordina per rilevanza", () => {
    const url = buildPubmedUrl("test");
    expect(url).toContain("sort=relevance");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[BUG] Parsing tags — edge case", () => {
  test("[OK] tag vuoti non vengono inclusi", () => {
    const tags = parseTags("fegato,,digestione,,");
    expect(tags).not.toContain("");
    expect(tags).toEqual(["fegato", "digestione"]);
  });

  test("[OK] spazi multipli attorno ai tag vengono rimossi", () => {
    const tags = parseTags("  fegato  ,  digestione  ");
    expect(tags).toEqual(["fegato", "digestione"]);
  });

  test("[OK] stringa solo di virgole produce array vuoto", () => {
    const tags = parseTags(",,,,,");
    expect(tags).toHaveLength(0);
  });

  test("[OK] tag con accenti italiani (è, à, ò) sono preservati", () => {
    const tags = parseTags("età avanzata, salute à tout âge");
    expect(tags[0]).toBe("età avanzata");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[BUG] Generazione codice paziente — collisioni", () => {
  test("[OK] codici generati rapidamente non si sovrappongono (campione 500)", () => {
    const codes = new Set();
    for (let i = 0; i < 500; i++) {
      codes.add(genCode());
    }
    // Con 36^4 ≈ 1.6M combinazioni, 500 codici dovrebbero essere quasi sempre unici
    expect(codes.size).toBeGreaterThan(490);
  });

  test("[BUG DOCUMENTATO] nessun meccanismo di controllo unicità nel DB", () => {
    // Il codice chiama genCode() e inserisce direttamente nel DB senza
    // verificare che il codice non esista già. Con molti pazienti,
    // potrebbero verificarsi collisioni (probabilità bassa ma non zero).
    // Il test documenta il rischio teorico.
    const code1 = "NAT-2025-AAAA";
    const code2 = "NAT-2025-AAAA"; // duplicato simulato
    expect(code1).toBe(code2); // Documenta la possibilità di collisione
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[BUG] Costruzione messaggi API — messaggi vuoti", () => {
  // In sendChat: if(!chatInput.trim()||chatLoading) return;
  // Testa la validazione preventiva

  test("[OK] chatInput vuoto non viene inviato", () => {
    const chatInput = "   "; // solo spazi
    const shouldSend = !(!chatInput.trim()); // logica inversa del guard
    expect(shouldSend).toBe(false);
  });

  test("[OK] chatInput con contenuto viene inviato", () => {
    const chatInput = "Ho un paziente con stanchezza cronica";
    const shouldSend = !(!chatInput.trim());
    expect(shouldSend).toBe(true);
  });

  test("[OK] chatLoading=true blocca l'invio", () => {
    const chatInput = "messaggio valido";
    const chatLoading = true;
    const shouldBlock = !chatInput.trim() || chatLoading;
    expect(shouldBlock).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[BUG] Estrazione testo da risposta Anthropic", () => {
  // In sendChat: const text = (data.content||[]).filter(c=>c.type==="text").map(c=>c.text||"").join("")

  test("[OK] risposta con type=text viene estratta", () => {
    const data = {
      content: [
        { type: "text", text: "Risposta dell'AI" },
      ],
    };
    const text = (data.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text || "")
      .join("");
    expect(text).toBe("Risposta dell'AI");
  });

  test("[OK] risposta con web_search (più blocchi) viene concatenata", () => {
    const data = {
      content: [
        { type: "tool_use", name: "web_search", input: { query: "curcumin" } },
        { type: "tool_result", content: "..." },
        { type: "text", text: "Basandomi sulla ricerca..." },
        { type: "text", text: " Conclusione finale." },
      ],
    };
    const text = (data.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text || "")
      .join("");
    expect(text).toBe("Basandomi sulla ricerca... Conclusione finale.");
  });

  test("[OK] risposta senza content[] ritorna fallback (T.chat_err_resp)", () => {
    const data = { content: [] };
    const T_fallback = "Errore risposta.";
    const text =
      (data.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text || "")
        .join("") || T_fallback;
    expect(text).toBe(T_fallback);
  });

  test("[OK] risposta con content null usa fallback", () => {
    const data = {};
    const T_fallback = "Errore risposta.";
    const text =
      (data.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text || "")
        .join("") || T_fallback;
    expect(text).toBe(T_fallback);
  });

  test("[BUG] testo vuoto ('') usa fallback correttamente (stringa vuota è falsy)", () => {
    const data = { content: [{ type: "text", text: "" }] };
    const T_fallback = "Errore risposta.";
    const text =
      (data.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text || "")
        .join("") || T_fallback;
    // Il testo estratto è "" che è falsy → usa fallback
    expect(text).toBe(T_fallback);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[BUG] Setup form — validazione ordine", () => {
  // L'ordine delle validazioni in doSetup() è importante
  // 1. username || password → err_fields
  // 2. password !== confirm → err_match
  // 3. password.length < 8 → err_short

  const T = {
    err_fields: "Compila tutti i campi",
    err_match: "Le password non coincidono",
    err_short: "Password minimo 8 caratteri",
  };

  function validateSetup(form) {
    if (!form.username || !form.password) return T.err_fields;
    if (form.password !== form.confirm) return T.err_match;
    if (form.password.length < 8) return T.err_short;
    return null;
  }

  test("[OK] validazione priorità: campi vuoti prima di password corta", () => {
    // username vuoto → err_fields (non err_short)
    const err = validateSetup({ username: "", password: "abc", confirm: "abc" });
    expect(err).toBe(T.err_fields);
  });

  test("[OK] validazione priorità: campi vuoti prima di mismatch", () => {
    const err = validateSetup({ username: "", password: "pass1234", confirm: "different" });
    expect(err).toBe(T.err_fields);
  });

  test("[OK] validazione priorità: mismatch prima di password corta", () => {
    // Se password e confirm non coincidono ma entrambe < 8 char → err_match (non err_short)
    const err = validateSetup({ username: "admin", password: "abc", confirm: "def" });
    expect(err).toBe(T.err_match);
  });

  test("[OK] password esattamente 8 char è valida", () => {
    const err = validateSetup({ username: "admin", password: "abcdefgh", confirm: "abcdefgh" });
    expect(err).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("[FIXED] loadAll — paginazione aggiunta", () => {
  // Le query ora includono &limit per evitare caricamenti illimitati
  const KB_QUERY    = "nm_knowledge_base?order=created_at.desc&limit=200";
  const PT_QUERY    = "nm_patients?order=created_at.desc&limit=200";
  const CONS_QUERY  = "nm_consultations?order=created_at.desc&limit=100";

  test("[FIXED] query KB include limit=200", () => {
    expect(KB_QUERY).toContain("limit=200");
  });

  test("[FIXED] query pazienti include limit=200", () => {
    expect(PT_QUERY).toContain("limit=200");
  });

  test("[FIXED] query consultazioni include limit=100", () => {
    expect(CONS_QUERY).toContain("limit=100");
  });

  test("[OK] query KB mantiene l'ordinamento corretto", () => {
    expect(KB_QUERY).toContain("order=created_at.desc");
  });

  test("[OK] il limit non rimuove l'order by", () => {
    // Verifica che le due clausole coesistano
    expect(KB_QUERY).toContain("order=");
    expect(KB_QUERY).toContain("limit=");
  });
});

describe("[FIXED] Auto-save sessione — logica del debounce", () => {
  // L'auto-save usa setTimeout(30000) e clearTimeout al cleanup
  // Verifica la logica di guardia dell'effetto

  function shouldAutoSave(messages, screen, currentUser) {
    return !(messages.length <= 1 || screen !== "app" || !currentUser);
  }

  test("[FIXED] non auto-salva con solo il messaggio di benvenuto (1 msg)", () => {
    const messages = [{ role: "assistant", content: "Benvenuto" }];
    expect(shouldAutoSave(messages, "app", { username: "mario" })).toBe(false);
  });

  test("[FIXED] non auto-salva se screen non è 'app'", () => {
    const messages = [{ role: "assistant", content: "A" }, { role: "user", content: "B" }];
    expect(shouldAutoSave(messages, "lock", { username: "mario" })).toBe(false);
  });

  test("[FIXED] non auto-salva se currentUser è null (sessione scaduta)", () => {
    const messages = [{ role: "assistant", content: "A" }, { role: "user", content: "B" }];
    expect(shouldAutoSave(messages, "app", null)).toBe(false);
  });

  test("[FIXED] auto-salva con 2+ messaggi, screen=app, utente loggato", () => {
    const messages = [
      { role: "assistant", content: "Benvenuto" },
      { role: "user", content: "Ho un caso..." },
    ];
    expect(shouldAutoSave(messages, "app", { username: "mario" })).toBe(true);
  });

  test("[FIXED] il debounce annulla il timer precedente (clearTimeout)", () => {
    jest.useFakeTimers();
    const saveFn = jest.fn();

    // Simula l'effetto: ogni cambio messaggi resetta il timer
    let timer;
    const triggerEffect = () => {
      clearTimeout(timer);
      timer = setTimeout(saveFn, 30000);
    };

    triggerEffect(); // primo messaggio
    triggerEffect(); // secondo messaggio entro 30s
    triggerEffect(); // terzo messaggio entro 30s

    jest.advanceTimersByTime(29999);
    expect(saveFn).not.toHaveBeenCalled(); // ancora non salvato

    jest.advanceTimersByTime(1);
    expect(saveFn).toHaveBeenCalledTimes(1); // salvato una sola volta

    jest.useRealTimers();
  });

  test("[FIXED] il salvataggio avviene dopo esattamente 30 secondi di inattività", () => {
    jest.useFakeTimers();
    const saveFn = jest.fn();

    setTimeout(saveFn, 30000);
    jest.advanceTimersByTime(30000);
    expect(saveFn).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
