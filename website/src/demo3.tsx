import { useProxyStore } from "@carefrees/valtio"

const Demo = () => {
  const { state, dispatch, proxyInstance } = useProxyStore({ a: 1 })
  console.log("demo3", state, state.a, dispatch, proxyInstance);
  return <div>
    <button onClick={() => { dispatch({ a: new Date().getTime() }) }}  >点击</button>
  </div>
}
export default Demo