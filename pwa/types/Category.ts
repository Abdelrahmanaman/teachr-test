import { Item } from "./item";

export class Category implements Item {
  public "@id"?: string;

  constructor(_id?: string, public name?: string, public products?: string[]) {
    this["@id"] = _id;
  }
}
