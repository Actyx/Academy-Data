import { Pond } from '@actyx/pond'
import manifest from './manifest'

Pond.default(manifest).then((pond) => {

  console.log(pond.info())

  // start something awesome here
  // -------------------------------
  //
  // For the first time here?
  // https://developer.actyx.com/docs/pond/getting-started
  //
  // You will find help and examples on:
  // https://developer.actyx.com/docs/pond/guides/hello-world
  // https://developer.actyx.com/blog
})
