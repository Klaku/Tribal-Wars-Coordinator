import { createDarkTheme, FluentProvider } from '@fluentui/react-components'

interface IFluentCustomProvider {
  children: React.ReactNode
}

export function Provider({ children }: IFluentCustomProvider) {
  return (
    <FluentProvider
      theme={createDarkTheme({
        10: '#020402',
        20: '#101C12',
        30: '#162F1C',
        40: '#193C22',
        50: '#1C4A29',
        60: '#1F5930',
        70: '#216837',
        80: '#22773E',
        90: '#238745',
        100: '#23974C',
        110: '#22A854',
        120: '#20B85B',
        130: '#1EC963',
        140: '#19DB6B',
        150: '#11EC72',
        160: '#01FE7A',
      })}
    >
      {children}
    </FluentProvider>
  )
}
