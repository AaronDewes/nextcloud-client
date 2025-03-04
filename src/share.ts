import type Client from "./client.ts";
import { ClientError } from "./client.ts";
import type FileSystemElement from "./fileSystemElement.ts";

export enum SharePermission {
  all = 31,
  read = 1,
  update = 2,
  create = 4,
  delete = 8,
  share = 16,
}

enum ShareType {
  user = 0,
  group = 1,
  publicLink = 3,
  email = 4,
}

export interface ICreateShare {
  "fileSystemElement": FileSystemElement;
  // @todo "shareWith"?: User | UserGroup | EMail;
  "publicUpload"?: boolean;
  "password"?: string;
}

export enum ShareItemType {
  file = "file",
  folder = "folder",
}
export default class Share {
  public static async getShare(client: Client, id: string): Promise<Share> {
    const share: Share = new Share(client, id);
    await share.initialize();
    return share;
  }

  public static createShareRequestBody(createShare: ICreateShare): string {
    const shareType: ShareType = ShareType.publicLink;

    const shareRequest: {
      path: string;
      shareType: number;
      // @todo   permissions: number | number[]
      password?: string;
    } = {
      path: createShare.fileSystemElement.name,
      //  @todo    permissions: 1,
      shareType,
    };

    if (createShare.password) {
      shareRequest.password = createShare.password;
    }

    return JSON.stringify(shareRequest, null, 4);
  }

  private client: Client;
  private memento: {
    expiration: Date | null;
    id: string;
    itemType: ShareItemType;
    note: string;
    token: string;
    url: string;
    publicUpload: boolean;
    // share_type: number,
    // "uid_owner": string,
    // "displayname_owner": string,
    // "permissions": SharePermission,
    // "can_edit": boolean,
    // "can_delete": boolean,
    // "stime": Date,
    // "parent"?: Share,
    // "uid_file_owner": string,
    // "label"?: string,
    // "displayname_file_owner": string,
    // "path": string,
    // "mimetype"?: string,
    // "share_with"?: string,
    // "share_with_displayname"?: string,
    // "mail_send": boolean,
    // "hide_download": boolean,
  };

  private constructor(client: Client, id: string) {
    this.client = client;
    this.memento = {
      expiration: null,
      id,
      itemType: ShareItemType.file,
      note: "",
      token: "",
      url: "",
      publicUpload: false,
    };
  }

  public async delete(): Promise<void> {
    await this.client.deleteShare(this.memento.id);
  }

  public async setExpiration(expiration: Date): Promise<void> {
    this.memento.expiration = expiration;
    await this.client.updateShare(this.memento.id, {
      expireDate: expiration.toISOString().split("T")[0],
    });
  }

  /**
   * set a new password
   * @param password
   */
  public async setPassword(password: string): Promise<void> {
    await this.client.updateShare(this.memento.id, { password });
  }

  public async setPublicUpload(): Promise<void> {
    if (this.memento.itemType === ShareItemType.folder) {
      this.memento.publicUpload = true;
      await this.client.updateShare(this.memento.id, { permissions: 15 });
    }
  }

  public async setNote(note: string): Promise<void> {
    this.memento.note = note;
    await this.client.updateShare(this.memento.id, { note });
  }

  private async initialize(): Promise<void> {
    const rawShareData = await this.client.getShare(this.memento.id);

    if (!rawShareData.ocs || !rawShareData.ocs.data[0]) {
      throw new ClientError(
        `Error invalid share data received "ocs.data" missing`,
        "ERR_INVALID_SHARE_RESPONSE",
      );
    }

    if (!rawShareData.ocs.data[0].url) {
      throw new ClientError(
        `Error invalid share data received "url" missing`,
        "ERR_INVALID_SHARE_RESPONSE",
      );
    }
    this.memento.url = rawShareData.ocs.data[0].url;

    if (!rawShareData.ocs.data[0].token) {
      throw new ClientError(
        `Error invalid share data received "token" missing`,
        "ERR_INVALID_SHARE_RESPONSE",
      );
    }
    this.memento.token = rawShareData.ocs.data[0].token;

    if (!rawShareData.ocs.data[0].item_type) {
      throw new ClientError(
        `Error invalid share data received "item_type" missing`,
        "ERR_INVALID_SHARE_RESPONSE",
      );
    }

    if (rawShareData.ocs.data[0].item_type === "file") {
      this.memento.itemType = ShareItemType.file;
    } else {
      this.memento.itemType = ShareItemType.folder;
    }
    if (rawShareData.ocs.data[0].expiration) {
      this.memento.expiration = new Date(rawShareData.ocs.data[0].expiration);
    }

    if (rawShareData.ocs.data[0].note) {
      this.memento.note = rawShareData.ocs.data[0].note;
    }

    // console.log(JSON.stringify(rawShareData, null, 4));
    // console.log(JSON.stringify(this, null, 4));
  }

  /**
   * token
   * The token is readonly
   */
  public get token(): string {
    return this.memento.token;
  }

  /**
   * share url
   * The share url is readonly
   */
  public get url(): string {
    return this.memento.url;
  }

  /**
   * expiration
   * The expiration is readonly
   */
  public get expiration(): Date | null {
    return this.memento.expiration;
  }

  /**
   * note
   * The note is readonly
   */
  public get note(): string {
    return this.memento.note;
  }

  /**
   * id
   * The id is readonly
   */
  public get id(): string {
    return this.memento.id;
  }

  /**
   * returns true if the share akkows upload
   */
  public get publicUpload(): boolean {
    return this.memento.publicUpload;
  }

  /**
   * item type
   * The type of the share item file or folder
   */
  public get itemType(): ShareItemType {
    return this.memento.itemType;
  }
}
