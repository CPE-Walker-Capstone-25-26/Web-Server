
export interface User {
  id: string;
  name: string;

  // current toc consent
  tocAccepted?: boolean;
  tocVersion?: string;
  tocTimestamp?: Date;

  active: boolean;
  deletedAt?: Date;
}
  