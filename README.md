# Bidrag-Dokumentasjon

## ⚠️ DETTE REPOET ER FLYTTET

> **Dette repoet er flyttet til [navikt/bidrag-backend](https://github.com/navikt/bidrag-backend).**
> Bruk det nye repoet for videre utvikling — dette repoet oppdateres ikke lenger.

Bidrag-dokumentasjon er et verktøy for å presentere, utforske og lese teknisk dokumentasjon, systemskisser og flytdiagrammer for NAVs bidragsløsning. 

Applikasjonen gjør det mulig å:
- **Bla i dokumentasjonen:** Lett tilgjengelig oversikt over markdown-dokumenter og applikasjonsbeskrivelser fra et sidemenytre.
- **Vise interaktive Mermaid-diagrammer:** Systemkart og flytdiagrammer vises som interaktive tegninger maskert med pan- og zoom-funksjonalitet for detaljert visning.
- **Klikke på komponenter i diagrammer:** Gir direkte tilgang til utfyllende detaljer (f.eks. applikasjonsbeskrivelser eller kildekodelinker) ved å klikke direkte på noder i diagrammene.

🌐 **Du kan se den publiserte versjonen her:**  
[https://navikt.github.io/bidrag-dokumentasjon/](https://navikt.github.io/bidrag-dokumentasjon/)

## Struktur
- `frontend/bidrag-dokumentasjon` – Selve React/TypeScript-applikasjonen (bygget med Vite) som visualiserer innholdet.
- `dokumentasjon/` – Markdown-dokumenter, Mermaid-diagrammer og innholdsfiler for bidragsområdet som appen indekserer og presenterer. 

