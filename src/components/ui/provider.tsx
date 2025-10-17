"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}


// "use client"

// import { ChakraProvider, createSystem } from "@chakra-ui/react"
// import {
//   ColorModeProvider,
//   type ColorModeProviderProps,
// } from "./color-mode"
// import config from "../../theme"

// const system = createSystem(config)

// export function Provider(props: ColorModeProviderProps) {
//   return (
//     <ChakraProvider value={system}>
//       <ColorModeProvider {...props} />
//     </ChakraProvider>
//   )
// }
