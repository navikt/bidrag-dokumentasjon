## DELBEREGNING_BARNETILLEGG_SKATTESATS

> Tar utgangspunkt i summert inntekt for siste periode og beregner en skattesats, som brukes for alle barnetillegg. Baserer seg på
> bidragsevneberegningen. Vil bare inneholde en periode, som egentlig ikke har noen betydning.
>
>Utføres kun hvis det finnes inntekter av typen Inntektsrapportering.BARNETILLEGG.
>
>Beregnes separat for bidragspliktig og bidragsmottaker.
>
>Evt. kan denne delberegningen også brukes som en delberegning under bidragsevne-beregningen.
>
>Refererer til
>
>PERSON_BIDRAGSPLIKTIG eller PERSON_BIDRAGSMOTTAKER
> DELBEREGNING_SUM_INNTEKT (alle valgte inntekter for siste periode)
> SJABLON_SJABLONTALL (0017, 0023, 0025, 0027, 0040)
>
>Beregnes separat for bidragspliktig og bidragsmottaker:
>
>**Evt. kan denne delberegningen også brukes som en delberegning under bidragsvevn-beregningen.**
>
> **Referrer til**
> - PERSON_BIDRAGSPLIKTIG eller PERSON_BIDRAGSMOTTAKER
> - DELBEREGNING_SUM_INNTEKT (alle valgte inntekter for siste periode)
> - SJABLON_SJABLONTALL (0017, 0023, 0025, 0027, 0040)

| Felt        | Type       | Beskrivelse  |
|-------------|------------|--------------|
| periode     | Periode    | Periode      |
| skattFaktor | BigDecimal | Skatt faktor |

## DELBEREGNING_NETTO_BARNETILLEGG

> Beregner netto barnetillegg pr barnetilleggtype og summert for alle barnetillegg.
>
>Beregnes separat for bidragspliktig og bidragsmottaker.
>
>Refererer til
>
> - PERSON_BIDRAGSPLIKTIG eller PERSON_BIDRAGSMOTTAKER
> - DELBEREGNING_BARNETILLEGG_SKATTESATS
> - INNTEKT_RAPPORTERING_PERIODE (Inntektsrapportering.BARNETILLEGG)

| Felt                      | Type        | Beskrivelse                                                                                         |
|---------------------------|-------------|-----------------------------------------------------------------------------------------------------|
| periode                   | Periode     | Periodese                                                                                           |
| summertBruttoBarnetillegg | BigDecimal  | Summert brutto barnetillegg                                                                         |
| summertNettoBarnetillegg  | BigDecimal  | summertBruttoBarnetillegg - (summertBruttoBarnetillegg * skattFaktor)                               |
| barnetilleggTypeListe     | Tabel/liste | Tabel som inneholder inntektype, bruttoBarnetillegg og nettoBarnetillegg for hver barnetillegstype. |