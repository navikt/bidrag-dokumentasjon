## BELØPSHISTORIKK_FORSKUDD

**Referrer til**
- DELBEREGNING_FORSKUDD
- gjelder: PERSON_BIDRAGSPLIKTIG
- gjelderBarn: PERSON_SØKNADSBARN
> Beløpshistorikk for søknadsbarnet i samme sak (BP og søknadsbarn)
> 
| Felt           | Type                                                 | Beskrivelse |
|----------------|------------------------------------------------------|-------------|
| beløpHistorikk | Liste over beløp og periode (BeløpshistorikkPeriode) |             |


### BeløpshistorikkPeriode

| Felt    | Type             | Beskrivelse |
|---------|------------------|-------------|
| periode | Årsmånedsperiode |             |
| beløp   | Bigdecimal       |             |


## BELØPSHISTORIKK_BIDRAG

**Referrer til**
- DELBEREGNING_BIDRAG
- PERSON_BIDRAGSMOTTAKER
- PERSON_BIDRAGSPLIKTIG

| Felt           | Type             | Beskrivelse                  |
|----------------|------------------|------------------------------|
| beløpHistorikk | Liste over beløp | Liste over perioder og beløp |

## DELBEREGNING_BEGRENSET_REVURDERING

**Regneresultat ved reberegning**
- Dersom beløpet er satt lik 0 fordi beløpet opp forhøyelse av forskuddssatsen
- Dersom beløpet er satt lik 0 fordi beløpet opp forhøyelse av bidragssatsen

**Hvis det er tilf IP er:**
- BELØP_HISTORISK_SJABLON
- SJABLON_SJABLONVERDI (0012, 0054)
- SJABLON_FRISKRUDD

| Felt      | Type                                                                                       | Beskrivelse            |
|-----------|--------------------------------------------------------------------------------------------|------------------------|
| nyttBeløp | Lapertid forhøyelsesbeløp                                                                  | Nytt beløp i beregning |
| nyttBeløp | Resultat basen på beregning av nytt beløp i forhold til opprinnelig beløp og forskuddssats |                        |

## DELBEREGNING_ENDRING_UNDER_GRENSE

**BeløpHistorikk**
- dersomHistorikk er satt lik 0 dersom beløpet er satt lik 0 pga endring i forskuddssats (12, 16, 18)
- dersomHistorikk er satt lik 0 dersom beløpet er satt lik 0 pga endring i bidragssats (12, 16, 18)

**Hvis det er tilf IP er:**
- SJABLON_FRISKRUDD
- Endring i forskuddssats

**Hvis det er tilf IP er:**
- SJABLON_FRISKRUDD
- Endring i bidragssats

| Felt               | Type       | Beskrivelse          |
|--------------------|------------|----------------------|
| endringOver        | BigDecimal | Endring i beløp      |
| endringUnderGrense | Boolean    | Endring under grense |

## DELBEREGNING_HØYESTE_INNTEKT

**Referrer til**
- DELBEREGNING_INNTEKT
- DELBEREGNING_SUM_INNTEKT

**Gjøres for den beregningsperiode BP er satt periode (hvis periode er ulikt vedtak periode som omfatter delberegning)**

| Felt           | Type       | Beskrivelse                                                                 |
|----------------|------------|-----------------------------------------------------------------------------|
| høyesteInntekt | BigDecimal | Høyeste inntekt i DELBEREGNING_SUM_INNTEKT grunnlaget som det refereres til |

## PRIVAT_AVTALE

> **Referrer til**
> - gjelder: PERSON_BIDRAGSPLIKTIG
> - gjelderBarn: PERSON_BARN (som privat avtalene gjelder for)

> V2 så skal det bare gjelde for søknadsbarnet. I neste versjon så kan det gjelde for hvilken som helst barn<br>
> Inneholder en liste over perioder og beløp for privat avtale

| Felt     | Type                           | Beskrivelse |
|----------|--------------------------------|-------------|
| perioder | Liste over PrivatAvtalePeriode |             |

#### PrivatAvtalePeriode

| Felt    | Type             |
|---------|------------------|
| periode | Årsmåndesperiode |
| beløp   |                  |


## DELBEREGNING_PRIVAT_AVTALE_INDEKSREGULERT
