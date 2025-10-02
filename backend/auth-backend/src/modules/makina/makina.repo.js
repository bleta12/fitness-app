// src/modules/makina/makina.repo.js
import mysqlDB from "../../config.js";
import { MakinaModel } from "./makina.model.js";

export const MakinaRepo = {
  insert: ({ Modeli, VitiProdhimit, Id_Fabrika }, cb) => {
    mysqlDB.query(
      `INSERT INTO ${MakinaModel.table} (${MakinaModel.cols.model}, ${MakinaModel.cols.year}, ${MakinaModel.cols.fabrikaId}) VALUES (?, ?, ?)`,
      [Modeli, VitiProdhimit, Id_Fabrika],
      cb
    );
  },

  update: (id, { Modeli, VitiProdhimit, Id_Fabrika }, cb) => {
    mysqlDB.query(
      `UPDATE ${MakinaModel.table} SET ${MakinaModel.cols.model}=?, ${MakinaModel.cols.year}=?, ${MakinaModel.cols.fabrikaId}=? WHERE ${MakinaModel.cols.id}=?`,
      [Modeli, VitiProdhimit, Id_Fabrika, id],
      cb
    );
  },

  delete: (id, cb) => {
    mysqlDB.query(
      `DELETE FROM ${MakinaModel.table} WHERE ${MakinaModel.cols.id}=?`,
      [id],
      cb
    );
  },

  listAll: (cb) => {
    const sql = `
      SELECT m.Id, m.Modeli, m.VitiProdhimit,
             f.EmriFabrikes
      FROM Makina m
      LEFT JOIN Fabrika f ON m.Id_Fabrika = f.Id
      ORDER BY m.Id DESC
    `;
    mysqlDB.query(sql, cb);
  },

  listByFabrika: (idFabrika, cb) => {
    const sql = `
      SELECT m.Id, m.Modeli, m.VitiProdhimit
      FROM Makina m
      WHERE m.Id_Fabrika = ?
      ORDER BY m.Id DESC
    `;
    mysqlDB.query(sql, [idFabrika], cb);
  },
};
