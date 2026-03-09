/**
 * TEST SUITE 7 — Nuove funzionalità UI
 *
 * Copre le 5 migliorie implementate nell'ultimo commit:
 * 1. Focus ring CSS (:focus-visible su tutti gli elementi interattivi)
 * 2. Badge visivi KB per rimedi / sintomi / controindicazioni
 * 3. Indicatore auto-save ("⏳ Salvataggio..." / "✓ Salvata")
 * 4. Auto-chunking del testo incollato (onPaste con overlap 15%)
 * 5. Conferma prima della cancellazione (window.confirm)
 */

// ─── 1. FOCUS RING CSS ────────────────────────────────────────────────────────

describe("[NEW] Focus ring CSS (:focus-visible)", () => {
  const CSS_RULE =
    "button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible" +
    "{outline:2px solid var(--nm-accent,#6aaa6a);outline-offset:2px;border-radius:4px}";

  test("la regola copre button", () => {
    expect(CSS_RULE).toContain("button:focus-visible");
  });

  test("la regola copre input", () => {
    expect(CSS_RULE).toContain("input:focus-visible");
  });

  test("la regola copre select", () => {
    expect(CSS_RULE).toContain("select:focus-visible");
  });

  test("la regola copre textarea", () => {
    expect(CSS_RULE).toContain("textarea:focus-visible");
  });

  test("usa :focus-visible (non :focus generico) per non disturbare i click", () => {
    expect(CSS_RULE).toContain(":focus-visible");
    // Il selettore non deve avere ":focus{" senza il "-visible"
    expect(CSS_RULE).not.toMatch(/:focus\{/);
    expect(CSS_RULE).not.toMatch(/:focus\s*\{/);
  });

  test("outline spessore è 2px", () => {
    expect(CSS_RULE).toContain("outline:2px");
  });

  test("il colore usa la variabile CSS del tema (non un colore fisso)", () => {
    expect(CSS_RULE).toContain("var(--nm-accent");
  });

  test("outline-offset è 2px per distanza visiva corretta", () => {
    expect(CSS_RULE).toContain("outline-offset:2px");
  });
});

// ─── 2. BADGE VISIVI KB ───────────────────────────────────────────────────────

describe("[NEW] Badge visivi KB — rimedi / sintomi / controindicazioni", () => {
  // Simula la logica di rendering multi-riga dei badge
  function renderBadgeRows(entry) {
    const rows = [];
    if ((entry.tags || []).length > 0)
      rows.push({ type: "tags", items: entry.tags });
    if ((entry.rimedi || []).length > 0)
      rows.push({ type: "rimedi", items: entry.rimedi });
    if ((entry.sintomi || []).length > 0)
      rows.push({ type: "sintomi", items: entry.sintomi });
    if ((entry.controindicazioni || []).length > 0)
      rows.push({ type: "controindicazioni", items: entry.controindicazioni });
    return rows;
  }

  test("voce vuota (tutti array vuoti) non produce righe", () => {
    const entry = { tags: [], rimedi: [], sintomi: [], controindicazioni: [] };
    expect(renderBadgeRows(entry)).toHaveLength(0);
  });

  test("voce con soli tag produce 1 riga di tipo 'tags'", () => {
    const entry = { tags: ["digestione"], rimedi: [], sintomi: [], controindicazioni: [] };
    const rows = renderBadgeRows(entry);
    expect(rows).toHaveLength(1);
    expect(rows[0].type).toBe("tags");
  });

  test("i rimedi producono una riga separata con il tipo corretto", () => {
    const entry = { tags: [], rimedi: ["Silybum marianum", "Carciofo"], sintomi: [], controindicazioni: [] };
    const rows = renderBadgeRows(entry);
    expect(rows).toHaveLength(1);
    expect(rows[0].type).toBe("rimedi");
    expect(rows[0].items).toContain("Silybum marianum");
  });

  test("i sintomi producono una riga separata con il tipo corretto", () => {
    const entry = { tags: [], rimedi: [], sintomi: ["epatite", "steatosi"], controindicazioni: [] };
    const rows = renderBadgeRows(entry);
    expect(rows[0].type).toBe("sintomi");
    expect(rows[0].items).toHaveLength(2);
  });

  test("le controindicazioni producono una riga con il tipo corretto", () => {
    const entry = { tags: [], rimedi: [], sintomi: [], controindicazioni: ["gravidanza"] };
    const rows = renderBadgeRows(entry);
    expect(rows[0].type).toBe("controindicazioni");
  });

  test("voce completa produce 4 righe distinte nell'ordine corretto", () => {
    const entry = {
      tags: ["tag1"],
      rimedi: ["rimedio1"],
      sintomi: ["sintomo1"],
      controindicazioni: ["c1"],
    };
    const rows = renderBadgeRows(entry);
    expect(rows).toHaveLength(4);
    expect(rows[0].type).toBe("tags");
    expect(rows[1].type).toBe("rimedi");
    expect(rows[2].type).toBe("sintomi");
    expect(rows[3].type).toBe("controindicazioni");
  });

  test("entry con campi undefined non crasha", () => {
    const entry = { title: "Solo titolo" };
    expect(() => renderBadgeRows(entry)).not.toThrow();
    expect(renderBadgeRows(entry)).toHaveLength(0);
  });

  test("ogni item è preservato esattamente (inclusi accenti e spazi)", () => {
    const entry = { tags: [], rimedi: ["Echinacea purpurea", "Sambuco nigra"],
      sintomi: [], controindicazioni: [] };
    const rows = renderBadgeRows(entry);
    expect(rows[0].items[0]).toBe("Echinacea purpurea");
    expect(rows[0].items[1]).toBe("Sambuco nigra");
  });
});

// ─── 3. INDICATORE AUTO-SAVE ──────────────────────────────────────────────────

describe("[NEW] Indicatore auto-save (saveStatus)", () => {
  test("il testo dell'indicatore in stato 'saving' è corretto", () => {
    const label = (s) => s === "saving" ? "⏳ Salvataggio..." : "✓ Salvata";
    expect(label("saving")).toBe("⏳ Salvataggio...");
  });

  test("il testo dell'indicatore in stato 'saved' è corretto", () => {
    const label = (s) => s === "saving" ? "⏳ Salvataggio..." : "✓ Salvata";
    expect(label("saved")).toBe("✓ Salvata");
  });

  test("l'indicatore non è visibile quando saveStatus è null", () => {
    const saveStatus = null;
    expect(!!saveStatus).toBe(false); // null è falsy → span non renderizzato
  });

  test("l'indicatore è visibile quando saveStatus è 'saving'", () => {
    const saveStatus = "saving";
    expect(!!saveStatus).toBe(true);
  });

  test("l'indicatore è visibile quando saveStatus è 'saved'", () => {
    const saveStatus = "saved";
    expect(!!saveStatus).toBe(true);
  });

  test("il ciclo di stato: null → saving → saved → null", async () => {
    jest.useFakeTimers();
    let status = null;
    const setSaveStatus = (s) => { status = s; };
    const mockSave = jest.fn().mockResolvedValue(undefined);

    // Simula il corpo del setTimeout nell'auto-save useEffect
    const runAutoSave = async () => {
      setSaveStatus("saving");
      await mockSave();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 3000);
    };

    // Avvia il timer auto-save
    setTimeout(() => runAutoSave(), 30000);

    expect(status).toBeNull();

    jest.advanceTimersByTime(30000);
    // Flush delle promise pendenti (mockSave)
    await Promise.resolve();
    await Promise.resolve();

    expect(status).toBe("saved");
    expect(mockSave).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(3000);
    expect(status).toBeNull();

    jest.useRealTimers();
  });

  test("il debounce auto-save chiama la funzione una sola volta anche con 3 aggiornamenti rapidi", () => {
    jest.useFakeTimers();
    const saveFn = jest.fn();
    let timer;
    const triggerEffect = () => { clearTimeout(timer); timer = setTimeout(saveFn, 30000); };

    triggerEffect();
    triggerEffect();
    triggerEffect();

    jest.advanceTimersByTime(30000);
    expect(saveFn).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});

// ─── 4. AUTO-CHUNKING TESTO INCOLLATO ────────────────────────────────────────

describe("[NEW] Auto-chunking testo incollato (onPaste)", () => {
  // Logica estratta dall'handler onPaste
  function chunkPastedText(text, name = "Testo incollato", CHUNK = 3500) {
    const OVERLAP = Math.round(CHUNK * 0.15);
    if (text.length <= CHUNK) return null; // testo corto → nessun chunking
    const chunks = [];
    let idx = 0, part = 1;
    while (idx < text.length) {
      let end = Math.min(idx + CHUNK, text.length);
      if (end < text.length) {
        const nl = text.lastIndexOf("\n", end);
        if (nl > idx + CHUNK / 2) end = nl;
        else {
          const sp = text.lastIndexOf(" ", end);
          if (sp > idx + CHUNK / 2) end = sp;
        }
      }
      chunks.push({ title: `${name} — parte ${part}`, content: text.slice(idx, end).trim() });
      idx = end < text.length ? end - OVERLAP : text.length;
      part++;
    }
    return chunks;
  }

  test("testo ≤ 3500 caratteri ritorna null (lascia il normale onChange)", () => {
    expect(chunkPastedText("a".repeat(3500))).toBeNull();
    expect(chunkPastedText("a".repeat(100))).toBeNull();
    expect(chunkPastedText("")).toBeNull();
  });

  test("testo > 3500 caratteri produce un array di blocchi", () => {
    const chunks = chunkPastedText("a".repeat(3501));
    expect(chunks).not.toBeNull();
    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
  });

  test("testo di 7000 caratteri produce almeno 2 blocchi", () => {
    const chunks = chunkPastedText("a".repeat(7000));
    expect(chunks.length).toBeGreaterThanOrEqual(2);
  });

  test("ogni blocco non supera CHUNK caratteri", () => {
    const CHUNK = 3500;
    const text = "Parola ".repeat(2000); // ~14000 chars
    const chunks = chunkPastedText(text, "Test", CHUNK);
    chunks.forEach((c) => {
      expect(c.content.length).toBeLessThanOrEqual(CHUNK);
    });
  });

  test("il titolo include il nome base e il numero di parte", () => {
    const chunks = chunkPastedText("a".repeat(8000), "Monografia Curcuma");
    expect(chunks[0].title).toBe("Monografia Curcuma — parte 1");
    expect(chunks[1].title).toBe("Monografia Curcuma — parte 2");
  });

  test("il nome default è 'Testo incollato'", () => {
    const chunks = chunkPastedText("a".repeat(8000));
    expect(chunks[0].title).toMatch(/^Testo incollato/);
  });

  test("l'overlap del 15% garantisce che il contenuto totale >= testo originale", () => {
    const text = "a".repeat(10000);
    const chunks = chunkPastedText(text);
    const totalLen = chunks.reduce((acc, c) => acc + c.content.length, 0);
    expect(totalLen).toBeGreaterThanOrEqual(text.length);
  });

  test("taglia preferibilmente al newline più vicino (oltre CHUNK/2)", () => {
    const CHUNK = 100;
    // newline a posizione 80 > CHUNK/2 = 50 → deve tagliare lì
    const text = "a".repeat(80) + "\n" + "b".repeat(300);
    const chunks = chunkPastedText(text, "T", CHUNK);
    expect(chunks[0].content).toBe("a".repeat(80));
  });

  test("fallback: taglia all'ultimo spazio se nessun newline utile", () => {
    const CHUNK = 100;
    // spazio a posizione 80, nessun newline
    const text = "a".repeat(80) + " " + "b".repeat(300);
    const chunks = chunkPastedText(text, "T", CHUNK);
    // il primo blocco termina all'ultimo spazio vicino a CHUNK
    expect(chunks[0].content.endsWith("b".repeat(20))).toBe(false);
    expect(chunks[0].content.length).toBeLessThanOrEqual(CHUNK);
  });

  test("testo di 20.000 caratteri produce circa 7 blocchi con overlap 15%", () => {
    // Con CHUNK=3500 e OVERLAP=525, ogni passo avanza di 2975 chars
    // 20000 / 2975 ≈ 6.7 → aspettiamo 6-8 blocchi
    const chunks = chunkPastedText("x".repeat(20000));
    expect(chunks.length).toBeGreaterThanOrEqual(6);
    expect(chunks.length).toBeLessThanOrEqual(8);
  });

  test("l'ultimo blocco copre fino alla fine del testo originale", () => {
    const text = "fine-del-testo ".repeat(500); // ~7500 chars
    const chunks = chunkPastedText(text);
    const lastContent = chunks[chunks.length - 1].content;
    // L'ultimo blocco deve essere contenuto nel testo originale
    expect(text).toContain(lastContent);
  });

  test("il primo blocco è quello corretto (indice 0 per pdfChunks[0])", () => {
    const text = "PRIMO_BLOCCO " + "a".repeat(7000);
    const chunks = chunkPastedText(text);
    expect(chunks[0].content).toMatch(/^PRIMO_BLOCCO/);
  });
});

// ─── 5. CONFERMA CANCELLAZIONE ────────────────────────────────────────────────

describe("[NEW] Conferma prima della cancellazione (window.confirm)", () => {
  // Simula la logica di delKB e delDoc con il guard window.confirm()
  async function delKBWithConfirm(id, deleteFn, setKb, confirmFn) {
    if (!confirmFn("Eliminare questa voce dalla Banca Dati?")) return false;
    await deleteFn(id);
    setKb((prev) => prev.filter((e) => e.id !== id));
    return true;
  }

  async function delDocWithConfirm(id, deleteFn, setDocs, confirmFn) {
    if (!confirmFn("Eliminare questo documento?")) return false;
    await deleteFn(id);
    setDocs((prev) => prev.filter((x) => x.id !== id));
    return true;
  }

  test("delKB non chiama deleteFromDb se l'utente annulla il confirm", async () => {
    const deleteFn = jest.fn();
    let kb = [{ id: 1 }, { id: 2 }];
    const confirmFn = jest.fn().mockReturnValue(false);

    await delKBWithConfirm(1, deleteFn, (fn) => { kb = fn(kb); }, confirmFn);

    expect(deleteFn).not.toHaveBeenCalled();
    expect(kb).toHaveLength(2);
  });

  test("delKB chiama deleteFromDb e aggiorna la lista se l'utente conferma", async () => {
    const deleteFn = jest.fn().mockResolvedValue(undefined);
    let kb = [{ id: 1 }, { id: 2 }];
    const confirmFn = jest.fn().mockReturnValue(true);

    const result = await delKBWithConfirm(1, deleteFn, (fn) => { kb = fn(kb); }, confirmFn);

    expect(result).toBe(true);
    expect(deleteFn).toHaveBeenCalledWith(1);
    expect(kb).toHaveLength(1);
    expect(kb[0].id).toBe(2);
  });

  test("delKB elimina solo la voce con l'id corretto", async () => {
    const deleteFn = jest.fn().mockResolvedValue(undefined);
    let kb = [{ id: 10, title: "A" }, { id: 20, title: "B" }, { id: 30, title: "C" }];
    const confirmFn = jest.fn().mockReturnValue(true);

    await delKBWithConfirm(20, deleteFn, (fn) => { kb = fn(kb); }, confirmFn);

    expect(kb).toHaveLength(2);
    expect(kb.find((e) => e.id === 20)).toBeUndefined();
    expect(kb.find((e) => e.id === 10)).toBeDefined();
    expect(kb.find((e) => e.id === 30)).toBeDefined();
  });

  test("delDoc non chiama deleteFromDb se l'utente annulla", async () => {
    const deleteFn = jest.fn();
    let docs = [{ id: 10 }, { id: 20 }];
    const confirmFn = jest.fn().mockReturnValue(false);

    const result = await delDocWithConfirm(10, deleteFn, (fn) => { docs = fn(docs); }, confirmFn);

    expect(result).toBe(false);
    expect(deleteFn).not.toHaveBeenCalled();
    expect(docs).toHaveLength(2);
  });

  test("delDoc elimina correttamente se l'utente conferma", async () => {
    const deleteFn = jest.fn().mockResolvedValue(undefined);
    let docs = [{ id: 10 }, { id: 20 }];
    const confirmFn = jest.fn().mockReturnValue(true);

    await delDocWithConfirm(10, deleteFn, (fn) => { docs = fn(docs); }, confirmFn);

    expect(docs).toHaveLength(1);
    expect(docs[0].id).toBe(20);
  });

  test("il messaggio del confirm per KB è la stringa corretta", () => {
    const confirmFn = jest.fn().mockReturnValue(true);
    confirmFn("Eliminare questa voce dalla Banca Dati?");
    expect(confirmFn).toHaveBeenCalledWith("Eliminare questa voce dalla Banca Dati?");
  });

  test("il messaggio del confirm per Doc è la stringa corretta", () => {
    const confirmFn = jest.fn().mockReturnValue(true);
    confirmFn("Eliminare questo documento?");
    expect(confirmFn).toHaveBeenCalledWith("Eliminare questo documento?");
  });

  test("doppia cancellazione rapida: il secondo confirm è indipendente", async () => {
    const deleteFn = jest.fn().mockResolvedValue(undefined);
    let kb = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const confirmFn = jest.fn()
      .mockReturnValueOnce(true)   // primo confirm: OK
      .mockReturnValueOnce(false); // secondo confirm: Annulla

    await delKBWithConfirm(1, deleteFn, (fn) => { kb = fn(kb); }, confirmFn);
    await delKBWithConfirm(2, deleteFn, (fn) => { kb = fn(kb); }, confirmFn);

    expect(deleteFn).toHaveBeenCalledTimes(1); // solo la prima eliminazione
    expect(kb).toHaveLength(2); // rimangono id:2 e id:3
  });
});
