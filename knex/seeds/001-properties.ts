import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('property')
    .del()
    .then(() => {
      return knex('property').insert([
        { name: 'Columbiana Manor' },
        { name: 'Newton Village' },
        { name: 'West View Village' },
        { name: 'West View Village II' },
        { name: 'Westchester Commons' },
        { name: 'Newton Commons' },
        { name: 'Niles Executive' },
        { name: 'Westchester Executive' },
      ])
    })
}
/*
COPY public.properties (id, name, created_at, updated_at) FROM stdin;
1	Columbiana Manor	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
2	Newton Village	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
3	West View Village	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
4	West View Village II	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
5	Westchester Commons	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
6	Newton Commons	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
7	Niles Executive	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
8	Westchester Executive	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
\.
*/
