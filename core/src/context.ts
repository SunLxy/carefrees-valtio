import { useContext, createContext, createElement, useState } from "react"
import { useSnapshot, } from "valtio"
import { ProxyInstanceObject, cacheInstance } from "./instance"

const MainProxyContext = createContext<{ namespace: string, proxyInstance: ProxyInstanceObject<any> }>({ namespace: undefined, proxyInstance: undefined })

export interface MainProxyProviderProps<T> {
  children: React.ReactNode,
  proxyInstance?: T
  namespace?: string,
}

export const MainProxyProvider = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(props: MainProxyProviderProps<K>) => {
  return createElement(MainProxyContext.Provider, {
    value: { namespace: props.namespace, proxyInstance: props.proxyInstance },
    children: props.children
  })
}

/**获取页面的proxy名称空间*/
export const useMainProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>() => useContext(MainProxyContext) as { namespace?: string, proxyInstance: K }

/**
 * 当页面有页面级的实例
*/
export const useMainProxyStore = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>() => {
  const { proxyInstance, namespace } = useMainProxy<T, K>()
  const state = useSnapshot(proxyInstance.store);
  const dispatch = (value: Partial<T>) => {
    proxyInstance._setStore(value)
  }
  const dispatchRef = (value: Partial<T>) => {
    proxyInstance._setRefStore(value)
  }
  /**为了解决没有取值时直接重新渲染问题*/
  const temps = (state as any).___temps;
  return { state, dispatch, dispatchRef, namespace, proxyInstance, temps }
}

interface MainProxyInstanceType<T> extends ProxyInstanceObject<T> {
  new(namespace?: string)
}

export const connecMainProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(namespace: string, MainProxyInstance: K, Component: React.FC) => {
  const pageInstance = new (MainProxyInstance as unknown as MainProxyInstanceType<T>)(namespace)

  return (props: any) => {
    const [proxyInstance] = useState(() => {
      return cacheInstance.createProxy({
        name: namespace,
        instanceObject: typeof pageInstance.main_ctor === 'function' ? pageInstance.main_ctor() : pageInstance
      })
    })
    return createElement(MainProxyProvider, {
      namespace: namespace,
      proxyInstance,
      children: createElement(Component, { ...props })
    })
  }
}
