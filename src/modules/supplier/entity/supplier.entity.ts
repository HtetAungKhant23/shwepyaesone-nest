export class SupplierEntity {
  id: string;

  name: string;

  phone: string;

  address: string | null;

  createdAt: Date;

  updatedAt: Date;

  constructor(id: string, name: string, phone: string, createdAt: Date, updatedAt: Date, address: string | null) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address ?? null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
