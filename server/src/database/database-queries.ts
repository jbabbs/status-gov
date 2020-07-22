import { Client } from 'pg';

export function initializeDatabase(client: Client) {
  client.query('CREATE SCHEMA IF NOT EXISTS status_schema');
  client.query('CREATE TABLE IF NOT EXISTS status_schema.sites (id bigserial primary key, name varchar(50) NOT NULL, url varchar(1000) NOT NULL)');
  client.query(`CREATE TABLE IF NOT EXISTS status_schema.latencies (
     id bigserial primary key,
     site_id int REFERENCES status_schema.sites (id),
     capture_time timestamp NOT NULL,
     http_status_code int NOT NULL,
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
  const latencyQueryList = await client.query('SELECT * from status_schema.latencies WHERE site_id = $1 AND capture_time >= NOW() - INTERVAL \'1 minutes\'', [siteId]);
  return latencyQueryList.rows;
}

export function insertNewLatencyInfo(client: Client, siteIdToLatency: Map<number, {responseTime: number, statusCode: number}>) {
  let dbQuery = `Insert into status_schema.latencies (site_id, capture_time, latency_ms, http_status_code) values `;
  siteIdToLatency.forEach(({responseTime, statusCode}, appId) => {
    console.log(responseTime, statusCode);
    const value = `(${appId}, CURRENT_TIMESTAMP, ${responseTime}, ${statusCode}) `;
    dbQuery = dbQuery + value;
  });

  client.query(dbQuery);
}
