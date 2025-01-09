Here is a simple flow chart:

```mermaid
classDiagram
    DelberegningBegrensetRevurdering <-- BeløpshistorikkForskudd
    DelberegningBegrensetRevurdering <-- SjablonSjablontallPeriode_grense
    class DelberegningBegrensetRevurdering {
        navn: DELBEREGNING_BEGRENSET_REVURDERING
        -
        Felter:
    løpendeForskudd: BigDecimal
    nyttBeløp: BigDecimal
    resultatBeløp: BigDecimal 
    -
    gjelder: Bidragspliktig
    gjelderBarn: Søknadsbarn

    }
    class BeløpshistorikkForskudd{
    navn: BELØPSHISTORIKK_FORSKUDD
        -
        Felter:
    perioder:[]
        + fom
        + tom
        + beløp      
    -
    gjelder: Bidragspliktig
    gjelderBarn: Søknadsbarn
    }
    class SjablonSjablontallPeriode_grense{
    navn: SJABLON_SJABLONTALL
        -
        Felter:
    sjablonTallNavn: ENDRING_BIDRAG_GRENSE_PROSENT
    verdi: 12%     
    }
```
