import { getConnection, getRepository } from 'typeorm';
import { Workplace } from '../entity/Workplace';

export const WorkplacesResolver = async (root, args, context, info) => {
  const workplaceRepository = getRepository(Workplace);

  return await workplaceRepository.find();
};

export const WorkplacesMutation = async (root, args, context, info) => {
  //TODO: Validate inputs
  return {
    create: async (root, context, info) => {
      const { input } = root;

      const connection = getConnection();

      const workplace = new Workplace();
      workplace.name = input.name;

      await connection.manager.save(workplace);
      return workplace;
    },
    update: async (root, context, info) => {
      const { id, input } = root;

      const workplaceRepository = getRepository(Workplace);
      const connection = getConnection();

      const workplace = await workplaceRepository.findOne(id);
      if (!!input.name) workplace.name = input.name;

      await connection.manager.save(workplace);
      return workplace;
    }
  };
};
