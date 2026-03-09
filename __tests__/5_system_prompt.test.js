/**
 * TEST SUITE 5 — buildSystemPrompt
 * Verifica che il prompt di sistema sia costruito correttamente per tutte le lingue.
 */

// ─── Traduzione minima per il test ───────────────────────────────────────────
const T_ALL = {
  it: { ai_lang: "Rispondi SEMPRE in italiano." },
  en: { ai_lang: "Always respond in English." },
  es: { ai_lang: "Responde SIEMPRE en español." },
  pt: { ai_lang: "Responda SEMPRE em português." },
  fr: { ai_lang: "Réponds TOUJOURS en français." },
  de: { ai_lang: "Antworte IMMER auf Deutsch." },
  ar: { ai_lang: "أجب دائماً باللغة العربية." },
  ja: { ai_lang: "常に日本語で返答してください。" },
};

// ─── Copia esatta di buildSystemPrompt dal sorgente ──────────────────────────
function buildSystemPrompt(lang, kbCtx = "") {
  const T = T_ALL[lang] || T_ALL.it;
  return `Sei un collega esperto in naturopatia con profonde conoscenze in tutte le discipline naturopatiche organizzate nelle seguenti aree:

AREA 1 — BIOENERGETICA E VIBRAZIONALE: Floriterapia (Bach, Australiani, Californiani), Aromaterapia, Cromoterapia, Cristalloterapia, Reiki, Pranopratica, Terapie Suono-Vibrazionali (campane tibetane).

AREA 2 — MANUALE E FISICO-RIFLESSOLOGICA: Riflessologia Plantare/Facciale/Auricolare, Shiatsu, Massaggio Olistico/Bioenergetico, Kinesiologia Specializzata, Craniosacrale Biodinamico, Tuina, Ayurveda (tecniche manuali), Ortho-Bionomy.

AREA 3 — NUTRIZIONALE E FITOTERAPICA: Fitoterapia, Fitoterapia Spagyrica, Oligoterapia, Gemmoterapia, Nutraceutica (integrazione con molecole naturali bioattive: curcumina, berberina, resveratrolo, ecc.), Alimentazione Clinica/Naturale/Consapevole.

AREA 4 — EDUCAZIONE E STILE DI VITA: Iridologia, Idroterapia/Talassoterapia, Bio-Naturopatia, Yoga/Tai Chi/Qi Gong, Medicina Tradizionale Cinese (MTC: agopuntura, coppettazione, moxa), Omeopatia.

AREA 5 — MENTALE E PSICOSOMATICA: Gestione dello Stress, Mindfulness, Immaginazione Guidata, Visualizzazione.

Il tuo interlocutore è un biologo nutrizionista naturopata esperto. Parlate tra colleghi.

IL TUO RUOLO NON È DARGLI RAGIONE. Il tuo ruolo è:
1. Fare domande socratiche che approfondiscano il quadro clinico: chiedi sempre contesto (età, sesso, stile di vita, alimentazione, stress, sonno, storia clinica, farmaci, stagione, costituzione, terreno)
2. Presentare ipotesi multiple da aree diverse (es: "in MTC questo schema fa pensare a... mentre in nutraceutica potrebbe indicare una carenza di...")
3. Evidenziare contraddizioni o punti deboli nel ragionamento del collega
4. Mettere in discussione le sue ipotesi con domande come "Hai escluso che...?" o "Come spieghi allora...?"
5. Suggerire rimedi con basi teoriche chiare, citando sempre disciplina e area di riferimento
6. Segnalare quando un sintomo potrebbe avere origine organica non naturopatica (RED FLAG)
7. Trovare sempre il filo d'unione tra approccio naturopatico e nutrizione clinica/biochimica

Stile: diretto, collegiale, intellettualmente onesto. Usa il "tu". Distingui sempre quale disciplina e area stai citando.
Quando usi materiale dalla BANCA DATI, citalo con [BD: nome fonte].
Quando fai una ricerca web o trovi letteratura scientifica, citala esplicitamente con [WEB: fonte] o [PUBMED: titolo/PMID].
Fai UNA domanda chiave alla volta per non sovraccaricare il dialogo.
${T.ai_lang}

Hai accesso a ricerca web in tempo reale. Usala quando:
- Il collega chiede evidenze scientifiche su un rimedio o sintomo
- Vuoi citare studi recenti da PubMed o fonti autorevoli di medicina tradizionale
- Vuoi verificare interazioni, dosaggi o controindicazioni aggiornate
Fonti preferenziali: PubMed/NCBI, WHO, ESCOP, EMA (fitoterapia), AYUSH (ayurveda), WHO Traditional Medicine, riviste peer-reviewed di medicina integrativa.${kbCtx}`;
}
// ─────────────────────────────────────────────────────────────────────────────

describe("buildSystemPrompt()", () => {
  test("ritorna una stringa non vuota", () => {
    const prompt = buildSystemPrompt("it");
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(100);
  });

  test("include tutte e 5 le AREE", () => {
    const prompt = buildSystemPrompt("it");
    for (let i = 1; i <= 5; i++) {
      expect(prompt).toContain(`AREA ${i}`);
    }
  });

  test("include le discipline principali", () => {
    const prompt = buildSystemPrompt("it");
    ["Fitoterapia", "Omeopatia", "Shiatsu", "Ayurveda", "Reiki", "Mindfulness"].forEach((d) => {
      expect(prompt).toContain(d);
    });
  });

  test("include l'istruzione lingua corretta per italiano", () => {
    const prompt = buildSystemPrompt("it");
    expect(prompt).toContain("Rispondi SEMPRE in italiano.");
  });

  test("include l'istruzione lingua corretta per inglese", () => {
    const prompt = buildSystemPrompt("en");
    expect(prompt).toContain("Always respond in English.");
  });

  test("include l'istruzione lingua corretta per arabo", () => {
    const prompt = buildSystemPrompt("ar");
    expect(prompt).toContain("أجب دائماً باللغة العربية.");
  });

  test("include l'istruzione lingua corretta per giapponese", () => {
    const prompt = buildSystemPrompt("ja");
    expect(prompt).toContain("常に日本語で返答してください。");
  });

  test("fallback a italiano per lingua sconosciuta", () => {
    const prompt = buildSystemPrompt("xx"); // lingua inesistente
    expect(prompt).toContain("Rispondi SEMPRE in italiano.");
  });

  test("include contesto KB se fornito", () => {
    const kbCtx = "\n\n--- BANCA DATI ---\n[Libro Test | Fitoterapia]\nContenuto...\n--- FINE BANCA DATI ---";
    const prompt = buildSystemPrompt("it", kbCtx);
    expect(prompt).toContain("--- BANCA DATI ---");
    expect(prompt).toContain("Libro Test");
  });

  test("senza kbCtx il prompt non contiene la sezione BANCA DATI", () => {
    const prompt = buildSystemPrompt("it", "");
    expect(prompt).not.toContain("--- BANCA DATI ---");
  });

  test("contiene istruzione su RED FLAG", () => {
    const prompt = buildSystemPrompt("it");
    expect(prompt).toContain("RED FLAG");
  });

  test("contiene istruzione citazione [BD:...]", () => {
    const prompt = buildSystemPrompt("it");
    expect(prompt).toContain("[BD: nome fonte]");
  });

  test("contiene istruzione citazione [WEB:...] e [PUBMED:...]", () => {
    const prompt = buildSystemPrompt("it");
    expect(prompt).toContain("[WEB: fonte]");
    expect(prompt).toContain("[PUBMED: titolo/PMID]");
  });

  test("contiene riferimento a PubMed/NCBI e WHO come fonti preferenziali", () => {
    const prompt = buildSystemPrompt("it");
    expect(prompt).toContain("PubMed/NCBI");
    expect(prompt).toContain("WHO");
  });

  test("il prompt è lo stesso per stessa lingua (deterministico senza kbCtx)", () => {
    const p1 = buildSystemPrompt("fr");
    const p2 = buildSystemPrompt("fr");
    expect(p1).toBe(p2);
  });

  test("prompt con kbCtx è più lungo di prompt senza kbCtx", () => {
    const without = buildSystemPrompt("it", "");
    const with_ = buildSystemPrompt("it", "\n\n--- BANCA DATI ---\ntest\n--- FINE ---");
    expect(with_.length).toBeGreaterThan(without.length);
  });

  test("supporta tutte e 8 le lingue senza errori", () => {
    const langs = ["it", "en", "es", "pt", "fr", "de", "ar", "ja"];
    langs.forEach((lang) => {
      expect(() => buildSystemPrompt(lang)).not.toThrow();
      const prompt = buildSystemPrompt(lang);
      expect(prompt.length).toBeGreaterThan(500);
    });
  });
});
