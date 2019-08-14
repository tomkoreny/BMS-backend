import { getConnection, getRepository } from 'typeorm';
import { Workplace } from '../entity/Workplace';
import { Shift } from '../entity/Shift';

export const ShiftsResolver = async (root, args, context, info) => {
  const shiftRepository = getRepository(Shift);

  return await shiftRepository.find();
};

export const ShiftsMutation = async (root, args, context, info) => {
  //TODO: Validate inputs
  return {
    create: async (root, context, info) => {
      const { input } = root;

      const connection = getConnection();
      const workplaceRepository = getRepository(Workplace);

      const shift = new Shift();
      shift.userId = input.user;
      shift.workplace = await workplaceRepository.findOne(input.workplace);
      shift.date = input.date;

      await connection.manager.save(shift);
      return shift;
    },
    update: async (root, context, info) => {
      const { id, input } = root;

      const workplaceRepository = getRepository(Workplace);
      const shiftRepository = getRepository(Shift);
      const connection = getConnection();

      const shift = await shiftRepository.findOne(id);

      if(!!input.user) shift.userId = input.user;
      if(!!input.workplace) shift.workplace = await workplaceRepository.findOne(input.workplace);
      if(!!input.date) shift.date = input.date;

      await connection.manager.save(shift);
      return shift;
    }
  };
};
