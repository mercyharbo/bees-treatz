import { Request, Response } from 'express';

export interface UkRegion {
  name: string;
  code: string;
  cities: string[];
}

export const UK_REGIONS: UkRegion[] = [
  {
    name: 'Greater London',
    code: 'GL',
    cities: [
      'London',
      'Peckham',
      'Southwark',
      'Greenwich',
      'Croydon',
      'Lewisham',
      'Bromley',
      'Camden',
      'Hackney',
      'Islington',
      'Lambeth',
      'Wandsworth',
      'Westminster',
      'Kensington and Chelsea',
      'Hammersmith and Fulham',
      'Tower Hamlets',
      'Newham',
      'Barking and Dagenham',
      'Brent',
      'Ealing',
      'Harrow',
      'Hillingdon',
      'Hounslow',
      'Richmond upon Thames',
      'Kingston upon Thames',
      'Merton',
      'Sutton',
      'Barnet',
      'Enfield',
      'Haringey',
      'Waltham Forest',
      'Redbridge',
      'Havering',
      'Bexley',
    ],
  },
  {
    name: 'Greater Manchester',
    code: 'GM',
    cities: [
      'Manchester',
      'Salford',
      'Bolton',
      'Bury',
      'Oldham',
      'Rochdale',
      'Stockport',
      'Tameside',
      'Trafford',
      'Wigan',
    ],
  },
  {
    name: 'West Midlands',
    code: 'WM',
    cities: [
      'Birmingham',
      'Coventry',
      'Wolverhampton',
      'Solihull',
      'Dudley',
      'Sandwell',
      'Walsall',
      'West Bromwich',
    ],
  },
  {
    name: 'West Yorkshire',
    code: 'WY',
    cities: [
      'Leeds',
      'Bradford',
      'Wakefield',
      'Huddersfield',
      'Halifax',
      'Keighley',
      'Dewsbury',
    ],
  },
  {
    name: 'Merseyside',
    code: 'MS',
    cities: [
      'Liverpool',
      'Birkenhead',
      'St Helens',
      'Southport',
      'Wallasey',
      'Bootle',
      'Crosby',
    ],
  },
  {
    name: 'South Yorkshire',
    code: 'SY',
    cities: [
      'Sheffield',
      'Doncaster',
      'Rotherham',
      'Barnsley',
    ],
  },
  {
    name: 'Tyne and Wear',
    code: 'TW',
    cities: [
      'Newcastle upon Tyne',
      'Sunderland',
      'Gateshead',
      'South Shields',
      'Tynemouth',
      'Washington',
    ],
  },
  {
    name: 'Bristol & Bath',
    code: 'BB',
    cities: [
      'Bristol',
      'Bath',
      'Weston-super-Mare',
    ],
  },
  {
    name: 'Leicestershire',
    code: 'LE',
    cities: [
      'Leicester',
      'Loughborough',
      'Hinckley',
      'Melton Mowbray',
      'Coalville',
    ],
  },
  {
    name: 'Nottinghamshire',
    code: 'NT',
    cities: [
      'Nottingham',
      'Mansfield',
      'Newark-on-Trent',
      'Worksop',
      'Beeston',
    ],
  },
  {
    name: 'Berkshire',
    code: 'BK',
    cities: [
      'Reading',
      'Slough',
      'Bracknell',
      'Maidenhead',
      'Windsor',
      'Newbury',
    ],
  },
  {
    name: 'Surrey',
    code: 'SR',
    cities: [
      'Guildford',
      'Woking',
      'Epsom',
      'Farnham',
      'Redhill',
      'Staines-upon-Thames',
    ],
  },
  {
    name: 'Kent',
    code: 'KT',
    cities: [
      'Maidstone',
      'Canterbury',
      'Dartford',
      'Rochester',
      'Chatham',
      'Dover',
      'Tunbridge Wells',
      'Ashford',
    ],
  },
  {
    name: 'Essex',
    code: 'EX',
    cities: [
      'Chelmsford',
      'Colchester',
      'Southend-on-Sea',
      'Basildon',
      'Harlow',
      'Brentwood',
    ],
  },
  {
    name: 'Hertfordshire',
    code: 'HR',
    cities: [
      'Watford',
      'St Albans',
      'Hemel Hempstead',
      'Stevenage',
      'Welwyn Garden City',
    ],
  },
  {
    name: 'Hampshire',
    code: 'HA',
    cities: [
      'Southampton',
      'Portsmouth',
      'Winchester',
      'Basingstoke',
      'Eastleigh',
    ],
  },
  {
    name: 'Cambridgeshire',
    code: 'CB',
    cities: [
      'Cambridge',
      'Peterborough',
      'Ely',
      'Huntingdon',
      'Wisbech',
    ],
  },
  {
    name: 'Oxfordshire',
    code: 'OX',
    cities: [
      'Oxford',
      'Banbury',
      'Bicester',
      'Abingdon',
      'Didcot',
    ],
  },
  {
    name: 'Buckinghamshire',
    code: 'BU',
    cities: [
      'Milton Keynes',
      'Aylesbury',
      'High Wycombe',
      'Chesham',
    ],
  },
  {
    name: 'Scotland',
    code: 'SCT',
    cities: [
      'Edinburgh',
      'Glasgow',
      'Aberdeen',
      'Dundee',
      'Inverness',
      'Stirling',
      'Perth',
      'Paisley',
    ],
  },
  {
    name: 'Wales',
    code: 'WLS',
    cities: [
      'Cardiff',
      'Swansea',
      'Newport',
      'Wrexham',
      'Barry',
      'Neath',
      'Bangor',
    ],
  },
  {
    name: 'Northern Ireland',
    code: 'NIR',
    cities: [
      'Belfast',
      'Derry',
      'Lisburn',
      'Newry',
      'Armagh',
      'Bangor',
      'Ballymena',
    ],
  },
];

/**
 * GET /api/locations/uk
 * Returns all UK states/regions and their associated cities/boroughs
 */
export async function getUkLocationsHandler(_req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    country: 'United Kingdom',
    regions: UK_REGIONS,
  });
}
