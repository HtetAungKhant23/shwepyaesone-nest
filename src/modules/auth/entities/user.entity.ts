// import { ACCOUNT_TYPE } from '@prisma/client';

export class UserEntity {
  name: string;

  email: string;

  // accounts: IAccount[];

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
    // this.accounts = accounts;
  }
}

// type IAccount = {
//   name: string;
//   amount: number;
//   type: ACCOUNT_TYPE;
// };
