import { useContext, createContext, createElement, useState } from "react"
import { useSnapshot, } from "valtio"
import { ProxyInstanceObject, cacheInstance } from "./instance"
import { MainProxyProviderProps, CreateMainProviderOptions, ProxyInstanceObjectStoreType } from "./interface"

const MainProxyContext = createContext<{ namespace: string, proxyInstance: ProxyInstanceObject<any> }>({ namespace: undefined, proxyInstance: undefined })

/**创建自定义组合状态管理*/
export const createCommonMainStore = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(options: CreateMainProviderOptions<T, K>) => {

  const MainProxyContext = createContext<{ namespace: string, proxyInstance: ProxyInstanceObject, initAttr?: any }>({ namespace: undefined, proxyInstance: undefined })

  const proxyInstance = cacheInstance.createProxy<T, K>({
    name: options.namespace,
    inital: options.initalValue,
    instanceObject: options.proxyInstance,
  })

  /**主页面*/
  const MainProxyProvider = (props: { children?: React.ReactNode, initAttr?: any }) => {
    const { children, initAttr } = props
    return createElement(MainProxyContext.Provider, {
      children,
      value: { proxyInstance: proxyInstance, namespace: options.namespace, initAttr }
    })
  }

  const useMainProxyStore = () => {
    const state = useSnapshot<T>(proxyInstance.store);
    const attr = useContext(MainProxyContext)
    const dispatch = (value: Partial<T>, type: "ref" | "none" = 'ref') => {
      if (type === 'none') {
        proxyInstance._setStore(value)
      } else {
        proxyInstance._setRefStore(value)
      }
    }
    /**为了解决没有取值时直接重新渲染问题*/
    const temps = (state as any).___temps;
    return { state, dispatch, proxyInstance, initAttr: attr.initAttr, temps }
  };

  return {
    MainProxyProvider,
    useMainProxyStore,
    MainProxyContext
  }
}

export const MainProxyProvider = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(props: MainProxyProviderProps<K>) => {
  return createElement(MainProxyContext.Provider, {
    value: { namespace: props.namespace, proxyInstance: props.proxyInstance },
    children: props.children
  })
}

/**获取页面的实例*/
export const useMainProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>() => useContext(MainProxyContext) as { namespace?: string, proxyInstance: K }

/**
 * 当页面有页面级的实例
*/
export const useMainProxyStore = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>() => {
  const { proxyInstance, namespace } = useMainProxy<T, K>()
  const state = useSnapshot(proxyInstance.store);
  const dispatch = (value: Partial<T>, type: "ref" | "none" = 'ref') => {
    if (type === 'none') {
      proxyInstance._setStore(value)
    } else {
      proxyInstance._setRefStore(value)
    }
  }
  /**为了解决没有取值时直接重新渲染问题*/
  const temps = (state as any).___temps;
  return { state, dispatch, namespace, proxyInstance, temps }
}


/**
 * 状态管理(===>useState)
*/
export const useProxyStore = <T extends ProxyInstanceObjectStoreType = ProxyInstanceObjectStoreType>(inital: T) => {
  const [proxyInstance] = useState(new ProxyInstanceObject<T>()._ctor(inital))
  const state = useSnapshot(proxyInstance.store);
  const dispatch = (value: Partial<T>, type: "ref" | "none" = 'ref') => {
    if (type === 'none') {
      proxyInstance._setStore(value)
    } else {
      proxyInstance._setRefStore(value)
    }
  }
  /**为了解决没有取值时直接重新渲染问题*/
  const temps = (state as any).___temps;
  return { state, dispatch, proxyInstance, temps }
}

/**
 * 根据存储名称获取实例
*/
export const useMainProxyNameStore = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(namespace: string) => {
  const [proxyInstance] = useState(cacheInstance.createProxy<T, K>({ name: namespace }))
  const state = useSnapshot(proxyInstance.store);
  const dispatch = (value: Partial<T>, type: "ref" | "none" = 'ref') => {
    if (type === 'none') {
      proxyInstance._setStore(value)
    } else {
      proxyInstance._setRefStore(value)
    }
  }
  /**为了解决没有取值时直接重新渲染问题*/
  const temps = (state as any).___temps;
  return { state, dispatch, namespace, proxyInstance, temps }
}

export const connecMainProxy = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>, M extends { new(...args: any[]): K } = { new(...args: any[]): K }>(namespace: string, MainProxyInstance: M, Component: React.FC) => {
  const pageInstance = new MainProxyInstance(namespace)

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
