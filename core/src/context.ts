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
  /**是否存储到缓存中*/
  isCache?: boolean
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
  let proxyInstance = options.instance ? options.instance : (new ProxyInstanceObject<T>()._cstor(options.initalValue || {} as T) as K)
  const Context = createContext<ContextType<T, K>>({ instance: proxyInstance, name: options.name })
  const newCacheInstance = options.cacheInstance || cacheInstance
  /**
   * 都是 name 存在的时候
   * 1. 当缓存中存在的时候，要不要直接取缓存里面的实例进行生成,还是直接覆写
   * 2. 当缓存中不存在，实例是否需要进行存储到缓存中去
   * */

  if (options.name) {
    /**存在的时候*/
    if (newCacheInstance.isProxy(options.name)) {
      if (options.isCover) {
        // 覆写
        newCacheInstance.proxyMap.set(options.name, proxyInstance)
      } else {
        // 不用覆写,直接取值
        proxyInstance = newCacheInstance.getProxy(options.name)
      }
    } else if (options.isCache) {
      newCacheInstance.proxyMap.set(options.name, proxyInstance)
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
    cacheInstance,
    instance: proxyInstance,
    Context,
    Provider,
    useProxyInstanceContext,
  }
}