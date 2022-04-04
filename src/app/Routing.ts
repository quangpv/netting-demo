export const Routing = {
    login: "/login",

    home: "/home",
    demo: "/home/demo",
    rateComparison: "/home/rate-comparison",
    exchangeRate: "/home/exchange-rate",

    overview: "/home/overview",
    nettingCycles: "/home/overview/netting-cycles",
    detail: "/home/overview/detail/:id",
    instruction: "/home/demo/instruction",
    createNetting: "/home/demo/netting",

    protectedRoutes: () => [Routing.login],

    detailOf(nettingId: string) {
        return this.detail.replace(":id", nettingId)
    }
}