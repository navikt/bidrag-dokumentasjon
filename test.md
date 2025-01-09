Here is a simple flow chart:

```mermaid
flowchart LR
    classDef className stroke:green,stroke-width:1px;

    subgraph steg1["Steg 1"]
        direction RL
        periode1["Periode 1"]
        periode2["Periode 2"]
    end
    steg1 --> DelberegningBegrensetRevurdering
    subgraph "steg 2 - Beregning"
    DelberegningBegrensetRevurdering
    end
    subgraph "steg 3 - Resultat"
     DelberegningBegrensetRevurdering --> Resultat{nytt beløp er}
    Resultat -->|Over løpende forskudd| D[Juster beløp til forskuddsats]
    Resultat -->|Mellom forskudd og løpende bidrag| E[Bruk beløp fra steg 1]
    Resultat -->|Lavere enn forskuddsats| F[fa:fa-ban Ikke lov til å fatte vedtak]
    end
    BeløpshistorikkForskudd -..-> DelberegningBegrensetRevurdering
    SjablonGrenseverdi -..-> DelberegningBegrensetRevurdering
    A@{ shape: text, label: "Opprinnelig virkningstidspunkt" } -..-> DelberegningBegrensetRevurdering

    class A className;
```
