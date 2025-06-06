export class UserEntity {
  name: string;

  email: string;

  isVerify: boolean;

  deleted: boolean;

  constructor(name: string, email: string, isVerify: boolean, deleted: boolean) {
    this.name = name;
    this.email = email;
    this.isVerify = isVerify;
    this.deleted = deleted;
  }
}
