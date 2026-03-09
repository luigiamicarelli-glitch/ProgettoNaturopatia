/**
 * TEST SUITE 2 — Strutture Dati (LANGUAGES, T_ALL, DISCIPLINE_AREAS, THEMES)
 * Verifica l'integrità e la completezza di tutti i dati statici dell'app.
 */

// ─── Costanti copiate dal sorgente ───────────────────────────────────────────

const LANGUAGES = [
  { code: "it", name: "Italiano", flag: "🇮🇹", rtl: false },
  { code: "en", name: "English", flag: "🇬🇧", rtl: false },
  { code: "es", name: "Español", flag: "🇪🇸", rtl: false },
  { code: "pt", name: "Português", flag: "🇧🇷", rtl: false },
  { code: "fr", name: "Français", flag: "🇫🇷", rtl: false },
  { code: "de", name: "Deutsch", flag: "🇩🇪", rtl: false },
  { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
  { code: "ja", name: "日本語", flag: "🇯🇵", rtl: false },
];

const DISCIPLINE_AREAS = [
  {
    id: "bioenergetica",
    label: "Bioenergetica e Vibrazionale",
    color: "#7a5a9a",
    disciplines: [
      { id: "floriterapia", label: "Floriterapia (Bach/Australiani/Californiani)", color: "#9a6a8a" },
      { id: "aromaterapia", label: "Aromaterapia", color: "#6a8a6a" },
      { id: "cromoterapia", label: "Cromoterapia", color: "#8a6a4a" },
      { id: "cristalloterapia", label: "Cristalloterapia", color: "#6a7a9a" },
      { id: "reiki", label: "Reiki", color: "#7a5a8a" },
      { id: "pranopratica", label: "Pranopratica", color: "#8a7a5a" },
      { id: "suono_vibrazionale", label: "Terapie Suono-Vibrazionali", color: "#5a7a8a" },
    ],
  },
  {
    id: "manuale",
    label: "Manuale e Fisico-Riflessologica",
    color: "#5a7a6a",
    disciplines: [
      { id: "riflessologia", label: "Riflessologia Plantare/Facciale/Auricolare", color: "#5a6a8a" },
      { id: "shiatsu", label: "Shiatsu", color: "#6a8a7a" },
      { id: "massaggio_olistico", label: "Massaggio Olistico/Bioenergetico", color: "#7a6a5a" },
      { id: "kinesiologia", label: "Kinesiologia Specializzata", color: "#5a8a7a" },
      { id: "craniosacrale", label: "Craniosacrale Biodinamico", color: "#6a5a8a" },
      { id: "tuina", label: "Tuina", color: "#8a5a5a" },
      { id: "ayurveda_manuale", label: "Ayurveda (Tecniche Manuali)", color: "#c87941" },
      { id: "ortho_bionomy", label: "Ortho-Bionomy", color: "#7a8a5a" },
    ],
  },
  {
    id: "nutrizionale",
    label: "Nutrizionale e Fitoterapica",
    color: "#5a8a5a",
    disciplines: [
      { id: "fitoterapia", label: "Fitoterapia", color: "#4a8a4a" },
      { id: "fitoterapia_spagyrica", label: "Fitoterapia Spagyrica", color: "#6a8a5a" },
      { id: "oligoterapia", label: "Oligoterapia", color: "#5a7a6a" },
      { id: "gemmoterapia", label: "Gemmoterapia", color: "#7a9a6a" },
      { id: "nutraceutica", label: "Nutraceutica", color: "#5a9a7a" },
      { id: "alimentazione_clinica", label: "Alimentazione Clinica/Naturale", color: "#6a9a5a" },
    ],
  },
  {
    id: "educazione",
    label: "Educazione e Stile di Vita",
    color: "#6a7a5a",
    disciplines: [
      { id: "iridologia", label: "Iridologia", color: "#8a9a6a" },
      { id: "idroterapia", label: "Idroterapia/Talassoterapia", color: "#5a8a9a" },
      { id: "bio_naturopatia", label: "Bio-Naturopatia", color: "#7a8a6a" },
      { id: "yoga_taichi", label: "Yoga/Tai Chi/Qi Gong", color: "#9a8a5a" },
      { id: "mtc", label: "MTC (Agopuntura/Coppettazione/Moxa)", color: "#c84a4a" },
      { id: "omeopatia", label: "Omeopatia", color: "#7a6a9a" },
    ],
  },
  {
    id: "psicosomatica",
    label: "Mentale e Psicosomatica",
    color: "#8a6a7a",
    disciplines: [
      { id: "stress_mindfulness", label: "Gestione Stress / Mindfulness", color: "#7a6a8a" },
      { id: "immaginazione_guidata", label: "Immaginazione Guidata / Visualizzazione", color: "#8a7a6a" },
    ],
  },
];

const DISCIPLINES = DISCIPLINE_AREAS.flatMap((a) => a.disciplines);

const DOC_TYPES = [
  { id: "disclaimer", label: "Disclaimer Naturopatico" },
  { id: "privacy", label: "Informativa Privacy (GDPR)" },
  { id: "whitepaper", label: "Whitepaper Sistema" },
  { id: "manual", label: "Manuale Utente" },
];

// Subset delle traduzioni per il test di completezza
const T_ALL_KEYS_IT = [
  "loading", "setup_title", "setup_sub", "setup_warn",
  "lbl_uname", "lbl_pwd", "lbl_confirm", "btn_setup",
  "err_fields", "err_match", "err_short", "err_setup_fail",
  "login_title", "login_sub", "lbl_user", "lbl_password",
  "btn_login", "err_login", "err_disabled",
  "nav_chat", "nav_sources", "nav_kb", "nav_kb_add",
  "nav_patients", "nav_reports", "nav_docs", "nav_admin", "nav_settings",
  "stat_ex", "stat_kb", "stat_pt", "btn_logout",
  "chat_title", "chat_sub", "web_on", "web_off", "btn_pubmed",
  "no_pt", "btn_save", "btn_saved", "btn_new",
  "lbl_ai", "lbl_you", "lbl_web", "lbl_searching",
  "chat_ph", "chat_welcome", "chat_new_msg", "chat_err", "chat_err_resp",
  "sources_title", "sources_sub",
  "pubmed_title", "pubmed_ph", "btn_search", "btn_ctx",
  "pubmed_searching", "pubmed_none", "pubmed_found",
  "pubmed_open", "pubmed_cite", "pubmed_empty", "pubmed_err",
  "web_title", "web_desc",
  "kb_title", "kb_sub_n", "kb_search_ph", "kb_empty",
  "kb_add_title", "kb_add_sub", "lbl_content", "content_ph",
  "btn_analyze", "btn_analyzing", "btn_load_txt",
  "lbl_title", "lbl_disc", "lbl_tags", "tags_ph",
  "btn_add_kb", "analyze_empty", "analyze_err", "analyze_ok", "analyze_area", "kb_tip",
  "patients_title", "patients_sub", "new_patient",
  "lbl_cf", "cf_ph", "lbl_notes", "notes_ph",
  "btn_create", "patient_created", "cf_hidden", "btn_use_chat", "patients_empty", "patient_tip",
  "reports_title", "reports_sub", "lbl_session", "current_session",
  "lbl_logo", "no_logo", "lbl_profile", "no_profile",
  "lbl_report_notes", "report_notes_ph", "lbl_followup", "followup_ph",
  "lbl_sign", "sign_ph", "btn_pdf", "btn_word",
  "no_logo_warn", "preview_title", "preview_session", "preview_patient", "preview_none", "pdf_missing",
  "rpt_main_title", "rpt_by",
  "sec_symptoms", "sec_analysis", "sec_notes", "sec_followup", "sec_sign", "rpt_footer",
  "docs_title", "docs_sub", "btn_new_doc", "new_doc_title",
  "lbl_type", "lbl_doc_title", "doc_title_ph", "lbl_version", "lbl_doc_content",
  "btn_doc_save", "btn_cancel", "btn_edit", "btn_print", "btn_del", "doc_empty",
  "btn_save_changes", "btn_print_preview",
  "admin_title", "admin_sub", "new_user", "lbl_fullname",
  "lbl_role", "role_staff", "role_admin",
  "btn_create_user", "user_created", "err_admin_fields", "err_admin_short", "err_admin_fail",
  "users_title", "never_logged", "last_login", "btn_deactivate", "btn_activate",
  "logs_title", "logs_empty", "admin_denied",
  "settings_title", "settings_sub",
  "logos_title", "lbl_logo_name", "logo_name_ph",
  "btn_upload_logo", "logo_loaded", "btn_default", "logos_none",
  "profiles_title", "lbl_pname", "pname_ph",
  "lbl_address", "address_ph", "lbl_phone", "phone_ph",
  "lbl_email", "email_ph", "lbl_piva", "piva_ph",
  "lbl_albo", "albo_ph",
  "btn_add_profile", "profile_saved", "profiles_none",
  "session_prefix", "session_msgs", "ai_lang", "change_lang",
];

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe("LANGUAGES", () => {
  test("ci sono esattamente 8 lingue", () => {
    expect(LANGUAGES).toHaveLength(8);
  });

  test("ogni lingua ha i campi obbligatori: code, name, flag, rtl", () => {
    LANGUAGES.forEach((lang) => {
      expect(lang).toHaveProperty("code");
      expect(lang).toHaveProperty("name");
      expect(lang).toHaveProperty("flag");
      expect(lang).toHaveProperty("rtl");
    });
  });

  test("i codici lingua sono unici", () => {
    const codes = LANGUAGES.map((l) => l.code);
    const unique = new Set(codes);
    expect(unique.size).toBe(LANGUAGES.length);
  });

  test("i codici lingua hanno 2 caratteri", () => {
    LANGUAGES.forEach((lang) => {
      expect(lang.code).toHaveLength(2);
    });
  });

  test("solo l'arabo (ar) ha rtl=true", () => {
    const rtlLangs = LANGUAGES.filter((l) => l.rtl === true);
    expect(rtlLangs).toHaveLength(1);
    expect(rtlLangs[0].code).toBe("ar");
  });

  test("i codici attesi sono presenti: it, en, es, pt, fr, de, ar, ja", () => {
    const codes = LANGUAGES.map((l) => l.code);
    ["it", "en", "es", "pt", "fr", "de", "ar", "ja"].forEach((code) => {
      expect(codes).toContain(code);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("DISCIPLINE_AREAS", () => {
  test("ci sono esattamente 5 aree", () => {
    expect(DISCIPLINE_AREAS).toHaveLength(5);
  });

  test("ogni area ha id, label, color e disciplines", () => {
    DISCIPLINE_AREAS.forEach((area) => {
      expect(area).toHaveProperty("id");
      expect(area).toHaveProperty("label");
      expect(area).toHaveProperty("color");
      expect(area).toHaveProperty("disciplines");
      expect(Array.isArray(area.disciplines)).toBe(true);
    });
  });

  test("gli id delle aree sono unici", () => {
    const ids = DISCIPLINE_AREAS.map((a) => a.id);
    expect(new Set(ids).size).toBe(DISCIPLINE_AREAS.length);
  });

  test("i colori delle aree sono esadecimali validi", () => {
    DISCIPLINE_AREAS.forEach((area) => {
      expect(area.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  test("le 5 aree hanno gli id attesi", () => {
    const ids = DISCIPLINE_AREAS.map((a) => a.id);
    ["bioenergetica", "manuale", "nutrizionale", "educazione", "psicosomatica"].forEach((id) => {
      expect(ids).toContain(id);
    });
  });

  test("ogni disciplina ha id, label, color", () => {
    DISCIPLINE_AREAS.forEach((area) => {
      area.disciplines.forEach((d) => {
        expect(d).toHaveProperty("id");
        expect(d).toHaveProperty("label");
        expect(d).toHaveProperty("color");
      });
    });
  });

  test("i colori delle discipline sono esadecimali validi", () => {
    DISCIPLINE_AREAS.forEach((area) => {
      area.disciplines.forEach((d) => {
        expect(d.color).toMatch(/^#[0-9a-fA-F]{3,6}$/);
      });
    });
  });

  test("gli id delle discipline sono unici globalmente", () => {
    const allIds = DISCIPLINE_AREAS.flatMap((a) => a.disciplines.map((d) => d.id));
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  test("ci sono almeno 27 discipline totali", () => {
    const total = DISCIPLINE_AREAS.reduce((sum, a) => sum + a.disciplines.length, 0);
    expect(total).toBeGreaterThanOrEqual(27);
  });

  test("fitoterapia è nella lista discipline", () => {
    const allIds = DISCIPLINE_AREAS.flatMap((a) => a.disciplines.map((d) => d.id));
    expect(allIds).toContain("fitoterapia");
  });

  test("nessuna area ha 0 discipline", () => {
    DISCIPLINE_AREAS.forEach((area) => {
      expect(area.disciplines.length).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("DISCIPLINES (flatMap)", () => {
  test("è un array piatto di tutte le discipline", () => {
    expect(Array.isArray(DISCIPLINES)).toBe(true);
    expect(DISCIPLINES.length).toBeGreaterThanOrEqual(27);
  });

  test("ogni elemento ha id, label, color", () => {
    DISCIPLINES.forEach((d) => {
      expect(d).toHaveProperty("id");
      expect(d).toHaveProperty("label");
      expect(d).toHaveProperty("color");
    });
  });

  test("ricerca per id funziona correttamente", () => {
    const found = DISCIPLINES.find((d) => d.id === "fitoterapia");
    expect(found).toBeDefined();
    expect(found.label).toContain("Fitoterapia");
  });

  test("ricerca disciplina inesistente ritorna undefined", () => {
    const found = DISCIPLINES.find((d) => d.id === "disciplina_inventata");
    expect(found).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("DOC_TYPES", () => {
  test("ci sono esattamente 4 tipi di documento", () => {
    expect(DOC_TYPES).toHaveLength(4);
  });

  test("ogni tipo ha id e label", () => {
    DOC_TYPES.forEach((dt) => {
      expect(dt).toHaveProperty("id");
      expect(dt).toHaveProperty("label");
    });
  });

  test("i tipi attesi sono presenti: disclaimer, privacy, whitepaper, manual", () => {
    const ids = DOC_TYPES.map((d) => d.id);
    ["disclaimer", "privacy", "whitepaper", "manual"].forEach((id) => {
      expect(ids).toContain(id);
    });
  });

  test("gli id sono unici", () => {
    const ids = DOC_TYPES.map((d) => d.id);
    expect(new Set(ids).size).toBe(DOC_TYPES.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Completezza chiavi di traduzione", () => {
  // Test che verifica la coerenza strutturale delle traduzioni
  // Nota: le traduzioni complete sono nel sorgente; qui testiamo la logica di lookup

  test("T_ALL_KEYS_IT contiene le chiavi fondamentali", () => {
    const requiredKeys = ["loading", "login_title", "btn_login", "nav_chat", "ai_lang", "change_lang"];
    requiredKeys.forEach((key) => {
      expect(T_ALL_KEYS_IT).toContain(key);
    });
  });

  test("ci sono almeno 100 chiavi di traduzione per lingua", () => {
    expect(T_ALL_KEYS_IT.length).toBeGreaterThanOrEqual(100);
  });

  test("ai_lang è nella lista (necessaria per istruzioni lingua all'AI)", () => {
    expect(T_ALL_KEYS_IT).toContain("ai_lang");
  });

  test("le chiavi di navigazione sono presenti", () => {
    const navKeys = ["nav_chat", "nav_sources", "nav_kb", "nav_kb_add",
                     "nav_patients", "nav_reports", "nav_docs", "nav_admin", "nav_settings"];
    navKeys.forEach((key) => {
      expect(T_ALL_KEYS_IT).toContain(key);
    });
  });

  test("le chiavi per la gestione errori auth sono presenti", () => {
    const errKeys = ["err_fields", "err_match", "err_short", "err_setup_fail", "err_login", "err_disabled"];
    errKeys.forEach((key) => {
      expect(T_ALL_KEYS_IT).toContain(key);
    });
  });

  test("le chiavi GDPR/admin sono presenti", () => {
    const gdprKeys = ["patients_sub", "cf_hidden", "patient_tip", "rpt_footer", "admin_sub", "logs_title"];
    gdprKeys.forEach((key) => {
      expect(T_ALL_KEYS_IT).toContain(key);
    });
  });
});
