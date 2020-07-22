import { Client } from 'pg';

export function initializeDatabase(client: Client) {
  client.query('CREATE SCHEMA IF NOT EXISTS healthcheck_schema');
  client.query('CREATE TABLE IF NOT EXISTS healthcheck_schema.sites (id bigserial primary key, name varchar(50) NOT NULL, url varchar(1000) NOT NULL)');
  client.query(`CREATE TABLE IF NOT EXISTS healthcheck_schema.latencies (
     id bigserial primary key,
     site_id int REFERENCES healthcheck_schema.sites (id),
     capture_time timestamp NOT NULL,
     latency_ms int NOT NULL)`);
}

export async function getAllSites(client: Client) {
  const queryList = await client.query('SELECT * from healthcheck_schema.sites');
  return queryList.rows;
}

export async function getSingleSite(client: Client, siteId: number) {
  const queryList = await client.query('SELECT * from healthcheck_schema.sites where id = $1', [siteId]);
  if (queryList.rows.length) {
    return queryList.rows[0];
  } else {
    return null;
  }
}
