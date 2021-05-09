module.exports = {
  Admins: ["433680843802935297"],
  DefaultPrefix: "/",
  game: "Dev-Gaming.HLJ",
  Port: 3000,
  Token: "ODQwMzAzMjI1MzM2MjMzOTg0.YJWPXA.aqoUNHb7XcXqIHct7fEyNovyHOk" || process.env.Token,
  ClientID: "840303225336233984",
  ClientSecret: "v48mEqk_7iwo9T_4781wBKtRI2P_UgYW",
  Scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  CallbackURL: "/api/callback", //Discord OAuth2 Callback URL
  "24/7": false,
  CookieSecret: "Dev-Gaming.HLJ",
  IconURL:
    "https://forum.de.nostale.gameforge.com/images/avatars/5e/1348-5e3d485b7555012c3c3ac6058703503629aba9d3.gif",
  Permissions: 2205280576,
  Website: "http://localhost",

  //Lavalink
  Lavalink: {
    id: "Main",
    host: "127.0.0.1",
    port: 2333,
    pass: "youshallnotpass",
  },

  //https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID: "baa3d6ada5804faeb4ef8ddbd4ac231e",
    ClientSecret: "9751bdaf6dec4ecf81a87a870cc0ea6e",
  },
};
