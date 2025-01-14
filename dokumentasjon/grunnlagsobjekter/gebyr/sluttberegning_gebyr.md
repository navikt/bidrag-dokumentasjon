### SLUTTBREGNING_GEBYR

> **Refererer til grunnlag**
> - PERSON som skal få gebyr
> - DELBEREGNING_INNTEKSTBASERT_GEBYR
> - MANUELT_OVERSTYRT_GEBYR (optional)
> - SJABLON (Beløp fastsettelsegebyr)

| Felt       | Type    | Beskrivelse                          |
|------------|---------|--------------------------------------|
| ilagtGebyr | Boolean |                                      |


### DELBEREGNING_INNTEKTSBASERT_GEBYR
 
> **Refererer til grunnlag**  
>   - PERSON som skal få gebyr  
>   - SJABLON (Gebyr nedre inntektsgrense)  
>   - DELBEREGNING_INNTEKT (siste periode) (for alle barna)

> - **Regel:**  
  Beregne høyeste barnetillegg for ett av barna.

 > Bruk siste periode for skattbare inntekter, selv om det er skjønnsfastsatt inntekt.

| Felt        | Type    | Beskrivelse                               |
|-------------|---------|-------------------------------------------|
| leggesGebyr | Boolean |                                           |
| sumInntekt  |         | Høyeste verdi for skattbar + barnetillegg |


### MANUELT_OVERSTYRT_GEBYR

> **Refererer til grunnlag**  
  PERSON som skal få gebyr

| Felt         | Type    | Beskrivelse |
|--------------|---------|-------------|
| ilagtGebyr   | Boolean |             |
| begrunnelse  | Tekst   |             |
