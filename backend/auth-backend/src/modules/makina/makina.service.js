import { MakinaRepo } from "./makina.repo.js";

export const MakinaService = {
  add: (payload, cb) => MakinaRepo.insert(payload, cb),
  update: (id, payload, cb) => MakinaRepo.update(id, payload, cb),
  delete: (id, cb) => MakinaRepo.delete(id, cb),
  listAll: (cb) => MakinaRepo.listAll(cb),
  listByFabrika: (id, cb) => MakinaRepo.listByFabrika(id, cb),
};
