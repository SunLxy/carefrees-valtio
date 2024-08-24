import { ProxyInstanceObject, } from "./instance"
export interface MainProxyProviderProps<T> {
  children: React.ReactNode,
  proxyInstance?: T
  namespace?: string,
}
export interface CreateMainProviderOptions<T extends Object = any, K extends ProxyInstanceObject<T> = ProxyInstanceObject<T>> extends Omit<MainProxyProviderProps<K>, 'children'> {
  initalValue?: T
}

export interface MainInstanceInterfaceObject extends Object {
  /**loading存储*/
  loading?: Record<string, boolean>
  [s: string]: any
}

export interface MainProxyInstanceType<T> extends ProxyInstanceObject<T> {
  new(namespace?: string)
}