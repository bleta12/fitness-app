import { FabrikaRepo } from "./fabrika.repo.js";

export const FabrikaService = {
  add: (payload, cb) => FabrikaRepo.insert(payload, cb),
  update: (id, payload, cb) => FabrikaRepo.update(id, payload, cb),
  delete: (id, cb) => FabrikaRepo.delete(id, cb),
  listAll: (cb) => FabrikaRepo.listAll(cb),
  listWithMakina: (cb) => FabrikaRepo.listWithMakina(cb),
};
