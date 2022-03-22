export const Routing = {
    register: "/register",
    login: "/login",

    home: "/home",
    demo: "/home/demo",
    rateComparison: "/home/rate-comparison",
    exchangeRate: "/home/exchange-rate",

    overview: "/home/overview",
    nettingCycles: "/home/overview/netting-cycles",
    detail: "/home/overview/detail/:id",

    protectedRoutes: () => [Routing.login, Routing.register],

    detailOf(nettingId: string) {
        return this.detail.replace(":id", nettingId)
    }
}