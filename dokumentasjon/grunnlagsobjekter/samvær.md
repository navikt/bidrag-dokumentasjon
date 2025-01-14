## DELBEREGNING_SAMVÆRSFRADRAG

> **Referer til grunnlag**
> - SAMVÆR_PERIODE
> - SJABLON_SAMVÆRSFRADRAG
> - PERSON_SØKNADSBARN

> **Gjelder:**
> - PERSON_SØKNADSBARN

| Felt    | Type       | Beskrivelse |
|---------|------------|-------------|
| periode | Periode    |             |
| beløp   | BigDecimal |             |

## SAMVÆR_PERIODE

> **Referer til PERSON_SØKNADSBARN**

> **Referer til grunnlag**
> - DELBEREGNING_SAMVÆRSKLASSE

| Felt          | Type               | Beskrivelse                                                                                              |
|---------------|--------------------|----------------------------------------------------------------------------------------------------------|
| periode       | Periode            |                                                                                                          |
| samværsklasse | Samværsklasse Enum | INGEN_SAMVÆR<br/>SAMVÆRSKLASSE_1<br>SAMVÆRSKLASSE_2<br>SAMVÆRSKLASSE_3<br>SAMVÆRSKLASSE_4<br>DELT_BOSTED |


## DELBEREGNING_SAMVÆRSKLASSE

> **Referer til PERSON_SØKNADSBARN**

> **Referer til grunnlag**
> - SAMVÆRSKALKULATOR
> - SJABLON_SAMVÆRSFRADRAG

| Felt                         | Type               | Beskrivelse                                                                              |
|------------------------------|--------------------|------------------------------------------------------------------------------------------|
| samværsklasse                | Samværsklasse Enum | INGEN_SAMVÆR<br>SAMVÆRSKLASSE_1<br>SAMVÆRSKLASSE_2<br>SAMVÆRSKLASSE_3<br>SAMVÆRSKLASSE_4 |
| gjennomsnitligSamværPerMåned | Tall               |                                                                                          |

## SAMVÆRSKALKULATOR

> **Input verdier tastet inn av saksbehandler**

<table>
  <tr>
    <th>Felt</th>
    <th>Type</th>
    <th>Beskrivelse</th>
  </tr>
  <tr>
    <td>ferier</td>
    <td>Liste</td>
    <td>
Liste av
      <table>
        <tr>
          <th>Felt</th>
          <th>Type</th>
        </tr>
        <tr>
          <td>type</td>
          <td>JUL_NYTTÅR,<br>VINTERFERIE,<br>PÅSKE,<br>SOMMERFERIE,<br>HØSTFERIE,<br>ANNET</td>
        </tr>
        <tr>
          <td>bidragsmottakerNetter</td>
          <td>Tall > 0</td>
        </tr>
        <tr>
          <td>bidragspliktigNetter</td>
          <td>Tall > 0</td>
        </tr>
        <tr>
          <td>frekvens</td>
          <td>HVERT_ÅR<br>ANNETHVERT_ÅR</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>regelmessigSamværNetter</td>
    <td>Tall > 0</td>
    <td>Antall netter per 14 dag</td>
  </tr>
</table>