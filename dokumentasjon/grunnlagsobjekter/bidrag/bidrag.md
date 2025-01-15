### BELØPSHISTORIKK_FORSKUDD

> **Referer til**
>
> * gjelder: PERSON_BIDRAGSPLIKTIG
> * gjelderBarn: PERSON_SØKNADSBARN
>
> Beløpshistorikk for søknadsbarnet i samme sak (BP og søknadsbarn)

### BELØPSHISTORIKK_BIDRAG

> **Referrer til**
>
> - PERSON_BIDRAGSMOTTAKER
>- PERSON_BIDRAGSPLIKTIG
>
> Beløpshistorikk for søknadsbarnet i samme sak (BP og søknadsbarn)

| Felt            | Type                                                 | Beskrivelse |
|-----------------|------------------------------------------------------|-------------|
| beløpshistorikk | Liste over beløp og periode (BeløpshistorikkPeriode) |             |

#### BeløpshistorikkPeriode

| Felt    | Type             | Beskrivelse |
|---------|------------------|-------------|
| periode | Årsmånedsperiode |             |
| beløp   | Bigdecimal       |             |

### DELBEREGNING_BEGRENSET_REVURDERING

> Begrenset revurdering
> Bidrag løper lavere enn forskuddsats
> Da lager NAV ny søknad for å øke bidrag opp til forksuddsats
>
> Hvis det slår ut til FF - Ikke begrens til forskuddsats
>
> Referer til
>
> - BELØPSHISTORIKK_FORSKUDD
> - SJABLON_FORSKUDDSATS
> - PERSON_SØKNADSBARN
> - PERSON_BIDRAGSPLIKTIG

| Felt            | Type       | Beskrivelse                                                                      |
|-----------------|------------|----------------------------------------------------------------------------------|
| løpendeForskudd | BigDecimal | Løpende forskuddsbeløp                                                           |
| nyttBeløp       | BigDecimal | Nytt beløp fra beregning                                                         |
| resultatBeløp   | BigDecimal | Resultat basert på sammenligning av nytt beløp med løpende beløp og forskuddsats |

### DELBEREGNING_ENDRING_UNDER_GRENSE

> Referer til grunnlag
>
> - BELØPSHISTORIKK_BIDRAG
> - SJABLON_TALL (Prosentgrense for endring av bidrag 0020)
> > Grensefaktor som en sjablonverdi (12, 15, 10)
>>   
>> SJABLON skal basere seg på vedtakstidspunkt (og opprinnelig vedtakstidspunkt ved klage)
>
> Bruk opprinneligvirkningstidspunkt for innhenting av Sjablonverdi ved klage
>
> ---
>
> F*orslag:*
>
> *Hvis det er mindre enn ett år siden sist det ble endret så kan det endres uten å sjekk 15%
> Ellers gjelder 15% regelen*

| Felt               | Type       | Beskrivelse |
|--------------------|------------|-------------|
| tidligereBeløp     | BigDecimal |             |
| endringUnderGrense | Boolean    |             |

### DELBEREGNING_HØYESTE_INNTEKT

> Referer til grunnlag
>
> ---
>
> For hver periode
>
> - Hente siste vedtak fra alle sakene til BP for hver periode i nåværende vedtak
> - Hent DELBEREGNING_SUM_INNTEKT i vedtaket for periode som overlapper
>
> Går videre til delberegning bidragsevne

| Felt           | Type       | Beskrivelse                                                                 |
|----------------|------------|-----------------------------------------------------------------------------|
| høyesteInntekt | BigDecimal | Høyeste inntekt i DELBEREGNING_SUM_INNTEKT grunnlaget som det refereres til |

### PRIVAT_AVTALE

> **Referrer til**
>
> - gjelder: PERSON_BIDRAGSPLIKTIG
> - gjelderBarn: PERSON_BARN (som privat avtalene gjelder for)

> V2 så skal det bare gjelde for søknadsbarnet. I neste versjon så kan det gjelde for hvilken som helst barn `<br>`
> Inneholder en liste over perioder og beløp for privat avtale

| Felt     | Type                           | Beskrivelse |
|----------|--------------------------------|-------------|
| perioder | Liste over PrivatAvtalePeriode |             |

#### PrivatAvtalePeriode

| Felt    | Type             |
|---------|------------------|
| periode | Årsmåndesperiode |
| beløp   |                  |

### DELBEREGNING_PRIVAT_AVTALE_INDEKSREGULERT

> **Referrer til**
>
> - PRIVAT_AVTALE
> - SJABLON_INDEKSREGULERING_PROSENT

Beregning av indeksregulert beløp ved privat avtale. Periodiserer basert på sjablonverdien

| Felt                | Type             |
|---------------------|------------------|
| periode             | Årsmåndesperiode |
| beløp               | BigDecimal       |
| beløpIndeksregulert | BigDecimal       |
