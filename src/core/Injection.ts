import constructor from "tsyringe/dist/typings/types/constructor";
import {container, injectable, singleton} from "tsyringe";
import {Type} from "./Type";
import {useEffect, useMemo} from "react";
import {Command} from "../command/Command";
import {GlobalErrorHandler} from "../app/GlobalErrorHandler";

function registerTypes<T>(paramTypes: Type<any>[] = [], target: constructor<T>) {
    return Reflect.metadata("design:paramtypes", paramTypes)(target)
}

export function Injectable<T>(paramTypes: Type<any>[] = []) {
    return (target: constructor<T>) => {
        registerTypes(paramTypes, target)
        return injectable()(target)
    }
}

export function Singleton<T>(paramTypes: Type<any>[] = []) {
    return (target: constructor<T>) => {
        registerTypes(paramTypes, target)
        return singleton()(target)
    }
}

export abstract class Disposable {
    abstract dispose()
}

export function useService<T>(type: Type<T>): T {
    let value = useMemo(() => {
        let resolved = container.resolve(type)
        if (resolved instanceof Command) {
            resolved["getErrorHandler" as any] = () => container.resolve(GlobalErrorHandler)
        }
        return resolved
    }, [type])

    useEffect(() => {
        return function cleanup() {
            if (value instanceof Disposable) {
                value.dispose()
            }
        }
    }, [value])
    return value
}