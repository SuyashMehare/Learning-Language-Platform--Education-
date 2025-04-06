const CategoryEnum = [
  // Spanish Grammar
  "articles_la_el",       // Definite/indefinite articles
  "ser_vs_estar",         // "To be" verbs
  "preterite_tense",      // Past tense (simple)
  "imperfect_tense",      // Past tense (ongoing)
  "subjunctive_mood",     // Subjunctive
  "por_vs_para",          // "Por" vs "Para"
  "reflexive_verbs",      // e.g., "lavarse"
  "gender_nouns",         // Masculine/feminine nouns
  "direct_object_pronouns", // "lo", "la", "los", "las"
  "indirect_object_pronouns", // "le", "les"
  "commands",             // Formal/informal commands

  // English Grammar
  "articles_a_the",       // Articles
  "present_perfect",      // "Have eaten"
  "phrasal_verbs",        // "Turn up", "Look into"
  "gerunds_infinitives",  // "Swimming" vs "to swim"
  "modal_verbs",          // "Can", "should", "must"
  "conditionals",         // "If I were..."
  "passive_voice",        // "The book was written"
  "reported_speech",      // "He said that..."
  "relative_clauses",     // "The man who..."
  "prepositions"          // "In", "on", "at"
];

const LabelEnum = [
  "travel",           // Survival phrases, directions
  "business",         // Formal communication
  "academic",         // Essay writing, formal vocab
  "conversational",   // Everyday speaking
  "slang",            // Informal/colloquial terms
  "exam_prep",        // e.g., DELE, TOEFL
  "kids",             // Child-friendly content
  "literature"        // Books/poetry analysis
];

const VocabularyTags = [
  "ordering_food",       // Menus, allergies, reservations ("I'd like to order...")
  "travel_transport",    // Airports, tickets, directions ("Where is Gate A?")
  "business_meetings",   // Presentations, negotiations ("Let's discuss the proposal")
  "shopping",           // Prices, sizes, returns ("Do you have this in blue?")
  "emergencies",         // Police, hospitals, accidents ("I need help!")
  "socializing",         // Greetings, small talk, invitations ("Nice to meet you!")
  "health_pharmacy",     // Doctor visits, symptoms ("I have a headache")
  "directions",          // Asking/giving directions ("Turn left at the bank")
  "hotel_accommodation", // Check-in, room service ("I have a reservation")
  "technology",          // Tech support, Wi-Fi ("The password isn't working")
];

const DifficultiesTags = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
export {
    CategoryEnum as CATEGORIES,
    LabelEnum as LABELS ,
    VocabularyTags as  VOCABULARYTAGS,
    DifficultiesTags as DIFFICULTIES,
  };