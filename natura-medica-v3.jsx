import { useState, useRef, useEffect, useCallback } from "react";

// Inject CSS for blink animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} } @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Mono:wght@300;400&display=swap'); button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid var(--nm-accent,#6aaa6a);outline-offset:2px;border-radius:4px}`;
  document.head.appendChild(style);
}


// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const SB_URL = "https://qmjhcbrkqinacycdbskk.supabase.co";
const SB_KEY = "sb_publishable_RXPlDC_Y59epFfqpwLjt_g_NJrVqpA7";
const APP_VER = "3.0.0";

// ═══════════════════════════════════════════════════════════════
// MULTILINGUAL SYSTEM — 8 lingue
// ═══════════════════════════════════════════════════════════════
const LANGUAGES = [
  {code:"it",name:"Italiano",  flag:"🇮🇹",rtl:false},
  {code:"en",name:"English",   flag:"🇬🇧",rtl:false},
  {code:"es",name:"Español",   flag:"🇪🇸",rtl:false},
  {code:"pt",name:"Português", flag:"🇧🇷",rtl:false},
  {code:"fr",name:"Français",  flag:"🇫🇷",rtl:false},
  {code:"de",name:"Deutsch",   flag:"🇩🇪",rtl:false},
  {code:"ar",name:"العربية",   flag:"🇸🇦",rtl:true },
  {code:"ja",name:"日本語",     flag:"🇯🇵",rtl:false},
];

const T_ALL = {
it:{
  loading:"Connessione a Supabase in corso...",
  setup_title:"Configurazione Iniziale",setup_sub:"Crea account amministratore — conserva le credenziali in luogo sicuro",
  setup_warn:'⚠️ Prima di procedere: Supabase → Authentication → Settings → disabilita "Enable email confirmations"',
  lbl_uname:"Username Amministratore",lbl_pwd:"Password (min. 8 caratteri)",lbl_confirm:"Conferma Password",
  btn_setup:"Configura Sistema",err_fields:"Compila tutti i campi",err_match:"Le password non coincidono",
  err_short:"Password minimo 8 caratteri",err_setup_fail:"Errore registrazione. Verifica la conferma email in Supabase.",
  login_title:"Accesso Riservato",login_sub:"Sistema di supporto naturopatico professionale",
  lbl_user:"Username",lbl_password:"Password",btn_login:"Accedi",
  err_login:"Credenziali non valide o errore di connessione.",err_disabled:"Account disattivato.",
  nav_chat:"Consultazione",nav_sources:"Fonti Scientifiche",nav_kb:"Banca Dati",
  nav_kb_add:"Aggiungi Fonte",nav_patients:"Pazienti",nav_reports:"Referti",
  nav_docs:"Documenti",nav_admin:"Admin",nav_settings:"Impostazioni",
  stat_ex:"Scambi",stat_kb:"Fonti KB",stat_pt:"Pazienti",btn_logout:"Esci / Blocca",
  chat_title:"Consultazione AI",chat_sub:"Il collega AI ragiona con te — non ti dà semplicemente ragione",
  web_on:"🌐 Web ON",web_off:"🌐 Web OFF",btn_pubmed:"📚 PubMed",
  no_pt:"Nessun paziente",btn_save:"Salva",btn_saved:"✓ Salvata",btn_new:"Nuova",
  lbl_ai:"Collega AI · ",lbl_you:"Tu · ",lbl_web:"🌐 web",lbl_searching:"cerca sul web...",
  chat_ph:"Descrivi sintomi, contesto, ipotesi... (Invio = invia, Shift+Invio = a capo)",
  chat_welcome:"Ciao collega. Pronto a ragionare su un caso clinico.\n\nDescrivimi i sintomi — più contesto mi dai, meglio lavoriamo.",
  chat_new_msg:"Nuova sessione. Presentami il caso — parti dai sintomi e dal contesto del paziente.",
  chat_err:"⚠️ Errore connessione.",chat_err_resp:"Errore risposta.",
  sources_title:"Fonti Scientifiche",sources_sub:"PubMed · Letteratura peer-reviewed · Medicine tradizionali",
  pubmed_title:"🔬 Ricerca PubMed / NCBI",pubmed_ph:"Es: curcumin inflammation, berberine gut...",
  btn_search:"Cerca",btn_ctx:"Dal contesto",
  pubmed_searching:"Ricerca in corso su PubMed...",pubmed_none:"Nessun risultato trovato.",
  pubmed_found:"articoli trovati",pubmed_open:"Apri su PubMed ↗",pubmed_cite:"→ Cita in chat",
  pubmed_empty:'Cerca direttamente oppure usa "Dal contesto" per cercare automaticamente.',
  pubmed_err:"Errore PubMed. Controlla la connessione.",
  web_title:"🌐 Ricerca Web in Consultazione",
  web_desc:"Il collega AI ha accesso alla ricerca web in tempo reale quando Web ON è attivo.",
  kb_title:"Banca Dati Naturopatica",kb_sub_n:" fonti · usate automaticamente dall'AI",
  kb_search_ph:"Cerca...",kb_empty:'Nessuna fonte. Vai su "Aggiungi Fonte" per iniziare.',
  kb_add_title:"Aggiungi Fonte alla Banca Dati",kb_add_sub:"Incolla testo → Analizza → verifica → salva",
  lbl_content:"Contenuto (incolla prima il testo — poi usa Analizza)",
  content_ph:"Incolla il testo della fonte: sintomi, rimedi, indicazioni...",
  btn_analyze:"🔍 Analizza e Categorizza",btn_analyzing:"⏳ Analisi...",btn_load_txt:"📄 Carica .txt",
  lbl_title:"Titolo / Riferimento Bibliografico",title_ph:"Es: Weiss R.F. — Fitoterapia, cap.4",
  lbl_disc:"Disciplina (compilata automaticamente se usi Analizza)",
  lbl_tags:"Tag (separati da virgola)",tags_ph:"fegato, digestione, bile, colesterolo",
  btn_add_kb:"Aggiungi alla Banca Dati",analyze_empty:"Inserisci prima il testo da analizzare.",
  analyze_err:"Errore analisi. Controlla il testo e riprova.",
  analyze_ok:"✓ Categorizzato come:",analyze_area:"· Area:",
  kb_tip:"Flusso: incolla → Analizza → verifica → titolo → Aggiungi.",
  patients_title:"Gestione Pazienti",patients_sub:"Pseudonimizzati — CF oscurato nel database",
  new_patient:"Nuovo Paziente",lbl_cf:"Codice Fiscale (facoltativo — sarà oscurato)",
  cf_ph:"RSSMRA80A01H501Z",lbl_notes:"Note Anamnestiche",
  notes_ph:"Età, sesso, condizioni di base, allergie note...",
  btn_create:"Crea Paziente",patient_created:"Paziente creato:",
  cf_hidden:"CF: ████████████████",btn_use_chat:"Usa in chat",
  patients_empty:"Nessun paziente registrato.",
  patient_tip:"Codice (NAT-ANNO-XXXX) generato automaticamente. CF oscurato nel DB.",
  reports_title:"Genera Referto",reports_sub:"Seleziona sessione, configura e scarica PDF o Word",
  lbl_session:"Sessione",current_session:"Sessione corrente",
  lbl_logo:"Logo Studio",no_logo:"Nessun logo",lbl_profile:"Profilo Studio",no_profile:"Nessun profilo",
  lbl_report_notes:"Note e Ultimi Suggerimenti",report_notes_ph:"Raccomandazioni finali, rimedi scelti, stile di vita...",
  lbl_followup:"Follow-up Consigliato",followup_ph:"Es: Rivalutazione tra 4 settimane",
  lbl_sign:"Firma / Qualifica",sign_ph:"Es: Dott. Mario Rossi — Biologo Nutrizionista Naturopata",
  btn_pdf:"📄 PDF",btn_word:"📝 Word",
  no_logo_warn:"💡 Nessun logo. Vai su Impostazioni per aggiungere il logo del tuo studio.",
  preview_title:"Anteprima",preview_session:"Sessione:",preview_patient:"Paziente:",
  preview_none:"Non specificato",pdf_missing:"Libreria PDF in caricamento, riprova tra un secondo.",
  rpt_main_title:"REFERTO NATUROPATICO",rpt_by:"Redatto da:",
  sec_symptoms:"SINTOMI E QUADRO CLINICO RIFERITO",sec_analysis:"ANALISI E IPOTESI NATUROPATICHE",
  sec_notes:"NOTE E ULTIMI SUGGERIMENTI",sec_followup:"FOLLOW-UP CONSIGLIATO",
  sec_sign:"Firma del Professionista: ___________________________",
  rpt_footer:"Le indicazioni naturopatiche non sostituiscono diagnosi medica né terapia farmacologica. Natura Medica v",
  docs_title:"Documenti",docs_sub:"Disclaimer · Privacy · Whitepaper · Manuale",
  btn_new_doc:"+ Nuovo Documento",new_doc_title:"Nuovo Documento",
  lbl_type:"Tipo",lbl_doc_title:"Titolo",doc_title_ph:"Es: Disclaimer - Studio Roma - v2.0",
  lbl_version:"Versione",lbl_doc_content:"Contenuto",
  btn_doc_save:"Salva",btn_cancel:"Annulla",btn_edit:"✏ Modifica",
  btn_print:"🖨 Stampa",btn_del:"✕",doc_empty:"Nessun documento di questo tipo.",
  btn_save_changes:"Salva Modifiche",btn_print_preview:"🖨 Stampa Anteprima",
  admin_title:"Pannello Amministratore",admin_sub:"Gestione utenti · Log accessi · GDPR",
  new_user:"Nuovo Utente",lbl_fullname:"Nome Completo",
  lbl_role:"Ruolo",role_staff:"Staff",role_admin:"Amministratore",
  btn_create_user:"Crea Utente",user_created:"Utente creato con successo.",
  err_admin_fields:"Compila tutti i campi",err_admin_short:"Password minimo 8 caratteri",
  err_admin_fail:"Registrazione fallita.",
  users_title:"Utenti Registrati",never_logged:"mai acceduto",last_login:"ultimo accesso:",
  btn_deactivate:"Disattiva",btn_activate:"Attiva",
  logs_title:"Log Accessi",logs_empty:"Nessun log disponibile.",
  admin_denied:"Solo gli amministratori possono accedere a questa sezione.",
  settings_title:"Impostazioni",settings_sub:"Loghi studio · Profili studio",
  logos_title:"Loghi Studio",lbl_logo_name:"Nome Logo",logo_name_ph:"Es: Studio Roma",
  btn_upload_logo:"📁 Carica Logo (JPEG/PNG)",logo_loaded:"Logo caricato.",
  btn_default:"★ Default",logos_none:"Nessun logo caricato.",
  profiles_title:"Profili Studio",lbl_pname:"Nome Studio *",pname_ph:"Studio Naturopatico...",
  lbl_address:"Indirizzo",address_ph:"Via Roma 1, Milano",lbl_phone:"Telefono",phone_ph:"+39 02 1234567",
  lbl_email:"Email",email_ph:"studio@email.it",lbl_piva:"P.IVA",piva_ph:"12345678901",
  lbl_albo:"Nr. Albo / Registro",albo_ph:"123456",
  btn_add_profile:"Aggiungi Profilo",profile_saved:"Profilo salvato.",profiles_none:"Nessun profilo configurato.",
  session_prefix:"Sessione",session_msgs:"messaggi",
  ai_lang:"Rispondi SEMPRE in italiano.",
  change_lang:"← Cambia lingua",
},
en:{
  loading:"Connecting to Supabase...",
  setup_title:"Initial Setup",setup_sub:"Create administrator account — keep credentials in a safe place",
  setup_warn:'⚠️ Before proceeding: Supabase → Authentication → Settings → disable "Enable email confirmations"',
  lbl_uname:"Administrator Username",lbl_pwd:"Password (min. 8 characters)",lbl_confirm:"Confirm Password",
  btn_setup:"Configure System",err_fields:"Please fill in all fields",err_match:"Passwords do not match",
  err_short:"Password must be at least 8 characters",err_setup_fail:"Registration error. Check email confirmations in Supabase.",
  login_title:"Restricted Access",login_sub:"Professional naturopathic support system",
  lbl_user:"Username",lbl_password:"Password",btn_login:"Sign In",
  err_login:"Invalid credentials or connection error.",err_disabled:"Account deactivated.",
  nav_chat:"Consultation",nav_sources:"Scientific Sources",nav_kb:"Knowledge Base",
  nav_kb_add:"Add Source",nav_patients:"Patients",nav_reports:"Reports",
  nav_docs:"Documents",nav_admin:"Admin",nav_settings:"Settings",
  stat_ex:"Exchanges",stat_kb:"KB Sources",stat_pt:"Patients",btn_logout:"Sign Out / Lock",
  chat_title:"AI Consultation",chat_sub:"Your AI colleague reasons with you — does not simply agree",
  web_on:"🌐 Web ON",web_off:"🌐 Web OFF",btn_pubmed:"📚 PubMed",
  no_pt:"No patient",btn_save:"Save",btn_saved:"✓ Saved",btn_new:"New",
  lbl_ai:"AI Colleague · ",lbl_you:"You · ",lbl_web:"🌐 web",lbl_searching:"searching the web...",
  chat_ph:"Describe symptoms, context, hypothesis... (Enter = send, Shift+Enter = new line)",
  chat_welcome:"Hello colleague. Ready to reason through a clinical case.\n\nDescribe the symptoms — the more context you give me, the better we work.",
  chat_new_msg:"New session. Present the case — start with symptoms and patient context.",
  chat_err:"⚠️ Connection error.",chat_err_resp:"Response error.",
  sources_title:"Scientific Sources",sources_sub:"PubMed · Peer-reviewed literature · Traditional medicine",
  pubmed_title:"🔬 PubMed / NCBI Search",pubmed_ph:"e.g.: curcumin inflammation, berberine gut...",
  btn_search:"Search",btn_ctx:"From context",
  pubmed_searching:"Searching PubMed...",pubmed_none:"No results found.",
  pubmed_found:"articles found",pubmed_open:"Open on PubMed ↗",pubmed_cite:"→ Cite in chat",
  pubmed_empty:'Search directly or use "From context" to find relevant articles automatically.',
  pubmed_err:"PubMed search error. Check your connection.",
  web_title:"🌐 Web Search in Consultation",
  web_desc:"The AI colleague has real-time web search access when Web ON is active.",
  kb_title:"Naturopathic Knowledge Base",kb_sub_n:" sources · automatically used by AI",
  kb_search_ph:"Search...",kb_empty:'No sources. Go to "Add Source" to get started.',
  kb_add_title:"Add Source to Knowledge Base",kb_add_sub:"Paste text → Analyse → verify → save",
  lbl_content:"Content (paste text first — then use Analyse)",
  content_ph:"Paste source text: symptoms, remedies, indications...",
  btn_analyze:"🔍 Analyse and Categorise",btn_analyzing:"⏳ Analysing...",btn_load_txt:"📄 Load .txt",
  lbl_title:"Title / Bibliographic Reference",title_ph:"e.g.: Weiss R.F. — Herbal Medicine, ch.4",
  lbl_disc:"Discipline (auto-filled if you use Analyse)",
  lbl_tags:"Tags (comma-separated)",tags_ph:"liver, digestion, bile, cholesterol",
  btn_add_kb:"Add to Knowledge Base",analyze_empty:"Please insert text to analyse first.",
  analyze_err:"Analysis error. Check the text and try again.",
  analyze_ok:"✓ Categorised as:",analyze_area:"· Area:",
  kb_tip:"Workflow: paste → Analyse → verify → title → Add.",
  patients_title:"Patient Management",patients_sub:"Pseudonymised — tax ID obfuscated in database",
  new_patient:"New Patient",lbl_cf:"Tax / National ID (optional — will be obfuscated)",
  cf_ph:"National ID",lbl_notes:"Anamnesis Notes",
  notes_ph:"Age, sex, baseline conditions, known allergies...",
  btn_create:"Create Patient",patient_created:"Patient created:",
  cf_hidden:"ID: ████████████████",btn_use_chat:"Use in chat",
  patients_empty:"No patients registered.",
  patient_tip:"Patient code (NAT-YEAR-XXXX) generated automatically. ID obfuscated in DB.",
  reports_title:"Generate Report",reports_sub:"Select session, configure and download PDF or Word",
  lbl_session:"Session",current_session:"Current session",
  lbl_logo:"Practice Logo",no_logo:"No logo",lbl_profile:"Practice Profile",no_profile:"No profile",
  lbl_report_notes:"Notes and Final Recommendations",report_notes_ph:"Final recommendations, chosen remedies, lifestyle...",
  lbl_followup:"Recommended Follow-up",followup_ph:"e.g.: Reassessment in 4 weeks",
  lbl_sign:"Signature / Qualification",sign_ph:"e.g.: Dr. John Smith — Naturopathic Nutritionist",
  btn_pdf:"📄 PDF",btn_word:"📝 Word",
  no_logo_warn:"💡 No logo. Go to Settings to add your practice logo.",
  preview_title:"Preview",preview_session:"Session:",preview_patient:"Patient:",
  preview_none:"Not specified",pdf_missing:"PDF library loading, try again in a second.",
  rpt_main_title:"NATUROPATHIC REPORT",rpt_by:"Prepared by:",
  sec_symptoms:"SYMPTOMS AND REPORTED CLINICAL PICTURE",sec_analysis:"NATUROPATHIC ANALYSIS AND HYPOTHESES",
  sec_notes:"NOTES AND FINAL RECOMMENDATIONS",sec_followup:"RECOMMENDED FOLLOW-UP",
  sec_sign:"Practitioner Signature: ___________________________",
  rpt_footer:"Naturopathic recommendations do not replace medical diagnosis or drug therapy. Natura Medica v",
  docs_title:"Documents",docs_sub:"Disclaimer · Privacy · Whitepaper · Manual",
  btn_new_doc:"+ New Document",new_doc_title:"New Document",
  lbl_type:"Type",lbl_doc_title:"Title",doc_title_ph:"e.g.: Disclaimer - London Practice - v2.0",
  lbl_version:"Version",lbl_doc_content:"Content",
  btn_doc_save:"Save",btn_cancel:"Cancel",btn_edit:"✏ Edit",
  btn_print:"🖨 Print",btn_del:"✕",doc_empty:"No documents of this type.",
  btn_save_changes:"Save Changes",btn_print_preview:"🖨 Print Preview",
  admin_title:"Administrator Panel",admin_sub:"User management · Access logs · GDPR",
  new_user:"New User",lbl_fullname:"Full Name",
  lbl_role:"Role",role_staff:"Staff",role_admin:"Administrator",
  btn_create_user:"Create User",user_created:"User created successfully.",
  err_admin_fields:"Please fill in all fields",err_admin_short:"Password min 8 characters",
  err_admin_fail:"Registration failed.",
  users_title:"Registered Users",never_logged:"never logged in",last_login:"last login:",
  btn_deactivate:"Deactivate",btn_activate:"Activate",
  logs_title:"Access Logs",logs_empty:"No logs available.",
  admin_denied:"Only administrators can access this section.",
  settings_title:"Settings",settings_sub:"Practice logos · Practice profiles",
  logos_title:"Practice Logos",lbl_logo_name:"Logo Name",logo_name_ph:"e.g.: London Practice",
  btn_upload_logo:"📁 Upload Logo (JPEG/PNG)",logo_loaded:"Logo uploaded.",
  btn_default:"★ Default",logos_none:"No logos uploaded.",
  profiles_title:"Practice Profiles",lbl_pname:"Practice Name *",pname_ph:"Naturopathic Practice...",
  lbl_address:"Address",address_ph:"123 High Street, London",lbl_phone:"Phone",phone_ph:"+44 20 1234 5678",
  lbl_email:"Email",email_ph:"practice@email.com",lbl_piva:"VAT Number",piva_ph:"GB123456789",
  lbl_albo:"Register / Licence No.",albo_ph:"123456",
  btn_add_profile:"Add Profile",profile_saved:"Profile saved.",profiles_none:"No profiles configured.",
  session_prefix:"Session",session_msgs:"messages",
  ai_lang:"Always respond in English.",
  change_lang:"← Change language",
},
es:{
  loading:"Conectando a Supabase...",
  setup_title:"Configuración Inicial",setup_sub:"Crear cuenta de administrador — guarda las credenciales en un lugar seguro",
  setup_warn:'⚠️ Antes de continuar: Supabase → Authentication → Settings → desactiva "Enable email confirmations"',
  lbl_uname:"Usuario Administrador",lbl_pwd:"Contraseña (mín. 8 caracteres)",lbl_confirm:"Confirmar Contraseña",
  btn_setup:"Configurar Sistema",err_fields:"Completa todos los campos",err_match:"Las contraseñas no coinciden",
  err_short:"La contraseña debe tener al menos 8 caracteres",err_setup_fail:"Error de registro. Verifica la confirmación de email en Supabase.",
  login_title:"Acceso Restringido",login_sub:"Sistema profesional de apoyo naturopático",
  lbl_user:"Usuario",lbl_password:"Contraseña",btn_login:"Iniciar sesión",
  err_login:"Credenciales inválidas o error de conexión.",err_disabled:"Cuenta desactivada.",
  nav_chat:"Consulta",nav_sources:"Fuentes Científicas",nav_kb:"Base de Conocimiento",
  nav_kb_add:"Agregar Fuente",nav_patients:"Pacientes",nav_reports:"Informes",
  nav_docs:"Documentos",nav_admin:"Admin",nav_settings:"Configuración",
  stat_ex:"Intercambios",stat_kb:"Fuentes BC",stat_pt:"Pacientes",btn_logout:"Salir / Bloquear",
  chat_title:"Consulta con IA",chat_sub:"Tu colega IA razona contigo — no te da la razón sin más",
  web_on:"🌐 Web ON",web_off:"🌐 Web OFF",btn_pubmed:"📚 PubMed",
  no_pt:"Sin paciente",btn_save:"Guardar",btn_saved:"✓ Guardada",btn_new:"Nueva",
  lbl_ai:"Colega IA · ",lbl_you:"Tú · ",lbl_web:"🌐 web",lbl_searching:"buscando en la web...",
  chat_ph:"Describe síntomas, contexto, hipótesis... (Enter = enviar, Shift+Enter = nueva línea)",
  chat_welcome:"Hola colega. Listo para razonar sobre un caso clínico.\n\nDescríbeme los síntomas — cuanto más contexto me des, mejor trabajamos.",
  chat_new_msg:"Nueva sesión. Preséntame el caso — empieza por los síntomas y el contexto del paciente.",
  chat_err:"⚠️ Error de conexión.",chat_err_resp:"Error en la respuesta.",
  sources_title:"Fuentes Científicas",sources_sub:"PubMed · Literatura revisada · Medicina tradicional",
  pubmed_title:"🔬 Búsqueda PubMed / NCBI",pubmed_ph:"Ej: curcumin inflamación, berberina intestino...",
  btn_search:"Buscar",btn_ctx:"Del contexto",
  pubmed_searching:"Buscando en PubMed...",pubmed_none:"No se encontraron resultados.",
  pubmed_found:"artículos encontrados",pubmed_open:"Abrir en PubMed ↗",pubmed_cite:"→ Citar en chat",
  pubmed_empty:'Busca directamente o usa "Del contexto" para encontrar artículos automáticamente.',
  pubmed_err:"Error PubMed. Verifica tu conexión.",
  web_title:"🌐 Búsqueda Web en Consulta",
  web_desc:"El colega IA tiene búsqueda web en tiempo real cuando Web ON está activo.",
  kb_title:"Base de Conocimiento Naturopático",kb_sub_n:" fuentes · usadas automáticamente por la IA",
  kb_search_ph:"Buscar...",kb_empty:'Sin fuentes. Ve a "Agregar Fuente" para comenzar.',
  kb_add_title:"Agregar Fuente a la Base de Conocimiento",kb_add_sub:"Pega texto → Analiza → verifica → guarda",
  lbl_content:"Contenido (pega el texto primero — luego usa Analizar)",
  content_ph:"Pega el texto de la fuente: síntomas, remedios, indicaciones...",
  btn_analyze:"🔍 Analizar y Categorizar",btn_analyzing:"⏳ Analizando...",btn_load_txt:"📄 Cargar .txt",
  lbl_title:"Título / Referencia Bibliográfica",title_ph:"Ej: Weiss R.F. — Fitoterapia, cap.4",
  lbl_disc:"Disciplina (se completa automáticamente con Analizar)",
  lbl_tags:"Etiquetas (separadas por coma)",tags_ph:"hígado, digestión, bilis, colesterol",
  btn_add_kb:"Agregar a la Base de Conocimiento",analyze_empty:"Inserta primero el texto a analizar.",
  analyze_err:"Error de análisis. Revisa el texto e inténtalo de nuevo.",
  analyze_ok:"✓ Categorizado como:",analyze_area:"· Área:",
  kb_tip:"Flujo: pega → Analiza → verifica → título → Agregar.",
  patients_title:"Gestión de Pacientes",patients_sub:"Pseudonimizados — ID fiscal oscurecida en la BD",
  new_patient:"Nuevo Paciente",lbl_cf:"Identificación fiscal (opcional — será oscurecida)",
  cf_ph:"Número de identificación",lbl_notes:"Notas de Anamnesis",
  notes_ph:"Edad, sexo, condiciones base, alergias conocidas...",
  btn_create:"Crear Paciente",patient_created:"Paciente creado:",
  cf_hidden:"ID: ████████████████",btn_use_chat:"Usar en chat",
  patients_empty:"No hay pacientes registrados.",
  patient_tip:"Código (NAT-AÑO-XXXX) generado automáticamente.",
  reports_title:"Generar Informe",reports_sub:"Selecciona sesión, configura y descarga PDF o Word",
  lbl_session:"Sesión",current_session:"Sesión actual",
  lbl_logo:"Logo del Consultorio",no_logo:"Sin logo",lbl_profile:"Perfil del Consultorio",no_profile:"Sin perfil",
  lbl_report_notes:"Notas y Recomendaciones Finales",report_notes_ph:"Recomendaciones finales, remedios elegidos, estilo de vida...",
  lbl_followup:"Seguimiento Recomendado",followup_ph:"Ej: Reevaluación en 4 semanas",
  lbl_sign:"Firma / Calificación",sign_ph:"Ej: Dr. Juan García — Naturópata",
  btn_pdf:"📄 PDF",btn_word:"📝 Word",
  no_logo_warn:"💡 Sin logo. Ve a Configuración para agregar el logo de tu consultorio.",
  preview_title:"Vista Previa",preview_session:"Sesión:",preview_patient:"Paciente:",
  preview_none:"No especificado",pdf_missing:"Librería PDF cargando, intenta de nuevo.",
  rpt_main_title:"INFORME NATUROPÁTICO",rpt_by:"Elaborado por:",
  sec_symptoms:"SÍNTOMAS Y CUADRO CLÍNICO REFERIDO",sec_analysis:"ANÁLISIS E HIPÓTESIS NATUROPÁTICAS",
  sec_notes:"NOTAS Y RECOMENDACIONES FINALES",sec_followup:"SEGUIMIENTO RECOMENDADO",
  sec_sign:"Firma del Profesional: ___________________________",
  rpt_footer:"Las indicaciones naturopáticas no reemplazan el diagnóstico médico ni la terapia farmacológica. Natura Medica v",
  docs_title:"Documentos",docs_sub:"Aviso legal · Privacidad · Whitepaper · Manual",
  btn_new_doc:"+ Nuevo Documento",new_doc_title:"Nuevo Documento",
  lbl_type:"Tipo",lbl_doc_title:"Título",doc_title_ph:"Ej: Aviso legal - Consultorio Madrid - v2.0",
  lbl_version:"Versión",lbl_doc_content:"Contenido",
  btn_doc_save:"Guardar",btn_cancel:"Cancelar",btn_edit:"✏ Editar",
  btn_print:"🖨 Imprimir",btn_del:"✕",doc_empty:"No hay documentos de este tipo.",
  btn_save_changes:"Guardar Cambios",btn_print_preview:"🖨 Vista Previa",
  admin_title:"Panel de Administrador",admin_sub:"Gestión de usuarios · Registros · GDPR",
  new_user:"Nuevo Usuario",lbl_fullname:"Nombre Completo",
  lbl_role:"Rol",role_staff:"Personal",role_admin:"Administrador",
  btn_create_user:"Crear Usuario",user_created:"Usuario creado con éxito.",
  err_admin_fields:"Completa todos los campos",err_admin_short:"Contraseña mínimo 8 caracteres",
  err_admin_fail:"Registro fallido.",
  users_title:"Usuarios Registrados",never_logged:"nunca ha accedido",last_login:"último acceso:",
  btn_deactivate:"Desactivar",btn_activate:"Activar",
  logs_title:"Registros de Acceso",logs_empty:"No hay registros.",
  admin_denied:"Solo los administradores pueden acceder a esta sección.",
  settings_title:"Configuración",settings_sub:"Logos del consultorio · Perfiles",
  logos_title:"Logos del Consultorio",lbl_logo_name:"Nombre del Logo",logo_name_ph:"Ej: Consultorio Madrid",
  btn_upload_logo:"📁 Cargar Logo (JPEG/PNG)",logo_loaded:"Logo cargado.",
  btn_default:"★ Por defecto",logos_none:"No hay logos cargados.",
  profiles_title:"Perfiles del Consultorio",lbl_pname:"Nombre del Consultorio *",pname_ph:"Consultorio Naturopático...",
  lbl_address:"Dirección",address_ph:"Calle Mayor 1, Madrid",lbl_phone:"Teléfono",phone_ph:"+34 91 123 4567",
  lbl_email:"Email",email_ph:"consultorio@email.es",lbl_piva:"CIF / NIF",piva_ph:"B12345678",
  lbl_albo:"Nº Colegiado",albo_ph:"123456",
  btn_add_profile:"Agregar Perfil",profile_saved:"Perfil guardado.",profiles_none:"No hay perfiles configurados.",
  session_prefix:"Sesión",session_msgs:"mensajes",
  ai_lang:"Responde SIEMPRE en español.",
  change_lang:"← Cambiar idioma",
},
pt:{
  loading:"Conectando ao Supabase...",
  setup_title:"Configuração Inicial",setup_sub:"Criar conta de administrador — guarde as credenciais em local seguro",
  setup_warn:'⚠️ Antes de continuar: Supabase → Authentication → Settings → desative "Enable email confirmations"',
  lbl_uname:"Utilizador Administrador",lbl_pwd:"Senha (mín. 8 caracteres)",lbl_confirm:"Confirmar Senha",
  btn_setup:"Configurar Sistema",err_fields:"Preencha todos os campos",err_match:"As senhas não coincidem",
  err_short:"A senha deve ter pelo menos 8 caracteres",err_setup_fail:"Erro no registro. Verifique as confirmações de e-mail no Supabase.",
  login_title:"Acesso Restrito",login_sub:"Sistema profissional de apoio naturopático",
  lbl_user:"Utilizador",lbl_password:"Senha",btn_login:"Entrar",
  err_login:"Credenciais inválidas ou erro de conexão.",err_disabled:"Conta desativada.",
  nav_chat:"Consulta",nav_sources:"Fontes Científicas",nav_kb:"Base de Conhecimento",
  nav_kb_add:"Adicionar Fonte",nav_patients:"Pacientes",nav_reports:"Relatórios",
  nav_docs:"Documentos",nav_admin:"Admin",nav_settings:"Configurações",
  stat_ex:"Trocas",stat_kb:"Fontes BC",stat_pt:"Pacientes",btn_logout:"Sair / Bloquear",
  chat_title:"Consulta com IA",chat_sub:"Seu colega IA raciocina com você — não simplesmente concorda",
  web_on:"🌐 Web ON",web_off:"🌐 Web OFF",btn_pubmed:"📚 PubMed",
  no_pt:"Sem paciente",btn_save:"Salvar",btn_saved:"✓ Salva",btn_new:"Nova",
  lbl_ai:"Colega IA · ",lbl_you:"Você · ",lbl_web:"🌐 web",lbl_searching:"pesquisando na web...",
  chat_ph:"Descreva sintomas, contexto, hipótese... (Enter = enviar, Shift+Enter = nova linha)",
  chat_welcome:"Olá colega. Pronto para raciocinar sobre um caso clínico.\n\nDescreva os sintomas — quanto mais contexto me der, melhor trabalhamos.",
  chat_new_msg:"Nova sessão. Apresente o caso — comece pelos sintomas e contexto do paciente.",
  chat_err:"⚠️ Erro de conexão.",chat_err_resp:"Erro na resposta.",
  sources_title:"Fontes Científicas",sources_sub:"PubMed · Literatura revisada · Medicina tradicional",
  pubmed_title:"🔬 Pesquisa PubMed / NCBI",pubmed_ph:"Ex: curcumin inflamação, berberina intestino...",
  btn_search:"Pesquisar",btn_ctx:"Do contexto",
  pubmed_searching:"Pesquisando no PubMed...",pubmed_none:"Nenhum resultado encontrado.",
  pubmed_found:"artigos encontrados",pubmed_open:"Abrir no PubMed ↗",pubmed_cite:"→ Citar no chat",
  pubmed_empty:'Pesquise diretamente ou use "Do contexto" para encontrar artigos automaticamente.',
  pubmed_err:"Erro PubMed. Verifique sua conexão.",
  web_title:"🌐 Pesquisa Web em Consulta",
  web_desc:"O colega IA tem pesquisa web em tempo real quando Web ON está ativo.",
  kb_title:"Base de Conhecimento Naturopático",kb_sub_n:" fontes · usadas automaticamente pela IA",
  kb_search_ph:"Pesquisar...",kb_empty:'Sem fontes. Vá a "Adicionar Fonte" para começar.',
  kb_add_title:"Adicionar Fonte à Base de Conhecimento",kb_add_sub:"Cole o texto → Analise → verifique → salve",
  lbl_content:"Conteúdo (cole o texto primeiro — depois use Analisar)",
  content_ph:"Cole o texto da fonte: sintomas, remédios, indicações...",
  btn_analyze:"🔍 Analisar e Categorizar",btn_analyzing:"⏳ Analisando...",btn_load_txt:"📄 Carregar .txt",
  lbl_title:"Título / Referência Bibliográfica",title_ph:"Ex: Weiss R.F. — Fitoterapia, cap.4",
  lbl_disc:"Disciplina (preenchida automaticamente com Analisar)",
  lbl_tags:"Tags (separadas por vírgula)",tags_ph:"fígado, digestão, bile, colesterol",
  btn_add_kb:"Adicionar à Base de Conhecimento",analyze_empty:"Insira primeiro o texto a analisar.",
  analyze_err:"Erro na análise. Verifique o texto e tente novamente.",
  analyze_ok:"✓ Categorizado como:",analyze_area:"· Área:",
  kb_tip:"Fluxo: cole → Analise → verifique → título → Adicionar.",
  patients_title:"Gestão de Pacientes",patients_sub:"Pseudonimizados — CPF ocultado na BD",
  new_patient:"Novo Paciente",lbl_cf:"CPF / Identificação (opcional — será ocultada)",
  cf_ph:"000.000.000-00",lbl_notes:"Notas de Anamnese",
  notes_ph:"Idade, sexo, condições base, alergias conhecidas...",
  btn_create:"Criar Paciente",patient_created:"Paciente criado:",
  cf_hidden:"CPF: ████████████████",btn_use_chat:"Usar no chat",
  patients_empty:"Nenhum paciente registrado.",
  patient_tip:"Código (NAT-ANO-XXXX) gerado automaticamente.",
  reports_title:"Gerar Relatório",reports_sub:"Selecione sessão, configure e baixe PDF ou Word",
  lbl_session:"Sessão",current_session:"Sessão atual",
  lbl_logo:"Logo do Consultório",no_logo:"Sem logo",lbl_profile:"Perfil do Consultório",no_profile:"Sem perfil",
  lbl_report_notes:"Notas e Recomendações Finais",report_notes_ph:"Recomendações finais, remédios escolhidos, estilo de vida...",
  lbl_followup:"Acompanhamento Recomendado",followup_ph:"Ex: Reavaliação em 4 semanas",
  lbl_sign:"Assinatura / Qualificação",sign_ph:"Ex: Dr. João Silva — Naturopata",
  btn_pdf:"📄 PDF",btn_word:"📝 Word",
  no_logo_warn:"💡 Sem logo. Vá a Configurações para adicionar o logo do seu consultório.",
  preview_title:"Prévia",preview_session:"Sessão:",preview_patient:"Paciente:",
  preview_none:"Não especificado",pdf_missing:"Biblioteca PDF carregando, tente novamente.",
  rpt_main_title:"RELATÓRIO NATUROPÁTICO",rpt_by:"Elaborado por:",
  sec_symptoms:"SINTOMAS E QUADRO CLÍNICO REFERIDO",sec_analysis:"ANÁLISE E HIPÓTESES NATUROPÁTICAS",
  sec_notes:"NOTAS E RECOMENDAÇÕES FINAIS",sec_followup:"ACOMPANHAMENTO RECOMENDADO",
  sec_sign:"Assinatura do Profissional: ___________________________",
  rpt_footer:"As indicações naturopáticas não substituem diagnóstico médico nem terapia farmacológica. Natura Medica v",
  docs_title:"Documentos",docs_sub:"Aviso legal · Privacidade · Whitepaper · Manual",
  btn_new_doc:"+ Novo Documento",new_doc_title:"Novo Documento",
  lbl_type:"Tipo",lbl_doc_title:"Título",doc_title_ph:"Ex: Aviso legal - Consultório SP - v2.0",
  lbl_version:"Versão",lbl_doc_content:"Conteúdo",
  btn_doc_save:"Salvar",btn_cancel:"Cancelar",btn_edit:"✏ Editar",
  btn_print:"🖨 Imprimir",btn_del:"✕",doc_empty:"Nenhum documento deste tipo.",
  btn_save_changes:"Salvar Alterações",btn_print_preview:"🖨 Prévia de Impressão",
  admin_title:"Painel de Administrador",admin_sub:"Gestão de usuários · Registros · LGPD/GDPR",
  new_user:"Novo Usuário",lbl_fullname:"Nome Completo",
  lbl_role:"Função",role_staff:"Equipe",role_admin:"Administrador",
  btn_create_user:"Criar Usuário",user_created:"Usuário criado com sucesso.",
  err_admin_fields:"Preencha todos os campos",err_admin_short:"Senha mínimo 8 caracteres",
  err_admin_fail:"Registro falhou.",
  users_title:"Usuários Registrados",never_logged:"nunca acessou",last_login:"último acesso:",
  btn_deactivate:"Desativar",btn_activate:"Ativar",
  logs_title:"Registros de Acesso",logs_empty:"Nenhum registro disponível.",
  admin_denied:"Apenas administradores podem acessar esta seção.",
  settings_title:"Configurações",settings_sub:"Logos do consultório · Perfis",
  logos_title:"Logos do Consultório",lbl_logo_name:"Nome do Logo",logo_name_ph:"Ex: Consultório SP",
  btn_upload_logo:"📁 Carregar Logo (JPEG/PNG)",logo_loaded:"Logo carregado.",
  btn_default:"★ Padrão",logos_none:"Nenhum logo carregado.",
  profiles_title:"Perfis do Consultório",lbl_pname:"Nome do Consultório *",pname_ph:"Consultório Naturopático...",
  lbl_address:"Endereço",address_ph:"Rua Principal 1, São Paulo",lbl_phone:"Telefone",phone_ph:"+55 11 1234-5678",
  lbl_email:"Email",email_ph:"consultorio@email.com.br",lbl_piva:"CNPJ / CPF",piva_ph:"00.000.000/0001-00",
  lbl_albo:"Nº Registro / CRN",albo_ph:"123456",
  btn_add_profile:"Adicionar Perfil",profile_saved:"Perfil salvo.",profiles_none:"Nenhum perfil configurado.",
  session_prefix:"Sessão",session_msgs:"mensagens",
  ai_lang:"Responda SEMPRE em português.",
  change_lang:"← Mudar idioma",
},
fr:{
  loading:"Connexion à Supabase en cours...",
  setup_title:"Configuration Initiale",setup_sub:"Créer un compte administrateur — conservez les identifiants en lieu sûr",
  setup_warn:'⚠️ Avant de continuer : Supabase → Authentication → Settings → désactivez "Enable email confirmations"',
  lbl_uname:"Identifiant administrateur",lbl_pwd:"Mot de passe (min. 8 caractères)",lbl_confirm:"Confirmer le mot de passe",
  btn_setup:"Configurer le système",err_fields:"Veuillez remplir tous les champs",err_match:"Les mots de passe ne correspondent pas",
  err_short:"Le mot de passe doit comporter au moins 8 caractères",err_setup_fail:"Erreur d'inscription. Vérifiez la confirmation d'e-mail dans Supabase.",
  login_title:"Accès Restreint",login_sub:"Système professionnel de soutien naturopathique",
  lbl_user:"Identifiant",lbl_password:"Mot de passe",btn_login:"Se connecter",
  err_login:"Identifiants invalides ou erreur de connexion.",err_disabled:"Compte désactivé.",
  nav_chat:"Consultation",nav_sources:"Sources scientifiques",nav_kb:"Base de connaissances",
  nav_kb_add:"Ajouter une source",nav_patients:"Patients",nav_reports:"Rapports",
  nav_docs:"Documents",nav_admin:"Admin",nav_settings:"Paramètres",
  stat_ex:"Échanges",stat_kb:"Sources BC",stat_pt:"Patients",btn_logout:"Déconnexion / Verrouiller",
  chat_title:"Consultation IA",chat_sub:"Votre collègue IA raisonne avec vous — ne vous donne pas simplement raison",
  web_on:"🌐 Web ON",web_off:"🌐 Web OFF",btn_pubmed:"📚 PubMed",
  no_pt:"Aucun patient",btn_save:"Enregistrer",btn_saved:"✓ Enregistrée",btn_new:"Nouvelle",
  lbl_ai:"Collègue IA · ",lbl_you:"Vous · ",lbl_web:"🌐 web",lbl_searching:"recherche sur le web...",
  chat_ph:"Décrivez symptômes, contexte, hypothèse... (Entrée = envoyer, Maj+Entrée = nouvelle ligne)",
  chat_welcome:"Bonjour collègue. Prêt à raisonner sur un cas clinique.\n\nDécrivez-moi les symptômes — plus vous me donnez de contexte, mieux nous travaillons.",
  chat_new_msg:"Nouvelle session. Présentez le cas — commencez par les symptômes et le contexte du patient.",
  chat_err:"⚠️ Erreur de connexion.",chat_err_resp:"Erreur de réponse.",
  sources_title:"Sources Scientifiques",sources_sub:"PubMed · Littérature à comité · Médecine traditionnelle",
  pubmed_title:"🔬 Recherche PubMed / NCBI",pubmed_ph:"Ex : curcumin inflammation, berberine intestin...",
  btn_search:"Rechercher",btn_ctx:"Du contexte",
  pubmed_searching:"Recherche en cours sur PubMed...",pubmed_none:"Aucun résultat trouvé.",
  pubmed_found:"articles trouvés",pubmed_open:"Ouvrir sur PubMed ↗",pubmed_cite:"→ Citer dans le chat",
  pubmed_empty:'Recherchez directement ou utilisez "Du contexte" pour trouver des articles automatiquement.',
  pubmed_err:"Erreur PubMed. Vérifiez votre connexion.",
  web_title:"🌐 Recherche web en consultation",
  web_desc:"Le collègue IA dispose d'une recherche web en temps réel quand Web ON est actif.",
  kb_title:"Base de Connaissances Naturopathiques",kb_sub_n:" sources · utilisées automatiquement par l'IA",
  kb_search_ph:"Rechercher...",kb_empty:'Aucune source. Allez sur "Ajouter une source" pour commencer.',
  kb_add_title:"Ajouter une source à la base de connaissances",kb_add_sub:"Collez le texte → Analysez → vérifiez → enregistrez",
  lbl_content:"Contenu (collez d'abord le texte — puis utilisez Analyser)",
  content_ph:"Collez le texte de la source : symptômes, remèdes, indications...",
  btn_analyze:"🔍 Analyser et catégoriser",btn_analyzing:"⏳ Analyse...",btn_load_txt:"📄 Charger .txt",
  lbl_title:"Titre / Référence bibliographique",title_ph:"Ex : Weiss R.F. — Phytothérapie, ch.4",
  lbl_disc:"Discipline (remplie automatiquement avec Analyser)",
  lbl_tags:"Étiquettes (séparées par une virgule)",tags_ph:"foie, digestion, bile, cholestérol",
  btn_add_kb:"Ajouter à la base de connaissances",analyze_empty:"Insérez d'abord le texte à analyser.",
  analyze_err:"Erreur d'analyse. Vérifiez le texte et réessayez.",
  analyze_ok:"✓ Catégorisé comme :",analyze_area:"· Domaine :",
  kb_tip:"Flux : coller → Analyser → vérifier → titre → Ajouter.",
  patients_title:"Gestion des Patients",patients_sub:"Pseudonymisés — numéro fiscal masqué dans la BD",
  new_patient:"Nouveau patient",lbl_cf:"Numéro fiscal (facultatif — sera masqué)",
  cf_ph:"Numéro d'identification",lbl_notes:"Notes d'anamnèse",
  notes_ph:"Âge, sexe, conditions de base, allergies connues...",
  btn_create:"Créer un patient",patient_created:"Patient créé :",
  cf_hidden:"N° : ████████████████",btn_use_chat:"Utiliser dans le chat",
  patients_empty:"Aucun patient enregistré.",
  patient_tip:"Code (NAT-ANNÉE-XXXX) généré automatiquement.",
  reports_title:"Générer un rapport",reports_sub:"Sélectionnez la session, configurez et téléchargez en PDF ou Word",
  lbl_session:"Session",current_session:"Session en cours",
  lbl_logo:"Logo du cabinet",no_logo:"Sans logo",lbl_profile:"Profil du cabinet",no_profile:"Sans profil",
  lbl_report_notes:"Notes et recommandations finales",report_notes_ph:"Recommandations finales, remèdes choisis, mode de vie...",
  lbl_followup:"Suivi recommandé",followup_ph:"Ex : Réévaluation dans 4 semaines",
  lbl_sign:"Signature / Qualification",sign_ph:"Ex : Dr. Jean Dupont — Naturopathe",
  btn_pdf:"📄 PDF",btn_word:"📝 Word",
  no_logo_warn:"💡 Sans logo. Allez dans Paramètres pour ajouter le logo de votre cabinet.",
  preview_title:"Aperçu",preview_session:"Session :",preview_patient:"Patient :",
  preview_none:"Non spécifié",pdf_missing:"Bibliothèque PDF en chargement, réessayez.",
  rpt_main_title:"RAPPORT NATUROPATHIQUE",rpt_by:"Rédigé par :",
  sec_symptoms:"SYMPTÔMES ET TABLEAU CLINIQUE RAPPORTÉ",sec_analysis:"ANALYSE ET HYPOTHÈSES NATUROPATHIQUES",
  sec_notes:"NOTES ET RECOMMANDATIONS FINALES",sec_followup:"SUIVI RECOMMANDÉ",
  sec_sign:"Signature du professionnel : ___________________________",
  rpt_footer:"Les indications naturopathiques ne remplacent pas le diagnostic médical ni la thérapie médicamenteuse. Natura Medica v",
  docs_title:"Documents",docs_sub:"Clause de non-responsabilité · Confidentialité · Livre blanc · Manuel",
  btn_new_doc:"+ Nouveau document",new_doc_title:"Nouveau document",
  lbl_type:"Type",lbl_doc_title:"Titre",doc_title_ph:"Ex : Clause - Cabinet Paris - v2.0",
  lbl_version:"Version",lbl_doc_content:"Contenu",
  btn_doc_save:"Enregistrer",btn_cancel:"Annuler",btn_edit:"✏ Modifier",
  btn_print:"🖨 Imprimer",btn_del:"✕",doc_empty:"Aucun document de ce type.",
  btn_save_changes:"Enregistrer les modifications",btn_print_preview:"🖨 Aperçu avant impression",
  admin_title:"Panneau d'administration",admin_sub:"Gestion des utilisateurs · Journaux · RGPD",
  new_user:"Nouvel utilisateur",lbl_fullname:"Nom complet",
  lbl_role:"Rôle",role_staff:"Personnel",role_admin:"Administrateur",
  btn_create_user:"Créer un utilisateur",user_created:"Utilisateur créé avec succès.",
  err_admin_fields:"Veuillez remplir tous les champs",err_admin_short:"Mot de passe minimum 8 caractères",
  err_admin_fail:"Échec de l'inscription.",
  users_title:"Utilisateurs enregistrés",never_logged:"jamais connecté",last_login:"dernière connexion :",
  btn_deactivate:"Désactiver",btn_activate:"Activer",
  logs_title:"Journaux d'accès",logs_empty:"Aucun journal disponible.",
  admin_denied:"Seuls les administrateurs peuvent accéder à cette section.",
  settings_title:"Paramètres",settings_sub:"Logos du cabinet · Profils",
  logos_title:"Logos du cabinet",lbl_logo_name:"Nom du logo",logo_name_ph:"Ex : Cabinet Paris",
  btn_upload_logo:"📁 Charger un logo (JPEG/PNG)",logo_loaded:"Logo chargé.",
  btn_default:"★ Par défaut",logos_none:"Aucun logo chargé.",
  profiles_title:"Profils du cabinet",lbl_pname:"Nom du cabinet *",pname_ph:"Cabinet naturopathique...",
  lbl_address:"Adresse",address_ph:"1 Rue de la Paix, Paris",lbl_phone:"Téléphone",phone_ph:"+33 1 23 45 67 89",
  lbl_email:"Email",email_ph:"cabinet@email.fr",lbl_piva:"SIRET / TVA",piva_ph:"123 456 789 00010",
  lbl_albo:"N° d'enregistrement",albo_ph:"123456",
  btn_add_profile:"Ajouter un profil",profile_saved:"Profil enregistré.",profiles_none:"Aucun profil configuré.",
  session_prefix:"Session",session_msgs:"messages",
  ai_lang:"Réponds TOUJOURS en français.",
  change_lang:"← Changer de langue",
},
de:{
  loading:"Verbindung zu Supabase wird hergestellt...",
  setup_title:"Ersteinrichtung",setup_sub:"Administrator-Konto erstellen — Anmeldedaten sicher aufbewahren",
  setup_warn:'⚠️ Vor dem Fortfahren: Supabase → Authentication → Settings → deaktivieren Sie "Enable email confirmations"',
  lbl_uname:"Administrator-Benutzername",lbl_pwd:"Passwort (mind. 8 Zeichen)",lbl_confirm:"Passwort bestätigen",
  btn_setup:"System konfigurieren",err_fields:"Bitte alle Felder ausfüllen",err_match:"Passwörter stimmen nicht überein",
  err_short:"Passwort muss mindestens 8 Zeichen haben",err_setup_fail:"Registrierungsfehler. E-Mail-Bestätigungen in Supabase deaktivieren.",
  login_title:"Eingeschränkter Zugang",login_sub:"Professionelles naturopathisches Unterstützungssystem",
  lbl_user:"Benutzername",lbl_password:"Passwort",btn_login:"Anmelden",
  err_login:"Ungültige Anmeldedaten oder Verbindungsfehler.",err_disabled:"Konto deaktiviert.",
  nav_chat:"Beratung",nav_sources:"Wissenschaftliche Quellen",nav_kb:"Wissensdatenbank",
  nav_kb_add:"Quelle hinzufügen",nav_patients:"Patienten",nav_reports:"Berichte",
  nav_docs:"Dokumente",nav_admin:"Admin",nav_settings:"Einstellungen",
  stat_ex:"Austausche",stat_kb:"KB-Quellen",stat_pt:"Patienten",btn_logout:"Abmelden / Sperren",
  chat_title:"KI-Beratung",chat_sub:"Ihr KI-Kollege denkt mit — stimmt nicht einfach zu",
  web_on:"🌐 Web EIN",web_off:"🌐 Web AUS",btn_pubmed:"📚 PubMed",
  no_pt:"Kein Patient",btn_save:"Speichern",btn_saved:"✓ Gespeichert",btn_new:"Neu",
  lbl_ai:"KI-Kollege · ",lbl_you:"Sie · ",lbl_web:"🌐 web",lbl_searching:"Websuche...",
  chat_ph:"Symptome, Kontext, Hypothese beschreiben... (Enter = senden, Shift+Enter = neue Zeile)",
  chat_welcome:"Hallo Kollege. Bereit, einen klinischen Fall zu besprechen.\n\nBeschreiben Sie mir die Symptome — je mehr Kontext, desto besser arbeiten wir.",
  chat_new_msg:"Neue Sitzung. Stellen Sie den Fall vor — beginnen Sie mit Symptomen und Patientenkontext.",
  chat_err:"⚠️ Verbindungsfehler.",chat_err_resp:"Antwortfehler.",
  sources_title:"Wissenschaftliche Quellen",sources_sub:"PubMed · Peer-Review · Traditionelle Medizin",
  pubmed_title:"🔬 PubMed / NCBI Suche",pubmed_ph:"z.B.: Curcumin Entzündung, Berberin Darm...",
  btn_search:"Suchen",btn_ctx:"Aus Kontext",
  pubmed_searching:"PubMed-Suche läuft...",pubmed_none:"Keine Ergebnisse gefunden.",
  pubmed_found:"Artikel gefunden",pubmed_open:"Auf PubMed öffnen ↗",pubmed_cite:"→ Im Chat zitieren",
  pubmed_empty:'Suchen Sie direkt oder verwenden Sie "Aus Kontext" für automatische Suche.',
  pubmed_err:"PubMed-Fehler. Verbindung prüfen.",
  web_title:"🌐 Websuche in der Beratung",
  web_desc:"Der KI-Kollege hat Echtzeit-Webzugang wenn Web EIN aktiv ist.",
  kb_title:"Naturopathische Wissensdatenbank",kb_sub_n:" Quellen · automatisch von der KI verwendet",
  kb_search_ph:"Suchen...",kb_empty:'"Quelle hinzufügen" aufrufen um zu beginnen.',
  kb_add_title:"Quelle zur Wissensdatenbank hinzufügen",kb_add_sub:"Text einfügen → Analysieren → prüfen → speichern",
  lbl_content:"Inhalt (zuerst Text einfügen — dann Analysieren nutzen)",
  content_ph:"Quelltext einfügen: Symptome, Heilmittel, Indikationen...",
  btn_analyze:"🔍 Analysieren und kategorisieren",btn_analyzing:"⏳ Analysiere...",btn_load_txt:"📄 TXT laden",
  lbl_title:"Titel / Bibliografische Referenz",title_ph:"z.B.: Weiss R.F. — Phytotherapie, Kap.4",
  lbl_disc:"Disziplin (automatisch ausgefüllt mit Analysieren)",
  lbl_tags:"Tags (durch Komma getrennt)",tags_ph:"Leber, Verdauung, Galle, Cholesterin",
  btn_add_kb:"Zur Wissensdatenbank hinzufügen",analyze_empty:"Bitte zuerst den Text eingeben.",
  analyze_err:"Analysefehler. Text prüfen und erneut versuchen.",
  analyze_ok:"✓ Kategorisiert als:",analyze_area:"· Bereich:",
  kb_tip:"Ablauf: einfügen → Analysieren → prüfen → Titel → Hinzufügen.",
  patients_title:"Patientenverwaltung",patients_sub:"Pseudonymisiert — Steuer-ID verschleiert",
  new_patient:"Neuer Patient",lbl_cf:"Steuer-ID (optional — wird verschleiert)",
  cf_ph:"Identifikationsnummer",lbl_notes:"Anamnesenotizen",
  notes_ph:"Alter, Geschlecht, Grunderkrankungen, bekannte Allergien...",
  btn_create:"Patient erstellen",patient_created:"Patient erstellt:",
  cf_hidden:"ID: ████████████████",btn_use_chat:"Im Chat verwenden",
  patients_empty:"Keine Patienten registriert.",
  patient_tip:"Patientencode (NAT-JAHR-XXXX) wird automatisch generiert.",
  reports_title:"Bericht generieren",reports_sub:"Sitzung auswählen, konfigurieren und als PDF oder Word herunterladen",
  lbl_session:"Sitzung",current_session:"Aktuelle Sitzung",
  lbl_logo:"Praxislogo",no_logo:"Kein Logo",lbl_profile:"Praxisprofil",no_profile:"Kein Profil",
  lbl_report_notes:"Notizen und abschließende Empfehlungen",report_notes_ph:"Abschließende Empfehlungen, gewählte Heilmittel, Lebensstil...",
  lbl_followup:"Empfohlene Nachsorge",followup_ph:"z.B.: Neubewertung in 4 Wochen",
  lbl_sign:"Unterschrift / Qualifikation",sign_ph:"z.B.: Dr. Hans Müller — Naturheilpraktiker",
  btn_pdf:"📄 PDF",btn_word:"📝 Word",
  no_logo_warn:"💡 Kein Logo. Gehen Sie zu Einstellungen um das Logo Ihrer Praxis hinzuzufügen.",
  preview_title:"Vorschau",preview_session:"Sitzung:",preview_patient:"Patient:",
  preview_none:"Nicht angegeben",pdf_missing:"PDF-Bibliothek lädt noch, bitte erneut versuchen.",
  rpt_main_title:"NATUROPATHISCHER BERICHT",rpt_by:"Erstellt von:",
  sec_symptoms:"SYMPTOME UND GEMELDETES KLINISCHES BILD",sec_analysis:"NATUROPATHISCHE ANALYSE UND HYPOTHESEN",
  sec_notes:"NOTIZEN UND ABSCHLIESSENDE EMPFEHLUNGEN",sec_followup:"EMPFOHLENE NACHSORGE",
  sec_sign:"Unterschrift des Therapeuten: ___________________________",
  rpt_footer:"Naturopathische Empfehlungen ersetzen keine medizinische Diagnose. Natura Medica v",
  docs_title:"Dokumente",docs_sub:"Haftungsausschluss · Datenschutz · Whitepaper · Handbuch",
  btn_new_doc:"+ Neues Dokument",new_doc_title:"Neues Dokument",
  lbl_type:"Typ",lbl_doc_title:"Titel",doc_title_ph:"z.B.: Haftungsausschluss - Praxis Berlin - v2.0",
  lbl_version:"Version",lbl_doc_content:"Inhalt",
  btn_doc_save:"Speichern",btn_cancel:"Abbrechen",btn_edit:"✏ Bearbeiten",
  btn_print:"🖨 Drucken",btn_del:"✕",doc_empty:"Keine Dokumente dieses Typs.",
  btn_save_changes:"Änderungen speichern",btn_print_preview:"🖨 Druckvorschau",
  admin_title:"Administratorbereich",admin_sub:"Benutzerverwaltung · Zugriffsprotokolle · DSGVO",
  new_user:"Neuer Benutzer",lbl_fullname:"Vollständiger Name",
  lbl_role:"Rolle",role_staff:"Mitarbeiter",role_admin:"Administrator",
  btn_create_user:"Benutzer erstellen",user_created:"Benutzer erfolgreich erstellt.",
  err_admin_fields:"Bitte alle Felder ausfüllen",err_admin_short:"Passwort mindestens 8 Zeichen",
  err_admin_fail:"Registrierung fehlgeschlagen.",
  users_title:"Registrierte Benutzer",never_logged:"noch nie angemeldet",last_login:"letzte Anmeldung:",
  btn_deactivate:"Deaktivieren",btn_activate:"Aktivieren",
  logs_title:"Zugriffsprotokolle",logs_empty:"Keine Protokolle verfügbar.",
  admin_denied:"Nur Administratoren können auf diesen Bereich zugreifen.",
  settings_title:"Einstellungen",settings_sub:"Praxislogos · Praxisprofile",
  logos_title:"Praxislogos",lbl_logo_name:"Logoname",logo_name_ph:"z.B.: Praxis Berlin",
  btn_upload_logo:"📁 Logo hochladen (JPEG/PNG)",logo_loaded:"Logo hochgeladen.",
  btn_default:"★ Standard",logos_none:"Keine Logos hochgeladen.",
  profiles_title:"Praxisprofile",lbl_pname:"Praxisname *",pname_ph:"Naturheilpraxis...",
  lbl_address:"Adresse",address_ph:"Musterstraße 1, Berlin",lbl_phone:"Telefon",phone_ph:"+49 30 1234 5678",
  lbl_email:"E-Mail",email_ph:"praxis@email.de",lbl_piva:"USt-IdNr.",piva_ph:"DE123456789",
  lbl_albo:"Heilpraktiker-Nr.",albo_ph:"123456",
  btn_add_profile:"Profil hinzufügen",profile_saved:"Profil gespeichert.",profiles_none:"Keine Profile konfiguriert.",
  session_prefix:"Sitzung",session_msgs:"Nachrichten",
  ai_lang:"Antworte IMMER auf Deutsch.",
  change_lang:"← Sprache ändern",
},
ar:{
  loading:"جارٍ الاتصال بـ Supabase...",
  setup_title:"الإعداد الأولي",setup_sub:"إنشاء حساب المسؤول — احتفظ ببيانات الدخول في مكان آمن",
  setup_warn:'⚠️ قبل المتابعة: Supabase → Authentication → Settings → أوقف "Enable email confirmations"',
  lbl_uname:"اسم مستخدم المسؤول",lbl_pwd:"كلمة المرور (8 أحرف على الأقل)",lbl_confirm:"تأكيد كلمة المرور",
  btn_setup:"تهيئة النظام",err_fields:"يرجى ملء جميع الحقول",err_match:"كلمتا المرور غير متطابقتين",
  err_short:"يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",err_setup_fail:"خطأ في التسجيل. تأكد من إيقاف تشغيل تأكيد البريد الإلكتروني في Supabase.",
  login_title:"الوصول المقيَّد",login_sub:"نظام دعم الطب الطبيعي المهني",
  lbl_user:"اسم المستخدم",lbl_password:"كلمة المرور",btn_login:"تسجيل الدخول",
  err_login:"بيانات دخول غير صالحة أو خطأ في الاتصال.",err_disabled:"الحساب معطَّل.",
  nav_chat:"الاستشارة",nav_sources:"المصادر العلمية",nav_kb:"قاعدة المعرفة",
  nav_kb_add:"إضافة مصدر",nav_patients:"المرضى",nav_reports:"التقارير",
  nav_docs:"الوثائق",nav_admin:"المسؤول",nav_settings:"الإعدادات",
  stat_ex:"التبادلات",stat_kb:"مصادر قاعدة المعرفة",stat_pt:"المرضى",btn_logout:"تسجيل الخروج / القفل",
  chat_title:"استشارة الذكاء الاصطناعي",chat_sub:"زميلك الذكاء الاصطناعي يفكر معك — لا يوافقك ببساطة",
  web_on:"🌐 الويب مفعَّل",web_off:"🌐 الويب معطَّل",btn_pubmed:"📚 PubMed",
  no_pt:"بدون مريض",btn_save:"حفظ",btn_saved:"✓ محفوظة",btn_new:"جديدة",
  lbl_ai:"زميل الذكاء الاصطناعي · ",lbl_you:"أنت · ",lbl_web:"🌐 ويب",lbl_searching:"جارٍ البحث على الويب...",
  chat_ph:"صِف الأعراض والسياق وفرضيتك... (Enter للإرسال، Shift+Enter لسطر جديد)",
  chat_welcome:"مرحباً زميل. مستعد للتفكير في حالة سريرية.\n\nصِف لي الأعراض — كلما أعطيتني سياقاً أكثر، كلما عملنا بشكل أفضل.",
  chat_new_msg:"جلسة جديدة. قدِّم الحالة — ابدأ بالأعراض وسياق المريض.",
  chat_err:"⚠️ خطأ في الاتصال.",chat_err_resp:"خطأ في الاستجابة.",
  sources_title:"المصادر العلمية",sources_sub:"PubMed · الأدبيات المحكَّمة · الطب التقليدي",
  pubmed_title:"🔬 البحث في PubMed / NCBI",pubmed_ph:"مثال: كركمين التهاب، بربرين الأمعاء...",
  btn_search:"بحث",btn_ctx:"من السياق",
  pubmed_searching:"جارٍ البحث في PubMed...",pubmed_none:"لم يتم العثور على نتائج.",
  pubmed_found:"مقالات وُجدت",pubmed_open:"فتح في PubMed ↗",pubmed_cite:"→ الاستشهاد في المحادثة",
  pubmed_empty:'ابحث مباشرةً أو استخدم "من السياق" للعثور تلقائياً على مقالات ذات صلة.',
  pubmed_err:"خطأ في بحث PubMed. تحقق من اتصالك.",
  web_title:"🌐 البحث على الويب في الاستشارة",
  web_desc:"يمتلك زميل الذكاء الاصطناعي وصولاً للبحث الفوري على الويب عندما يكون الويب مفعَّلاً.",
  kb_title:"قاعدة معرفة الطب الطبيعي",kb_sub_n:" مصادر · تُستخدم تلقائياً من قِبَل الذكاء الاصطناعي",
  kb_search_ph:"بحث...",kb_empty:'لا توجد مصادر. اذهب إلى "إضافة مصدر" للبدء.',
  kb_add_title:"إضافة مصدر إلى قاعدة المعرفة",kb_add_sub:"الصق النص → حلِّل → تحقق → احفظ",
  lbl_content:"المحتوى (الصق النص أولاً — ثم استخدم التحليل)",
  content_ph:"الصق نص المصدر: الأعراض، العلاجات، المؤشرات...",
  btn_analyze:"🔍 تحليل وتصنيف",btn_analyzing:"⏳ جارٍ التحليل...",btn_load_txt:"📄 تحميل ملف .txt",
  lbl_title:"العنوان / المرجع الببليوغرافي",title_ph:"مثال: Weiss R.F. — العلاج بالأعشاب، الفصل 4",
  lbl_disc:"التخصص (يُملأ تلقائياً عند التحليل)",
  lbl_tags:"الوسوم (مفصولة بفاصلة)",tags_ph:"كبد، هضم، صفراء، كوليسترول",
  btn_add_kb:"إضافة إلى قاعدة المعرفة",analyze_empty:"يرجى إدخال النص للتحليل أولاً.",
  analyze_err:"خطأ في التحليل. تحقق من النص وحاول مجدداً.",
  analyze_ok:"✓ تم التصنيف كـ:",analyze_area:"· المجال:",
  kb_tip:"سير العمل: الصق → حلِّل → تحقق → أضف عنوان → أضف.",
  patients_title:"إدارة المرضى",patients_sub:"مُزوَّرة الهوية — رقم الهوية مُشفَّر في قاعدة البيانات",
  new_patient:"مريض جديد",lbl_cf:"رقم الهوية الوطني (اختياري — سيتم تشفيره)",
  cf_ph:"رقم الهوية",lbl_notes:"ملاحظات التاريخ المرضي",
  notes_ph:"العمر، الجنس، الحالات الأساسية، الحساسية المعروفة...",
  btn_create:"إنشاء مريض",patient_created:"تم إنشاء المريض:",
  cf_hidden:"الهوية: ████████████████",btn_use_chat:"استخدام في المحادثة",
  patients_empty:"لا يوجد مرضى مسجلون.",
  patient_tip:"يتم إنشاء كود المريض (NAT-سنة-XXXX) تلقائياً.",
  reports_title:"إنشاء تقرير",reports_sub:"اختر الجلسة، وقم بالتهيئة، ونزِّل PDF أو Word",
  lbl_session:"الجلسة",current_session:"الجلسة الحالية",
  lbl_logo:"شعار العيادة",no_logo:"بدون شعار",lbl_profile:"ملف العيادة",no_profile:"بدون ملف",
  lbl_report_notes:"الملاحظات والتوصيات النهائية",report_notes_ph:"التوصيات النهائية، العلاجات المختارة، نمط الحياة...",
  lbl_followup:"المتابعة الموصى بها",followup_ph:"مثال: إعادة التقييم بعد 4 أسابيع",
  lbl_sign:"التوقيع / المؤهل",sign_ph:"مثال: د. أحمد محمد — طبيب طبيعي",
  btn_pdf:"📄 PDF",btn_word:"📝 Word",
  no_logo_warn:"💡 لم يتم تحميل شعار. اذهب إلى الإعدادات لإضافة شعار عيادتك.",
  preview_title:"معاينة",preview_session:"الجلسة:",preview_patient:"المريض:",
  preview_none:"غير محدد",pdf_missing:"مكتبة PDF لا تزال تحمِّل، حاول مرة أخرى.",
  rpt_main_title:"التقرير الطبي الطبيعي",rpt_by:"أعدَّه:",
  sec_symptoms:"الأعراض والصورة السريرية",sec_analysis:"التحليل والفرضيات الطبيعية",
  sec_notes:"الملاحظات والتوصيات النهائية",sec_followup:"المتابعة الموصى بها",
  sec_sign:"توقيع المختص: ___________________________",
  rpt_footer:"التوصيات الطبيعية لا تحلّ محلّ التشخيص الطبي أو العلاج الدوائي. Natura Medica v",
  docs_title:"الوثائق",docs_sub:"إخلاء المسؤولية · الخصوصية · الورقة البيضاء · الدليل",
  btn_new_doc:"+ وثيقة جديدة",new_doc_title:"وثيقة جديدة",
  lbl_type:"النوع",lbl_doc_title:"العنوان",doc_title_ph:"مثال: إخلاء مسؤولية - عيادة الرياض - v2.0",
  lbl_version:"الإصدار",lbl_doc_content:"المحتوى",
  btn_doc_save:"حفظ",btn_cancel:"إلغاء",btn_edit:"✏ تعديل",
  btn_print:"🖨 طباعة",btn_del:"✕",doc_empty:"لا توجد وثائق من هذا النوع.",
  btn_save_changes:"حفظ التغييرات",btn_print_preview:"🖨 معاينة الطباعة",
  admin_title:"لوحة المسؤول",admin_sub:"إدارة المستخدمين · سجلات الوصول · حماية البيانات",
  new_user:"مستخدم جديد",lbl_fullname:"الاسم الكامل",
  lbl_role:"الدور",role_staff:"موظف",role_admin:"مسؤول",
  btn_create_user:"إنشاء مستخدم",user_created:"تم إنشاء المستخدم بنجاح.",
  err_admin_fields:"يرجى ملء جميع الحقول",err_admin_short:"كلمة المرور 8 أحرف على الأقل",
  err_admin_fail:"فشل التسجيل.",
  users_title:"المستخدمون المسجلون",never_logged:"لم يسجل الدخول قط",last_login:"آخر دخول:",
  btn_deactivate:"تعطيل",btn_activate:"تفعيل",
  logs_title:"سجلات الوصول",logs_empty:"لا توجد سجلات متاحة.",
  admin_denied:"يمكن للمسؤولين فقط الوصول إلى هذا القسم.",
  settings_title:"الإعدادات",settings_sub:"شعارات العيادة · ملفات العيادة",
  logos_title:"شعارات العيادة",lbl_logo_name:"اسم الشعار",logo_name_ph:"مثال: عيادة الرياض",
  btn_upload_logo:"📁 تحميل الشعار (JPEG/PNG)",logo_loaded:"تم تحميل الشعار.",
  btn_default:"★ افتراضي",logos_none:"لم يتم تحميل شعارات.",
  profiles_title:"ملفات العيادة",lbl_pname:"اسم العيادة *",pname_ph:"عيادة الطب الطبيعي...",
  lbl_address:"العنوان",address_ph:"شارع الملك فهد، الرياض",lbl_phone:"الهاتف",phone_ph:"+966 11 123 4567",
  lbl_email:"البريد الإلكتروني",email_ph:"clinic@email.com",lbl_piva:"الرقم الضريبي",piva_ph:"300000000000003",
  lbl_albo:"رقم الترخيص",albo_ph:"123456",
  btn_add_profile:"إضافة ملف",profile_saved:"تم حفظ الملف.",profiles_none:"لا توجد ملفات مُهيَّأة.",
  session_prefix:"جلسة",session_msgs:"رسائل",
  ai_lang:"أجب دائماً باللغة العربية.",
  change_lang:"← تغيير اللغة",
},
ja:{
  loading:"Supabaseに接続中...",
  setup_title:"初期設定",setup_sub:"管理者アカウントを作成 — 認証情報を安全な場所に保管してください",
  setup_warn:'⚠️ 続行前に: Supabase → Authentication → Settings → 「Enable email confirmations」を無効にしてください',
  lbl_uname:"管理者ユーザー名",lbl_pwd:"パスワード（最低8文字）",lbl_confirm:"パスワードの確認",
  btn_setup:"システムを設定する",err_fields:"すべてのフィールドを入力してください",err_match:"パスワードが一致しません",
  err_short:"パスワードは最低8文字必要です",err_setup_fail:"登録エラー。Supabaseでメール確認を無効にしてください。",
  login_title:"制限付きアクセス",login_sub:"プロフェッショナル自然療法サポートシステム",
  lbl_user:"ユーザー名",lbl_password:"パスワード",btn_login:"ログイン",
  err_login:"無効な認証情報または接続エラー。",err_disabled:"アカウントが無効です。",
  nav_chat:"相談",nav_sources:"科学的文献",nav_kb:"知識ベース",
  nav_kb_add:"文献を追加",nav_patients:"患者",nav_reports:"レポート",
  nav_docs:"文書",nav_admin:"管理",nav_settings:"設定",
  stat_ex:"交換回数",stat_kb:"知識ソース",stat_pt:"患者数",btn_logout:"ログアウト / ロック",
  chat_title:"AI相談",chat_sub:"AIが一緒に考えます — 単に同意するだけではありません",
  web_on:"🌐 ウェブ ON",web_off:"🌐 ウェブ OFF",btn_pubmed:"📚 PubMed",
  no_pt:"患者なし",btn_save:"保存",btn_saved:"✓ 保存済み",btn_new:"新規",
  lbl_ai:"AIの同僚 · ",lbl_you:"あなた · ",lbl_web:"🌐 ウェブ",lbl_searching:"ウェブ検索中...",
  chat_ph:"症状、状況、仮説を説明してください... （Enter=送信、Shift+Enter=改行）",
  chat_welcome:"こんにちは、同僚。臨床ケースについて考える準備ができています。\n\n症状を説明してください — 状況をより多く伝えていただくほど、より良い協力ができます。",
  chat_new_msg:"新しいセッション。ケースを説明してください — 症状と患者の状況から始めてください。",
  chat_err:"⚠️ 接続エラー。",chat_err_resp:"応答エラー。",
  sources_title:"科学的文献",sources_sub:"PubMed · 査読済み文献 · 伝統医学",
  pubmed_title:"🔬 PubMed / NCBI 検索",pubmed_ph:"例: クルクミン 炎症、ベルベリン 腸...",
  btn_search:"検索",btn_ctx:"コンテキストから",
  pubmed_searching:"PubMed を検索中...",pubmed_none:"結果が見つかりませんでした。",
  pubmed_found:"件の記事が見つかりました",pubmed_open:"PubMed で開く ↗",pubmed_cite:"→ チャットで引用",
  pubmed_empty:"直接検索するか「コンテキストから」を使用して自動検索してください。",
  pubmed_err:"PubMed エラー。接続を確認してください。",
  web_title:"🌐 相談中のウェブ検索",
  web_desc:"ウェブ ON が有効な場合、AI同僚はリアルタイムでウェブ検索にアクセスできます。",
  kb_title:"自然療法知識ベース",kb_sub_n:" 件の文献 · AI が相談で自動的に使用",
  kb_search_ph:"検索...",kb_empty:"文献がありません。「文献を追加」に移動して始めてください。",
  kb_add_title:"知識ベースに文献を追加",kb_add_sub:"テキストを貼り付け → 分析 → 確認 → 保存",
  lbl_content:"内容（最初にテキストを貼り付け — その後分析を使用）",
  content_ph:"文献のテキストを貼り付けてください: 症状、治療法、適応症...",
  btn_analyze:"🔍 分析して分類",btn_analyzing:"⏳ 分析中...",btn_load_txt:"📄 .txt ファイルを読み込む",
  lbl_title:"タイトル / 参考文献",title_ph:"例: Weiss R.F. — 植物療法、第4章",
  lbl_disc:"分野（分析を使用すると自動入力）",
  lbl_tags:"タグ（カンマ区切り）",tags_ph:"肝臓、消化、胆汁、コレステロール",
  btn_add_kb:"知識ベースに追加",analyze_empty:"最初に分析するテキストを入力してください。",
  analyze_err:"分析エラー。テキストを確認して再試行してください。",
  analyze_ok:"✓ 分類済み：",analyze_area:"· 分野：",
  kb_tip:"推奨ワークフロー: テキスト貼り付け → 分析 → 確認 → タイトル追加 → 追加。",
  patients_title:"患者管理",patients_sub:"仮名化 — データベースで税務IDを難読化",
  new_patient:"新規患者",lbl_cf:"マイナンバー（任意 — 難読化されます）",
  cf_ph:"識別番号",lbl_notes:"問診メモ",
  notes_ph:"年齢、性別、基礎疾患、既知のアレルギー...",
  btn_create:"患者を作成",patient_created:"患者が作成されました：",
  cf_hidden:"ID: ████████████████",btn_use_chat:"チャットで使用",
  patients_empty:"登録された患者がいません。",
  patient_tip:"患者コード（NAT-年-XXXX）は自動生成されます。",
  reports_title:"レポートを生成",reports_sub:"セッションを選択し、設定して PDF または Word でダウンロード",
  lbl_session:"セッション",current_session:"現在のセッション",
  lbl_logo:"クリニックのロゴ",no_logo:"ロゴなし",lbl_profile:"クリニックのプロフィール",no_profile:"プロフィールなし",
  lbl_report_notes:"メモと最終推奨事項",report_notes_ph:"最終推奨事項、選択した治療法、生活習慣...",
  lbl_followup:"推奨フォローアップ",followup_ph:"例: 4週間後に再評価",
  lbl_sign:"署名 / 資格",sign_ph:"例: 田中一郎 — 自然療法士",
  btn_pdf:"📄 PDF",btn_word:"📝 Word",
  no_logo_warn:"💡 ロゴがアップロードされていません。設定に移動してクリニックのロゴを追加してください。",
  preview_title:"プレビュー",preview_session:"セッション：",preview_patient:"患者：",
  preview_none:"未指定",pdf_missing:"PDF ライブラリを読み込み中です。もう一度お試しください。",
  rpt_main_title:"自然療法レポート",rpt_by:"作成者：",
  sec_symptoms:"症状と報告された臨床像",sec_analysis:"自然療法の分析と仮説",
  sec_notes:"メモと最終推奨事項",sec_followup:"推奨フォローアップ",
  sec_sign:"専門家の署名: ___________________________",
  rpt_footer:"自然療法の推奨事項は医学的診断や薬物療法に代わるものではありません。Natura Medica v",
  docs_title:"文書",docs_sub:"免責事項 · プライバシー · ホワイトペーパー · マニュアル",
  btn_new_doc:"+ 新しい文書",new_doc_title:"新しい文書",
  lbl_type:"タイプ",lbl_doc_title:"タイトル",doc_title_ph:"例: 免責事項 - 東京クリニック - v2.0",
  lbl_version:"バージョン",lbl_doc_content:"内容",
  btn_doc_save:"保存",btn_cancel:"キャンセル",btn_edit:"✏ 編集",
  btn_print:"🖨 印刷",btn_del:"✕",doc_empty:"このタイプの文書はありません。",
  btn_save_changes:"変更を保存",btn_print_preview:"🖨 印刷プレビュー",
  admin_title:"管理者パネル",admin_sub:"ユーザー管理 · アクセスログ · 個人情報保護",
  new_user:"新規ユーザー",lbl_fullname:"フルネーム",
  lbl_role:"役割",role_staff:"スタッフ",role_admin:"管理者",
  btn_create_user:"ユーザーを作成",user_created:"ユーザーが正常に作成されました。",
  err_admin_fields:"すべてのフィールドを入力してください",err_admin_short:"パスワードは最低8文字",
  err_admin_fail:"登録に失敗しました。",
  users_title:"登録済みユーザー",never_logged:"一度もログインしていません",last_login:"最終ログイン：",
  btn_deactivate:"無効化",btn_activate:"有効化",
  logs_title:"アクセスログ",logs_empty:"利用可能なログがありません。",
  admin_denied:"管理者のみがこのセクションにアクセスできます。",
  settings_title:"設定",settings_sub:"クリニックのロゴ · クリニックのプロフィール",
  logos_title:"クリニックのロゴ",lbl_logo_name:"ロゴ名",logo_name_ph:"例: 東京クリニック",
  btn_upload_logo:"📁 ロゴをアップロード（JPEG/PNG）",logo_loaded:"ロゴがアップロードされました。",
  btn_default:"★ デフォルト",logos_none:"ロゴがアップロードされていません。",
  profiles_title:"クリニックのプロフィール",lbl_pname:"クリニック名 *",pname_ph:"自然療法クリニック...",
  lbl_address:"住所",address_ph:"東京都渋谷区1-1-1",lbl_phone:"電話番号",phone_ph:"+81 3-1234-5678",
  lbl_email:"メールアドレス",email_ph:"clinic@email.jp",lbl_piva:"法人番号",piva_ph:"1234567890123",
  lbl_albo:"資格番号",albo_ph:"123456",
  btn_add_profile:"プロフィールを追加",profile_saved:"プロフィールが保存されました。",profiles_none:"プロフィールが設定されていません。",
  session_prefix:"セッション",session_msgs:"メッセージ",
  ai_lang:"常に日本語で返答してください。",
  change_lang:"← 言語を変更",
},
};

// ── System Prompt builder — dynamic per language ───────────────
function buildSystemPrompt(lang, kbCtx="") {
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


// ═══════════════════════════════════════════════════════════════
// DISCIPLINE / DOCS / DATA
// ═══════════════════════════════════════════════════════════════
const DISCIPLINE_AREAS = [
  {id:"bioenergetica",label:"Bioenergetica e Vibrazionale",color:"#7a5a9a",disciplines:[
    {id:"floriterapia",label:"Floriterapia (Bach/Australiani/Californiani)",color:"#9a6a8a"},
    {id:"aromaterapia",label:"Aromaterapia",color:"#6a8a6a"},
    {id:"cromoterapia",label:"Cromoterapia",color:"#8a6a4a"},
    {id:"cristalloterapia",label:"Cristalloterapia",color:"#6a7a9a"},
    {id:"reiki",label:"Reiki",color:"#7a5a8a"},
    {id:"pranopratica",label:"Pranopratica",color:"#8a7a5a"},
    {id:"suono_vibrazionale",label:"Terapie Suono-Vibrazionali",color:"#5a7a8a"},
  ]},
  {id:"manuale",label:"Manuale e Fisico-Riflessologica",color:"#5a7a6a",disciplines:[
    {id:"riflessologia",label:"Riflessologia Plantare/Facciale/Auricolare",color:"#5a6a8a"},
    {id:"shiatsu",label:"Shiatsu",color:"#6a8a7a"},
    {id:"massaggio_olistico",label:"Massaggio Olistico/Bioenergetico",color:"#7a6a5a"},
    {id:"kinesiologia",label:"Kinesiologia Specializzata",color:"#5a8a7a"},
    {id:"craniosacrale",label:"Craniosacrale Biodinamico",color:"#6a5a8a"},
    {id:"tuina",label:"Tuina",color:"#8a5a5a"},
    {id:"ayurveda_manuale",label:"Ayurveda (Tecniche Manuali)",color:"#c87941"},
    {id:"ortho_bionomy",label:"Ortho-Bionomy",color:"#7a8a5a"},
  ]},
  {id:"nutrizionale",label:"Nutrizionale e Fitoterapica",color:"#5a8a5a",disciplines:[
    {id:"fitoterapia",label:"Fitoterapia",color:"#4a8a4a"},
    {id:"fitoterapia_spagyrica",label:"Fitoterapia Spagyrica",color:"#6a8a5a"},
    {id:"oligoterapia",label:"Oligoterapia",color:"#5a7a6a"},
    {id:"gemmoterapia",label:"Gemmoterapia",color:"#7a9a6a"},
    {id:"nutraceutica",label:"Nutraceutica",color:"#5a9a7a"},
    {id:"alimentazione_clinica",label:"Alimentazione Clinica/Naturale",color:"#6a9a5a"},
  ]},
  {id:"educazione",label:"Educazione e Stile di Vita",color:"#6a7a5a",disciplines:[
    {id:"iridologia",label:"Iridologia",color:"#8a9a6a"},
    {id:"idroterapia",label:"Idroterapia/Talassoterapia",color:"#5a8a9a"},
    {id:"bio_naturopatia",label:"Bio-Naturopatia",color:"#7a8a6a"},
    {id:"yoga_taichi",label:"Yoga/Tai Chi/Qi Gong",color:"#9a8a5a"},
    {id:"mtc",label:"MTC (Agopuntura/Coppettazione/Moxa)",color:"#c84a4a"},
    {id:"omeopatia",label:"Omeopatia",color:"#7a6a9a"},
  ]},
  {id:"psicosomatica",label:"Mentale e Psicosomatica",color:"#8a6a7a",disciplines:[
    {id:"stress_mindfulness",label:"Gestione Stress / Mindfulness",color:"#7a6a8a"},
    {id:"immaginazione_guidata",label:"Immaginazione Guidata / Visualizzazione",color:"#8a7a6a"},
  ]},
];
const DISCIPLINES = DISCIPLINE_AREAS.flatMap(a=>a.disciplines);
const DOC_TYPES = [
  {id:"disclaimer",label:"Disclaimer Naturopatico"},
  {id:"privacy",label:"Informativa Privacy (GDPR)"},
  {id:"whitepaper",label:"Whitepaper Sistema"},
  {id:"manual",label:"Manuale Utente"},
];
const DEFAULT_DOCS = {
  disclaimer:{title:"Disclaimer Naturopatico - v1.0",content:`DICHIARAZIONE DI INTENTO NATUROPATICO\n\nNATURA DELLA CONSULENZA\nLa naturopatia è una disciplina olistica che si avvale di tecniche naturali per supportare il benessere della persona. Le indicazioni fornite non sostituiscono in alcun modo la diagnosi medica, la prescrizione farmacologica o qualsiasi intervento medico convenzionale.\n\nLIMITI DELLA CONSULENZA NATUROPATICA\nIl naturopata non diagnostica malattie, non prescrive farmaci e non interviene in situazioni di emergenza medica.\n\n___________________________          ___________________________\nFirma del Professionista              Firma del Paziente`},
  privacy:{title:"Informativa Privacy GDPR - v1.0",content:`INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI\nai sensi del Regolamento (UE) 2016/679 - GDPR\n\nTITOLARE DEL TRATTAMENTO\n[Nome Studio / Professionista]\n[Indirizzo] - [Email] - [Telefono]\n\nTIPOLOGIA DI DATI TRATTATI\nDati identificativi, dati relativi alla salute (categoria particolare ex art. 9 GDPR), anamnesi.\n\nPSEUDONIMIZZAZIONE E SICUREZZA\nOgni paziente è identificato da un codice univoco (NAT-ANNO-XXXX). Il CF è oscurato nel database.\n\n___________________________          ___________________________\nFirma del Titolare                    Firma dell'Interessato`},
  whitepaper:{title:"Whitepaper Natura Medica - v1.0",content:`NATURA MEDICA\nSistema di Supporto Decisionale Naturopatico con Intelligenza Artificiale\n\nNatura Medica è un sistema innovativo di supporto decisionale clinico per professionisti della naturopatia. Integra AI avanzata (Claude), banca dati personalizzabile e strumenti di gestione professionale.\n\nARCHITETTURA\n1. AI: Powered by Claude (Anthropic) — ragionamento critico, domande socratiche, 27 discipline\n2. BANCA DATI CLOUD: PostgreSQL su Supabase (server UE)\n3. GESTIONE STUDIO: Pazienti pseudonimizzati, referti PDF/Word, multi-utente, log accessi\n\nSICUREZZA E GDPR\n- Pseudonimizzazione pazienti (NAT-ANNO-XXXX)\n- CF oscurato nel database\n- Log completo accessi\n- Server UE (GDPR art. 46)`},
  manual:{title:"Manuale Utente - v1.0",content:`MANUALE UTENTE — NATURA MEDICA v3.0.0\n\n1. ACCESSO\nRequisiti: browser moderno. Primo avvio: schermata di configurazione → scegli lingua → crea account admin.\n\n2. CONSULTAZIONE AI\nDescrivi i sintomi nel campo testo → Invio. L'AI ragionerà con te come un collega esperto.\n\n3. BANCA DATI\nAggiungi Fonte → incolla testo → Analizza → verifica categorizzazione → titolo → salva.\n\n4. PAZIENTI\nNuovo Paziente → CF (facoltativo, sarà oscurato) + note → Crea Paziente.\n\n5. REFERTI\nSeleziona sessione → logo → profilo → note finali → PDF o Word.\n\n6. ADMIN (solo admin)\nAggiungi utenti, visualizza log accessi.\n\n7. IMPOSTAZIONI\nCarica loghi studio, configura profili studio.`},
};

// ═══════════════════════════════════════════════════════════════
// SUPABASE CLIENT
// ═══════════════════════════════════════════════════════════════
let _jwt = null;
function setJwt(t) { _jwt = t; }

async function sb(path, method="GET", body=null) {
  const token = _jwt || SB_KEY;
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: {
      "apikey": SB_KEY,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
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
    headers: { "apikey": SB_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || JSON.stringify(data));
  return data;
}

async function sbSignOut(jwt) {
  await fetch(`${SB_URL}/auth/v1/logout`, {
    method: "POST",
    headers: { "apikey": SB_KEY, "Authorization": `Bearer ${jwt}` },
  });
}

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════
function obfuscate(text, key) {
  if (!text||!key) return "";
  return btoa(Array.from(text).map((c,i)=>String.fromCharCode(c.charCodeAt(0)^key.charCodeAt(i%key.length))).join(""));
}
function genCode() {
  return `NAT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2,4).toUpperCase()}`;
}
const fmtDate = d => d ? new Date(d).toLocaleDateString() : "";
const fmtDT   = d => d ? new Date(d).toLocaleString() : "";
const fmtTime = d => d ? new Date(d).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : "";

// ═══════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════
function DTag({id}) {
  const d = DISCIPLINES.find(x=>x.id===id);
  if(!d) return null;
  return <span style={{display:"inline-block",padding:"1px 7px",borderRadius:10,fontSize:10,
    background:d.color+"22",color:d.color,border:`1px solid ${d.color}44`,marginRight:4,marginTop:2}}>{d.label}</span>;
}
function DisciplineSelect({value, onChange, style={}}) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
        color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none",width:"100%",...style}}>
      {DISCIPLINE_AREAS.map(area=>(
        <optgroup key={area.id} label={`── ${area.label}`}>
          {area.disciplines.map(d=>(
            <option key={d.id} value={d.id}>{d.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
function Btn({onClick,children,style={},disabled=false,variant="primary"}) {
  const v={primary:{background:"#1a4a1a",borderColor:"#2a6a2a",color:"#6aaa6a"},
    secondary:{background:"transparent",borderColor:"#2a4a2a",color:"#5a8a5a"},
    danger:{background:"transparent",borderColor:"#4a1a1a",color:"#8a4a4a"},
    blue:{background:"#1a2a4a",borderColor:"#2a4a6a",color:"#6a8aaa"},
    warn:{background:"#3a2a0a",borderColor:"#6a4a0a",color:"#aa8a4a"}};
  return <button onClick={disabled?undefined:onClick} disabled={disabled}
    style={{padding:"9px 18px",borderRadius:8,border:"1px solid",cursor:disabled?"not-allowed":"pointer",
      fontSize:12,fontFamily:"'DM Mono',monospace",letterSpacing:"0.3px",opacity:disabled?0.5:1,
      transition:"all 0.15s",...v[variant],...style}}>{children}</button>;
}
function Inp({value,onChange,placeholder,type="text",style={},onKeyDown}) {
  return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    type={type} onKeyDown={onKeyDown}
    style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
      color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none",width:"100%",...style}}/>;
}
function Lbl({children}) {
  return <div style={{fontSize:10,letterSpacing:"1px",textTransform:"uppercase",color:"#4a6a4a",marginBottom:4}}>{children}</div>;
}
function Card({children,style={}}) {
  return <div style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:12,padding:16,...style}}>{children}</div>;
}
function PanelHeader({title,sub,action}) {
  return <div style={{padding:"20px 28px",borderBottom:"1px solid #1a2e1a",background:"#0a120a88",
    backdropFilter:"blur(10px)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
    <div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#a8c8a0",fontWeight:500}}>{title}</div>
      {sub && <div style={{fontSize:10,color:"#3a5a3a",letterSpacing:"0.5px",marginTop:3}}>{sub}</div>}
    </div>
    {action}
  </div>;
}

// ═══════════════════════════════════════════════════════════════
// AUTH SCREENS
// ═══════════════════════════════════════════════════════════════
function AuthCard({title,sub,children}) {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",
    background:"#0d160d",fontFamily:"'DM Mono',monospace"}}>
    <div style={{width:400,background:"#0a120a",border:"1px solid #1a3a1a",borderRadius:16,padding:36}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:28,color:"#6aaa6a",marginBottom:8}}>✦</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#a8c8a0"}}>{title}</div>
        <div style={{fontSize:10,color:"#3a5a3a",letterSpacing:"0.8px",marginTop:4,lineHeight:1.5}}>{sub}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>{children}</div>
    </div>
  </div>;
}

// ── Language Picker ────────────────────────────────────────────
function LangPicker({onSelect}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",
      background:"#0d160d",fontFamily:"'DM Mono',monospace"}}>
      <div style={{width:480,background:"#0a120a",border:"1px solid #1a3a1a",borderRadius:16,padding:40}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:32,color:"#6aaa6a",marginBottom:10}}>✦</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:"#a8c8a0",marginBottom:6}}>
            Natura Medica
          </div>
          <div style={{fontSize:11,color:"#4a6a4a",letterSpacing:"1.5px",textTransform:"uppercase"}}>
            Select Language / Seleziona Lingua
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {LANGUAGES.map(lang=>(
            <button key={lang.code} onClick={()=>onSelect(lang.code)}
              style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",
                borderRadius:10,border:"1px solid #1e3a1e",background:"#0f1f0f",
                color:"#b8d0b0",cursor:"pointer",fontSize:13,fontFamily:"'DM Mono',monospace",
                transition:"all 0.15s",textAlign:"left"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#3a6a3a";e.currentTarget.style.background="#1a2e1a";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e3a1e";e.currentTarget.style.background="#0f1f0f";}}>
              <span style={{fontSize:22}}>{lang.flag}</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0"}}>{lang.name}</span>
            </button>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:9,color:"#2a4a2a",letterSpacing:"0.5px"}}>
          v{APP_VER} · Naturopatia AI
        </div>
      </div>
    </div>
  );
}

function Loading({T}) {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",
    background:"#0d160d",color:"#4a6a4a",fontFamily:"'DM Mono',monospace",fontSize:12,gap:10}}>
    <span style={{fontSize:20,color:"#4a8a4a"}}>✦</span> {T.loading}
  </div>;
}

function Setup({T,form,setForm,error,onSubmit}) {
  return <AuthCard title={T.setup_title} sub={T.setup_sub}>
    <div style={{fontSize:10,color:"#6a8a5a",background:"#0a1f0a",border:"1px solid #1a3a1a",borderRadius:8,padding:"10px 12px",lineHeight:1.6}}>
      {T.setup_warn}
    </div>
    <Lbl>{T.lbl_uname}</Lbl>
    <Inp value={form.username} onChange={v=>setForm(f=>({...f,username:v}))} placeholder="es. mario.rossi"/>
    <Lbl>{T.lbl_pwd}</Lbl>
    <Inp value={form.password} onChange={v=>setForm(f=>({...f,password:v}))} placeholder="••••••••" type="password"/>
    <Lbl>{T.lbl_confirm}</Lbl>
    <Inp value={form.confirm} onChange={v=>setForm(f=>({...f,confirm:v}))} placeholder="••••••••" type="password"/>
    {error && <div style={{color:"#a84a4a",fontSize:11}}>{error}</div>}
    <Btn onClick={onSubmit} style={{marginTop:8}}>{T.btn_setup}</Btn>
  </AuthCard>;
}

function Lock({T,form,setForm,error,onSubmit,onChangeLang}) {
  const hk = e => { if(e.key==="Enter") onSubmit(); };
  return <AuthCard title={T.login_title} sub={T.login_sub}>
    <Lbl>{T.lbl_user}</Lbl>
    <Inp value={form.username} onChange={v=>setForm(f=>({...f,username:v}))} placeholder="username" onKeyDown={hk}/>
    <Lbl>{T.lbl_password}</Lbl>
    <Inp value={form.password} onChange={v=>setForm(f=>({...f,password:v}))} placeholder="••••••••" type="password" onKeyDown={hk}/>
    {error && <div style={{color:"#a84a4a",fontSize:11}}>{error}</div>}
    <Btn onClick={onSubmit} style={{marginTop:8}}>{T.btn_login}</Btn>
    <button onClick={onChangeLang}
      style={{background:"transparent",border:"none",color:"#3a5a3a",fontSize:10,cursor:"pointer",
        fontFamily:"'DM Mono',monospace",marginTop:4,letterSpacing:"0.5px"}}>
      {T.change_lang}
    </button>
  </AuthCard>;
}

export default function NaturopatiaAI() {
  // ── LANGUAGE STATE ─────────────────────────────────────────
  const [lang, setLang] = useState(null); // null = show LangPicker
  const T = T_ALL[lang] || T_ALL.it;
  const isRTL = LANGUAGES.find(l=>l.code===lang)?.rtl || false;

  const handleLangSelect = (code) => {
    setLang(code);
    setScreen("loading");
    checkSetup();
  };
  const handleChangeLang = () => {
    setLang(null);
    setScreen("loading");
    setCurrentUser(null);
    setJwt(null);
    setMessages([]);
  };

  const [screen, setScreen] = useState("loading");
  const [currentUser, setCurrentUser] = useState(null);
  const [panel, setPanel] = useState("chat");

  // Data
  const [kb, setKb] = useState([]);
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [logos, setLogos] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);

  // Chat
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activePatient, setActivePatient] = useState("");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);

  // PubMed
  const [pubmedQuery, setPubmedQuery] = useState("");
  const [pubmedResults, setPubmedResults] = useState([]);
  const [pubmedLoading, setPubmedLoading] = useState(false);
  const [pubmedMsg, setPubmedMsg] = useState("");

  // Auth forms
  const [loginForm, setLoginForm] = useState({username:"",password:""});
  const [loginErr, setLoginErr] = useState("");
  const [setupForm, setSetupForm] = useState({username:"",password:"",confirm:""});
  const [setupErr, setSetupErr] = useState("");

  // KB Add
  const [kbForm, setKbForm] = useState({title:"",discipline:"fitoterapia",content:"",tags:"",rimedi:"",sintomi:"",controindicazioni:""});
  const [kbSearch, setKbSearch] = useState("");
  const [kbAnalyzing, setKbAnalyzing] = useState(false);
  const [kbAnalyzeMsg, setKbAnalyzeMsg] = useState("");

  // Patients
  const [ptForm, setPtForm] = useState({cf:"",notes:""});
  const [ptMsg, setPtMsg] = useState("");

  // Referti
  const [refSession, setRefSession] = useState("current");
  const [refLogo, setRefLogo] = useState("");
  const [refProfile, setRefProfile] = useState("");
  const [refNotes, setRefNotes] = useState("");
  const [refFollowup, setRefFollowup] = useState("");
  const [refSign, setRefSign] = useState("");

  // Documents
  const [docView, setDocView] = useState(null);
  const [docEdit, setDocEdit] = useState(null);
  const [docNewForm, setDocNewForm] = useState({doc_type:"disclaimer",title:"",content:"",version:"1.0"});
  const [showNewDoc, setShowNewDoc] = useState(false);

  // Admin
  const [newUserForm, setNewUserForm] = useState({username:"",password:"",full_name:"",role:"staff"});
  const [newUserErr, setNewUserErr] = useState("");
  const [newUserMsg, setNewUserMsg] = useState("");

  // Settings
  const [logoName, setLogoName] = useState("");
  const [profileForm, setProfileForm] = useState({name:"",address:"",phone:"",email:"",piva:"",albo_number:""});
  const [settingsMsg, setSettingsMsg] = useState("");

  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved"

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileKbRef = useRef(null);
  const [kbFileQueue, setKbFileQueue] = useState([]);
  const [kbFileIdx, setKbFileIdx] = useState(0);
  const [pdfChunks, setPdfChunks] = useState([]);
  const [pdfChunkIdx, setPdfChunkIdx] = useState(0);
  const fileLogoRef = useRef(null);

  // ── INIT ──────────────────────────────────────────────────────
  useEffect(() => {
    // Load jsPDF
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    document.head.appendChild(s);
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/nm_user_profiles?select=id&limit=1`, {
        headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` }
      });
      const data = await r.json();
      // Se data è array vuoto → setup. Se è array con elementi → lock.
      // Se non è array (errore RLS o altro) → assumiamo lock per sicurezza.
      if (Array.isArray(data)) {
        setScreen(data.length === 0 ? "setup" : "lock");
      } else {
        setScreen("lock");
      }
    } catch { setScreen("lock"); }
  };

  const loadAll = async () => {
    try {
      const [k,p,c,l,pr,d] = await Promise.all([
        sb("nm_knowledge_base?order=created_at.desc&limit=200"),
        sb("nm_patients?order=created_at.desc&limit=200"),
        sb("nm_consultations?order=created_at.desc&limit=100"),
        sb("nm_logos?order=created_at.desc"),
        sb("nm_practice_profiles?order=created_at.desc"),
        sb("nm_documents?order=updated_at.desc"),
      ]);
      setKb(k); setPatients(p); setConsultations(c); setLogos(l); setProfiles(pr); setDocuments(d);
      if(d.length===0) await seedDocs();
      if(l.length>0 && !refLogo) setRefLogo(l.find(x=>x.is_default)?.id || l[0].id);
      if(pr.length>0 && !refProfile) setRefProfile(pr.find(x=>x.is_default)?.id || pr[0].id);
    } catch(e) { console.error(e); }
  };

  const seedDocs = async () => {
    for (const [type,doc] of Object.entries(DEFAULT_DOCS)) {
      await sb("nm_documents","POST",{doc_type:type,title:doc.title,content:doc.content,version:"1.0"});
    }
    const d = await sb("nm_documents?order=updated_at.desc");
    setDocuments(d);
  };

  const logAccess = (username, action, details="") =>
    sb("nm_access_logs","POST",{username,action,details}).catch(()=>{});

  // ── AUTH — Supabase Auth JWT ──────────────────────────────────
  const doSetup = async () => {
    if(!setupForm.username||!setupForm.password) return setSetupErr(T.err_fields);
    if(setupForm.password!==setupForm.confirm) return setSetupErr(T.err_match);
    if(setupForm.password.length<8) return setSetupErr(T.err_short);
    const email = `${setupForm.username.toLowerCase().trim()}@nm.naturopatia`;
    try {
      const data = await sbAuth("signup", {
        email,
        password: setupForm.password,
        data: { username: setupForm.username.toLowerCase().trim(), full_name: setupForm.username, role: "admin" }
      });
      if(data.user) { setScreen("lock"); setSetupErr(""); }
      else setSetupErr(T.err_setup_fail);
    } catch(e) {
      const msg = (e.message||"").toLowerCase();
      if(msg.includes("already registered")||msg.includes("already exists")) { setScreen("lock"); }
      else { setSetupErr("Errore: "+e.message); }
    }
  };

  const doLogin = async () => {
    if(!loginForm.username||!loginForm.password) return setLoginErr(T.err_fields);
    const email = `${loginForm.username.toLowerCase().trim()}@nm.naturopatia`;
    try {
      const data = await sbAuth("token?grant_type=password", { email, password: loginForm.password });
      if(!data.access_token) return setLoginErr("Credenziali non valide");
      setJwt(data.access_token);
      // Load profile
      const profiles = await sb(`nm_user_profiles?id=eq.${data.user.id}`);
      const profile = profiles[0] || { username: loginForm.username, role: "staff", id: data.user.id };
      if(!profile.active && profile.active !== undefined) return setLoginErr("Account disattivato.");
      const pwdHash = btoa(`${loginForm.username.toLowerCase().trim()}:${loginForm.password}:nm2025`);
      setCurrentUser({ ...profile, jwt: data.access_token, pwdHash });
      await logAccess(profile.username, "LOGIN", navigator.platform);
      await sb(`nm_user_profiles?id=eq.${data.user.id}`, "PATCH", { last_login: new Date().toISOString() });
      await loadAll();
      setScreen("app"); setLoginErr(""); setLoginForm({username:"",password:""});
    } catch(e) { setLoginErr(T.err_login); }
  };

  const doLogout = async () => {
    if(currentUser) {
      await logAccess(currentUser.username, "LOGOUT", "");
      if(currentUser.jwt) await sbSignOut(currentUser.jwt);
    }
    setJwt(null);
    setCurrentUser(null); setScreen("lock");
    setMessages([{role:"assistant",content:T.chat_welcome,time:new Date()}]);
  };

  // ── CHAT ──────────────────────────────────────────────────────
  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);
  useEffect(() => {
    if(textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight,140)+"px";
    }
  }, [chatInput]);

  // ── AUTO-SAVE: persiste la sessione 30s dopo l'ultimo messaggio ───────────
  useEffect(() => {
    if(messages.length<=1||screen!=="app"||!currentUser) return;
    const t = setTimeout(async ()=>{
      setSaveStatus("saving");
      await saveSession();
      setSaveStatus("saved");
      setTimeout(()=>setSaveStatus(null), 3000);
    }, 30000);
    return ()=>clearTimeout(t);
  }, [messages]);

  const kbContext = useCallback(() => {
    if(!kb.length) return "";
    return "\n\n--- BANCA DATI ---\n"+
      kb.map(e=>{
        const disc = DISCIPLINES.find(d=>d.id===e.discipline)?.label||e.discipline;
        let meta = `[${e.title} | ${disc}]`;
        if(e.rimedi?.length)          meta += `\nRimedi: ${e.rimedi.join(", ")}`;
        if(e.sintomi?.length)         meta += `\nSintomi/Patologie: ${e.sintomi.join(", ")}`;
        if(e.controindicazioni?.length) meta += `\nControindicazioni: ${e.controindicazioni.join(", ")}`;
        return meta+"\n"+e.content;
      }).join("\n\n")+
      "\n--- FINE BANCA DATI ---";
  }, [kb]);

  const sendChat = async () => {
    if(!chatInput.trim()||chatLoading) return;
    const uMsg = {role:"user",content:chatInput.trim(),time:new Date()};
    const newMsgs = [...messages,uMsg];
    setMessages(newMsgs); setChatInput(""); setChatLoading(true);
    try {
      const apiMessages = newMsgs.map(m=>({role:m.role,content:m.content}));
      const body = {
        model:"claude-sonnet-4-20250514",
        max_tokens:1500,
        system:buildSystemPrompt(lang||"it", kbContext()),
        messages:apiMessages,
      };
      if(webSearchEnabled) {
        body.tools = [{type:"web_search_20250305",name:"web_search"}];
      }
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(body)
      });
      const data = await res.json();
      // Extract all text blocks (web search may produce multiple content blocks)
      const text = (data.content||[])
        .filter(c=>c.type==="text")
        .map(c=>c.text||"")
        .join("") || T.chat_err_resp;
      setMessages(prev=>[...prev,{role:"assistant",content:text,time:new Date(),hasWebSearch:webSearchEnabled}]);
      setSessionSaved(false);
    } catch { setMessages(prev=>[...prev,{role:"assistant",content:T.chat_err,time:new Date()}]); }
    setChatLoading(false);
  };

  const saveSession = async () => {
    if(messages.length<=1) return;
    const title = `Sessione ${fmtDate(new Date())}${activePatient?" - "+activePatient:""}`;
    await sb("nm_consultations","POST",{patient_code:activePatient||null,session_title:title,
      messages:messages,created_by:currentUser?.username});
    await logAccess(currentUser?.username,"SAVE_SESSION",title);
    const c = await sb("nm_consultations?order=created_at.desc");
    setConsultations(c); setSessionSaved(true);
  };

  const newSession = () => {
    setMessages([{role:"assistant",content:T.chat_new_msg,time:new Date()}]);
    setActivePatient(""); setSessionSaved(false);
  };

  // ── PUBMED ───────────────────────────────────────────────────
  const searchPubMed = async (queryOverride) => {
    const q = (queryOverride || pubmedQuery).trim();
    if(!q) return;
    setPubmedLoading(true); setPubmedMsg("Ricerca in corso su PubMed..."); setPubmedResults([]);
    try {
      // Step 1: search IDs
      const searchRes = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(q+" naturopathy OR herbal OR traditional medicine OR integrative")}&retmax=8&retmode=json&sort=relevance`
      );
      const searchData = await searchRes.json();
      const ids = searchData.esearchresult?.idlist || [];
      if(!ids.length) { setPubmedMsg("Nessun risultato trovato."); setPubmedLoading(false); return; }

      // Step 2: fetch summaries
      const summaryRes = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`
      );
      const summaryData = await summaryRes.json();
      const results = ids.map(id => {
        const r = summaryData.result?.[id];
        if(!r) return null;
        return {
          pmid: id,
          title: r.title || "(Titolo non disponibile)",
          authors: (r.authors||[]).slice(0,3).map(a=>a.name).join(", "),
          journal: r.fulljournalname || r.source || "",
          year: r.pubdate?.substring(0,4) || "",
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        };
      }).filter(Boolean);
      setPubmedResults(results);
      setPubmedMsg(`${results.length} articoli trovati`);
    } catch(e) {
      setPubmedMsg("Errore nella ricerca PubMed. Controlla la connessione.");
    }
    setPubmedLoading(false);
  };

  const pubmedFromContext = () => {
    // Extract key terms from last few messages
    const recentText = messages.slice(-4).map(m=>m.content).join(" ");
    const terms = recentText.replace(/[^\w\s]/g,"").split(/\s+/)
      .filter(w=>w.length>5)
      .slice(0,5).join(" ");
    setPubmedQuery(terms);
    searchPubMed(terms);
    setPanel("fonti");
  };

  const injectPubmedInChat = (article) => {
    const ref = `[PUBMED] ${article.authors} (${article.year}). "${article.title}". ${article.journal}. PMID: ${article.pmid} — ${article.url}`;
    setChatInput(prev => prev ? prev + "\n\n" + ref : ref);
    setPanel("chat");
  };

  // ── KB ────────────────────────────────────────────────────────
  const addKB = async () => {
    if(!kbForm.title||!kbForm.content) return;
    const entry = {title:kbForm.title,discipline:kbForm.discipline,content:kbForm.content,
      tags:kbForm.tags.split(",").map(t=>t.trim()).filter(Boolean),
      rimedi:kbForm.rimedi.split(",").map(t=>t.trim()).filter(Boolean),
      sintomi:kbForm.sintomi.split(",").map(t=>t.trim()).filter(Boolean),
      controindicazioni:kbForm.controindicazioni.split(",").map(t=>t.trim()).filter(Boolean),
      created_by:currentUser?.username};
    const r = await sb("nm_knowledge_base","POST",entry);
    setKb(prev=>[r[0],...prev]);
    await logAccess(currentUser?.username,"ADD_KB",kbForm.title);
    setKbForm({title:"",discipline:"fitoterapia",content:"",tags:"",rimedi:"",sintomi:"",controindicazioni:""});
    setPanel("kb");
  };

  // ── KB FILE PROCESSING (txt + pdf) ───────────────────────────
  const processKbFile = async (file) => {
    if(!file) return;
    const name = file.name.replace(/\.[^.]+$/, "");
    if(file.name.toLowerCase().endsWith(".pdf")) {
      // Use Anthropic API to extract text from PDF
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(",")[1];
        try {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
              model:"claude-sonnet-4-20250514", max_tokens:2000,
              messages:[{role:"user", content:[
                {type:"document", source:{type:"base64", media_type:"application/pdf", data:base64}},
                {type:"text", text:"Estrai e riassumi il contenuto principale di questo documento in modo dettagliato, mantenendo tutti i termini tecnici, rimedi, dosaggi e indicazioni presenti. Massimo 3500 parole."}
              ]}]
            })
          });
          const data = await res.json();
          const text = (data.content||[]).filter(c=>c.type==="text").map(c=>c.text).join("") || "";
          setKbForm(fm=>({...fm, title:name, content:text.slice(0,4000)}));
          setKbAnalyzeMsg("✓ PDF estratto: "+name);
        } catch { setKbAnalyzeMsg("Errore estrazione PDF. Riprova."); }
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text
      const reader = new FileReader();
      reader.onload = ev => {
        setKbForm(fm=>({...fm, title:name, content:ev.target.result.slice(0,4000)}));
        setKbAnalyzeMsg("✓ File caricato: "+name);
      };
      reader.readAsText(file, "UTF-8");
    }
  };

  const nextKbFile = async () => {
    const next = kbFileIdx + 1;
    if(next < kbFileQueue.length) {
      setKbFileIdx(next);
      setKbForm({title:"",discipline:"fitoterapia",content:"",tags:"",rimedi:"",sintomi:"",controindicazioni:""});
      setKbAnalyzeMsg("");
      await processKbFile(kbFileQueue[next]);
    } else {
      setKbFileQueue([]);
      setKbFileIdx(0);
    }
  };

  const nextPdfChunk = () => {
    const next = pdfChunkIdx + 1;
    if(next < pdfChunks.length) {
      setPdfChunkIdx(next);
      setKbForm(fm=>({...fm, title:pdfChunks[next].title, content:pdfChunks[next].content}));
      setKbAnalyzeMsg(`Blocco ${next+1}/${pdfChunks.length} — modifica titolo se vuoi, poi Aggiungi.`);
    } else {
      setPdfChunks([]); setPdfChunkIdx(0);
      setKbForm({title:"",discipline:"fitoterapia",content:"",tags:"",rimedi:"",sintomi:"",controindicazioni:""});
      setKbAnalyzeMsg("✓ Tutti i blocchi caricati!");
      setTimeout(()=>setKbAnalyzeMsg(""), 3000);
    }
  };

  const delKB = async id => {
    if(!window.confirm("Eliminare questa voce dalla Banca Dati?")) return;
    await sb(`nm_knowledge_base?id=eq.${id}`,"DELETE");
    setKb(prev=>prev.filter(e=>e.id!==id));
  };

  const analyzeAndCategorize = async () => {
    if(!kbForm.content.trim()) { setKbAnalyzeMsg("Inserisci prima il testo da analizzare."); return; }
    setKbAnalyzing(true); setKbAnalyzeMsg("Analisi in corso...");
    const disciplineList = DISCIPLINES.map(d=>`${d.id}: ${d.label}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:800,
          messages:[{role:"user", content:`Analizza questo testo naturopatico e rispondi SOLO con un oggetto JSON valido, senza markdown, senza backtick, senza testo aggiuntivo.

TESTO:
${kbForm.content.slice(0,2000)}

DISCIPLINE DISPONIBILI (usa SOLO questi id):
${disciplineList}

Rispondi con questo JSON esatto (array vuoto [] se non ci sono elementi per una categoria):
{"discipline":"id_disciplina","title":"titolo_breve_bibliografico","tags":["tag1","tag2"],"area":"nome_area_tematica","rimedi":["pianta1","integratore2"],"sintomi":["sintomo1","patologia2"],"controindicazioni":["controindicazione1"]}`}]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(c=>c.text||"").join("").trim();
      // Strip markdown code fences se Claude le include nonostante le istruzioni
      const jsonStr = raw.replace(/^```(?:json)?\s*/i,"").replace(/\s*```\s*$/,"").trim();
      const parsed = JSON.parse(jsonStr);
      setKbForm(f=>({
        ...f,
        discipline: parsed.discipline || f.discipline,
        title: f.title || parsed.title || f.title,
        tags: parsed.tags?.join(", ") || f.tags,
        rimedi: parsed.rimedi?.join(", ") || f.rimedi,
        sintomi: parsed.sintomi?.join(", ") || f.sintomi,
        controindicazioni: parsed.controindicazioni?.join(", ") || f.controindicazioni,
      }));
      const disc = DISCIPLINES.find(d=>d.id===parsed.discipline)?.label||parsed.discipline;
      const summary = [
        parsed.rimedi?.length ? `Rimedi: ${parsed.rimedi.slice(0,3).join(", ")}` : "",
        parsed.sintomi?.length ? `Sintomi: ${parsed.sintomi.slice(0,3).join(", ")}` : "",
        parsed.controindicazioni?.length ? `⚠ Controindicazioni: ${parsed.controindicazioni.slice(0,2).join(", ")}` : "",
      ].filter(Boolean).join(" · ");
      setKbAnalyzeMsg(`✓ ${disc} · Area: ${parsed.area}${summary ? "\n"+summary : ""}`);
    } catch(e) {
      setKbAnalyzeMsg("Errore nell'analisi. Controlla il testo e riprova.");
    }
    setKbAnalyzing(false);
  };

  // ── PATIENTS ─────────────────────────────────────────────────
  const addPatient = async () => {
    if (!currentUser?.pwdHash) { await doLogout(); return; }
    const code = genCode();
    const cfObs = ptForm.cf ? obfuscate(ptForm.cf, currentUser.pwdHash) : null;
    const r = await sb("nm_patients","POST",{patient_code:code,cf_obfuscated:cfObs,
      notes:ptForm.notes,created_by:currentUser?.username});
    setPatients(prev=>[r[0],...prev]);
    await logAccess(currentUser?.username,"ADD_PATIENT",code);
    setPtForm({cf:"",notes:""}); setPtMsg(`Paziente creato: ${code}`);
    setTimeout(()=>setPtMsg(""),4000);
  };

  // ── REFERTI ──────────────────────────────────────────────────
  const getRefMsgs = () => {
    if(refSession==="current") return messages;
    const c = consultations.find(x=>x.id===refSession);
    return c?.messages || messages;
  };
  const getRefPatientCode = () => {
    if(refSession==="current") return activePatient;
    return consultations.find(x=>x.id===refSession)?.patient_code||"";
  };

  const genPDF = async () => {
    if(!window.jspdf) { alert("Libreria PDF ancora in caricamento, riprova tra un secondo."); return; }
    const {jsPDF} = window.jspdf;
    const doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
    const W=210, M=20;
    let y = M;
    const logo = logos.find(l=>l.id===refLogo);
    const profile = profiles.find(p=>p.id===refProfile);
    const msgs = getRefMsgs();
    const userMsgs = msgs.filter(m=>m.role==="user");
    const aiMsgs = msgs.filter(m=>m.role==="assistant").slice(1);
    const patCode = getRefPatientCode();
    const refN = Date.now().toString().slice(-6);
    const today = fmtDate(new Date());

    // Logo
    if(logo?.logo_data) {
      try { doc.addImage(logo.logo_data,"JPEG",(W-50)/2,y,50,25); y+=30; } catch {}
    }
    // Practice header
    if(profile) {
      doc.setFontSize(14); doc.setFont("helvetica","bold"); doc.setTextColor(40,80,40);
      doc.text(profile.name||"Studio Naturopatico",W/2,y,{align:"center"}); y+=7;
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(100);
      if(profile.address){doc.text(profile.address,W/2,y,{align:"center"});y+=5;}
      const contacts=[profile.phone,profile.email].filter(Boolean).join(" | ");
      if(contacts){doc.text(contacts,W/2,y,{align:"center"});y+=5;}
      if(profile.piva){doc.text(`P.IVA: ${profile.piva}`,W/2,y,{align:"center"});y+=5;}
      if(profile.albo_number){doc.text(`Albo: ${profile.albo_number}`,W/2,y,{align:"center"});y+=5;}
    }
    doc.setTextColor(0); y+=3;
    doc.setDrawColor(80,140,80); doc.setLineWidth(0.5); doc.line(M,y,W-M,y); y+=8;
    doc.setFontSize(18); doc.setFont("helvetica","bold"); doc.setTextColor(30,70,30);
    doc.text(T.rpt_main_title,W/2,y,{align:"center"}); y+=8;
    doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(80);
    doc.text(`Data: ${today}`,M,y);
    if(patCode) doc.text(`Codice Paziente: ${patCode}`,W/2,y,{align:"center"});
    doc.text(`N° ${refN}`,W-M,y,{align:"right"}); y+=5;
    doc.text(T.rpt_by+" "+(currentUser?.username||"")+(refSign?" — "+refSign:""),M,y); y+=5;
    doc.setDrawColor(200); doc.line(M,y,W-M,y); y+=8; doc.setTextColor(0);

    const addSection = (title, content) => {
      if(y>260){doc.addPage();y=M;}
      doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(40,80,40);
      doc.text(title,M,y); y+=6;
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(50);
      const lines = doc.splitTextToSize(content,W-M*2);
      lines.forEach(l=>{ if(y>272){doc.addPage();y=M;} doc.text(l,M,y); y+=5; });
      y+=4;
    };

    if(userMsgs.length) addSection(T.sec_symptoms,userMsgs.map(m=>m.content).join("\n\n").substring(0,1000));
    if(aiMsgs.length) addSection(T.sec_analysis,aiMsgs.map(m=>m.content).join("\n\n").substring(0,2000));
    if(refNotes) addSection(T.sec_notes,refNotes);
    if(refFollowup) addSection(T.sec_followup,refFollowup);
    if(refSign) { if(y>260){doc.addPage();y=M;} doc.setFontSize(9); doc.setTextColor(80);
      doc.text(T.sec_sign,M,y); y+=5;
      doc.text(refSign,M,y); y+=10; }

    // Footer
    const lastY = Math.max(y+10, 270);
    doc.setDrawColor(200); doc.line(M,lastY,W-M,lastY);
    doc.setFontSize(7); doc.setTextColor(160);
    doc.text(T.rpt_footer+APP_VER,M,lastY+4);

    doc.save(`referto_${patCode||"sessione"}_${today.replace(/\//g,"-")}.pdf`);
    await logAccess(currentUser?.username,"PDF_REFERTO",patCode||"sessione corrente");
  };

  const genWord = async () => {
    const msgs = getRefMsgs();
    const userMsgs = msgs.filter(m=>m.role==="user");
    const aiMsgs = msgs.filter(m=>m.role==="assistant").slice(1);
    const profile = profiles.find(p=>p.id===refProfile);
    const patCode = getRefPatientCode();
    const today = fmtDate(new Date());
    const html = `<html><head><meta charset="UTF-8">
<style>body{font-family:Calibri,sans-serif;margin:2cm;color:#222;font-size:11pt}
h1{color:#2a5a2a;text-align:center;font-size:16pt}h2{color:#3a6a3a;font-size:12pt;border-bottom:1pt solid #aaa;padding-bottom:3pt}
.hdr{text-align:center;border-bottom:2pt solid #5a9a5a;padding-bottom:14pt;margin-bottom:14pt}
.meta{color:#666;font-size:9pt}.footer{margin-top:30pt;border-top:1pt solid #ccc;font-size:8pt;color:#888}
.sig{margin-top:20pt;font-size:10pt}</style></head><body>
<div class="hdr">
${profile?`<h2 style="border:none;font-size:14pt">${profile.name}</h2>
<div class="meta">${[profile.address,profile.phone,profile.email].filter(Boolean).join(" | ")}</div>
${profile.piva?`<div class="meta">P.IVA: ${profile.piva}</div>`:""}
${profile.albo_number?`<div class="meta">Albo: ${profile.albo_number}</div>`:""}`:""
}<h1>${T.rpt_main_title}</h1>
<div class="meta">Data: ${today} &nbsp;|&nbsp; Codice Paziente: ${patCode||"N/D"} &nbsp;|&nbsp; N° ${Date.now().toString().slice(-6)}<br>
Redatto da: ${currentUser?.username||""}${refSign?" — "+refSign:""}</div></div>
${userMsgs.length?`<h2>${T.sec_symptoms}</h2><p>${userMsgs.map(m=>m.content).join("<br><br>").replace(/\n/g,"<br>")}</p>`:""}
${aiMsgs.length?`<h2>${T.sec_analysis}</h2><p>${aiMsgs.map(m=>m.content).join("<br><br>").replace(/\n/g,"<br>")}</p>`:""}
${refNotes?`<h2>${T.sec_notes}</h2><p>${refNotes.replace(/\n/g,"<br>")}</p>`:""}
${refFollowup?`<h2>${T.sec_followup}</h2><p>${refFollowup}</p>`:""}
${refSign?`<div class="sig">${T.sec_sign}<br>${refSign}</div>`:""}
<div class="footer">${T.rpt_footer}${APP_VER}</div>
</body></html>`;
    const blob = new Blob([html],{type:"application/msword"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `referto_${patCode||"sessione"}_${today.replace(/\//g,"-")}.doc`;
    a.click();
    await logAccess(currentUser?.username,"WORD_REFERTO",patCode||"sessione corrente");
  };

  // ── DOCUMENTS ────────────────────────────────────────────────
  const saveDoc = async () => {
    if(!docEdit) return;
    await sb(`nm_documents?id=eq.${docEdit.id}`,"PATCH",{title:docEdit.title,content:docEdit.content,version:docEdit.version,updated_at:new Date().toISOString()});
    const d = await sb("nm_documents?order=updated_at.desc");
    setDocuments(d); setDocEdit(null); setDocView(null);
    await logAccess(currentUser?.username,"EDIT_DOC",docEdit.title);
  };
  const addDoc = async () => {
    if(!docNewForm.title||!docNewForm.content) return;
    await sb("nm_documents","POST",{...docNewForm});
    const d = await sb("nm_documents?order=updated_at.desc");
    setDocuments(d); setShowNewDoc(false);
    setDocNewForm({doc_type:"disclaimer",title:"",content:"",version:"1.0"});
  };
  const delDoc = async id => {
    if(!window.confirm("Eliminare questo documento?")) return;
    await sb(`nm_documents?id=eq.${id}`,"DELETE");
    setDocuments(prev=>prev.filter(x=>x.id!==id));
  };
  const printDoc = (content,title) => {
    const w = window.open("","_blank");
    w.document.write(`<html><head><title>${title}</title><style>body{font-family:Calibri,sans-serif;margin:2cm;font-size:11pt;white-space:pre-wrap}</style></head><body>${content}</body></html>`);
    w.document.close(); w.print();
  };

  // ── ADMIN ────────────────────────────────────────────────────
  const loadAdminData = async () => {
    const [u,l] = await Promise.all([
      sb("nm_user_profiles?order=created_at.desc"),
      sb("nm_access_logs?order=created_at.desc&limit=200")
    ]);
    setUsers(u); setAccessLogs(l);
  };
  useEffect(()=>{ if(panel==="admin" && currentUser?.role==="admin") loadAdminData(); },[panel]);

  const addUser = async () => {
    if(!newUserForm.username||!newUserForm.password) return setNewUserErr("Compila tutti i campi");
    if(newUserForm.password.length<8) return setNewUserErr("Password minimo 8 caratteri");
    const email = `${newUserForm.username.toLowerCase().trim()}@nm.naturopatia`;
    try {
      const data = await sbAuth("signup", {
        email,
        password: newUserForm.password,
        data: {
          username: newUserForm.username.toLowerCase().trim(),
          full_name: newUserForm.full_name || newUserForm.username,
          role: newUserForm.role
        }
      });
      if(!data.user) throw new Error("Registrazione fallita — verifica che la conferma email sia disabilitata in Supabase.");
      await logAccess(currentUser?.username,"ADD_USER",newUserForm.username);
      await loadAdminData();
      setNewUserForm({username:"",password:"",full_name:"",role:"staff"});
      setNewUserErr(""); setNewUserMsg("Utente creato con successo.");
      setTimeout(()=>setNewUserMsg(""),3000);
    } catch(e) { setNewUserErr("Errore: "+e.message); }
  };
  const toggleUser = async (u) => {
    await sb(`nm_user_profiles?id=eq.${u.id}`,"PATCH",{active:!u.active});
    await logAccess(currentUser?.username,u.active?"DEACTIVATE_USER":"ACTIVATE_USER",u.username);
    loadAdminData();
  };

  // ── SETTINGS ─────────────────────────────────────────────────
  const uploadLogo = async (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const data = ev.target.result;
      const name = logoName || file.name.replace(/\.[^.]+$/,"");
      const isFirst = logos.length===0;
      const r = await sb("nm_logos","POST",{name,logo_data:data,is_default:isFirst});
      setLogos(prev=>[...prev,r[0]]);
      if(isFirst) setRefLogo(r[0].id);
      setLogoName(""); setSettingsMsg("Logo caricato.");
      setTimeout(()=>setSettingsMsg(""),3000);
    };
    reader.readAsDataURL(file);
  };
  const setDefaultLogo = async (id) => {
    await Promise.all(logos.map(l=>sb(`nm_logos?id=eq.${l.id}`,"PATCH",{is_default:l.id===id})));
    setLogos(prev=>prev.map(l=>({...l,is_default:l.id===id})));
    setRefLogo(id);
  };
  const delLogo = async (id) => {
    await sb(`nm_logos?id=eq.${id}`,"DELETE");
    setLogos(prev=>prev.filter(l=>l.id!==id));
  };
  const saveProfile = async () => {
    if(!profileForm.name) return;
    const isFirst = profiles.length===0;
    const r = await sb("nm_practice_profiles","POST",{...profileForm,is_default:isFirst});
    setProfiles(prev=>[...prev,r[0]]);
    if(isFirst) setRefProfile(r[0].id);
    setProfileForm({name:"",address:"",phone:"",email:"",piva:"",albo_number:""});
    setSettingsMsg("Profilo salvato."); setTimeout(()=>setSettingsMsg(""),3000);
  };
  const delProfile = async id => {
    await sb(`nm_practice_profiles?id=eq.${id}`,"DELETE");
    setProfiles(prev=>prev.filter(p=>p.id!==id));
  };


  // ── INIT MESSAGES on lang load ─────────────────────────────
  useEffect(() => {
    if(lang && messages.length === 0) {
      setMessages([{role:"assistant",content:(T_ALL[lang]||T_ALL.it).chat_welcome,time:new Date()}]);
    }
  }, [lang]);

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  if(!lang) return <LangPicker onSelect={handleLangSelect}/>;
  if(screen==="loading") return <Loading T={T}/>;
  if(screen==="setup") return <Setup T={T} form={setupForm} setForm={setSetupForm} error={setupErr} onSubmit={doSetup}/>;
  if(screen==="lock") return <Lock T={T} form={loginForm} setForm={setLoginForm} error={loginErr} onSubmit={doLogin} onChangeLang={handleChangeLang}/>;

  const curLangObj = LANGUAGES.find(l=>l.code===lang) || LANGUAGES[0];

  // ── NAV ITEMS ─────────────────────────────────────────────────
  const navItems = [
    {id:"chat",icon:"◈",label:T.nav_chat},
    {id:"fonti",icon:"⊞",label:T.nav_sources},
    {id:"kb",icon:"◉",label:T.nav_kb},
    {id:"kb_add",icon:"⊕",label:T.nav_kb_add},
    {id:"patients",icon:"♦",label:T.nav_patients},
    {id:"referti",icon:"▣",label:T.nav_reports},
    {id:"documents",icon:"☰",label:T.nav_docs},
    ...(currentUser?.role==="admin"?[{id:"admin",icon:"⚙",label:T.nav_admin}]:[]),
    {id:"settings",icon:"◎",label:T.nav_settings},
  ];


  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Mono',monospace",background:"#0d160d",color:"#c8d8c0",overflow:"hidden",direction:isRTL?"rtl":"ltr"}}>
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 20% 50%,#1a2e1a,transparent 60%),radial-gradient(ellipse at 80% 20%,#1e2a18,transparent 50%)",pointerEvents:"none",zIndex:0}}/>

      {/* SIDEBAR */}
      <aside style={{width:248,background:"#0a120a",borderRight:"1px solid #1a2e1a",display:"flex",flexDirection:"column",padding:"20px 0",zIndex:10,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 18px 20px",borderBottom:"1px solid #1a2e1a",marginBottom:12}}>
          <span style={{fontSize:24,color:"#6aaa6a"}}>✦</span>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:"#a8c8a0",fontWeight:600}}>Natura Medica</div>
            <div style={{fontSize:9,color:"#3a5a3a",letterSpacing:"1px",marginTop:1}}>v{APP_VER} · {currentUser?.username}</div>
          </div>
        </div>
        <nav style={{display:"flex",flexDirection:"column",gap:1,padding:"0 10px",flex:1,overflow:"auto"}}>
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>setPanel(item.id)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:7,
                border:"none",background:panel===item.id?"#1a3a1a":"transparent",
                color:panel===item.id?"#8ac88a":"#4a6a4a",cursor:"pointer",fontSize:11,
                fontFamily:"'DM Mono',monospace",letterSpacing:"0.4px",textAlign:"left",transition:"all 0.12s"}}>
              <span style={{fontSize:14,width:18,textAlign:"center"}}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 18px",borderTop:"1px solid #1a2e1a",marginTop:"auto"}}>
          <div style={{display:"flex",gap:16,marginBottom:12}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"#6aaa6a",lineHeight:1}}>{messages.length-1}</div>
              <div style={{fontSize:9,color:"#3a5a3a",letterSpacing:"0.8px",textTransform:"uppercase",marginTop:1}}>{T.stat_ex}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"#6aaa6a",lineHeight:1}}>{kb.length}</div>
              <div style={{fontSize:9,color:"#3a5a3a",letterSpacing:"0.8px",textTransform:"uppercase",marginTop:1}}>{T.stat_kb}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"#6aaa6a",lineHeight:1}}>{patients.length}</div>
              <div style={{fontSize:9,color:"#3a5a3a",letterSpacing:"0.8px",textTransform:"uppercase",marginTop:1}}>{T.stat_pt}</div>
            </div>
          </div>
          <button onClick={doLogout} style={{width:"100%",padding:"8px",borderRadius:8,
            border:"1px solid #2a3a2a",background:"transparent",color:"#4a6a4a",
            cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:"0.4px"}}>
            {T.btn_logout}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",zIndex:10}}>

        {/* ── CHAT ── */}
        {panel==="chat" && <>
          <PanelHeader title={T.chat_title} sub={T.chat_sub}
            action={<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <button onClick={()=>setWebSearchEnabled(v=>!v)}
                style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${webSearchEnabled?"#2a6a4a":"#2a4a2a"}`,
                  background:webSearchEnabled?"#0f2a1a":"transparent",
                  color:webSearchEnabled?"#5aaa7a":"#4a6a4a",cursor:"pointer",fontSize:10,
                  fontFamily:"'DM Mono',monospace",letterSpacing:"0.4px",transition:"all 0.15s"}}>
                {webSearchEnabled?T.web_on:T.web_off}
              </button>
              <Btn onClick={pubmedFromContext} variant="blue" style={{padding:"6px 12px",fontSize:10}}>
                {T.btn_pubmed}
              </Btn>
              <select value={activePatient} onChange={e=>setActivePatient(e.target.value)}
                style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,
                  padding:"7px 10px",color:"#7aaa7a",fontSize:11,fontFamily:"'DM Mono',monospace",outline:"none"}}>
                <option value="">{T.no_pt}</option>
                {patients.map(p=><option key={p.id} value={p.patient_code}>{p.patient_code}</option>)}
              </select>
              <Btn onClick={saveSession} variant="secondary" disabled={messages.length<=1||sessionSaved} style={{padding:"7px 12px"}}>
                {sessionSaved?T.btn_saved:T.btn_save}
              </Btn>
              {saveStatus && <span style={{fontSize:10,color:saveStatus==="saving"?"var(--nm-text-dim)":"var(--nm-accent)",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap",transition:"color 0.3s"}}>
                {saveStatus==="saving" ? "⏳ Salvataggio..." : "✓ Salvata"}
              </span>}
              <Btn onClick={newSession} variant="secondary" style={{padding:"7px 12px"}}>{T.btn_new}</Btn>
            </div>}/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",flexDirection:"column",gap:14}}>
            {messages.map((msg,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
                {msg.role==="assistant" && <div style={{width:34,height:34,borderRadius:"50%",background:"#1a3a1a",border:"1px solid #2a5a2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#6aaa6a",flexShrink:0,marginTop:2}}>✦</div>}
                <div style={{maxWidth:"68%",display:"flex",flexDirection:"column",alignItems:msg.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{background:msg.role==="user"?"#0f1a2a":"#0f1f0f",
                    border:`1px solid ${msg.role==="user"?"#1a304a":"#1e3a1e"}`,
                    borderRadius:msg.role==="user"?"16px 4px 16px 16px":"4px 16px 16px 16px",
                    padding:"13px 17px",fontSize:13,lineHeight:1.7,
                    color:msg.role==="user"?"#a0b8cc":"#b8d0b0",fontFamily:"'DM Mono',monospace"}}>
                    {msg.content.split("\n").map((l,j)=><span key={j}>{l}{j<msg.content.split("\n").length-1&&<br/>}</span>)}
                  </div>
                  <div style={{fontSize:9,color:"#2a4a2a",marginTop:3,letterSpacing:"0.5px",display:"flex",gap:8,alignItems:"center"}}>
                    {msg.role==="assistant"?T.lbl_ai:T.lbl_you}{fmtTime(msg.time)}
                    {msg.hasWebSearch && <span style={{color:"#3a6a5a",fontSize:8}}>🌐 web</span>}
                  </div>
                </div>
                {msg.role==="user" && <div style={{width:34,height:34,borderRadius:"50%",background:"#1a2a3a",border:"1px solid #2a4a5a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#6aaaca",flexShrink:0,marginTop:2,letterSpacing:"0.5px"}}>TU</div>}
              </div>
            ))}
            {chatLoading && <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:"#1a3a1a",border:"1px solid #2a5a2a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#6aaa6a"}}>✦</div>
              <div style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:"4px 16px 16px 16px",padding:"13px 17px"}}>
                <span style={{display:"inline-flex",gap:4,fontSize:16,color:"#4a8a4a"}}>
                  {[0,200,400].map(d=><span key={d} style={{animation:`blink 1.2s infinite ${d}ms`}}>●</span>)}
                </span>
                {webSearchEnabled && <span style={{fontSize:9,color:"#3a6a5a",marginLeft:8}}>{T.lbl_searching}</span>}
              </div>
            </div>}
            <div ref={chatEndRef}/>
          </div>
          <div style={{padding:"14px 28px 18px",borderTop:"1px solid #1a2e1a",background:"#0a120aaa",backdropFilter:"blur(10px)"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <textarea ref={textareaRef} value={chatInput}
                onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
                placeholder={T.chat_ph}
                style={{flex:1,background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:12,
                  padding:"12px 16px",color:"#b8d0b0",fontSize:13,fontFamily:"'DM Mono',monospace",
                  lineHeight:1.6,resize:"none",outline:"none",minHeight:46,maxHeight:140}} rows={1}/>
              <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()}
                style={{width:44,height:44,borderRadius:12,background:"#1a4a1a",border:"1px solid #2a6a2a",
                  color:"#6aaa6a",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",
                  justifyContent:"center",opacity:chatLoading||!chatInput.trim()?0.4:1,flexShrink:0}}>➤</button>
            </div>
          </div>
        </>}

        {/* ── FONTI SCIENTIFICHE ── */}
        {panel==="fonti" && <>
          <PanelHeader title={T.sources_title} sub={T.sources_sub}/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",flexDirection:"column",gap:16}}>

            {/* PubMed search */}
            <Card>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#a8c8a0",marginBottom:12}}>
                {T.pubmed_title}
              </div>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <Inp value={pubmedQuery} onChange={setPubmedQuery}
                  placeholder={T.pubmed_ph}
                  style={{flex:1}}
                  onKeyDown={e=>{if(e.key==="Enter") searchPubMed();}}/>
                <Btn onClick={()=>searchPubMed()} disabled={pubmedLoading||!pubmedQuery.trim()} style={{flexShrink:0,padding:"10px 16px"}}>
                  {pubmedLoading?"⏳":T.btn_search}
                </Btn>
                <Btn variant="blue" onClick={pubmedFromContext} style={{flexShrink:0,padding:"10px 12px",fontSize:10}} title="Cerca automaticamente dai sintomi discussi">
                  Dal contesto
                </Btn>
              </div>
              {pubmedMsg && <div style={{fontSize:10,color:"#5a8a6a",marginBottom:8,letterSpacing:"0.5px"}}>{pubmedMsg}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {pubmedResults.map(r=>(
                  <div key={r.pmid} style={{padding:"12px 14px",background:"#0a1a0a",borderRadius:10,border:"1px solid #1a2e1a"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:"#9ac89a",marginBottom:4,lineHeight:1.4}}>{r.title}</div>
                    <div style={{fontSize:10,color:"#4a6a4a",marginBottom:6}}>
                      {r.authors}{r.authors&&r.journal?" · ":""}{r.journal} {r.year&&`(${r.year})`} · PMID: {r.pmid}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <a href={r.url} target="_blank" rel="noreferrer"
                        style={{fontSize:10,color:"#4a8a6a",textDecoration:"none",
                          padding:"3px 10px",border:"1px solid #2a5a3a",borderRadius:6}}>
                        {T.pubmed_open}
                      </a>
                      <button onClick={()=>injectPubmedInChat(r)}
                        style={{fontSize:10,color:"#4a6a8a",background:"transparent",
                          border:"1px solid #2a4a5a",borderRadius:6,padding:"3px 10px",
                          cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
                        {T.pubmed_cite}
                      </button>
                    </div>
                  </div>
                ))}
                {!pubmedLoading && pubmedResults.length===0 && !pubmedMsg && (
                  <div style={{fontSize:11,color:"#3a5a3a",padding:"8px 4px",lineHeight:1.7}}>
                    Cerca direttamente oppure usa "Dal contesto" per cercare automaticamente
                    articoli pertinenti alla consultazione in corso.
                    <br/>Puoi anche citare un articolo direttamente in chat con "→ Cita in chat".
                  </div>
                )}
              </div>
            </Card>

            {/* Web search note */}
            <Card>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#a8c8a0",marginBottom:10}}>
                {T.web_title}
              </div>
              <div style={{fontSize:11,color:"#5a7a5a",lineHeight:1.8}}>
                Il collega AI ha accesso alla ricerca web in tempo reale durante le consultazioni
                quando il toggle <span style={{color:"#5aaa7a"}}>Web ON</span> è attivo.
                <br/><br/>
                Fonti che utilizza automaticamente:
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
                {["PubMed/NCBI","WHO","ESCOP","EMA Fitoterapia","AYUSH Ayurveda",
                  "WHO Traditional Medicine","NIH ODS","Journal Integrative Medicine"].map(s=>(
                  <span key={s} style={{fontSize:10,color:"#4a7a5a",background:"#0a2a1a",
                    padding:"3px 10px",borderRadius:6,border:"1px solid #1a4a2a"}}>{s}</span>
                ))}
              </div>
              <div style={{fontSize:10,color:"#3a5a4a",marginTop:12,lineHeight:1.6,
                padding:"8px 12px",background:"#0a1a0a",borderRadius:8,border:"1px solid #1a2e1a"}}>
                💡 Per attivare la ricerca su un tema specifico, includilo nella tua domanda in chat
                — es: "Hai evidenze recenti su berberina e sindrome metabolica?" — l'AI cercherà
                automaticamente su PubMed e fonti autorevoli e citerà i risultati con [WEB: fonte].
              </div>
            </Card>
          </div>
        </>}
        {panel==="kb" && <>
          <PanelHeader title={T.kb_title}
            sub={kb.length+T.kb_sub_n}
            action={<Inp value={kbSearch} onChange={setKbSearch} placeholder={T.kb_search_ph} style={{width:220}}/>}/>
          <div style={{flex:1,overflowY:"auto",padding:"16px 28px",display:"flex",flexDirection:"column",gap:10}}>
            {kb.filter(e=>{const q=kbSearch.toLowerCase();return !q||e.title.toLowerCase().includes(q)||e.content.toLowerCase().includes(q)||(e.tags||[]).some(t=>t.toLowerCase().includes(q));})
              .map(e=><Card key={e.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#a8c8a0",fontWeight:500}}>{e.title}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <DTag id={e.discipline}/>
                    <Btn onClick={()=>delKB(e.id)} variant="danger" style={{padding:"3px 10px",fontSize:10}}>✕</Btn>
                  </div>
                </div>
                <p style={{fontSize:11,color:"#5a7a5a",lineHeight:1.6,marginBottom:8}}>{e.content.slice(0,200)}...</p>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {(e.tags||[]).length>0 && <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {(e.tags||[]).map(t=><span key={t} style={{fontSize:10,color:"var(--nm-accent-dim,#4a8a4a)",background:"var(--nm-nav-active,#1a3a1a)",padding:"2px 8px",borderRadius:6}}>#{t}</span>)}
                  </div>}
                  {(e.rimedi||[]).length>0 && <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {(e.rimedi||[]).map(t=><span key={t} style={{fontSize:10,color:"#4aaa4a",background:"#0d200d",border:"1px solid #2a5a2a",padding:"2px 8px",borderRadius:6}}>🌿 {t}</span>)}
                  </div>}
                  {(e.sintomi||[]).length>0 && <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {(e.sintomi||[]).map(t=><span key={t} style={{fontSize:10,color:"#5a9aaa",background:"#0a1a22",border:"1px solid #1a4a5a",padding:"2px 8px",borderRadius:6}}>◉ {t}</span>)}
                  </div>}
                  {(e.controindicazioni||[]).length>0 && <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {(e.controindicazioni||[]).map(t=><span key={t} style={{fontSize:10,color:"#cc5555",background:"#200a0a",border:"1px solid #5a1a1a",padding:"2px 8px",borderRadius:6,fontWeight:500}}>⚠ {t}</span>)}
                  </div>}
                </div>
                {e.created_by && <div style={{fontSize:9,color:"#2a4a2a",marginTop:6}}>Aggiunto da {e.created_by} · {fmtDate(e.created_at)}</div>}
              </Card>)}
            {kb.length===0 && <div style={{color:"#3a5a3a",fontSize:12,textAlign:"center",padding:40}}>Nessuna fonte. Vai su "Aggiungi Fonte" per iniziare.</div>}
          </div>
        </>}

        {/* ── KB ADD ── */}
        {panel==="kb_add" && <>
          <PanelHeader title="Aggiungi Fonte alla Banca Dati" sub="Incolla il testo → Analizza → verifica → salva"/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",flexDirection:"column",gap:12}}>
            <Lbl>Contenuto (incolla prima il testo — poi usa Analizza)</Lbl>
            <textarea value={kbForm.content} onChange={e=>setKbForm(f=>({...f,content:e.target.value}))}
              onPaste={e=>{
                const text = e.clipboardData.getData('text');
                if(text.length <= 3500) return;
                e.preventDefault();
                const CHUNK=3500, OVERLAP=Math.round(3500*0.15);
                const name = kbForm.title||"Testo incollato";
                const chunks=[]; let idx=0, part=1;
                while(idx<text.length){
                  let end=Math.min(idx+CHUNK,text.length);
                  if(end<text.length){
                    const nl=text.lastIndexOf("\n",end);
                    if(nl>idx+CHUNK/2) end=nl;
                    else{const sp=text.lastIndexOf(" ",end);if(sp>idx+CHUNK/2) end=sp;}
                  }
                  chunks.push({title:`${name} — parte ${part}`,content:text.slice(idx,end).trim()});
                  idx=end<text.length?end-OVERLAP:text.length; part++;
                }
                setPdfChunks(chunks); setPdfChunkIdx(0);
                setKbForm(fm=>({...fm,title:chunks[0].title,content:chunks[0].content}));
                setKbAnalyzeMsg(`✓ Testo lungo: ${chunks.length} blocchi da ~${CHUNK} car. Usa "🔍 Analizza" poi salva blocco per blocco.`);
              }}
              placeholder="Incolla il testo della fonte: sintomi, rimedi, indicazioni, meccanismi d'azione..."
              style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"12px 14px",
                color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none",
                minHeight:180,resize:"vertical"}}/>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <Btn onClick={analyzeAndCategorize} disabled={kbAnalyzing||!kbForm.content.trim()} variant="warn" style={{padding:"8px 16px"}}>
                {kbAnalyzing?"⏳ Analisi...":"🔍 Analizza e Categorizza"}
              </Btn>
              <Btn variant="secondary" style={{padding:"8px 14px"}} onClick={()=>fileKbRef.current?.click()}>📄 Carica file (.txt / .pdf)</Btn>
              <input ref={fileKbRef} type="file" accept=".txt,.md,.pdf" multiple style={{display:"none"}}
                onChange={async e=>{
                  const files = Array.from(e.target.files);
                  if(!files.length) return;
                  setKbFileQueue(files);
                  setKbFileIdx(0);
                  await processKbFile(files[0]);
                }}/>
              {kbFileQueue.length>1 && <span style={{fontSize:10,color:"#5a8a5a"}}>
                {kbFileIdx+1}/{kbFileQueue.length} file
              </span>}
            </div>
            {kbAnalyzeMsg && <div style={{fontSize:11,color:kbAnalyzeMsg.startsWith("✓")?"#6aaa6a":"#aa8a4a",
              padding:"8px 12px",background:kbAnalyzeMsg.startsWith("✓")?"#0f2a0f":"#2a1f0a",
              borderRadius:8,border:`1px solid ${kbAnalyzeMsg.startsWith("✓")?"#1a4a1a":"#4a3a0a"}`,
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>{kbAnalyzeMsg}</span>
              {pdfChunks.length>1 && pdfChunkIdx<pdfChunks.length-1 &&
                <button onClick={nextPdfChunk}
                  style={{background:"#1a4a1a",border:"1px solid #2a6a2a",color:"#6aaa6a",
                    borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:10,fontFamily:"'DM Mono',monospace"}}>
                  Blocco successivo ({pdfChunkIdx+2}/{pdfChunks.length}) →
                </button>}
              {kbFileQueue.length>1 && kbFileIdx<kbFileQueue.length-1 &&
                <button onClick={nextKbFile}
                  style={{background:"#1a4a1a",border:"1px solid #2a6a2a",color:"#6aaa6a",
                    borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:10,fontFamily:"'DM Mono',monospace"}}>
                  File successivo ({kbFileIdx+2}/{kbFileQueue.length}) →
                </button>}
            </div>}
            <Lbl>Titolo / Riferimento Bibliografico</Lbl>
            <Inp value={kbForm.title} onChange={v=>setKbForm(f=>({...f,title:v}))} placeholder="Es: Weiss R.F. — Fitoterapia, cap.4 — Epatoprotettori"/>
            <Lbl>Disciplina (compilata automaticamente se usi Analizza)</Lbl>
            <DisciplineSelect value={kbForm.discipline} onChange={v=>setKbForm(f=>({...f,discipline:v}))}/>
            <Lbl>Tag (separati da virgola — compilati automaticamente se usi Analizza)</Lbl>
            <Inp value={kbForm.tags} onChange={v=>setKbForm(f=>({...f,tags:v}))} placeholder="fegato, digestione, bile, colesterolo"/>
            <div style={{display:"flex",gap:12,alignItems:"center",marginTop:4}}>
              <Btn onClick={addKB} disabled={!kbForm.title||!kbForm.content}>Aggiungi alla Banca Dati</Btn>
            </div>
            <div style={{fontSize:10,color:"#3a5a3a",lineHeight:1.7}}>
              Flusso consigliato: incolla testo → Analizza e Categorizza → verifica/correggi → aggiungi titolo → Aggiungi.
              Per PDF: copia e incolla il testo · Max ~4000 caratteri per fonte.
            </div>
          </div>
        </>}

        {/* ── PATIENTS ── */}
        {panel==="patients" && <>
          <PanelHeader title="Gestione Pazienti" sub="Pseudonimizzati — codice fiscale oscurato nel database"/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",gap:20}}>
            {/* New patient form */}
            <div style={{width:320,flexShrink:0}}>
              <Card>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0",marginBottom:14}}>Nuovo Paziente</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <Lbl>Codice Fiscale (facoltativo — sarà oscurato)</Lbl>
                  <Inp value={ptForm.cf} onChange={v=>setPtForm(f=>({...f,cf:v}))} placeholder="RSSMRA80A01H501Z"/>
                  <Lbl>Note Anamnestiche</Lbl>
                  <textarea value={ptForm.notes} onChange={e=>setPtForm(f=>({...f,notes:e.target.value}))}
                    placeholder="Età, sesso, condizioni di base, allergie note..."
                    style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
                      color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none",minHeight:100,resize:"vertical"}}/>
                  <Btn onClick={addPatient}>Crea Paziente</Btn>
                  {ptMsg && <div style={{color:"#6aaa6a",fontSize:11}}>{ptMsg}</div>}
                  <div style={{fontSize:10,color:"#3a5a3a",lineHeight:1.6,marginTop:4}}>
                    Il codice paziente (NAT-ANNO-XXXX) viene generato automaticamente. Il CF è oscurato con chiave legata alla tua sessione.
                  </div>
                </div>
              </Card>
            </div>
            {/* Patient list */}
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
              {patients.map(p=><Card key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#8aaa8a",fontWeight:500,marginBottom:4}}>{p.patient_code}</div>
                  {p.cf_obfuscated && <div style={{fontSize:10,color:"#4a6a4a",marginBottom:4}}>CF: ████████████████</div>}
                  {p.notes && <div style={{fontSize:11,color:"#5a7a5a",lineHeight:1.5}}>{p.notes.substring(0,120)}</div>}
                  <div style={{fontSize:9,color:"#2a4a2a",marginTop:4}}>{p.created_by} · {fmtDate(p.created_at)}</div>
                </div>
                <Btn variant="secondary" style={{padding:"5px 10px",fontSize:10,flexShrink:0,marginLeft:10}}
                  onClick={()=>{setActivePatient(p.patient_code);setPanel("chat");}}>Usa in chat</Btn>
              </Card>)}
              {patients.length===0 && <div style={{color:"#3a5a3a",fontSize:12,textAlign:"center",padding:40}}>Nessun paziente registrato.</div>}
            </div>
          </div>
        </>}

        {/* ── REFERTI ── */}
        {panel==="referti" && <>
          <PanelHeader title="Genera Referto" sub="Seleziona la sessione, configura e scarica in PDF o Word"/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",gap:20}}>
            {/* Config column */}
            <div style={{width:320,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
              <Card>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0",marginBottom:12}}>Configurazione</div>
                <Lbl>Sessione</Lbl>
                <select value={refSession} onChange={e=>setRefSession(e.target.value)}
                  style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
                    color:"#b8d0b0",fontSize:11,fontFamily:"'DM Mono',monospace",outline:"none",width:"100%"}}>
                  <option value="current">{T.current_session}</option>
                  {consultations.map(c=><option key={c.id} value={c.id}>{c.session_title}</option>)}
                </select>
                <Lbl style={{marginTop:10}}>Logo Studio</Lbl>
                <select value={refLogo} onChange={e=>setRefLogo(e.target.value)}
                  style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
                    color:"#b8d0b0",fontSize:11,fontFamily:"'DM Mono',monospace",outline:"none",width:"100%"}}>
                  <option value="">Nessun logo</option>
                  {logos.map(l=><option key={l.id} value={l.id}>{l.name}{l.is_default?" (default)":""}</option>)}
                </select>
                <Lbl style={{marginTop:10}}>Profilo Studio</Lbl>
                <select value={refProfile} onChange={e=>setRefProfile(e.target.value)}
                  style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
                    color:"#b8d0b0",fontSize:11,fontFamily:"'DM Mono',monospace",outline:"none",width:"100%"}}>
                  <option value="">Nessun profilo</option>
                  {profiles.map(p=><option key={p.id} value={p.id}>{p.name}{p.is_default?" (default)":""}</option>)}
                </select>
                <Lbl style={{marginTop:10}}>Note e Ultimi Suggerimenti</Lbl>
                <textarea value={refNotes} onChange={e=>setRefNotes(e.target.value)}
                  placeholder="Raccomandazioni finali, rimedi scelti, stile di vita..."
                  style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
                    color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none",
                    minHeight:80,resize:"vertical",width:"100%"}}/>
                <Lbl style={{marginTop:10}}>Follow-up Consigliato</Lbl>
                <Inp value={refFollowup} onChange={setRefFollowup} placeholder="Es: Rivalutazione tra 4 settimane"/>
                <Lbl style={{marginTop:10}}>Firma / Qualifica</Lbl>
                <Inp value={refSign} onChange={setRefSign} placeholder="Es: Dott. Mario Rossi — Biologo Nutrizionista Naturopata"/>
              </Card>
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={genPDF} style={{flex:1}}>📄 PDF</Btn>
                <Btn onClick={genWord} variant="blue" style={{flex:1}}>📝 Word</Btn>
              </div>
              {logos.length===0 && <div style={{fontSize:10,color:"#6a4a2a",padding:"8px 12px",background:"#2a1a0a",borderRadius:8,border:"1px solid #4a3a1a"}}>
                💡 Nessun logo caricato. Vai su Impostazioni per aggiungere il logo del tuo studio.
              </div>}
            </div>
            {/* Preview */}
            <div style={{flex:1}}>
              <Card>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0",marginBottom:12}}>Anteprima Contenuto</div>
                <div style={{fontSize:11,color:"#5a7a5a",lineHeight:1.7}}>
                  <div style={{marginBottom:8}}>
                    <strong style={{color:"#7a9a7a"}}>Sessione:</strong> {refSession==="current"?"Corrente ("+messages.length+" messaggi)":consultations.find(c=>c.id===refSession)?.session_title}
                  </div>
                  <div style={{marginBottom:8}}>
                    <strong style={{color:"#7a9a7a"}}>Paziente:</strong> {getRefPatientCode()||"Non specificato"}
                  </div>
                  <div style={{marginBottom:8}}>
                    <strong style={{color:"#7a9a7a"}}>Struttura referto:</strong>
                    <ul style={{marginTop:4,paddingLeft:16,lineHeight:2}}>
                      <li>Intestazione studio + logo</li>
                      <li>Dati sessione (data, codice paziente, numero)</li>
                      <li>Sintomi e quadro clinico riferito</li>
                      <li>Analisi e ipotesi naturopatiche</li>
                      {refNotes && <li>Note e ultimi suggerimenti ✓</li>}
                      {refFollowup && <li>Follow-up consigliato ✓</li>}
                      {refSign && <li>Firma del professionista ✓</li>}
                      <li>Disclaimer in calce</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>}

        {/* ── DOCUMENTS ── */}
        {panel==="documents" && !docEdit && <>
          <PanelHeader title="Documenti" sub="Disclaimer · Privacy · Whitepaper · Manuale — modificabili e stampabili on demand"
            action={<Btn onClick={()=>setShowNewDoc(v=>!v)} variant="secondary">+ Nuovo Documento</Btn>}/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",flexDirection:"column",gap:16}}>
            {showNewDoc && <Card style={{border:"1px solid #2a4a2a"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0",marginBottom:12}}>Nuovo Documento</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Lbl>Tipo</Lbl>
                <select value={docNewForm.doc_type} onChange={e=>setDocNewForm(f=>({...f,doc_type:e.target.value}))}
                  style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none"}}>
                  {DOC_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <Lbl>Titolo</Lbl>
                <Inp value={docNewForm.title} onChange={v=>setDocNewForm(f=>({...f,title:v}))} placeholder="Es: Disclaimer - Studio Roma - v2.0"/>
                <Lbl>Versione</Lbl>
                <Inp value={docNewForm.version} onChange={v=>setDocNewForm(f=>({...f,version:v}))} placeholder="1.0" style={{width:100}}/>
                <Lbl>Contenuto</Lbl>
                <textarea value={docNewForm.content} onChange={e=>setDocNewForm(f=>({...f,content:e.target.value}))}
                  style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
                    color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none",minHeight:160,resize:"vertical"}}/>
                <div style={{display:"flex",gap:8}}>
                  <Btn onClick={addDoc} disabled={!docNewForm.title||!docNewForm.content}>Salva</Btn>
                  <Btn variant="secondary" onClick={()=>setShowNewDoc(false)}>Annulla</Btn>
                </div>
              </div>
            </Card>}
            {DOC_TYPES.map(type=>{
              const typeDocs = documents.filter(d=>d.doc_type===type.id);
              return <div key={type.id}>
                <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase",color:"#3a5a3a",marginBottom:8}}>{type.label}</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {typeDocs.map(doc=><Card key={doc.id}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                      <div>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0"}}>{doc.title}</div>
                        <div style={{fontSize:9,color:"#3a5a3a",marginTop:2}}>v{doc.version} · aggiornato {fmtDate(doc.updated_at)}</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <Btn variant="secondary" style={{padding:"5px 10px",fontSize:10}} onClick={()=>setDocEdit({...doc})}>✏ Modifica</Btn>
                        <Btn variant="secondary" style={{padding:"5px 10px",fontSize:10}} onClick={()=>printDoc(doc.content,doc.title)}>🖨 Stampa</Btn>
                        <Btn variant="danger" style={{padding:"5px 10px",fontSize:10}} onClick={()=>delDoc(doc.id)}>✕</Btn>
                      </div>
                    </div>
                    <p style={{fontSize:11,color:"#4a6a4a",marginTop:8,lineHeight:1.5}}>{doc.content.substring(0,200)}...</p>
                  </Card>)}
                  {typeDocs.length===0 && <div style={{fontSize:11,color:"#2a4a2a",padding:"8px 4px"}}>Nessun documento di questo tipo.</div>}
                </div>
              </div>;
            })}
          </div>
        </>}

        {/* ── DOC EDIT ── */}
        {panel==="documents" && docEdit && <>
          <PanelHeader title={`Modifica: ${docEdit.title}`}
            action={<div style={{display:"flex",gap:8}}>
              <Btn onClick={saveDoc}>Salva</Btn>
              <Btn variant="secondary" onClick={()=>setDocEdit(null)}>Annulla</Btn>
            </div>}/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:200}}>
                <Lbl>Titolo</Lbl>
                <Inp value={docEdit.title} onChange={v=>setDocEdit(d=>({...d,title:v}))} placeholder="Titolo documento"/>
              </div>
              <div style={{width:100}}>
                <Lbl>Versione</Lbl>
                <Inp value={docEdit.version} onChange={v=>setDocEdit(d=>({...d,version:v}))} placeholder="1.0"/>
              </div>
            </div>
            <Lbl>Contenuto</Lbl>
            <textarea value={docEdit.content} onChange={e=>setDocEdit(d=>({...d,content:e.target.value}))}
              style={{flex:1,background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"14px",
                color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none",
                minHeight:400,resize:"vertical",lineHeight:1.7}}/>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={saveDoc}>Salva Modifiche</Btn>
              <Btn variant="secondary" onClick={()=>printDoc(docEdit.content,docEdit.title)}>🖨 Stampa Anteprima</Btn>
              <Btn variant="secondary" onClick={()=>setDocEdit(null)}>Annulla</Btn>
            </div>
          </div>
        </>}

        {/* ── ADMIN ── */}
        {panel==="admin" && currentUser?.role==="admin" && <>
          <PanelHeader title="Pannello Amministratore" sub="Gestione utenti · Log accessi · Conformità GDPR"/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",gap:20}}>
            {/* Left: users */}
            <div style={{width:340,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
              <Card>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0",marginBottom:12}}>Nuovo Utente</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <Lbl>Nome Completo</Lbl>
                  <Inp value={newUserForm.full_name} onChange={v=>setNewUserForm(f=>({...f,full_name:v}))} placeholder="Mario Rossi"/>
                  <Lbl>Username</Lbl>
                  <Inp value={newUserForm.username} onChange={v=>setNewUserForm(f=>({...f,username:v}))} placeholder="mario.rossi"/>
                  <Lbl>Password (min. 8 caratteri)</Lbl>
                  <Inp value={newUserForm.password} onChange={v=>setNewUserForm(f=>({...f,password:v}))} placeholder="••••••••" type="password"/>
                  <Lbl>Ruolo</Lbl>
                  <select value={newUserForm.role} onChange={e=>setNewUserForm(f=>({...f,role:e.target.value}))}
                    style={{background:"#0f1f0f",border:"1px solid #1e3a1e",borderRadius:8,padding:"10px 14px",
                      color:"#b8d0b0",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none"}}>
                    <option value="staff">Staff</option>
                    <option value="admin">Amministratore</option>
                  </select>
                  {newUserErr && <div style={{color:"#a84a4a",fontSize:11}}>{newUserErr}</div>}
                  {newUserMsg && <div style={{color:"#6aaa6a",fontSize:11}}>{newUserMsg}</div>}
                  <Btn onClick={addUser}>Crea Utente</Btn>
                </div>
              </Card>
              <Card>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0",marginBottom:12}}>Utenti Registrati</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {users.map(u=><div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"#0a1a0a",borderRadius:8,border:"1px solid #1a2a1a"}}>
                    <div>
                      <div style={{fontSize:12,color:u.active?"#8ac88a":"#5a5a5a"}}>{u.username}</div>
                      <div style={{fontSize:9,color:"#3a5a3a"}}>{u.role} · {u.last_login?`ultimo accesso: ${fmtDT(u.last_login)}`:"mai acceduto"}</div>
                    </div>
                    {u.id!==currentUser?.id && <button onClick={()=>toggleUser(u)}
                      style={{fontSize:10,color:u.active?"#8a4a4a":"#4a8a4a",background:"transparent",
                        border:`1px solid ${u.active?"#4a1a1a":"#1a4a1a"}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
                      {u.active?"Disattiva":"Attiva"}
                    </button>}
                  </div>)}
                </div>
              </Card>
            </div>
            {/* Right: access logs */}
            <div style={{flex:1}}>
              <Card style={{height:"100%",overflow:"hidden",display:"flex",flexDirection:"column"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#a8c8a0",marginBottom:12}}>
                  Log Accessi ({accessLogs.length})
                </div>
                <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                  {accessLogs.map(l=><div key={l.id} style={{display:"flex",gap:12,padding:"6px 10px",
                    background:"#0a1a0a",borderRadius:6,border:"1px solid #1a2a1a",fontSize:10}}>
                    <span style={{color:"#3a5a3a",flexShrink:0,minWidth:130}}>{fmtDT(l.created_at)}</span>
                    <span style={{color:"#6aaa6a",flexShrink:0,minWidth:80}}>{l.username}</span>
                    <span style={{color:"#7a9a7a",flexShrink:0,minWidth:120}}>{l.action}</span>
                    <span style={{color:"#4a6a4a"}}>{l.details}</span>
                  </div>)}
                  {accessLogs.length===0 && <div style={{color:"#3a5a3a",fontSize:11,textAlign:"center",padding:20}}>Nessun log disponibile.</div>}
                </div>
              </Card>
            </div>
          </div>
        </>}

        {/* ── SETTINGS ── */}
        {panel==="settings" && <>
          <PanelHeader title={T.settings_title} sub={T.settings_sub}/>
          <div style={{flex:1,overflowY:"auto",padding:"20px 28px",display:"flex",gap:20,flexWrap:"wrap"}}>
            {/* Logos */}
            <div style={{flex:1,minWidth:280}}>
              <Card>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#a8c8a0",marginBottom:14}}>Loghi Studio</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
                  <Lbl>Nome Logo</Lbl>
                  <Inp value={logoName} onChange={setLogoName} placeholder="Es: Studio Roma"/>
                  <Btn onClick={()=>fileLogoRef.current?.click()} variant="secondary">📁 Carica Logo (JPEG/PNG)</Btn>
                  <input ref={fileLogoRef} type="file" accept="image/jpeg,image/png,image/jpg"
                    style={{display:"none"}} onChange={uploadLogo}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {logos.map(l=><div key={l.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px",background:"#0a1a0a",borderRadius:8,border:"1px solid #1a2a1a"}}>
                    <img src={l.logo_data} alt={l.name} style={{height:36,objectFit:"contain",background:"#fff",borderRadius:4,padding:2}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:"#8ac88a"}}>{l.name}</div>
                      {l.is_default && <div style={{fontSize:9,color:"#5a9a5a"}}>Default</div>}
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      {!l.is_default && <Btn variant="secondary" style={{padding:"3px 8px",fontSize:10}} onClick={()=>setDefaultLogo(l.id)}>★ Default</Btn>}
                      <Btn variant="danger" style={{padding:"3px 8px",fontSize:10}} onClick={()=>delLogo(l.id)}>✕</Btn>
                    </div>
                  </div>)}
                  {logos.length===0 && <div style={{fontSize:11,color:"#3a5a3a",padding:"8px 4px"}}>Nessun logo caricato.</div>}
                </div>
              </Card>
            </div>
            {/* Practice profiles */}
            <div style={{flex:1,minWidth:280}}>
              <Card>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#a8c8a0",marginBottom:14}}>Profili Studio</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
                  {[
                    {k:"name",label:"Nome Studio *",placeholder:"Studio Naturopatico..."},
                    {k:"address",label:"Indirizzo",placeholder:"Via Roma 1, Milano"},
                    {k:"phone",label:"Telefono",placeholder:"+39 02 1234567"},
                    {k:"email",label:"Email",placeholder:"studio@email.it"},
                    {k:"piva",label:"P.IVA",placeholder:"12345678901"},
                    {k:"albo_number",label:"Nr. Albo / Registro",placeholder:"123456"},
                  ].map(f=><div key={f.k}>
                    <Lbl>{f.label}</Lbl>
                    <Inp value={profileForm[f.k]} onChange={v=>setProfileForm(p=>({...p,[f.k]:v}))} placeholder={f.placeholder}/>
                  </div>)}
                  <Btn onClick={saveProfile} disabled={!profileForm.name}>Aggiungi Profilo</Btn>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {profiles.map(p=><div key={p.id} style={{padding:"10px",background:"#0a1a0a",borderRadius:8,border:"1px solid #1a2a1a"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <div style={{fontSize:13,color:"#8ac88a",fontFamily:"'Cormorant Garamond',serif"}}>{p.name}</div>
                      <Btn variant="danger" style={{padding:"2px 8px",fontSize:10}} onClick={()=>delProfile(p.id)}>✕</Btn>
                    </div>
                    <div style={{fontSize:10,color:"#4a6a4a",lineHeight:1.6}}>
                      {[p.address,p.phone,p.email,p.piva&&"P.IVA: "+p.piva,p.albo_number&&"Albo: "+p.albo_number].filter(Boolean).join(" · ")}
                    </div>
                    {p.is_default && <div style={{fontSize:9,color:"#5a9a5a",marginTop:2}}>★ Default</div>}
                  </div>)}
                  {profiles.length===0 && <div style={{fontSize:11,color:"#3a5a3a",padding:"4px"}}>Nessun profilo configurato.</div>}
                </div>
              </Card>
              {settingsMsg && <div style={{color:"#6aaa6a",fontSize:11,marginTop:8,padding:"8px 12px",background:"#0f2a0f",borderRadius:8,border:"1px solid #1a4a1a"}}>{settingsMsg}</div>}
            </div>
          </div>
        </>}

        {/* ── ADMIN ACCESS DENIED ── */}
        {panel==="admin" && currentUser?.role!=="admin" && <>
          <PanelHeader title="Accesso Negato"/>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#5a3a3a",fontSize:13}}>Solo gli amministratori possono accedere a questa sezione.</div>
        </>}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Mono:wght@300;400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0d160d;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#0d160d;}
        ::-webkit-scrollbar-thumb{background:#2a4a2a;border-radius:2px;}
        select option{background:#0f1f0f;}
        @keyframes blink{0%,100%{opacity:0.2}50%{opacity:1}}
      `}</style>
    </div>
  );
}