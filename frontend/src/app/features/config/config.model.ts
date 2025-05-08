export type Config = {
  test: string;

  auth: {
    autologin: boolean;
    url: string;
  }

  bookingUrl: string;

  admin: {
    url: string;
  }
}
