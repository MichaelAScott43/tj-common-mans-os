/**
 * Crisis resources by country/region.
 *
 * Sources:
 *  - US: 988lifeline.org, crisistextline.org, veteranscrisisline.net
 *  - UK: samaritans.org, papyrus-uk.org
 *  - Canada: crisisservicescanada.ca
 *  - Australia: lifeline.org.au, beyondblue.org.au
 *  - Ireland: samaritans.ie, pieta.ie
 *  - Spain: telefonodelaesperanza.org
 *  - France: 3114 (national crisis line)
 *  - Portugal: SOS Voz Amiga
 *  - Germany: telefonseelsorge.de
 *  - Brazil: CVV
 *  - Mexico: SAPTEL
 *  - India: iCall / Vandrevala Foundation
 *  - Global: findahelpline.com
 *
 * IMPORTANT: These numbers should be verified regularly.
 * Last reviewed: 2024
 */

export const CrisisResources = {
  US: {
    name: 'United States',
    lines: [
      {
        label: '988 Suicide & Crisis Lifeline',
        number: '988',
        text: 'Text HOME to 741741',
        url: 'https://988lifeline.org',
        veteran: false,
      },
      {
        label: 'Veterans Crisis Line',
        number: '988 (press 1)',
        text: 'Text 838255',
        url: 'https://www.veteranscrisisline.net',
        veteran: true,
      },
      {
        label: 'Crisis Text Line',
        number: null,
        text: 'Text HOME to 741741',
        url: 'https://www.crisistextline.org',
        veteran: false,
      },
      {
        label: 'SAMHSA Helpline',
        number: '1-800-662-4357',
        text: null,
        url: 'https://www.samhsa.gov/find-help/national-helpline',
        veteran: false,
      },
    ],
  },
  GB: {
    name: 'United Kingdom',
    lines: [
      {
        label: 'Samaritans',
        number: '116 123',
        text: 'jo@samaritans.org',
        url: 'https://www.samaritans.org',
        veteran: false,
      },
      {
        label: 'Shout Crisis Text Line',
        number: null,
        text: 'Text SHOUT to 85258',
        url: 'https://giveusashout.org',
        veteran: false,
      },
      {
        label: 'Combat Stress (Veterans)',
        number: '0800 138 1619',
        text: null,
        url: 'https://combatstress.org.uk',
        veteran: true,
      },
    ],
  },
  CA: {
    name: 'Canada',
    lines: [
      {
        label: 'Talk Suicide Canada',
        number: '1-833-456-4566',
        text: 'Text 45645',
        url: 'https://talksuicide.ca',
        veteran: false,
      },
      {
        label: 'Veterans Affairs Canada',
        number: '1-800-268-7708',
        text: null,
        url: 'https://www.veterans.gc.ca',
        veteran: true,
      },
    ],
  },
  AU: {
    name: 'Australia',
    lines: [
      {
        label: 'Lifeline',
        number: '13 11 14',
        text: 'Text 0477 13 11 14',
        url: 'https://www.lifeline.org.au',
        veteran: false,
      },
      {
        label: 'Beyond Blue',
        number: '1300 22 4636',
        text: null,
        url: 'https://www.beyondblue.org.au',
        veteran: false,
      },
      {
        label: 'Open Arms (Veterans)',
        number: '1800 011 046',
        text: null,
        url: 'https://www.openarms.gov.au',
        veteran: true,
      },
    ],
  },
  IE: {
    name: 'Ireland',
    lines: [
      {
        label: 'Samaritans Ireland',
        number: '116 123',
        text: null,
        url: 'https://www.samaritans.org',
        veteran: false,
      },
      {
        label: 'Pieta House',
        number: '116 123',
        text: 'Text HELLO to 50808',
        url: 'https://www.pieta.ie',
        veteran: false,
      },
    ],
  },
  ES: {
    name: 'Spain / España',
    lines: [
      {
        label: 'Teléfono de la Esperanza',
        number: '717 003 717',
        text: null,
        url: 'https://www.telefonodelaesperanza.org',
        veteran: false,
      },
      {
        label: 'Línea de Atención a la Conducta Suicida',
        number: '024',
        text: null,
        url: null,
        veteran: false,
      },
    ],
  },
  FR: {
    name: 'France',
    lines: [
      {
        label: 'Numéro national prévention suicide',
        number: '3114',
        text: null,
        url: 'https://www.3114.fr',
        veteran: false,
      },
    ],
  },
  PT: {
    name: 'Portugal',
    lines: [
      {
        label: 'SOS Voz Amiga',
        number: '213 544 545',
        text: null,
        url: 'https://www.sosvozamiga.org',
        veteran: false,
      },
      {
        label: 'Linha de Crise',
        number: '800 202 676',
        text: null,
        url: null,
        veteran: false,
      },
    ],
  },
  DE: {
    name: 'Germany / Deutschland',
    lines: [
      {
        label: 'Telefonseelsorge',
        number: '0800 111 0 111',
        text: null,
        url: 'https://www.telefonseelsorge.de',
        veteran: false,
      },
      {
        label: 'Telefonseelsorge (alt)',
        number: '0800 111 0 222',
        text: null,
        url: 'https://www.telefonseelsorge.de',
        veteran: false,
      },
    ],
  },
  BR: {
    name: 'Brazil / Brasil',
    lines: [
      {
        label: 'CVV – Centro de Valorização da Vida',
        number: '188',
        text: null,
        url: 'https://www.cvv.org.br',
        veteran: false,
      },
    ],
  },
  MX: {
    name: 'Mexico / México',
    lines: [
      {
        label: 'SAPTEL',
        number: '55 5259-8121',
        text: null,
        url: 'https://www.saptel.org.mx',
        veteran: false,
      },
      {
        label: 'CONASAMA Línea de la Vida',
        number: '800 911 2000',
        text: null,
        url: null,
        veteran: false,
      },
    ],
  },
  IN: {
    name: 'India',
    lines: [
      {
        label: 'iCall',
        number: '9152987821',
        text: null,
        url: 'https://icallhelpline.org',
        veteran: false,
      },
      {
        label: 'Vandrevala Foundation',
        number: '1860-2662-345',
        text: null,
        url: 'https://www.vandrevalafoundation.com',
        veteran: false,
      },
    ],
  },
  GLOBAL: {
    name: 'Global / International',
    lines: [
      {
        label: 'Find A Helpline',
        number: null,
        text: null,
        url: 'https://findahelpline.com',
        veteran: false,
      },
      {
        label: 'International Association for Suicide Prevention',
        number: null,
        text: null,
        url: 'https://www.iasp.info/resources/Crisis_Centres/',
        veteran: false,
      },
    ],
  },
};

/** Ordered list of countries for the picker */
export const CountryList = [
  { code: 'US', label: '🇺🇸 United States' },
  { code: 'GB', label: '🇬🇧 United Kingdom' },
  { code: 'CA', label: '🇨🇦 Canada' },
  { code: 'AU', label: '🇦🇺 Australia' },
  { code: 'IE', label: '🇮🇪 Ireland' },
  { code: 'ES', label: '🇪🇸 Spain' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'PT', label: '🇵🇹 Portugal' },
  { code: 'DE', label: '🇩🇪 Germany' },
  { code: 'BR', label: '🇧🇷 Brazil' },
  { code: 'MX', label: '🇲🇽 Mexico' },
  { code: 'IN', label: '🇮🇳 India' },
  { code: 'GLOBAL', label: '🌍 Other / Global' },
];
