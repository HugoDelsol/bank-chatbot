# Bank Support Chatbot

> Projet d'exercice / démo technique — le secteur bancaire est un scénario fictif utilisé pour illustrer les mécanismes (classification, escalade, audit qualité), pas un produit destiné à la production.

Chatbot de support client pour le secteur bancaire, avec gestion des conversations, classification par mots-clés et dashboard d'audit qualité.

## Stack technique

- **Next.js 15** (App Router) — front et API routes intégrées
- **MySQL 8** (Docker) — stockage relationnel
- **phpMyAdmin** (Docker) — administration de la base
- **CSS Modules** — styles isolés par page

## Fonctionnalités

### Chat
Interface de discussion en temps réel. Chaque message utilisateur est classifié automatiquement pour déterminer l'intention (catégorie) et générer une réponse pertinente à partir de la base de connaissances.

### Moteur de classification (`lib/classify.js`)
- Matching par mots-clés avec détection de limites de mots (regex `\b`) pour éviter les faux positifs
- Score de confiance par catégorie
- Escalade automatique vers un humain dans trois cas :
  - **Aucune correspondance** (`no_match`)
  - **Ambiguïté** entre plusieurs catégories à score égal (`ambiguous`)
  - **Sujet sensible** marqué explicitement (`sensitive_topic`) — ex : opposition carte bancaire

### Dashboard d'audit
- Liste des conversations, triées par priorité (escaladées en premier) et date
- Statuts visuels par couleur (active / escalated / resolved)
- Vue détaillée par conversation : historique complet des messages, catégorie détectée et score de confiance pour chaque échange

## Modèle de données

```
categories (id, name, force_escalation)
category_keywords (id, category_id, keyword)
articles (id, category_id, title, content)
conversations (id, status, escalation_reason, started_at)
messages (id, conversation_id, sender, content, matched_category_id, match_score)
```

Relations 1-N : une catégorie a plusieurs mots-clés, une conversation contient plusieurs messages.

## Lancer le projet

```bash
docker compose up -d      # MySQL + phpMyAdmin
npm install
npm run dev
```

Accès :
- Chat : `http://localhost:3000/chat`
- Dashboard : `http://localhost:3000/dashboard`
- phpMyAdmin : `http://localhost:8080`
