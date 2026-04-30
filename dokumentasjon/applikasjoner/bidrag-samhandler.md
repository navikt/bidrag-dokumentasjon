# Bidrag-samhandler

## Kort beskrivelse
Applikasjon for å håndtere informasjon om bidragssamhandlere.

## Nøkkelinformasjon
| Felt             | Verdi                                                                                                         |
|------------------|---------------------------------------------------------------------------------------------------------------|
| Navn             | Bidrag-samhandler                                                                                             |
| Applikasjonstype | Backend-tjeneste                                                                                              |
| Driftsområde     | GCP                                                                                                           |
| GitHub           | [navikt/bidrag-samhandler](https://github.com/navikt/bidrag-samhandler/)                                      |
| Har database     | [Ja](https://console.cloud.google.com/sql/instances/bidrag-samhandler-prod/overview?project=bidrag-prod-8f72) |
| Kafka-topic      | [Ja](https://github.com/navikt/bidrag-kafka/blob/main/topics/samhandler-prod.yaml)                            |

## Viktige integrasjoner
- Brukes av `Bisys` når samhandlere opprettes eller endres
- Oppdaterer `Bidrag-Aktørregister` via Kafka topic

## Notater
-
