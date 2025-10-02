import mysqlDB from "../../config.js";
import { FabrikaModel } from "./fabrika.model.js";

export const FabrikaRepo = {
  insert: ({ EmriFabrikes, Lokacioni }, cb) => {
    mysqlDB.query(
      `INSERT INTO ${FabrikaModel.table} (${FabrikaModel.cols.name}, ${FabrikaModel.cols.location}) VALUES (?, ?)`,
      [EmriFabrikes, Lokacioni ?? null],
      cb
    );
  },

  update: (id, { EmriFabrikes, Lokacioni }, cb) => {
    mysqlDB.query(
      `UPDATE ${FabrikaModel.table} SET ${FabrikaModel.cols.name}=?, ${FabrikaModel.cols.location}=? WHERE ${FabrikaModel.cols.id}=?`,
      [EmriFabrikes, Lokacioni ?? null, id],
      cb
    );
  },

  delete: (id, cb) => {
    mysqlDB.query(`DELETE FROM ${FabrikaModel.table} WHERE ${FabrikaModel.cols.id}=?`, [id], cb);
  },

  listAll: (cb) => {
    mysqlDB.query(`SELECT * FROM ${FabrikaModel.table} ORDER BY ${FabrikaModel.cols.id} DESC`, cb);
  },

  listWithMakina: (cb) => {
    const sql = `
      SELECT f.Id as FabrikaID, f.EmriFabrikes, f.Lokacioni,
             m.Id as MakinaID, m.Modeli, m.VitiProdhimit
      FROM Fabrika f
      LEFT JOIN Makina m ON f.Id = m.Id_Fabrika
      ORDER BY f.Id DESC, m.Id DESC
    `;
    mysqlDB.query(sql, cb);
  },
};
