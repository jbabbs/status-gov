import { Client, QueryResult } from 'pg';
import { ISite } from 'statusgov-interface/site';
import { ILatency } from 'statusgov-interface/latency';

export async function initializeDatabase(client: Client) {
  await client.query('CREATE SCHEMA IF NOT EXISTS status_schema');
  await client.query('CREATE TABLE IF NOT EXISTS status_schema.sites (id bigserial primary key, name varchar(50) NOT NULL, url varchar(1000) NOT NULL)');
  await client.query(`CREATE TABLE IF NOT EXISTS status_schema.latencies (
     id bigserial primary key,
     site_id int REFERENCES status_schema.sites (id),
     capture_time timestamp NOT NULL,
     http_status_code int NOT NULL,
     latency_ms int NOT NULL)`);
}

export async function getAllSites(client: Client): Promise<ISite[]> {
  const queryList = await client.query('SELECT * from status_schema.sites');
  return queryList.rows;
}

export async function getSingleSite(client: Client, siteId: number, latencyInterval?: string): Promise<ISite> {
  const sitesList: QueryResult<ISite> = await client.query('SELECT * from status_schema.sites where id = $1', [siteId]);

  if (sitesList.rows.length) {
    const latencyList: ILatency[] = await getAllLatenciesForSite(client, siteId, latencyInterval);
    const singleSite = sitesList.rows[0];
    singleSite.latencies = latencyList;
    return singleSite;
  } else {
    return null;
  }
}

export async function getAllLatenciesForSite(client: Client, siteId: number, latencyInterval = '2 minutes'): Promise<ILatency[]> {
  const latencyQueryList = await client.query(`SELECT * from status_schema.latencies WHERE site_id = $1 AND capture_time >= NOW() - INTERVAL '${latencyInterval}'`,
    [siteId]);
  return latencyQueryList.rows;
}

export function insertNewLatencyInfo(client: Client, siteIdToLatency: Map<number, {responseTime: number, statusCode: number}>) {
  let dbQuery = `Insert into status_schema.latencies (site_id, capture_time, latency_ms, http_status_code) values `;
  siteIdToLatency.forEach(({responseTime, statusCode}, appId) => {
    console.log(responseTime, statusCode);
    const value = `(${appId}, CURRENT_TIMESTAMP, ${responseTime}, ${statusCode}), `;
    dbQuery = dbQuery + value;
  });

  const lastComma = dbQuery.lastIndexOf(',');
  dbQuery = dbQuery.substring(0, lastComma);
  client.query(dbQuery);
}

export function insertNewSite(client: Client, site: ISite) {
  const dbQuery = `Insert into status_schema.sites (name, url) values ('${site.name}', '${site.url}')`;
  client.query(dbQuery);
}
