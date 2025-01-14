## DELBEREGNING_BARNETILLEGG_SKATTEATS

> 1. Tar utgangspunkt i summet inntekt for siste periode og beregner en skatteats som brukes for alle barnetillegg. Baserer seg på bidragsvevneregnningen. Vil bare inneholde en periode, som egentlig ikke har noen betydning.
>    - Uføres kun hvis det finnes inntekter av typen Inntektrapportering_BARNETILLEGG.

Beregnes separat for bidragspliktig og bidragsmottaker:

**Evt. kan denne delberegningen også brukes som en delberegning under bidragsvevn-beregningen.**

> **Referrer til**
> - PERSON_BIDRAGSPLIKTIG eller PERSON_BIDRAGSMOTTAKER
> - DELBEREGNING_SUM_INNTEKT (alle valgte inntekter for siste periode)
> - SJABLON_SJABLONTALL (0017, 0023, 0025, 0027, 0040)

| Felt        | Type       | Beskrivelse  |
|-------------|------------|--------------|
| periode     | Periode    | Periode      |
| skattFaktor | BigDecimal | Skatt faktor |

## DELBEREGNING_NETTO_BARNETILLEGG

> 1. Beregner netto barnetillegg pr barnetillegstype og summert for alle barnetillegg.
>    - Beregnes separat for bidragspliktig og bidragsmottaker.

> **Referrer til**
> - PERSON_BIDRAGSPLIKTIG eller PERSON_BIDRAGSMOTTAKER
> - DELBEREGNING_BARNETILLEGG_SKATTEATS
> - INNTEKT_RAPPORTERING_PERIODE (inntektrapportering_BARNETILLEGG)

| Felt                      | Type        | Beskrivelse                                                                                         |
|---------------------------|-------------|-----------------------------------------------------------------------------------------------------|
| periode                   | Periode     | Periodese                                                                                           |
| summertBruttoBarnetillegg | BigDecimal  | Summert brutto barnetillegg                                                                         |
| summertNettoBarnetillegg  | BigDecimal  | summertBruttoBarnetillegg - (summertBruttoBarnetillegg * skattFaktor)                               |
| barnetilleggTypeListe     | Tabel/liste | Tabel som inneholder inntektype, bruttoBarnetillegg og nettoBarnetillegg for hver barnetillegstype. |