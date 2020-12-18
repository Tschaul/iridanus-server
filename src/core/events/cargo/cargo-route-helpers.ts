import { Gates } from "../../../shared/model/v1/universe";

function isOneReversedRoute(fromId: string, toId: string, route: string[]) {

    for (let j = 1; j < route.length; j++) {
        let i = j - 1;
        if (fromId === route[i] && toId == route[j]) {
            return false
        }
    }
    return true
}

function routeInCorrectOrder(fromId: string, toId: string, route: string[]) {
    if (isOneReversedRoute(fromId, toId, route)) {
        return route.map(it => it).reverse()
    } else {
        return route
    }
}

export function arrivesAtEndpoint(fromId: string, toId: string, routeRaw: string[]) {

    const route = routeInCorrectOrder(fromId, toId, routeRaw)
    const end = route.slice(-2)
    return fromId === end[0] && toId === end[1]

}

export function nextDestinationOfRoute(fromId: string, toId: string, routeRaw: string[]) {
    const route = routeInCorrectOrder(fromId, toId, routeRaw)
    for (let j = 1; j < (route.length - 1); j++) {
        let i = j - 1;
        if (fromId === route[i] && toId == route[j]) {
            return route[j + 1]
        }
    }
    throw Error("Could not determine next destination of route")
}

export function verifyRouteExists(routesRaw: string[], gates: Gates) {
    if (routesRaw.length < 2) {
        return false
    }

    for (let j = 1; j < (routesRaw.length - 1); j++) {
        let i = j - 1;
        if (!gates[routesRaw[i]].includes(routesRaw[j])) {
            return false
        }
    }

    return true
}

export function firstDestinationOfRoute(worldId: string, routesRaw: string[]) {

    const routes = worldId === routesRaw[0] ? routesRaw : routesRaw.map(it => it).reverse();

    return routes[1]

}

export function finalDestinationOfRoute(worldId: string, routesRaw: string[]) {

    const routesReversed = worldId === routesRaw[0] ? routesRaw.map(it => it).reverse() : routesRaw;

    return routesReversed[0]

}