/**
 * TEST SUITE 3 — Layer API (Supabase + Anthropic + PubMed)
 * Testa le funzioni di comunicazione con servizi esterni usando fetch mock.
 */

// ─── Costanti e funzioni copiate dal sorgente ─────────────────────────────────
const SB_URL = "https://qmjhcbrkqinacycdbskk.supabase.co";
const SB_KEY = "sb_publishable_RXPlDC_Y59epFfqpwLjt_g_NJrVqpA7";

let _jwt = null;
function setJwt(t) { _jwt = t; }

async function sb(path, method = "GET", body = null) {
  const token = _jwt || SB_KEY;
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : null,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text ? JSON.parse(text) : [];
}

async function sbAuth(path, body) {
  const res = await fetch(`${SB_URL}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: SB_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || JSON.stringify(data));
  return data;
}

async function sbSignOut(jwt) {
  await fetch(`${SB_URL}/auth/v1/logout`, {
    method: "POST",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${jwt}` },
  });
}
// ─────────────────────────────────────────────────────────────────────────────

// Helper per creare mock fetch
function mockFetch(status, bodyObj, asText = false) {
  const body = typeof bodyObj === "string" ? bodyObj : JSON.stringify(bodyObj);
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: async () => body,
    json: async () => (typeof bodyObj === "string" ? JSON.parse(bodyObj) : bodyObj),
  });
}

beforeEach(() => {
  _jwt = null; // reset JWT tra i test
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────

describe("sb() — Client REST Supabase", () => {
  test("GET senza body: chiamata corretta", async () => {
    global.fetch = mockFetch(200, [{ id: 1, title: "Test" }]);

    const result = await sb("nm_knowledge_base?limit=5");

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = fetch.mock.calls[0];
    expect(url).toBe(`${SB_URL}/rest/v1/nm_knowledge_base?limit=5`);
    expect(opts.method).toBe("GET");
    expect(opts.headers["apikey"]).toBe(SB_KEY);
    expect(opts.body).toBeNull();
    expect(result).toEqual([{ id: 1, title: "Test" }]);
  });

  test("POST con body: chiamata corretta", async () => {
    const newEntry = { title: "Curcuma", content: "..." };
    global.fetch = mockFetch(201, [{ id: 99, ...newEntry }]);

    const result = await sb("nm_knowledge_base", "POST", newEntry);

    const [url, opts] = fetch.mock.calls[0];
    expect(url).toBe(`${SB_URL}/rest/v1/nm_knowledge_base`);
    expect(opts.method).toBe("POST");
    expect(opts.body).toBe(JSON.stringify(newEntry));
    expect(result).toEqual([{ id: 99, ...newEntry }]);
  });

  test("PATCH con filtro nel path", async () => {
    global.fetch = mockFetch(200, [{ id: 5, active: false }]);

    await sb("nm_user_profiles?id=eq.5", "PATCH", { active: false });

    const [url, opts] = fetch.mock.calls[0];
    expect(url).toContain("nm_user_profiles?id=eq.5");
    expect(opts.method).toBe("PATCH");
    expect(JSON.parse(opts.body)).toEqual({ active: false });
  });

  test("DELETE: chiamata corretta", async () => {
    global.fetch = mockFetch(200, "");

    await sb("nm_knowledge_base?id=eq.42", "DELETE");

    const [url, opts] = fetch.mock.calls[0];
    expect(url).toContain("nm_knowledge_base?id=eq.42");
    expect(opts.method).toBe("DELETE");
  });

  test("usa SB_KEY come Authorization quando JWT non è settato", async () => {
    global.fetch = mockFetch(200, []);
    _jwt = null;

    await sb("nm_patients");

    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["Authorization"]).toBe(`Bearer ${SB_KEY}`);
  });

  test("usa JWT come Authorization quando JWT è settato", async () => {
    global.fetch = mockFetch(200, []);
    _jwt = "my.jwt.token";

    await sb("nm_patients");

    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["Authorization"]).toBe("Bearer my.jwt.token");
  });

  test("lancia eccezione su risposta non-ok (4xx)", async () => {
    global.fetch = mockFetch(401, '{"error":"Unauthorized"}');

    await expect(sb("nm_user_profiles")).rejects.toThrow();
  });

  test("lancia eccezione su risposta 500", async () => {
    global.fetch = mockFetch(500, '{"error":"Internal Server Error"}');

    await expect(sb("nm_knowledge_base")).rejects.toThrow();
  });

  test("risposta vuota: ritorna array vuoto", async () => {
    global.fetch = mockFetch(200, "");

    const result = await sb("nm_access_logs", "DELETE");
    expect(result).toEqual([]);
  });

  test("header Content-Type è sempre application/json", async () => {
    global.fetch = mockFetch(200, []);

    await sb("nm_patients");

    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["Content-Type"]).toBe("application/json");
  });

  test("header Prefer è return=representation", async () => {
    global.fetch = mockFetch(200, []);

    await sb("nm_patients", "POST", { patient_code: "NAT-2025-XXXX" });

    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["Prefer"]).toBe("return=representation");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("sbAuth() — Autenticazione Supabase", () => {
  test("signup: chiama l'endpoint corretto", async () => {
    global.fetch = mockFetch(200, { user: { id: "uuid-123" }, access_token: "tok" });

    const result = await sbAuth("signup", {
      email: "admin@nm.naturopatia",
      password: "password123",
    });

    const [url, opts] = fetch.mock.calls[0];
    expect(url).toBe(`${SB_URL}/auth/v1/signup`);
    expect(opts.method).toBe("POST");
    expect(result.user.id).toBe("uuid-123");
  });

  test("login (token): chiama l'endpoint corretto", async () => {
    global.fetch = mockFetch(200, { access_token: "jwt.token.here", user: { id: "uuid-456" } });

    const result = await sbAuth("token?grant_type=password", {
      email: "user@nm.naturopatia",
      password: "mypassword",
    });

    const [url] = fetch.mock.calls[0];
    expect(url).toBe(`${SB_URL}/auth/v1/token?grant_type=password`);
    expect(result.access_token).toBe("jwt.token.here");
  });

  test("errore auth: lancia eccezione con messaggio da error_description", async () => {
    global.fetch = mockFetch(400, {
      error: "invalid_grant",
      error_description: "Invalid login credentials",
    });

    await expect(
      sbAuth("token?grant_type=password", { email: "x@nm.naturopatia", password: "wrong" })
    ).rejects.toThrow("Invalid login credentials");
  });

  test("errore auth: usa msg se error_description è assente", async () => {
    global.fetch = mockFetch(422, {
      msg: "User already registered",
    });

    await expect(
      sbAuth("signup", { email: "dup@nm.naturopatia", password: "pass1234" })
    ).rejects.toThrow("User already registered");
  });

  test("include apikey nell'header", async () => {
    global.fetch = mockFetch(200, { user: { id: "x" } });

    await sbAuth("signup", { email: "t@nm.naturopatia", password: "test1234" });

    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["apikey"]).toBe(SB_KEY);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("sbSignOut() — Logout Supabase", () => {
  test("chiama il logout endpoint con metodo POST", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    await sbSignOut("my.valid.jwt");

    const [url, opts] = fetch.mock.calls[0];
    expect(url).toBe(`${SB_URL}/auth/v1/logout`);
    expect(opts.method).toBe("POST");
  });

  test("include Authorization header con il JWT fornito", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    await sbSignOut("test.jwt.token");

    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["Authorization"]).toBe("Bearer test.jwt.token");
  });

  test("non lancia errori anche se la risposta è fallita", async () => {
    // sbSignOut non ha gestione errori — il catch deve avvenire nel chiamante
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 });

    // Non deve lanciare
    await expect(sbSignOut("expired.jwt")).resolves.toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("setJwt() — Gestione token", () => {
  test("il JWT viene usato dopo setJwt()", async () => {
    global.fetch = mockFetch(200, []);
    setJwt("nuovo.jwt.token");

    await sb("nm_patients");

    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["Authorization"]).toBe("Bearer nuovo.jwt.token");
  });

  test("setJwt(null) fa tornare al SB_KEY", async () => {
    global.fetch = mockFetch(200, []);
    setJwt("vecchio.token");
    setJwt(null);

    await sb("nm_patients");

    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers["Authorization"]).toBe(`Bearer ${SB_KEY}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Costruzione URL email Supabase Auth", () => {
  // La logica di generazione email è: `${username.toLowerCase().trim()}@nm.naturopatia`
  // Testa la funzione di costruzione inline

  const buildEmail = (username) =>
    `${username.toLowerCase().trim()}@nm.naturopatia`;

  test("username maiuscolo diventa minuscolo", () => {
    expect(buildEmail("ADMIN")).toBe("admin@nm.naturopatia");
  });

  test("spazi iniziali/finali vengono rimossi", () => {
    expect(buildEmail("  mario  ")).toBe("mario@nm.naturopatia");
  });

  test("username valido produce email corretta", () => {
    expect(buildEmail("naturopata")).toBe("naturopata@nm.naturopatia");
  });

  test("username con numeri è accettato", () => {
    expect(buildEmail("user123")).toBe("user123@nm.naturopatia");
  });
});
