# 使用 valtio 封装

1. 简化页面状态生成

## 安装

```bash
yarn add @carefrees/valtio # npm install @carefrees/valtio
```

## 使用

```tsx
import { MainProxyProvider , useMainProxyStore , ProxyInstanceObject} from "@carefrees/valtio"

const proxyInstance = new ProxyInstanceObject<T>()._ctor({ a:2 })

const Demo = ()=>{

  const { state, dispatch, namespace, proxyInstance,} = useMainProxyStore()
  console.log(state,state.a,namespace,proxyInstance);

  return <div>
    <button onClick={()=>{ dispatch({a:new Date().getTime()}) }}  >点击</button>
  </div>
} 

const Main = ()=>{
  return (<MainProxyProvider proxyInstance={proxyInstance} namespace='demo' >
      <Demo />
  </MainProxyProvider>)
}

```

## 自定义使用

```tsx
import { createCommonMainStore , ProxyInstanceObject } from "@carefrees/valtio"

const proxyInstance = new ProxyInstanceObject<T>()._ctor({ a:2 })

const { MainProxyProvider , useMainProxyStore } = createCommonMainStore({ proxyInstance, namespace:"demo" })

const Demo = ()=>{

  const { state, dispatch, namespace, proxyInstance,} = useMainProxyStore()
  console.log(state,state.a,namespace,proxyInstance);

  return <div>
    <button onClick={()=>{ dispatch({a:new Date().getTime()}) }}  >点击</button>
  </div>
} 

const Main = ()=>{
  return (<MainProxyProvider >
      <Demo />
  </MainProxyProvider>)
}

```
