/* eslint-disable max-classes-per-file */
export class RiceCategoryEntity {
  id: string;

  name: string;

  description: string | null;

  createdAt: Date;

  updatedAt: Date;
}

export class BaseRiceEntity {
  id: string;

  name: string;

  category: string | RiceCategoryEntity;

  createdAt: Date;

  updatedAt: Date;
}

export class RiceEntity extends BaseRiceEntity {
  category: string;
}

export class PopulatedRiceEntity extends BaseRiceEntity {
  category: RiceCategoryEntity;
}
