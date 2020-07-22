import { Client } from 'pg';

export function initializeDatabase(client: Client) {
  client.query('CREATE SCHEMA IF NOT EXISTS status_schema');
  client.query('CREATE TABLE IF NOT EXISTS status_schema.sites (id bigserial primary key, name varchar(50) NOT NULL, url varchar(1000) NOT NULL)');
  client.query(`CREATE TABLE IF NOT EXISTS status_schema.latencies (
     id bigserial primary key,
     site_id int REFERENCES status_schema.sites (id),
     capture_time timestamp NOT NULL,
     latency_ms int NOT NULL)`);
}

export async function getAllSites(client: Client) {
  const queryList = await client.query('SELECT * from status_schema.sites');
  return queryList.rows;
}

export async function getSingleSite(client: Client, siteId: number) {
  const sitesList = await client.query('SELECT * from status_schema.sites where id = $1', [siteId]);

  if (sitesList.rows.length) {
    const latencyList = await getAllLatenciesForSite(client, siteId);
    const singleSite = sitesList.rows[0];
    singleSite.latencies = latencyList;
    return singleSite;
  } else {
    return null;
  }
}

export async function getAllLatenciesForSite(client: Client, siteId: number) {
  const latencyQueryList = await client.query('SELECT * from status_schema.latencies WHERE site_id = $1', [siteId]);
  return latencyQueryList.rows;
}
