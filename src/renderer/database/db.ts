import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import {
  cashFundSchema,
  employeeSchema,
  productSchema,
  productInventorySchema,
  customerOrderSchema,
  customerSchema,
} from './schema';

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
// create database
const db = await createRxDatabase({
  name: 'sample',
  storage: getRxStorageDexie(),
});
// Remove the first database.
// await removeRxDatabase('sample', getRxStorageDexie());
// create collections
const collections = await db.addCollections({
  cashfund: {
    schema: cashFundSchema,
  },
  employees: {
    schema: employeeSchema,
  },
  products: {
    schema: productSchema,
  },
  inventory: {
    schema: productInventorySchema,
  },
  order: {
    schema: customerOrderSchema,
  },
  customers: {
    schema: customerSchema,
  },
});

export default collections;
