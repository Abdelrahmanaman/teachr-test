import { Item } from "./item";

export class Product implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public description?: string,
    public price?: number,
    public category?: string,
    public createdAt?: Date
  ) {
    this["@id"] = _id;
  }
}
