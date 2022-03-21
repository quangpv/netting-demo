import {EffectCallback, useEffect} from "react";

export function launch(effect: EffectCallback) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useEffect(effect, [])
}