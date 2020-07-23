import { Client } from 'pg';
import { initializeDatabase } from './database-queries';

export class StatusDatabase {
  private client: Client;

  getClient() {
    return this.client;
  }

  async startDatabase() {
    await this.connectDatabase();
    await this.initializeDB();
  }

  private async connectDatabase(retries = 5) {
    const connectionString = `postgres://postgres:postgres@${process.env.DATABASE}/${process.env.DATABASE_NAME}`;
    this.client = new Client({
        connectionString
    });

    while(retries) {
      try {
          await this.client.connect();
          console.log('Connected to Databse');
          break;
      } catch (err) {
          retries--;
          console.log(err);
          console.log(`Failed to connect to database. Retries left: ${retries}`);
          await new Promise(res => setTimeout(res, 5000));
      }
    }
  }

  private async initializeDB() {
    console.log('Initializing db');
    await initializeDatabase(this.client);
  }
}