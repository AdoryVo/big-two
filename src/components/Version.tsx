import { Text, type TextProps } from '@chakra-ui/react'

export default function Version(props: TextProps) {
  return (
    <Text position="fixed" bottom={0} left={0} p={4} {...props}>
      v1.0.1
    </Text>
  )
}
