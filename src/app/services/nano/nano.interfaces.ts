

export interface PendingResp {
  blocks: string[];
}


export interface BlocksInfoResp {
  [key: string]: BlockInfo;
}

export interface BlockInfo {
  block_account: string;
  amount: string;
  balance: string;
  height: string;
  local_timestamp: string;
  confirmed: string;
  contents: {
    type: 'state'
    account: string;
    previous: string;
    representative: string;
    balance: string;
    link: string;
    link_as_account: string;
    signature: string;
    work: string;
  };
  subtype: string;
}

export interface AccountInfo {
  frontier: string;
  open_block: string;
  representative_block: string;
  balance: string;
  modified_timestamp: string;
  block_count: string;
  confirmation_height: string;
  confirmation_height_frontier: string;
  account_version: string;
}
