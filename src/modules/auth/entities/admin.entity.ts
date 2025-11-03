export class AdminEntity {
  id: string;

  name: string;

  email: string;

  isVerify: boolean;

  deleted: boolean;

  constructor(id: string, name: string, email: string, isVerify: boolean, deleted: boolean) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isVerify = isVerify;
    this.deleted = deleted;
  }
}
