export const EP = {
  login: "/mpl/admin/login",
  logout: "/mpl/admin/logout",
  players: "/mpl/players/find-all-player",
  playersImport: "/mpl/admin/players/import",
  teams: "/mpl/owner/retrieve-team-name",
  ownerDetails: (id) => `/mpl/owner/owner-details/${encodeURIComponent(id)}`,
  registerOwner: "/mpl/owner/register-owner",
  bidPlayer: "/mpl/auction/bid-auction-player",
  liveAuction: "/mpl/auction/live",
  nextPlayer: "/mpl/players/next-player",
};