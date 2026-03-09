/**
 * TEST SUITE 1 — Funzioni Utility Pure
 * Testa: obfuscate, genCode, fmtDate, fmtDT, fmtTime
 */

// ─── Copia esatta delle funzioni dal sorgente (natura-medica-v3.jsx) ───────
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
const fmtDT = (d) => (d ? new Date(d).toLocaleString() : "");
const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
// ────────────────────────────────────────────────────────────────────────────

describe("obfuscate()", () => {
  test("ritorna stringa vuota se text è vuoto", () => {
    expect(obfuscate("", "key")).toBe("");
  });

  test("ritorna stringa vuota se text è null", () => {
    expect(obfuscate(null, "key")).toBe("");
  });

  test("ritorna stringa vuota se text è undefined", () => {
    expect(obfuscate(undefined, "key")).toBe("");
  });

  test("ritorna stringa vuota se key è vuota", () => {
    expect(obfuscate("RSSMRA80A01H501Z", "")).toBe("");
  });

  test("ritorna stringa vuota se key è null", () => {
    expect(obfuscate("RSSMRA80A01H501Z", null)).toBe("");
  });

  test("produce output non vuoto per input validi", () => {
    const result = obfuscate("RSSMRA80A01H501Z", "miachiave");
    expect(result).not.toBe("");
    expect(typeof result).toBe("string");
  });

  test("output è una stringa Base64 valida", () => {
    const result = obfuscate("RSSMRA80A01H501Z", "miachiave");
    // Base64 usa solo caratteri A-Z a-z 0-9 + / =
    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  test("chiavi diverse producono output diversi (stesso testo)", () => {
    const r1 = obfuscate("RSSMRA80A01H501Z", "chiave1");
    const r2 = obfuscate("RSSMRA80A01H501Z", "chiave2");
    expect(r1).not.toBe(r2);
  });

  test("testi diversi producono output diversi (stessa chiave)", () => {
    const r1 = obfuscate("RSSMRA80A01H501Z", "chiave");
    const r2 = obfuscate("VRDLGI70T10A944S", "chiave");
    expect(r1).not.toBe(r2);
  });

  test("stesso input produce sempre stesso output (deterministica)", () => {
    const r1 = obfuscate("RSSMRA80A01H501Z", "miachiave");
    const r2 = obfuscate("RSSMRA80A01H501Z", "miachiave");
    expect(r1).toBe(r2);
  });

  test("funziona con testo breve (1 carattere)", () => {
    const result = obfuscate("A", "k");
    expect(result).not.toBe("");
    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  test("funziona con testo lungo (100+ caratteri)", () => {
    const longText = "A".repeat(100);
    const result = obfuscate(longText, "mykey");
    expect(result).not.toBe("");
  });

  test("la chiave 'key' (fallback) produce output diverso da chiave custom", () => {
    const withFallback = obfuscate("RSSMRA80A01H501Z", "key");
    const withCustom = obfuscate("RSSMRA80A01H501Z", "miachiave");
    expect(withFallback).not.toBe(withCustom);
  });

  // BUG REGRESSION: quando pwdHash è undefined si usa "key" come fallback
  // Questo è un rischio sicurezza — la chiave fissa rende tutti i CF deoffuscabili allo stesso modo
  test("[REGRESSION BUG] fallback key='key' produce output prevedibile e identico per tutti", () => {
    const cf1 = obfuscate("RSSMRA80A01H501Z", "key");
    const cf2 = obfuscate("VRDLGI70T10A944S", "key");
    // Entrambi prodotti con stessa chiave "key" — un attaccante può invertire entrambi
    // Il test documenta il comportamento (non lo valida come corretto)
    expect(cf1).not.toBe(cf2); // Output diversi anche con chiave fissa
    expect(cf1).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(cf2).toMatch(/^[A-Za-z0-9+/=]+$/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("genCode()", () => {
  test("formato corretto: NAT-ANNO-XXXX", () => {
    const code = genCode();
    expect(code).toMatch(/^NAT-\d{4}-[A-Z0-9]{4}$/);
  });

  test("l'anno nel codice corrisponde all'anno corrente", () => {
    const year = new Date().getFullYear();
    const code = genCode();
    expect(code).toContain(`NAT-${year}-`);
  });

  test("il suffisso è di esattamente 4 caratteri alfanumerici maiuscoli", () => {
    const code = genCode();
    const suffix = code.split("-")[2];
    expect(suffix).toHaveLength(4);
    expect(suffix).toMatch(/^[A-Z0-9]{4}$/);
  });

  test("genera codici unici in 1000 iterazioni", () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(genCode());
    }
    // Altamente probabile che siano tutti unici (Math.random 36^4 = ~1.6M combinazioni)
    expect(codes.size).toBeGreaterThan(990);
  });

  test("ritorna sempre una stringa", () => {
    expect(typeof genCode()).toBe("string");
  });

  test("non contiene spazi", () => {
    const code = genCode();
    expect(code).not.toContain(" ");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("fmtDate()", () => {
  test("ritorna stringa vuota per null", () => {
    expect(fmtDate(null)).toBe("");
  });

  test("ritorna stringa vuota per undefined", () => {
    expect(fmtDate(undefined)).toBe("");
  });

  test("ritorna stringa vuota per stringa vuota", () => {
    expect(fmtDate("")).toBe("");
  });

  test("formatta una data ISO valida", () => {
    const result = fmtDate("2024-01-15T10:30:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("accetta oggetto Date", () => {
    const result = fmtDate(new Date("2024-06-01"));
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("accetta timestamp numerico", () => {
    const result = fmtDate(1700000000000);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("fmtDT()", () => {
  test("ritorna stringa vuota per null", () => {
    expect(fmtDT(null)).toBe("");
  });

  test("ritorna stringa vuota per undefined", () => {
    expect(fmtDT(undefined)).toBe("");
  });

  test("formatta data e ora da stringa ISO", () => {
    const result = fmtDT("2024-01-15T14:30:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("fmtTime()", () => {
  test("ritorna stringa vuota per null", () => {
    expect(fmtTime(null)).toBe("");
  });

  test("ritorna stringa vuota per undefined", () => {
    expect(fmtTime(undefined)).toBe("");
  });

  test("formatta solo l'ora in formato HH:MM", () => {
    const result = fmtTime("2024-01-15T14:30:00Z");
    expect(typeof result).toBe("string");
    // Deve contenere ":"
    expect(result).toContain(":");
  });

  test("output di fmtTime è più corto di fmtDT (solo ora)", () => {
    const dt = "2024-01-15T14:30:00Z";
    expect(fmtTime(dt).length).toBeLessThan(fmtDT(dt).length);
  });
});
