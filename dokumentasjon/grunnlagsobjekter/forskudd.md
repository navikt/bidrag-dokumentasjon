## SLUTTBERENING_FORSKUDD

- **Referat av:** SLUTTBERENING_
- **Referrer til:** DELBEREGNING_INNTEKT, DELBEREGNING_BARN_I_HUSSTAND og andre relevante objekter (sjablon, barn, sivilstand)

| Felt | Type | Beskrivelse |
| --- | --- | --- |
| periode | Periode | Periode |
| beløp | BigDecimal | Beløp |
| resultatkode | String |  |
| aldersgruppe | ALDER_0_10_ÅR <br> ALDER_11_17_ÅR <br> ALDER_18_ÅR_OG_OVER | Aldersgruppe for barnet som resultatet gjelder |

## DELBEREGNING_SUM_INNTEKT

- **Referat av:** SLUTTBERENING_*
- **Referrer til liste over:** INNTEKS-RAPPORTERING_PERIODE

| Felt | Type | Beskrivelse |
| --- | --- | --- |
| periode | Periode | Periode |
| totalinntekt | BigDecimal | Sum av alle inntekter |
| kontantstøtte | BigDecimal | Nullable |
| skattepliktigInntekt | BigDecimal | Sum av alle inntekter (inklusive kapitalinntekt), bortsett fra kontantstøtte, barnetillegg, utvidet barnetrygd og småbarnstillegg. Nullable |
| barnetillegg | BigDecimal | Nullable |
| utvidetBarnetrygd | BigDecimal | Nullable |
| småbarnstillegg | BigDecimal | Nullable |

## DELBEREGNING_BARN_I_HUSSTAND

- **Referat av:** SLUTTBERENING_*
- **Referrer til liste over:** BOSTATUS_PERIODE

| Felt | Type | Beskrivelse |
| --- | --- | --- |
| periode | Periode | Periode |
| antallBarn | BigDecimal | Antall barn som bor i husstanden. Kan være deltall (feks 2.5, 1.0, eller 0) |