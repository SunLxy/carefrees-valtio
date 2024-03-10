import { useContext, createContext, createElement } from "react"
import { useSnapshot, } from "valtio"
import { ProxyInstanceObject, ProxyInstanceCache } from "./instance"

export interface CreateProxyInstanceContextOptions<T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>> {
  /**名称*/
  name?: string;
  /**实例*/
  instance?: K,
  /**初始值*/
  initalValue?: T
  /**缓存数据实例*/
  cacheInstance?: ProxyInstanceCache
  /**当缓存中已经存在名称时是否进行覆盖 instance 实例*/
  isCover?: boolean
}

export interface ContextType<T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>> {
  name?: string;
  /**实例*/
  instance: K,
}

/**内置缓存数据实例*/
export const cacheInstance = new ProxyInstanceCache()

/**创建组合Provider和useContext*/
export const createProxyInstanceContext = <T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>>(options: CreateProxyInstanceContextOptions<T, K>) => {
  const proxyInstance = options.instance ? options.instance : (new ProxyInstanceObject<T>(options.initalValue || {} as T) as K)
  const Context = createContext<ContextType<T, K>>({ instance: proxyInstance, name: options.name })
  const newCacheInstance = options.cacheInstance || cacheInstance

  if (options.name) {
    // 当存在的时候并且可以重新赋值的时候
    if (newCacheInstance.isProxy(options.name) && options.isCover) {
      options.cacheInstance.proxyMap.set(options.name, proxyInstance)
    } else if (!newCacheInstance.isProxy(options.name)) {
      /**当不存在的时候*/
      options.cacheInstance.proxyMap.set(options.name, proxyInstance)
    }
  }

  const Provider = (props: { children?: React.ReactNode }) => {
    return createElement(Context.Provider, {
      children: props.children,
      value: { name: options.name, instance: proxyInstance }
    })
  }

  const useProxyInstanceContext = () => {
    const { instance, name } = useContext(Context)
    const state = useSnapshot(instance.store);
    const dispatch = (value: Partial<T>) => {
      instance._setStore(value)
    }
    const dispatchRef = (value: Partial<T>) => {
      instance._setRefStore(value)
    }
    return { state, dispatch, dispatchRef, name, instance }
  }

  return {
    instance: proxyInstance,
    Provider,
    Context,
    useProxyInstanceContext,
  }
}